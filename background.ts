const api = (globalThis as any).browser || globalThis.chrome

const MINUTES_IN_MS = 60 * 1000
const DEFAULT_REMINDER_INTERVAL = 0

// Initialize default settings on install
api.runtime.onInstalled.addListener(() => {
  api.storage.local.get([
    "blockedSites",
    "waitTime",
    "tasks",
    "reminderInterval",
  ])
})

api.runtime.onMessage.addListener(
  (message: any, sender: any, sendResponse: any) => {
    if (message.action === "closeTab" && sender.tab?.id) {
      api.tabs.remove(sender.tab.id)
    }

    api.storage.local.get(["reminderInterval"]).then(({ reminderInterval }) => {
      if (message.action === "startTimer" && reminderInterval > 0) {
        const timer = setTimeout(() => {
          clearTimeout(timer)
          sendResponse({ type: "blockSite", payload: true })
        }, reminderInterval * MINUTES_IN_MS)
      }
    })

    // must return true immediately to keep sendResponse alive
    return true
  }
)
