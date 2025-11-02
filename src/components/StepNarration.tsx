import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface StepNarrationProps {
  step: number;
  title: string;
  description: string;
  icon: string;
  color?: string;
  autoShow?: boolean;
}

export const StepNarration: React.FC<StepNarrationProps> = ({
  step,
  title,
  description,
  icon,
  color = "blue",
  autoShow = true
}) => {
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Auto-show once when component mounts, if enabled
    if (autoShow && !hasShown) {
      const timer = setTimeout(() => {
        setShow(true);
        setHasShown(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoShow, hasShown]);

  const colorClasses: Record<string, { bg: string; border: string; button: string }> = {
    blue: {
      bg: "from-blue-500 to-indigo-600",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700"
    },
    green: {
      bg: "from-green-500 to-emerald-600",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700"
    },
    purple: {
      bg: "from-purple-500 to-indigo-600",
      border: "border-purple-200",
      button: "bg-purple-600 hover:bg-purple-700"
    },
    indigo: {
      bg: "from-indigo-500 to-blue-600",
      border: "border-indigo-200",
      button: "bg-indigo-600 hover:bg-indigo-700"
    },
    emerald: {
      bg: "from-emerald-500 to-green-600",
      border: "border-emerald-200",
      button: "bg-emerald-600 hover:bg-emerald-700"
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#11287c] hover:bg-[#1e3a8a] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all transform hover:scale-110"
        title="Show step information"
      >
        <span className="text-2xl">ℹ️</span>
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={() => setShow(false)}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.bg} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl shadow-lg">
                {icon}
              </div>
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">Step {step} of 5</div>
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 ${colors.border} mb-6`}>
            <p className="text-gray-800 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              💡 Click anywhere outside this box to continue
            </p>
            <Button
              onClick={() => setShow(false)}
              className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-4 text-lg font-semibold shadow-lg whitespace-nowrap flex-shrink-0"
            >
              Got It! →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

