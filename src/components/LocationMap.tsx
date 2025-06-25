
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  height?: number;
  className?: string;
  interactive?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({
  height = 400,
  className = '',
  interactive = true,
}) => {
  // Static map implementation for demo
  return (
    <div 
      className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
      style={{ height: `${height}px` }}
    >
      <div className="text-center p-4">
        <MapPin className="h-8 w-8 text-bhagwati-maroon mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-bhagwati-maroon mb-2">
          Shree Bhagwati Caterers
        </h3>
        <p className="text-gray-600 mb-2">Premium Vegetarian Catering Services</p>
        <p className="text-sm text-gray-500">
          Interactive map would be displayed here in a full implementation
        </p>
      </div>
    </div>
  );
};

export default LocationMap;
