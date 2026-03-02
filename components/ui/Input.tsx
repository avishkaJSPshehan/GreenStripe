import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <input
                className={`flex w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-[1rem] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#66bb6a] focus:bg-white focus:ring-[3px] focus:ring-[#66bb6a]/15 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
