import React, { useEffect, useState } from "react";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import { Modal } from "../../../../components/ui/modal";
import { SubDistrict } from "../../../../interface/SubDistrictInterface";
import SubDistrictController from "../../../../controller/SubDistrictController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface EditSubDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  subDistrict: SubDistrict | null;
  onSuccess: () => void;
}

export default function EditSubDistrictModal({
  isOpen,
  onClose,
  subDistrict,
  onSuccess,
}: EditSubDistrictModalProps) {
  const subDistrictController = new SubDistrictController();

  const [form, setForm] = useState<Omit<SubDistrict, "id">>({
    name: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && subDistrict) {
      setForm({
        name: subDistrict.name || "",
      });
    }
  }, [isOpen, subDistrict]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subDistrict) return;

    if (!form.name.trim()) {
      Toast({ message: "Nama kecamatan wajib diisi!", variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      await subDistrictController.update(subDistrict.id, form);
      Toast({ message: "Data kecamatan berhasil diperbarui!", variant: "success" });
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
          Ubah Data Kecamatan
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nama Kecamatan
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Contoh: Kecamatan Lowokwaru"
              value={form.name}
              onChange={handleChange}
              required
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
