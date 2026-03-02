import * as React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = '', ...props }, ref) => (
        <label
            ref={ref}
            className={`text-[0.85rem] font-semibold text-slate-600 ${className}`}
            {...props}
        />
    )
)
Label.displayName = "Label"

export { Label }
