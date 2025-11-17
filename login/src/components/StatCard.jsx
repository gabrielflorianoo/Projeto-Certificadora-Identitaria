import React from "react";
import GlassCard from "./GlassCard";

const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
    const colorClasses = {
        blue: "text-blue-300",
        green: "text-green-300",
        yellow: "text-yellow-300",
        red: "text-red-300",
        purple: "text-purple-300",
    };

    return (
        <GlassCard className="p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/70 text-sm font-medium">{title}</p>
                    <p className="text-white text-2xl font-bold mt-1">
                        {value}
                    </p>
                    {subtitle && (
                        <p className={`text-sm mt-1 ${colorClasses[color]}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`${colorClasses[color]} text-3xl`}>
                        <Icon />
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

export default StatCard;
