const api = (globalThis as any).browser || globalThis.chrome

const MINUTES_IN_MS = 60 * 1000
const DEFAULT_REMINDER_INTERVAL = 0

let activeTimer: any = null

// Initialize default settings on install
api.runtime.onInstalled.addListener(() => {
  api.storage.local.get([
    "blockedSites",
    "waitTime",
    "tasks",
    "reminderInterval",
  ])
})

api.runtime.onMessage.addListener((message: any, sender: any) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    api.tabs.remove(sender.tab.id)
  }

  if (message.action === "startTimer") {
    if (activeTimer) {
      clearTimeout(activeTimer)
      activeTimer = null
    }

    api.storage.local.get(["reminderInterval"]).then(({ reminderInterval }) => {
      if (reminderInterval > 0) {
        activeTimer = setTimeout(() => {
          activeTimer = null
          api.tabs
            .sendMessage(sender.tab.id, {
              type: "blockSite",
              payload: true,
            })
            .catch(() => {
              console.log("Failed to send message to tab")
            })
        }, reminderInterval * MINUTES_IN_MS)
      }
    })
  }

  // must return true immediately to keep sendResponse alive
  return true
})
