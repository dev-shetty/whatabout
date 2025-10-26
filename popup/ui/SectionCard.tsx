interface SectionCardProps {
  children: React.ReactNode
}

export function SectionCard({ children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      {children}
    </div>
  )
}
