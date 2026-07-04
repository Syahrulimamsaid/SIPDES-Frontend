import { useEffect, useState, Fragment } from "react";
import PageMeta from "../../../components/common/PageMeta";
import Button from "../../../components/ui/button/Button";
import TimePicker from "../../../components/form/time-picker";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import AddLocationModal from "./Location/Add";
import EditLocationModal from "./Location/Edit";
import DeleteLocationModal from "./Location/Delete";
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from "../../../components/ui/table";
import { Location } from "../../../interface/LocationInterface";
import { Village } from "../../../interface/VillageInterface";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Compass,
  Layers,
  Building,
  Clock,
} from "lucide-react";
import { catchHandle } from "../../../helpers/catchHandle";
import LocationController from "../../../controller/LocationController";
import VillageController from "../../../controller/VillageController";
import SettingController from "../../../controller/SettingController";
import { Toast } from "../../../components/ui/alert/Toast";

export default function Setting() {
  const locationController = new LocationController();
  const villageController = new VillageController();
  const settingController = new SettingController();

  const [locations, setLocations] = useState<Location[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const [inTimeLimit, setInTimeLimit] = useState("08:00");
  const [outTimeLimit, setOutTimeLimit] = useState("17:00");

  const getLocation = async () => {
    try {
      const data = await locationController.get();
      setLocations(data);
    }
    catch (err) {
      catchHandle({ err, variant: 'error' });
    }
  }

  const getVillage = async () => {
    try {
      const data = await villageController.get();
      setVillages(data);
    }
    catch (err) {
      catchHandle({ err, variant: 'error' });
    }
  }

  useEffect(() => {
    getLocation();
    getVillage();
  }, []);

  useEffect(() => {
    if (locations.length === 0) {
      setFilteredLocations([]);
    }
  }, [locations]);

  const handleSetting = async () => {
    try {
      await settingController.update(inTimeLimit, outTimeLimit);
      Toast({ message: "Pengaturan berhasil diperbarui!", variant: "success" });
    } catch (error) {
      catchHandle({ err: error, variant: 'error' });
    }
  }

  const customMarkerIcon = new L.DivIcon({
    html: `<div class="bg-brand-500 text-white p-1 rounded-full shadow-lg border border-white flex items-center justify-center w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    className: "custom-leaflet-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });

  const defaultCenter: [number, number] = (() => {
    if (locations.length === 0) return [-5.1476, 119.4328];
    const sumLat = locations.reduce((sum, loc) => sum + Number(loc.lat), 0);
    const sumLng = locations.reduce((sum, loc) => sum + Number(loc.lng), 0);
    return [sumLat / locations.length, sumLng / locations.length];
  })();

  function ChangeMapView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center[0] && center[1]) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  }

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLocations(locations);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredLocations(
        locations.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            (l.village?.name || "").toLowerCase().includes(q)
        )
      );
    }
  }, [locations, searchTerm]);

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleEdit = (loc: Location) => {
    setCurrentLocation(loc);
    setIsEditOpen(true);
  };

  const handleDelete = (loc: Location) => {
    setCurrentLocation(loc);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Pengaturan Area Presensi - SIPDES"
        description="Konfigurasi geofence koordinat dan radius presensi perangkat"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Pengaturan Presensi (Geofence)
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Konfigurasi radius aman presensi, koordinat latitude & longitude di setiap wilayah kantor desa.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 self-start sm:self-auto"
            startIcon={<Plus size={18} />}
          >
            Tambah Titik Presensi
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="max-w-md space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cari Titik Koordinat / Desa
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                  <input
                    type="text"
                    placeholder="Nama lokasi presensi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <TableHeader className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-4">Titik Presensi</TableCell>
                      <TableCell isHeader className="px-5 py-4">Desa Wilayah</TableCell>
                      <TableCell isHeader className="px-5 py-4">Koordinat (Lat / Lng)</TableCell>
                      <TableCell isHeader className="px-5 py-4">Radius Aman</TableCell>
                      <TableCell isHeader className="px-5 py-4 text-center">Aksi</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <TableRow
                          key={loc.id}
                          className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                        >
                          <TableCell className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                            {loc.name}
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <span className="flex items-center gap-1.5">
                              <Building size={14} className="text-gray-400" />
                              {loc.village?.name || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            <div className="text-xs">Lat: {loc.lat}</div>
                            <div className="text-xs">Lng: {loc.lng}</div>
                          </TableCell>
                          <TableCell className="px-5 py-4 font-bold text-brand-600 dark:text-brand-400">
                            {loc.radius} Meter
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(loc)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                                title="Edit Area"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(loc)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                                title="Hapus Area"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="px-5 py-12 text-center text-gray-400 dark:text-gray-600">
                          Belum ada area presensi dikonfigurasi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {locations.length > 0 && (
                <TablePagination
                  data={locations}
                  defaultItemsPerPage={10}
                  onPageDataChange={setFilteredLocations}
                />
              )}
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="text-brand-500" size={18} /> Batas Jam Presensi
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Atur waktu batas jam masuk (keterlambatan) and jam pulang perangkat desa.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Batas Jam Masuk
                  </label>
                  <TimePicker
                    id="inTimeLimit"
                    defaultDate={inTimeLimit}
                    placeholder="Pilih Jam Masuk"
                    onChange={(_selectedDates: any, dateStr: string) => {
                      setInTimeLimit(dateStr);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Batas Jam Pulang
                  </label>
                  <TimePicker
                    id="outTimeLimit"
                    defaultDate={outTimeLimit}
                    placeholder="Pilih Jam Pulang"
                    onChange={(_selectedDates: any, dateStr: string) => {
                      setOutTimeLimit(dateStr);
                    }}
                  />
                </div>
                <Button variant="primary" onClick={handleSetting} className="w-full justify-center">
                  Simpan Jam Presensi
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Compass className="text-brand-500" size={18} /> Visualisasi Peta Jangkauan
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Peta cakupan geofencing (radius aman) dari seluruh kantor desa yang terdaftar.
                </p>

                <div className="relative h-72 w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-0">
                  <MapContainer
                    center={defaultCenter}
                    zoom={10}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                  >
                    <ChangeMapView center={defaultCenter} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((loc) => (
                      <Fragment key={loc.id}>
                        <Marker position={[loc.lat, loc.lng]} icon={customMarkerIcon}>
                          <Popup>
                            <div className="text-xs p-1 space-y-1">
                              <strong className="block text-sm font-bold text-gray-900">{loc.name}</strong>
                              <span className="block text-gray-500">Desa: {loc.village?.name || "N/A"}</span>
                              <span className="block font-mono text-[10px] text-gray-400">Lat: {loc.lat}<br />Lng: {loc.lng}</span>
                              <span className="block font-bold text-brand-600 mt-1">Radius: {loc.radius} Meter</span>
                            </div>
                          </Popup>
                        </Marker>
                        <Circle
                          center={[loc.lat, loc.lng]}
                          radius={loc.radius}
                          pathOptions={{
                            color: "#4f46e5",
                            fillColor: "#4f46e5",
                            fillOpacity: 0.15,
                          }}
                        />
                      </Fragment>
                    ))}
                  </MapContainer>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400 border border-amber-500/10 flex items-start gap-2">
                <Layers size={18} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Informasi:</strong> Perangkat desa hanya dapat melakukan presensi kehadiran jika GPS perangkat berada di dalam geofence (radius aman) diatas.
                </span>
              </div>
            </div>
          </div>
        </div>

        <AddLocationModal
          isOpen={isAddOpen}
          onClose={() => { setIsAddOpen(false); getLocation(); }}
          villages={villages}
        />

        <EditLocationModal
          isOpen={isEditOpen}
          onClose={() => { setIsEditOpen(false); getLocation(); }}
          villages={villages}
          location={currentLocation}
        />

        <DeleteLocationModal
          isOpen={isDeleteOpen}
          onClose={() => { setIsDeleteOpen(false); getLocation(); }}
          location={currentLocation}
        />
      </div>
    </>
  );
}
