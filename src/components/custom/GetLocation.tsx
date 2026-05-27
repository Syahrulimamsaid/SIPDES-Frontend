import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { getLocation } from "../../helpers/GetLocation";

function GetLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleGetLocation = async () => {
    const location = await getLocation();
    if (location) {
      setLocation({ lat: location.lat, lng: location.lng });
    }
   
  };

  useEffect(() => {
    handleGetLocation();
  }, [location]);

  return (
    <div>
      <Button onClick={handleGetLocation} className="dark:bg-brand-600 dark:hover:bg-brand-700">Ambil Lokasi</Button>

      {location && (
        <p className="text-gray-500 dark:text-gray-400">
          Lat: {location.lat}, Lng: {location.lng}
        </p>
      )}
    </div>
  );
}

export default GetLocation;
