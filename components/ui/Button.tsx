import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'outline' | 'danger';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', ...props }, ref) => {
        const variantStyles = {
            primary: "bg-gradient-to-br from-[#66bb6a] to-[#43a047] text-white hover:from-[#5cba60] hover:to-[#388e3c] hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(67,160,71,0.3)] hover:shadow-[0_6px_15px_rgba(67,160,71,0.4)] shadow-[#43a047]/20",
            ghost: "bg-transparent text-[#2e7d32] hover:bg-green-50 shadow-none border-none",
            outline: "bg-transparent border-2 border-[#4caf50] text-[#2e7d32] hover:bg-green-50",
            danger: "bg-transparent border border-red-200 text-red-600 hover:bg-red-50"
        };

        const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 active:translate-y-0";

        return (
            <button
                className={`${baseStyles} ${variantStyles[variant]} ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }

