import React from "react";

const GlassCard = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl animate-fade-in ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
