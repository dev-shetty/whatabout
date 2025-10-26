console.log("Hello from the background script!")

const api = (globalThis as any).browser || chrome

api.runtime.onMessage.addListener((message: any, sender: any) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    api.tabs.remove(sender.tab.id)
  }
})
