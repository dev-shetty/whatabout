import { useCallback, useMemo, useRef, useState } from "react"

const MS_TO_SECONDS = 1000

interface ContentAppProps {
  waitTime: number
  tasks: string[]
}

export default function ContentApp({ waitTime, tasks }: ContentAppProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const TIME_TO_DISPLAY = waitTime

  const handleCloseSite = () => {
    const api = (globalThis as any).browser || chrome
    api.runtime.sendMessage({ action: "closeTab" })
  }

  const handleContinue = () => {
    if (time < TIME_TO_DISPLAY && intervalRef.current) return
    setIsVisible(false)
  }

  const startTimer = () => {
    console.log("startTimer")
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1)
    }, MS_TO_SECONDS)

    if (time >= TIME_TO_DISPLAY) {
      clearInterval(intervalRef.current)
    }
  }

  const stopTimer = () => {
    console.log("stopTimer")
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setTime(0)
    }
  }

  const timeLeft = time < TIME_TO_DISPLAY ? TIME_TO_DISPLAY - time : 0

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[999999]">
      <div className="text-center max-w-2xl px-8">
        <h1 className="text-5xl font-bold text-white mb-8">What about?</h1>

        <div className="rounded-lg p-6 mb-8">
          <ul className="text-white text-left space-y-3 text-lg">
            {tasks.map((task, idx) => (
              <li key={idx}>• {task}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleContinue}
            onMouseEnter={startTimer}
            onMouseLeave={stopTimer}
            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg transition-color cursor-pointer"
            style={{
              cursor: timeLeft > 0 ? "not-allowed" : "pointer",
            }}
          >
            {timeLeft > 0 ? `Continue in ${timeLeft}s` : "You Win :("}
          </button>
          <button
            onClick={handleCloseSite}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close site
          </button>
        </div>
      </div>
    </div>
  )
}
