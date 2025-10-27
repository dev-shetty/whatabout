const api = (globalThis as any).browser || chrome

// Initialize default settings on install
api.runtime.onInstalled.addListener(() => {
  api.storage.local.get(["blockedSites", "waitTime", "tasks"])
})

api.runtime.onMessage.addListener((message: any, sender: any) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    api.tabs.remove(sender.tab.id)
  }
})
