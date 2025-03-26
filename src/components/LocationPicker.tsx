
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("");

  const getLocation = () => {
    setIsLoading(true);
    setLocationStatus("Requesting your location...");

    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect({ lat: latitude, lng: longitude });
        setLocationStatus("Location captured successfully");
        toast.success("Location captured successfully");
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus(`Error: ${error.message}`);
        toast.error(`Could not get your location: ${error.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={getLocation}
          disabled={isLoading}
          className="glass-button flex items-center justify-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          {isLoading ? "Getting Location..." : "Capture Current Location"}
        </Button>
        
        {locationStatus && (
          <p className={`text-sm ${locationStatus.includes("Error") ? "text-destructive" : locationStatus.includes("success") ? "text-green-600" : "text-muted-foreground"}`}>
            {locationStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
