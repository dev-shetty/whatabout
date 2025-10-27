import ReactDOM from "react-dom/client"
import App from "./App"
import { DEFAULT_SETTINGS } from "@constants"

let unmount: () => void

if (import.meta.webpackHot) {
  import.meta.webpackHot?.accept()
  import.meta.webpackHot?.dispose(() => unmount?.())
}

if (document.readyState === "complete") {
  unmount = initial() || (() => {})
} else {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") unmount = initial() || (() => {})
  })
}

function initial() {
  const api = (globalThis as any).browser || chrome

  // Load settings from storage and check if site should be blocked
  api.storage.local
    .get(["blockedSites", "waitTime", "tasks"])
    .then(
      (result: {
        blockedSites?: string[]
        waitTime?: number
        tasks?: string[]
      }) => {
        const blockedSites = result.blockedSites || []
        const waitTime = result.waitTime || 3
        const tasks = result.tasks || DEFAULT_SETTINGS.tasks

        const isBlocked = blockedSites.some((site) =>
          window.location.hostname.includes(site)
        )

        if (!isBlocked) {
          return
        }

        // Create a new div element and append it to the document's body
        const rootDiv = document.createElement("div")
        rootDiv.id = "extension-root"
        document.body.appendChild(rootDiv)

        // Injecting content_scripts inside a shadow dom
        // prevents conflicts with the host page's styles.
        // This way, styles from the extension won't leak into the host page.
        const shadowRoot = rootDiv.attachShadow({ mode: "open" })

        const styleElement = document.createElement("style")
        shadowRoot.appendChild(styleElement)
        fetchCSS().then((response) => (styleElement.textContent = response))

        if (import.meta.webpackHot) {
          import.meta.webpackHot?.accept("./styles.css", () => {
            fetchCSS().then((response) => (styleElement.textContent = response))
          })
        }

        // Create a container for React to render into
        const container = document.createElement("div")
        shadowRoot.appendChild(container)

        const mountingPoint = ReactDOM.createRoot(container)
        mountingPoint.render(
          <div className="content_script">
            <App waitTime={waitTime} tasks={tasks} />
          </div>
        )
      }
    )
    .catch((error: any) => {
      console.error("Failed to load settings in content script:", error)
    })

  return () => {}
}

async function fetchCSS() {
  const cssUrl = new URL("./styles.css", import.meta.url)
  const response = await fetch(cssUrl)
  const text = await response.text()
  return response.ok ? text : Promise.reject(text)
}
