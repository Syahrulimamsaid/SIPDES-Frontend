import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import { SubDistrict } from "../../../../interface/SubDistrictInterface";
import SubDistrictController from "../../../../controller/SubDistrictController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";

interface DeleteSubDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  subDistrict: SubDistrict | null;
  onSuccess: () => void;
}

export default function DeleteSubDistrictModal({
  isOpen,
  onClose,
  subDistrict,
  onSuccess,
}: DeleteSubDistrictModalProps) {
  const subDistrictController = new SubDistrictController();

  const handleDeleteSubDistrict = async () => {
    if (!subDistrict) return;

    try {
      await subDistrictController.destroy(subDistrict.id);
      Toast({ message: "Data kecamatan berhasil dihapus!", variant: "success" });
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
            Hapus Kecamatan?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus kecamatan <strong>"{subDistrict?.name}"</strong>? Semua desa yang terkait dengan kecamatan ini mungkin akan kehilangan referensi wilayah administrasinya. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDeleteSubDistrict}
            className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 font-semibold"
          >
            Hapus Kecamatan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
