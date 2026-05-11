import { ReactNode } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
} from "react-leaflet";

interface MapProps {
  lat: number;
  long: number;
  children?: ReactNode;
  className?: ReactNode;
  animateMove?: boolean;
}

const Map: React.FC<MapProps> = ({
  lat = 0,
  long = 0,
  children,
  className,
  animateMove = false,
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
      <Marker position={[lat, long]}>
        <Popup>{children}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
