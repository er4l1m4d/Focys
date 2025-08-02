import * as React from "react"

interface ToastProps {
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning" | "info"
  onDismiss?: () => void
}

export function ToastSimple({ title, description, type = "default", onDismiss }: ToastProps) {
  const typeClasses = {
    default: "bg-white text-gray-900 border-gray-200",
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  }[type]

  return (
    <div
      className={`relative flex flex-col space-y-1 p-4 rounded-lg border ${typeClasses} shadow-lg`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useToast() {
  const showToast = React.useCallback(({ title, description, type = "default" }: Omit<ToastProps, 'onDismiss'>) => {
    // In a real implementation, this would add the toast to a global state
    // For now, we'll just log it
    console.log(`[TOAST] ${type}: ${title}`, description || '')
    
    // Return a function to dismiss the toast
    return () => console.log(`[TOAST] Dismissed: ${title}`)
  }, [])

  return { toast: showToast }
}
