import { useState, useEffect } from "react";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import DatePicker from "../../../../components/form/date-picker";
import { Modal } from "../../../../components/ui/modal";
import { Calendar } from "../../../../interface/CalendarInterface";
import CalendarController from "../../../../controller/CalendarController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
}

export default function AddModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate = "",
}: AddModalProps) {
  const calendarController = new CalendarController();

  const [event, setEvent] = useState<Omit<Calendar, "id">>({
    name: "",
    date: "",
    type: "off",
  });

  useEffect(() => {
    if (isOpen) {
      setEvent({
        name: "",
        date: initialDate || new Date().toISOString().split("T")[0],
        type: "off",
      });
    }
  }, [isOpen, initialDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setEvent({ ...event, type: value as any });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (event.name.trim() === "" || event.date.trim() === "") {
      Toast({ message: "Nama kegiatan dan tanggal wajib diisi!", variant: "warning" });
      return;
    }

    try {
      await calendarController.create(event);
      Toast({ message: "Kegiatan/Hari Libur berhasil ditambahkan!", variant: "success" });
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
          Tambah Hari Libur / Kegiatan
        </h3>

        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Nama Kegiatan / Keterangan
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Contoh: Libur Hari Raya Idul Fitri"
              value={event.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Tanggal
            </label>
            <DatePicker
              id="eventDate"
              defaultDate={event.date}
              placeholder="Pilih Tanggal"
              onChange={(_selectedDates: any, dateStr: string) => {
                setEvent(prev => ({ ...prev, date: dateStr }));
              }}
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
              defaultValue={event.type}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
