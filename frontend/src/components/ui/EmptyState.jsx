export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center" aria-hidden="true">
          <Icon size={20} className="text-gray-400 dark:text-white/30" />
        </div>
      )}
      {title && (
        <p className="text-sm font-medium text-gray-700 dark:text-white/70">{title}</p>
      )}
      {description && (
        <p className="text-xs text-gray-400 dark:text-white/40 max-w-48">{description}</p>
      )}
      {action}
    </div>
  )
}
