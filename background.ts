console.log("Hello from the background script!")

const api = (globalThis as any).browser || chrome

// Initialize default settings on install
api.runtime.onInstalled.addListener(() => {
  api.storage.sync.get(["blockedSites", "waitTime", "tasks"], (result: any) => {
    if (!result.blockedSites) {
      api.storage.sync.set({
        blockedSites: ["example.com", "github.com", "stackoverflow.com"],
        waitTime: 3,
        tasks: [
          "Finish the project proposal",
          "Review pull requests",
          "Call mom",
          "Exercise for 30 minutes",
          "Read for 20 minutes",
        ],
      })
    }
  })
})

api.runtime.onMessage.addListener((message: any, sender: any) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    api.tabs.remove(sender.tab.id)
  }
})
