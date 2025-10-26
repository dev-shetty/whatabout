interface InputWithButtonProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  placeholder: string
}

export function InputWithButton({
  value,
  onChange,
  onSubmit,
  placeholder,
}: InputWithButtonProps) {
  return (
    <div className="flex gap-1 mb-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder={placeholder}
        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={onSubmit}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
      >
        +
      </button>
    </div>
  )
}
