import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <button
                className={`inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-br from-[#66bb6a] to-[#43a047] text-white hover:from-[#5cba60] hover:to-[#388e3c] hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(67,160,71,0.3)] hover:shadow-[0_6px_15px_rgba(67,160,71,0.4)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(67,160,71,0.3)] h-12 px-6 ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
