import React from "react";

export const Card = ({ children }) => {
    return <div className="bg-white p-8 rounded-lg shadow-lg">{children}</div>;
};

export const CardContent = ({ children }) => {
    return <div className="text-center w-full max-w-lg">{children}</div>;
};

export const CardHeader = ({ children }) => {
    return <div className="border-b pb-2 mb-4">{children}</div>;
};

export const CardTitle = ({ children }) => {
    return <h2 className="text-2xl font-bold text-gray-800">{children}</h2>;
};
