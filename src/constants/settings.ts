import type { Settings } from "@types"

export const DEFAULT_SETTINGS: Settings = {
  blockedSites: ["instagram.com"],
  waitTime: 3,
  tasks: [
    "Continue reading the book",
    "Call mom",
    "Finish the blog post",
    "Walk out, touch some grass",
  ],
  reminderInterval: 0,
}
