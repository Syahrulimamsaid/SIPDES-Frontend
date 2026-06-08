import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import { User } from "../../../../interface/UserInterface";
import { Trash2 } from "lucide-react";
import { catchHandle } from "../../../../helpers/catchHandle";
import UserController from "../../../../controller/UserController";
import { Toast } from "../../../../components/ui/alert/Toast";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: DeleteUserModalProps) {
  const userController = new UserController();

  const handleConfirmDelete = async () => {
    if (!user?.id) return;
    try {
      await userController.destroy(user.id);
      Toast({
        message: 'User berhasil dihapus',
        variant: 'success',
      });
      onSuccess();
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }
    finally {
      onClose();
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
            Hapus User?
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus user{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {user?.fullname}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 border-none"
            onClick={handleConfirmDelete}
          >
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
