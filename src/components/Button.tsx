import React from "react";

// extend input props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
export const Button = (props: ButtonProps) => {
    return (
        <button
            className="rounded-full border border-[#236456] bg-[#112220] text-[#33C6AB] py-1 px-3"
            {...props}>
            {props.children}
        </button>
    );
}