import React from "react";

export const Button = ({ children, ...props }) => {
    return (
        <button
            className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition"
            {...props}
        >
            {children}
        </button>
    );
};
