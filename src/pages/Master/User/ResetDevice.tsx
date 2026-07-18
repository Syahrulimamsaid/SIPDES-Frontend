import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { User } from "../../../interface/UserInterface";
import { Smartphone } from "lucide-react";
import { catchHandle } from "../../../helpers/catchHandle";
import UserController from "../../../controller/UserController";
import { Toast } from "../../../components/ui/alert/Toast";

interface ResetDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function ResetDeviceModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ResetDeviceModalProps) {
  const userController = new UserController();

  const handleConfirmReset = async () => {
    if (!user?.id) return;
    try {
      await userController.resetDevice(user.id);
      Toast({
        message: 'Device user berhasil di-reset',
        variant: 'success',
      });
      onSuccess();
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500">
          <Smartphone size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Reset Device User?
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Apakah Anda yakin ingin mereset binding device untuk user{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {user?.fullname}
            </span>
            ? Tindakan ini akan melepas ikatan perangkat pada akun ini.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            className="flex-1 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 border-none text-white"
            onClick={handleConfirmReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </Modal>
  );
}
