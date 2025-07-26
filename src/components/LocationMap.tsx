
import React from 'react';
import { MapPin } from 'lucide-react';
import { envConfig } from "@/lib/env-config";

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
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height: `${height}px` }}>
      <iframe
        src={envConfig.google.embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
        title={`${envConfig.business.name} Location Map`}
      />
      {!interactive && (
        <div className="absolute inset-0 bg-transparent cursor-pointer" />
      )}
    </div>
  );
};

export default LocationMap;
