import React, { useState } from "react";
import { type LoanApplication } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { StepNarration } from "../../components/StepNarration";
import { vendorPersona, formatINR } from "../../lib/vendorDemo";

interface VendorProfileProps {
  application: LoanApplication;
  onUpdate: (updates: Partial<LoanApplication>) => Promise<any>;
  onNext: () => void;
  onBack: () => void;
}

const sellsOptions = ['Vegetables', 'Fruits', 'Food cart', 'Flowers', 'General store', 'Other'];
const shopTypeOptions = ['Street pitch', 'Cart', 'Shutter shop'];

export const VendorProfile: React.FC<VendorProfileProps> = ({
  onUpdate,
  onNext,
  onBack,
}) => {
  const [sells, setSells] = useState(vendorPersona.sells);
  const [shopType, setShopType] = useState(vendorPersona.shopType);
  const [market, setMarket] = useState(vendorPersona.marketName);
  const [city, setCity] = useState(vendorPersona.city);
  const [years, setYears] = useState(vendorPersona.yearsInBusiness);
  const [dailySales, setDailySales] = useState(vendorPersona.dailySales);
  const [noDueDay, setNoDueDay] = useState('Monday');
  const [saving, setSaving] = useState(false);

  const qualifies = dailySales >= 800;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({
      vendor_profile: {
        sells,
        shop_type: shopType,
        market,
        city,
        years_in_business: years,
        daily_sales: dailySales,
        weekly_no_due_day: noDueDay,
      },
    } as any);
    setSaving(false);
    onNext();
  };

  return (
    <div>
      <StepNarration
        step={2}
        title="Business Profile"
        description="A few plain-language questions about the vendor's business. What she sells, where she trades from, how long she has been there, and what a typical day's sales look like. The daily-sales figure doubles as the qualifying revenue band for the product and as the anchor for instalment sizing — the daily instalment is never allowed past a fixed share of daily sales."
        icon="🛒"
        color="green"
        totalSteps={7}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
        <p className="text-sm text-gray-600 mt-1">Vendor-friendly inputs — everything is pre-filled and editable</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-8">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">What do you sell?</label>
          <div className="flex flex-wrap gap-2">
            {sellsOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSells(option)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  sells === option
                    ? 'border-[#11287c] bg-[#11287c] text-white shadow'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#28B2B6]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">Where do you trade from?</label>
          <div className="flex flex-wrap gap-2">
            {shopTypeOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setShopType(option)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  shopType === option
                    ? 'border-[#11287c] bg-[#11287c] text-white shadow'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#28B2B6]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market / street</label>
            <input
              type="text"
              value={market}
              onChange={e => setMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years in business</label>
            <input
              type="number"
              min={0}
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly no-due day
              <span className="ml-2 text-xs text-gray-500 font-normal">(borrower's choice)</span>
            </label>
            <select
              value={noDueDay}
              onChange={e => setNoDueDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#11287c] focus:border-transparent"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">No instalment is presented on this day, every week</p>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-800">Typical daily sales</label>
            <span className="text-2xl font-bold text-[#11287c]">{formatINR(dailySales)}</span>
          </div>
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={dailySales}
            onChange={e => setDailySales(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#28B2B6]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatINR(500)}</span>
            <span>{formatINR(10000)}</span>
          </div>
          <div className={`mt-4 p-3 rounded-lg border text-sm ${
            qualifies
              ? 'bg-teal-50 border-teal-200 text-teal-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {qualifies
              ? '✓ Within the qualifying revenue band for this product. This figure also caps the daily instalment at 18% of typical daily sales.'
              : 'Below the qualifying revenue band for this construct — the case would be routed to a smaller first-cycle ticket.'}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="px-6">Back</Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#11287c] hover:bg-[#1e3a8a] text-white px-8 py-2"
        >
          {saving ? 'Saving...' : 'Save & Continue to Consent'}
        </Button>
      </div>
    </div>
  );
};
