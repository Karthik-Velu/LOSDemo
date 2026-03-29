import React from "react";

interface RegionSelectorProps {
  onSelect: (region: string) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#11287c] to-[#1e3a8a] bg-clip-text text-transparent mb-4">
            Ki Originate<br />Demo Platform
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            Select a region to begin the demo experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <button
            onClick={() => onSelect('africa')}
            className="group bg-white rounded-2xl p-8 shadow-lg border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all text-left"
          >
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#11287c] transition-colors">Africa</h2>
          </button>

          <button
            onClick={() => onSelect('apac')}
            className="group bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all text-left"
          >
            <div className="text-5xl mb-4">🌏</div>
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#11287c] transition-colors">APAC</h2>
          </button>
        </div>
      </div>
    </div>
  );
};
