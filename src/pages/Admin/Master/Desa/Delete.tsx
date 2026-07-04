import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import { Village } from "../../../../interface/VillageInterface";
import VillageController from "../../../../controller/VillageController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface DeleteDesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  village: Village | null;
  onSuccess: () => void;
}

export default function DeleteDesaModal({
  isOpen,
  onClose,
  village,
  onSuccess,
}: DeleteDesaModalProps) {
  const villageController = new VillageController();

  const handleDeleteVillage = async () => {
    if (!village) return;

    try {
      await villageController.destroy(village.id);
      Toast({ message: "Data desa berhasil dihapus!", variant: "success" });
      onSuccess();
      onClose();
    } catch (err) {
      catchHandle({ err, variant: "error" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4 text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Hapus Desa?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus <strong>"{village?.name}"</strong>? Semua relasi seperti akun perangkat desa dan titik presensi yang terikat pada desa ini mungkin terpengaruh. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDeleteVillage}
            className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 font-semibold"
          >
            Hapus Desa
          </Button>
        </div>
      </div>
    </Modal>
  );
}
