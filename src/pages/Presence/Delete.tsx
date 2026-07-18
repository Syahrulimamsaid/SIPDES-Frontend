import { useState } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import { Trash2 } from "lucide-react";
import { Presence } from "../../interface/PresenceInterface";
import PresenceController from "../../controller/PresenceController";
import { Toast } from "../../components/ui/alert/Toast";
import { catchHandle } from "../../helpers/catchHandle";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  presence: Presence | null;
  onConfirm: () => void;
}

const presenceController = new PresenceController();

export default function DeleteModal({ isOpen, onClose, presence, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!presence) return;
    try {
      setLoading(true);
      await presenceController.destory(presence.id);
      Toast({ message: "Presensi berhasil dihapus", variant: "success" });
      onConfirm();
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500">
          <Trash2 size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Hapus Presensi?
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus catatan presensi untuk{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {presence?.user?.fullname}
            </span>{" "}
            pada tanggal <span className="font-semibold">{presence?.date?.split("T")[0]}</span>?
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 border-none"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
