import { useState } from "react";
import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import LocationController from "../../../../controller/LocationController";
import { catchHandle } from "../../../../helpers/catchHandle";
import { Toast } from "../../../../components/ui/alert/Toast";
import { Trash2 } from "lucide-react";

interface DeleteAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onSuccess: () => void;
}

export default function DeleteAccessModal({
  isOpen,
  onClose,
  id,
  onSuccess,
}: DeleteAccessModalProps) {
  const locationController = new LocationController();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;

    setLoading(true);
    try {
      await locationController.deleteAccess(id);
      Toast({ message: "Akses lokasi berhasil dicabut!", variant: "success" });
      onSuccess();
    } catch (err) {
      catchHandle({ err, variant: "error" });
    } finally {
      onClose();
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
            Cabut Akses Lokasi?
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin mencabut akses lokasi
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 border-none"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Mencabut..." : "Cabut"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
