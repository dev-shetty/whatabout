import { useEffect, useState } from "react"
import { InputWithButton } from "./ui/InputWithButton"
import { ItemList } from "./ui/ItemList"
import { SectionCard } from "./ui/SectionCard"
import type { Settings } from "@types"
import { DEFAULT_SETTINGS } from "@constants"

export default function PopupApp() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [newSite, setNewSite] = useState("")
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const api = (globalThis as any).browser || chrome

  // Use local storage for Firefox, sync for Chrome
  const storage = api.storage.local

  useEffect(() => {
    // Load settings from storage
    storage
      .get(["blockedSites", "waitTime", "tasks", "reminderInterval"])
      .then((result: any) => {
        setSettings({
          blockedSites: result.blockedSites || DEFAULT_SETTINGS.blockedSites,
          waitTime: result.waitTime || DEFAULT_SETTINGS.waitTime,
          tasks: result.tasks || DEFAULT_SETTINGS.tasks,
          reminderInterval:
            result.reminderInterval || DEFAULT_SETTINGS.reminderInterval,
        })
        setIsLoading(false)
      })
      .catch((error: any) => {
        console.error("Failed to load settings:", error)
        setIsLoading(false)
      })
  }, [])

  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings)
    try {
      await storage.set(newSettings)
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  const addSite = async () => {
    if (!newSite.trim()) return

    const site = newSite.trim().toLowerCase()
    if (settings.blockedSites.includes(site)) {
      alert("Site already in list")
      return
    }

    await saveSettings({
      ...settings,
      blockedSites: [...settings.blockedSites, site],
    })
    setNewSite("")
  }

  const removeSite = async (site: string) => {
    await saveSettings({
      ...settings,
      blockedSites: settings.blockedSites.filter((s) => s !== site),
    })
  }

  const updateWaitTime = async (time: number) => {
    if (time < 1) return
    await saveSettings({
      ...settings,
      waitTime: time,
    })
  }

  const updateReminderInterval = async (interval: number) => {
    if (interval < 0) return
    await saveSettings({
      ...settings,
      reminderInterval: interval,
    })
  }

  const addTask = async () => {
    if (!newTask.trim()) return

    const task = newTask.trim()
    if (settings.tasks.includes(task)) {
      alert("Task already in list")
      return
    }

    await saveSettings({
      ...settings,
      tasks: [...settings.tasks, task],
    })
    setNewTask("")
  }

  const removeTask = async (task: string) => {
    await saveSettings({
      ...settings,
      tasks: settings.tasks.filter((t) => t !== task),
    })
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">What About</h1>
        <p className="text-xs text-gray-600 mt-0.5">
          Block distracting sites and stay focused
        </p>
      </div>

      <section className="grid gap-3">
        <SectionCard>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold text-gray-900">Tasks</label>
            <span className="text-xs text-gray-500 font-medium">
              {settings.tasks.length}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Things you should focus on instead
          </p>
          <InputWithButton
            value={newTask}
            onChange={setNewTask}
            onSubmit={addTask}
            placeholder="Add a task"
          />
          <ItemList
            items={settings.tasks}
            onRemove={removeTask}
            emptyMessage="No tasks added yet, do something anon"
          />
        </SectionCard>

        <SectionCard>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold text-gray-900">
              Blocked Sites
            </label>
            <span className="text-xs text-gray-500 font-medium">
              {settings.blockedSites.length}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Sites that require reflection before access
          </p>
          <InputWithButton
            value={newSite}
            onChange={setNewSite}
            onSubmit={addSite}
            placeholder="example.com"
          />
          <ItemList
            items={settings.blockedSites}
            onRemove={removeSite}
            emptyMessage="No sites blocked. Try instagram.com"
          />
        </SectionCard>

        <SectionCard>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Wait Time
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Seconds to wait before accessing blocked sites
          </p>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.waitTime}
            onChange={(e) => updateWaitTime(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </SectionCard>

        <SectionCard>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Reminder Interval
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Minutes to wait before blocking the site again, and breaking your
            doom scrolling (0 to disable)
          </p>
          <input
            type="number"
            min="1"
            max="600"
            value={settings.reminderInterval}
            onChange={(e) => updateReminderInterval(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </SectionCard>
      </section>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Changes save automatically • Reload pages to apply
        </p>
      </div>
    </div>
  )
}
