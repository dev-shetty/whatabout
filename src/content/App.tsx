import { SECONDS_IN_MS, TIMER_START } from "@constants"
import { useRef, useState } from "react"

interface ContentAppProps {
  waitTime: number
  tasks: string[]
}

export default function ContentApp({ waitTime, tasks }: ContentAppProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [time, setTime] = useState(TIMER_START)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const TIME_TO_DISPLAY = waitTime
  const api = (globalThis as any).browser || chrome

  const handleCloseSite = () => {
    api.runtime.sendMessage({ action: "closeTab" })
  }

  const handleContinue = () => {
    if (time < TIME_TO_DISPLAY && intervalRef.current) return
    setIsVisible(false)
    api.runtime.sendMessage({ action: "startTimer" }, (response: any) => {
      stopTimer()
      if (response.type === "blockSite" && response.payload) {
        setIsVisible(true)
      }
    })
  }

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1 * SECONDS_IN_MS)
  }

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setTime(TIMER_START)
    }
  }

  const timeLeft = time < TIME_TO_DISPLAY ? TIME_TO_DISPLAY - time : TIMER_START

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-999999 font-normal">
      <div className="max-w-3xl p-8 bg-gray-700 rounded-xl">
        <h1 className="text-3xl font-bold text-white mb-8">What about?</h1>

        <div className="rounded-lg mb-8">
          <ul className="text-white text-left space-y-3 text-xl">
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
            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg transition-color cursor-pointer w-48 text-md"
            style={{
              cursor: timeLeft > TIMER_START ? "not-allowed" : "pointer",
            }}
          >
            {timeLeft > TIMER_START ? `Continue in ${timeLeft}s` : "You Win :("}
          </button>
          <button
            onClick={handleCloseSite}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors w-48 text-md"
          >
            Close site
          </button>
        </div>
      </div>
    </div>
  )
}
