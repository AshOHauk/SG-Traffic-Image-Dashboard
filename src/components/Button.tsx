import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps} from "solid-js";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(["hover:bg-secondary", "transition-colors"], {
    variants: {
        variant: {
            default: ["bg-secondary", "hover:bg-secondary-hover"],
            ghost:["hover:bg-gray-100"],
            dark:[
                "bg-secondary-dark", 
                "hover:bg-secondary-hover",
                "text-secondary",
            ],
            translucent:[
                "hover:bg-gray-100",
                "bg-opacity-50",
                "bg-white",
            ],

        },
        size: {
            default: ["rounded", "p-2"],
            icon: [
                "rounded-full",
                "w-10", 
                "h-10", 
                "flex", 
                "items-center",
                "justify-center", 
                "p-2.5",
            ],
        }
    },
    defaultVariants:{
        variant: "default",
        size: "default",
    }
})

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

export function Button({variant, size, class:className, ...props}: ButtonProps) {
    return (
        <button {...props} 
        class={twMerge(buttonStyles({ variant, size}), className)}/>
    )
}