import { ReactNode, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
  useMap,
} from "react-leaflet";

interface MapProps {
  lat: number;
  long: number;
  children?: ReactNode;
  className?: ReactNode;
  animateMove?: boolean;
  autoCenter?: boolean;
}

function ChangeMapView({ lat, lng, animate }: { lat: number; lng: number; animate: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), {
        animate: animate,
      });
    }
  }, [lat, lng, map, animate]);
  return null;
}

const Map: React.FC<MapProps> = ({
  lat = 0,
  long = 0,
  children,
  className,
  animateMove = false,
  autoCenter = true,
}) => {
  function SetViewOnClick({ animateRef }: { animateRef: boolean }) {
    const map = useMapEvent("click", (e) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: animateRef || false,
      });
    });

    return null;
  }
  return (
    <MapContainer
      center={[lat, long]}
      zoom={13}
      scrollWheelZoom={false}
      className={`${className}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewOnClick animateRef={animateMove} />
      {autoCenter && <ChangeMapView lat={lat} lng={long} animate={animateMove} />}
      <Marker position={[lat, long]}>
        <Popup>{children}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
