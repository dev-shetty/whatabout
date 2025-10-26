interface ItemListProps {
  items: string[]
  onRemove: (item: string) => void
  emptyMessage: string
}

export function ItemList({ items, onRemove, emptyMessage }: ItemListProps) {
  return (
    <div className="max-h-32 overflow-y-auto">
      {items.length === 0 ? (
        <p className="text-xs text-gray-500 italic">{emptyMessage}</p>
      ) : (
        items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-xs mb-1"
          >
            <span className="flex-1 truncate">{item}</span>
            <button
              onClick={() => onRemove(item)}
              className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            >
              x
            </button>
          </div>
        ))
      )}
    </div>
  )
}
