import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button/Button";
import { Trash2 } from "lucide-react";
import { Location } from "../../../../interface/LocationInterface";
import LocationController from "../../../../controller/LocationController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface DeleteLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

export default function DeleteLocationModal({
  isOpen,
  onClose,
  location,
}: DeleteLocationModalProps) {

  const locationController = new LocationController();

  const handleConfirm = async () => {
    try {
      await locationController.delete(location!.id);
      Toast({ message: "Data berhasil dihapus", variant: "success" });
      onClose();
    } catch (err) {
      catchHandle({ err, variant: "error" });
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
            Hapus Titik Presensi?
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus area presensi{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {location?.name}
            </span>
            ? Perangkat di wilayah ini tidak akan dapat login presensi sementara waktu.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 border-none"
            onClick={handleConfirm}
          >
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
