import React, { useEffect, useState } from "react";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { Modal } from "../../../../components/ui/modal";
import { Village } from "../../../../interface/VillageInterface";
import { SubDistrict } from "../../../../interface/SubDistrictInterface";
import VillageController from "../../../../controller/VillageController";
import DistrictController from "../../../../controller/SubDistrictController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface EditDesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  village: Village | null;
  onSuccess: () => void;
}

export default function EditDesaModal({
  isOpen,
  onClose,
  village,
  onSuccess,
}: EditDesaModalProps) {
  const villageController = new VillageController();
  const districtController = new DistrictController();

  const [form, setForm] = useState<Omit<Village, "id">>({
    name: "",
    address: "",
    subDistrictId: "",
  });

  const [subDistricts, setSubsubDistricts] = useState<SubDistrict[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchsubDistricts = async () => {
    try {
      const data = await districtController.get();
      setSubsubDistricts(data || []);
    } catch (err) {
      catchHandle({ err, variant: "error" });
    }
  };

  useEffect(() => {
    if (isOpen && village) {
      setForm({
        name: village.name || "",
        address: village.address || "",
        subDistrictId: village.subDistrict?.id || "",
      });
      fetchsubDistricts();
    }
  }, [isOpen, village]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, districtId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!village) return;

    if (!form.name.trim()) {
      Toast({ message: "Nama desa wajib diisi!", variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      await villageController.update(village.id, form);
      Toast({ message: "Data desa berhasil diperbarui!", variant: "success" });
      onSuccess();
      onClose();
    } catch (err) {
      catchHandle({ err, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const districtOptions = subDistricts.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Ubah Data Desa
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nama Desa
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Contoh: Desa Melati"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Alamat Kantor Desa / Keterangan
            </label>
            <Input
              type="text"
              name="address"
              placeholder="Contoh: Jl. Melati No. 10"
              value={form.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Kecamatan
            </label>
            <Select
              options={districtOptions}
              placeholder="Pilih Kecamatan"
              onChange={handleSelectChange}
              defaultValue={form.subDistrictId}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
