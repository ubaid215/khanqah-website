// src/components/ui/Toast.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"

export interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

const Toast = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  duration = 5000,
}: ToastProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  React.useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        setIsOpen(false)
        onOpenChange?.(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onOpenChange])

  if (!isOpen) return null

  const icons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle,
  }

  const styles = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
  }

  const Icon = icons[variant]

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={cn(
        "rounded-lg border p-4 shadow-lg",
        styles[variant]
      )}>
        <div className="flex items-start space-x-3">
          <Icon className={cn(
            "h-4 w-4 mt-0.5",
            variant === 'destructive' ? 'text-red-600' : 
            variant === 'success' ? 'text-green-600' : 'text-gray-600'
          )} />
          <div className="flex-1 space-y-1">
            {title && (
              <p className={cn(
                "text-sm font-medium",
                variant === 'destructive' ? 'text-red-900' : 
                variant === 'success' ? 'text-green-900' : 'text-gray-900'
              )}>
                {title}
              </p>
            )}
            {description && (
              <p className={cn(
                "text-sm",
                variant === 'destructive' ? 'text-red-700' : 
                variant === 'success' ? 'text-green-700' : 'text-gray-700'
              )}>
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsOpen(false)
              onOpenChange?.(false)
            }}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export { Toast }