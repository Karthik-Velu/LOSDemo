import React, { useState, useEffect } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { StepNarration } from "../../components/StepNarration";

interface FarmDetailsProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

const defaultFarmData = {
  crops_grown: 'Maize & beans (intercrop)',
  acreage: '1.5',
  water_source: 'Borehole',
  water_tank_capacity: '500 litres',
  distance_to_water: '1.2 km',
  ownership: 'Owned',
  agro_zone: 'Lowland transition — semi-arid',
  location: 'Kithimani Village, Yatta Sub-County, Machakos County',
};

export const FarmDetails: React.FC<FarmDetailsProps> = ({
  application,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [farmData, setFarmData] = useState(defaultFarmData);
  const [filling, setFilling] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFilling(true);
    const timer = setTimeout(() => {
      setFilling(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ farm_details: farmData } as any);
    setSaving(false);
    onNext();
  };

  const fields = [
    { label: 'Crops Grown', value: farmData.crops_grown, key: 'crops_grown' },
    { label: 'Acreage (acres)', value: farmData.acreage, key: 'acreage' },
    { label: 'Current Water Source Used', value: farmData.water_source, key: 'water_source' },
    { label: 'Water Tank Capacity', value: farmData.water_tank_capacity, key: 'water_tank_capacity' },
    { label: 'Distance to Water Source', value: farmData.distance_to_water, key: 'distance_to_water' },
    { label: 'Ownership of Farm', value: farmData.ownership, key: 'ownership' },
    { label: 'Farm Location', value: farmData.location, key: 'location' },
    { label: 'Agro-Ecological Zone', value: farmData.agro_zone, key: 'agro_zone' },
  ];

  return (
    <div>
      <StepNarration
        step={2}
        title="Farm & Crop Profile"
        description="The loan officer captures the farmer's land and crop profile during onboarding. Climate, soil, and socioeconomic context is then matched to the farm's village or coordinates as entered. Together with the individual profile, they provide Ki Score with enough signal to generate a credit decision without any bureau or transaction history."
        icon="🌱"
        color="green"
      />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Farm & Crop Details</h2>
        <p className="text-sm text-gray-600 mt-1">Capture farm-level inputs for alternate data assessment</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {filling && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-700">Auto-populating farm profile from field data...</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={field.key === 'agro_zone' || field.key === 'location' ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                value={filling ? '' : field.value}
                readOnly
                className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm ${filling ? 'animate-pulse bg-gray-100' : ''}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>How it works:</strong> Climate and soil context (rainfall patterns, temperature, soil properties) and socioeconomic indicators are matched to the farm's location. These area-level signals are combined with the individual farm profile above to generate a credit score — no bureau or transaction data needed.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={filling || saving}
            className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-2"
          >
            {saving ? 'Saving...' : 'Save & Continue to Credit Assessment'}
          </Button>
        </div>
      </div>
    </div>
  );
};
