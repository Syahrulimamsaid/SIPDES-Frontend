import React, { useEffect, useState } from "react";
import { Modal } from "../../../../components/ui/modal";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import Button from "../../../../components/ui/button/Button";
import { Village } from "../../../../interface/VillageInterface";
import LocationController from "../../../../controller/LocationController";
import { LocationCreate } from "../../../../interface/LocationInterface";
import { catchHandle } from "../../../../helpers/catchHandle";
import { Toast } from "../../../../components/ui/alert/Toast";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  villages: Village[];
}

const customMarkerIcon = new L.DivIcon({
  html: `<div class="bg-brand-500 text-white p-1 rounded-full shadow-lg border border-white flex items-center justify-center w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: "custom-leaflet-marker",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function MapEvents({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  villages,
}: AddLocationModalProps) {
  const locationController = new LocationController();

  const [form, setForm] = useState<LocationCreate>({
    name: "",
    lat: 0,
    lng: 0,
    radius: 0,
    villageId: "",
  });

  const villageOptions = villages.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        lat: 0,
        lng: 0,
        radius: 0,
        villageId: "",
      });
    }
  }, [isOpen, villages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const latVal = form.lat;
  const lngVal = form.lng;
  const radiusVal = form.radius;
  const isValidLatLng = !isNaN(latVal) && !isNaN(lngVal) && latVal !== 0 && lngVal !== 0;

  const handleMapClick = (latlng: L.LatLng) => {
    setForm((prev) => ({
      ...prev,
      lat: Number(latlng.lat.toFixed(6)),
      lng: Number(latlng.lng.toFixed(6)),
    }));
  };

  const handleMarkerDragEnd = (e: any) => {
    const latlng = e.target.getLatLng();
    setForm((prev) => ({
      ...prev,
      lat: Number(latlng.lat.toFixed(6)),
      lng: Number(latlng.lng.toFixed(6)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        form.name.trim() === "" ||
        form.lat === 0 ||
        form.lng === 0 ||
        form.radius === 0
      ) {
        Toast({ message: "Semua kolom input wajib diisi!", variant: "error" });
        return;
      }

      if (form.villageId === "") {
        Toast({ message: "Wilayah desa wajib diisi!", variant: "error" });
        return;
      }

      await locationController.create(form);
      Toast({ message: "Area presensi berhasil ditambahkan!", variant: "success" });
      onClose();
    } catch (err) {
      catchHandle({ err, variant: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Tambah Area Presensi
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Nama
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Contoh: Kantor Desa Melati Baru"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Pilih Wilayah Desa
            </label>
            <Select
              options={villageOptions}
              placeholder="Pilih Desa"
              onChange={(val) => setForm({ ...form, villageId: val })}
              defaultValue={form.villageId}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Pilih Lokasi di Peta
            </label>
            <div className="h-56 w-full rounded-lg border border-gray-200 dark:border-gray-850 overflow-hidden relative z-0">
              <MapContainer
                center={isValidLatLng ? [latVal, lngVal] : [-5.1476, 119.4328]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <ChangeMapView center={isValidLatLng ? [latVal, lngVal] : [-5.1476, 119.4328]} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onClick={handleMapClick} />
                {isValidLatLng && (
                  <>
                    <Marker
                      position={[latVal, lngVal]}
                      icon={customMarkerIcon}
                      draggable={true}
                      eventHandlers={{
                        dragend: handleMarkerDragEnd,
                      }}
                    />
                    {radiusVal > 0 && (
                      <Circle
                        center={[latVal, lngVal]}
                        radius={radiusVal}
                        pathOptions={{
                          color: "#4f46e5",
                          fillColor: "#4f46e5",
                          fillOpacity: 0.15,
                        }}
                      />
                    )}
                  </>
                )}
              </MapContainer>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              *Klik peta atau geser marker untuk menentukan koordinat otomatis.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Latitude
              </label>
              <Input
                type="text"
                name="lat"
                disabled
                value={form.lat}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Longitude
              </label>
              <Input
                type="text"
                name="lng"
                disabled
                value={form.lng}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Radius Jangkauan (Meter)
            </label>
            <Input
              type="number"
              name="radius"
              placeholder="Contoh: 100"
              value={form.radius}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Area
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
