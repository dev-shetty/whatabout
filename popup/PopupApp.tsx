import { useEffect, useState } from "react"
import { InputWithButton } from "./ui/InputWithButton"
import { ItemList } from "./ui/ItemList"
import { SectionCard } from "./ui/SectionCard"

interface Settings {
  blockedSites: string[]
  waitTime: number
  tasks: string[]
}

const DEFAULT_SETTINGS: Settings = {
  blockedSites: [],
  waitTime: 3,
  tasks: [
    "Finish the project proposal",
    "Review pull requests",
    "Call mom",
    "Exercise for 30 minutes",
    "Read for 20 minutes",
  ],
}

export default function PopupApp() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [newSite, setNewSite] = useState("")
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const api = (globalThis as any).browser || chrome

  useEffect(() => {
    // Load settings from storage
    api.storage.sync.get(
      ["blockedSites", "waitTime", "tasks"],
      (result: any) => {
        setSettings({
          blockedSites: result.blockedSites || DEFAULT_SETTINGS.blockedSites,
          waitTime: result.waitTime || DEFAULT_SETTINGS.waitTime,
          tasks: result.tasks || DEFAULT_SETTINGS.tasks,
        })
        setIsLoading(false)
      }
    )
  }, [])

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    api.storage.sync.set(newSettings)
  }

  const addSite = () => {
    if (!newSite.trim()) return

    const site = newSite.trim().toLowerCase()
    if (settings.blockedSites.includes(site)) {
      alert("Site already in list")
      return
    }

    saveSettings({
      ...settings,
      blockedSites: [...settings.blockedSites, site],
    })
    setNewSite("")
  }

  const removeSite = (site: string) => {
    saveSettings({
      ...settings,
      blockedSites: settings.blockedSites.filter((s) => s !== site),
    })
  }

  const updateWaitTime = (time: number) => {
    if (time < 1) return
    saveSettings({
      ...settings,
      waitTime: time,
    })
  }

  const addTask = () => {
    if (!newTask.trim()) return

    const task = newTask.trim()
    if (settings.tasks.includes(task)) {
      alert("Task already in list")
      return
    }

    saveSettings({
      ...settings,
      tasks: [...settings.tasks, task],
    })
    setNewTask("")
  }

  const removeTask = (task: string) => {
    saveSettings({
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
            emptyMessage="No tasks added yet"
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
            emptyMessage="No sites blocked. Try instagram.com or twitter.com"
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
      </section>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Changes save automatically • Reload pages to apply
        </p>
      </div>
    </div>
  )
}
