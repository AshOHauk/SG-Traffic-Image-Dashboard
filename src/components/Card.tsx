import { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

interface CardProps {
    rounded: boolean;
    flat: boolean;
    children?: JSX.Element | JSX.Element[];
    id?: string;
    padded: boolean;
    className?: string;
}

export default function Card({rounded, flat, children, padded, className}: CardProps) {
  const baseClassNames = 'bg-white text-center h-min';
  const conditionalClasses = twMerge(
    rounded ? 'rounded-md' : '',
    !flat ? 'shadow-md' : '',
    padded ? 'p-2' : '',
  );
  const combinedClassNames = twMerge(baseClassNames, conditionalClasses, className);
  return (
    <div 
    class={combinedClassNames}
    >
        {children}
    </div>
  )
}