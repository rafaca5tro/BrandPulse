import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip as MapTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionData {
  name: string;
  lat: number;
  lng: number;
  penetration: number; // 0-100
  sentiment: number; // -100 to 100
}

interface GlobalImpactMapProps {
  regions: RegionData[];
  onRegionSelect: (region: string, adjustments: Record<string, number>) => void;
}

const GlobalImpactMap: React.FC<GlobalImpactMapProps> = ({ regions, onRegionSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [adjustment, setAdjustment] = useState<number>(0);

  const getColor = (sentiment: number) => {
    if (sentiment > 50) return '#10b981'; // emerald
    if (sentiment > 0) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  const handleSimulate = (region: string) => {
    if (adjustment !== 0) {
      onRegionSelect(region, { penetration: adjustment });
      setAdjustment(0);
    }
  };

  return (
    <Card className="mt-6 border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-100 font-['Inter']">
          Global Impact Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-96">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} className="rounded-lg">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
            />
            {regions.map((region) => (
              <CircleMarker
                key={region.name}
                center={[region.lat, region.lng]}
                radius={Math.max(5, region.penetration / 5)}
                fillColor={getColor(region.sentiment)}
                color={getColor(region.sentiment)}
                fillOpacity={0.7}
                eventHandlers={{
                  click: () => setSelectedRegion(region.name),
                }}
              >
                <MapTooltip>
                  <div className="text-sm text-gray-100">
                    <strong>{region.name}</strong><br />
                    Penetration: {region.penetration}%<br />
                    Sentiment: {region.sentiment}
                  </div>
                </MapTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        {selectedRegion && (
          <div className="mt-4 flex space-x-4">
            <input
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
              placeholder="Penetration % Change"
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-sm text-gray-200 font-['Inter'] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => handleSimulate(selectedRegion)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              Simulate
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalImpactMap;