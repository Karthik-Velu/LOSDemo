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
  crop_type: 'Maize',
  acreage: '1.5',
  irrigation: 'Supplemental (borehole)',
  gps_lat: '-1.4200',
  gps_lng: '37.2500',
  agro_zone: 'Lowland transition — semi-arid',
  land_tenure: 'Customary',
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
  const fillStarted = React.useRef(false);

  useEffect(() => {
    if (fillStarted.current) return;
    fillStarted.current = true;
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
    { label: 'Crop Type', value: farmData.crop_type, key: 'crop_type' },
    { label: 'Acreage (acres)', value: farmData.acreage, key: 'acreage' },
    { label: 'Irrigation Practice', value: farmData.irrigation, key: 'irrigation' },
    { label: 'Farm Latitude', value: farmData.gps_lat, key: 'gps_lat' },
    { label: 'Farm Longitude', value: farmData.gps_lng, key: 'gps_lng' },
    { label: 'Agro-Ecological Zone', value: farmData.agro_zone, key: 'agro_zone' },
    { label: 'Land Tenure', value: farmData.land_tenure, key: 'land_tenure' },
  ];

  return (
    <div>
      <StepNarration
        step={2}
        title="Farm & Crop Profile"
        description="The loan officer captures the farmer's land and crop profile. These inputs — combined with climate, soil, and socioeconomic data extracted at the farm's GPS location — are sufficient for Ki Score to generate a credit decision without any bureau or transaction history."
        icon="🌱"
        color="green"
      />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Farm & Crop Details</h2>
        <p className="text-sm text-gray-600 mt-1">Capture farm-level inputs for alternate data assessment</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        {filling && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-700">Auto-populating farm profile from field data...</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={field.key === 'agro_zone' ? 'sm:col-span-2' : ''}>
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
            <strong>Data pipeline:</strong> Climate signals (CHIRPS rainfall, ERA5 temperature, SPEI drought index), soil characteristics (SoilGrids at 250m resolution), and socioeconomic context (CIAT/GRDI) are automatically extracted at the farm GPS coordinates and fused with the profile above for scoring.
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
