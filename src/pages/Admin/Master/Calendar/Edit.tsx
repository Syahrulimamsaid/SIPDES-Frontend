import { useState, useEffect } from "react";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { Modal } from "../../../../components/ui/modal";
import { Calendar } from "../../../../interface/CalendarInterface";
import CalendarController from "../../../../controller/CalendarController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event: Calendar | null;
}

export default function EditModal({
  isOpen,
  onClose,
  onSuccess,
  event,
}: EditModalProps) {
  const calendarController = new CalendarController();

  const [form, setForm] = useState<Omit<Calendar, "id">>({
    name: "",
    date: "",
    type: "off",
  });

  useEffect(() => {
    if (isOpen && event) {
      setForm({
        name: event.name,
        date: event.date ? event.date.split("T")[0] : "",
        type: event.type || "off",
      });
    }
  }, [isOpen, event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setForm({ ...form, type: value as any });
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (form.name.trim() === "" || form.date.trim() === "") {
      Toast({ message: "Nama kegiatan dan tanggal wajib diisi!", variant: "warning" });
      return;
    }

    try {
      await calendarController.update(event.id, form);
      Toast({ message: "Kegiatan/Hari Libur berhasil diperbarui!", variant: "success" });
      onSuccess();
      onClose();
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    }
  };

  const typeOptions = [
    { label: "Hari Kerja", value: "h" },
    { label: "Hari Libur / Off", value: "off" },
    { label: "Tugas / Kegiatan", value: "t" },
    { label: "Lainnya", value: "fm" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Ubah Hari Libur / Kegiatan
        </h3>

        <form onSubmit={handleUpdateEvent} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Nama Kegiatan / Keterangan
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Contoh: Libur Hari Raya Idul Fitri"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Tanggal
            </label>
            <Input
              type="date"
              name="date"
              value={form.date}
              required
              disabled
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Tipe Hari
            </label>
            <Select
              options={typeOptions}
              placeholder="Pilih Tipe Hari"
              onChange={handleSelectChange}
              defaultValue={form.type}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
