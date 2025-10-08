// src/components/ui/Switch.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "appearance-none w-11 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors duration-200 ease-in-out",
          "checked:bg-blue-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "before:content-[''] before:block before:w-4 before:h-4 before:bg-white before:rounded-full before:transform before:transition-transform before:duration-200 before:ease-in-out before:translate-x-1 before:translate-y-1",
          "checked:before:translate-x-6",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Switch.displayName = "Switch"

export { Switch }