import React from "react";

// extend input props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}
export const Input = (props: InputProps) => {
    return (
        <div className={`border border-[#242424] bg-[#161616] p-2 rounded-xl flex-grow`}>
            <input
                {...props}
                className="border-none bg-[#161616] focus:outline-none w-full text-white placeholder-gray-400"
                type="text"
            />
        </div>
    );
}