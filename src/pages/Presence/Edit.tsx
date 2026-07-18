import React, { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";
import { User as UserIcon } from "lucide-react";
import { Presence, PresenceUpdate } from "../../interface/PresenceInterface";
import TimePicker from "../../components/form/time-picker";
import PresenceController from "../../controller/PresenceController";
import { Toast } from "../../components/ui/alert/Toast";
import { catchHandle } from "../../helpers/catchHandle";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  presence: Presence | null;
  onSave: () => void;
}

const presenceController = new PresenceController();

export default function EditModal({ isOpen, onClose, presence, onSave }: EditModalProps) {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<PresenceUpdate>({
    id: "",
    in: "",
    out: "",
    status: "",
  });

  const statusOptions = [
    { value: "hadir", label: "Hadir" },
    { value: "terlambat", label: "Terlambat" },
    { value: "alpa", label: "Alpa" },
    { value: "cuti", label: "Cuti" },
    { value: "pulang", label: "Pulang" },
  ];

  const loadData = () => {
    if (presence) {
      setEdit({
        id: presence.id,
        in: presence.in ?? '',
        out: presence.out ?? '',
        status: presence.status as PresenceUpdate["status"],
      });
    }
  }

  useEffect(() => {
    loadData();
  }, [presence]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presence) return;
    try {
      setLoading(true);
      await presenceController.update(edit);
      Toast({ message: "Presensi berhasil diperbarui", variant: "success" });
      onSave();
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6 sm:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Edit Presensi
          </h3>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
              <UserIcon size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                {presence?.user?.fullname}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {presence?.user?.village?.name}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Tanggal
            </label>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {presence?.date?.split("T")[0]}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Jam Masuk
            </label>
            <TimePicker
              id="inTime"
              defaultDate={edit.in}
              placeholder="Pilih Jam Masuk"
              onChange={(_selectedDates: any, dateStr: string) => {
                setEdit((prev) => ({ ...prev, in: presence?.date?.split("T")[0] + "T" + dateStr }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Jam Pulang
            </label>
            <TimePicker
              id="outTime"
              defaultDate={edit.out}
              placeholder="Pilih Jam Pulang"
              onChange={(_selectedDates: any, dateStr: string) => {
                setEdit((prev) => ({ ...prev, out: presence?.date?.split("T")[0] + "T" + dateStr }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Status
            </label>
            <Select
              options={statusOptions}
              placeholder="Pilih Status"
              onChange={(val) => setEdit((prev) => ({ ...prev, status: val as PresenceUpdate["status"] }))}
              defaultValue={edit.status}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
