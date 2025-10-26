import { useEffect, useState } from "react"

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
    return <div className="p-3">Loading...</div>
  }

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-3">What About Settings</h1>

      <section className="grid gap-8">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Wait Time (seconds)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.waitTime}
            onChange={(e) => updateWaitTime(parseInt(e.target.value))}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Tasks</label>
          <div className="flex gap-1 mb-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a task"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {settings.tasks.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No tasks</p>
            ) : (
              settings.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs"
                >
                  <span className="flex-1 truncate">{task}</span>
                  <button
                    onClick={() => removeTask(task)}
                    className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    x
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">
            Blocked Sites
          </label>
          <div className="flex gap-1 mb-2">
            <input
              type="text"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSite()}
              placeholder="example.com"
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={addSite}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="max-h-32 overflow-y-auto">
            {settings.blockedSites.length === 0 ? (
              <p className="text-xs text-gray-500 italic">
                No sites blocked, start with instagram.com xD
              </p>
            ) : (
              settings.blockedSites.map((site) => (
                <div
                  key={site}
                  className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs"
                >
                  <span className="flex-1 truncate">{site}</span>
                  <button
                    onClick={() => removeSite(site)}
                    className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    x
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Changes apply immediately. Reload blocked pages.
        </p>
      </div>
    </div>
  )
}
