const api = (globalThis as any).browser || globalThis.chrome
let reminderInterval = 0

const MINUTES_IN_MS = 60 * 1000
const DEFAULT_REMINDER_INTERVAL = 0

// Initialize default settings on install
api.runtime.onInstalled.addListener(() => {
  api.storage.local
    .get(["blockedSites", "waitTime", "tasks", "reminderInterval"])
    .then((result: any) => {
      reminderInterval = result.reminderInterval || DEFAULT_REMINDER_INTERVAL
    })
})

api.runtime.onMessage.addListener(
  (message: any, sender: any, sendResponse: any) => {
    if (message.action === "closeTab" && sender.tab?.id) {
      api.tabs.remove(sender.tab.id)
    }

    if (message.action === "startTimer" && reminderInterval > 0) {
      const interval = setTimeout(() => {
        clearTimeout(interval)
        sendResponse({ type: "blockSite", payload: true })
      }, reminderInterval * MINUTES_IN_MS)

      return true
    }
  }
)
