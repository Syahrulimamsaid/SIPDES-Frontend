import React, { useEffect, useState } from "react";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { Modal } from "../../../../components/ui/modal";
import { User } from "../../../../interface/UserInterface";
import { Location } from "../../../../interface/LocationInterface";
import LocationController from "../../../../controller/LocationController";
import { catchHandle } from "../../../../helpers/catchHandle";
import { Toast } from "../../../../components/ui/alert/Toast";
import { LocationAccessCreate } from "../../../../interface/LocationAccessInterface";

interface AddAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function AddAccessModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: AddAccessModalProps) {
  const locationController = new LocationController();

  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<LocationAccessCreate>({
    userId: user?.id,
    locationId: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const getLocations = async () => {
    try {
      const data = await locationController.get();
      setLocations(data);
    } catch (error) {
      catchHandle({ err: error, variant: "error" });
    }
  }

  useEffect(() => {
    if (isOpen) {
      setForm({
        userId: user?.id,
        locationId: "",
        description: ""
      });
      getLocations();
    }
  }, [isOpen]);

  const locationOptions = locations.map((loc) => ({
    value: loc.id,
    label: loc.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      Toast({ message: "Data perangkat desa tidak valid!", variant: "warning" });
      return;
    }

    if (!form.locationId) {
      Toast({ message: "Silakan pilih lokasi kantor!", variant: "warning" });
      return;
    }

    if (!form.description) {
      Toast({ message: "Silakan masukan deskripsi lokasi!", variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      await locationController.createAccess(form);
      Toast({ message: "Akses lokasi berhasil diberikan!", variant: "success" });
      onSuccess();
      onClose();
    } catch (err) {
      catchHandle({ err, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Beri Akses Lokasi Baru
        </h3>

        {user && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Perangkat Desa
              </label>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.fullname || "Tidak Diketahui"}
                </p>
                <p className="text-xs text-gray-400">
                  {user.village?.name || "Tanpa Desa"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pilih Lokasi Kantor
              </label>
              <Select
                options={locationOptions}
                placeholder="Pilih Lokasi"
                onChange={(val) => setForm((prev) => ({ ...prev, locationId: val }))}
                defaultValue={form.locationId}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Keterangan / Deskripsi Akses
              </label>
              <Input
                type="text"
                placeholder="Contoh: Akses Kantor Desa Utama"
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                value={form.description}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
