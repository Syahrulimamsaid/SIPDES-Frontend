import { useState, useEffect } from "react";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import { Modal } from "../../../../components/ui/modal";
import { UserCreate } from "../../../../interface/UserInterface";
import UserController from "../../../../controller/UserController";
import { Toast } from "../../../../components/ui/alert/Toast";
import { catchHandle } from "../../../../helpers/catchHandle";
import { Eye, EyeOff } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
}: AddUserModalProps) {
  const userController = new UserController();

  const [user, setUser] = useState<UserCreate>({
    phone_number: "",
    password: "",
    fullname: "",
    role: "Umum",
    villageId: localStorage.getItem("village") || "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUser({
        phone_number: "",
        password: "",
        fullname: "",
        role: "Umum",
        villageId: localStorage.getItem("village") || "",
      });
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.fullname.trim() === "" || user.phone_number.trim() === "") {
      Toast({ message: "Nama lengkap dan nomor HP wajib diisi!", variant: 'warning' });
      return;
    }

    if (user.password !== confirmPassword) {
      Toast({ message: "Password dan konfirmasi password tidak cocok!", variant: 'warning' });
      return;
    }

    try {
      user.role = 'umum';
      user.villageId = '';
      await userController.create(user);

      Toast({ message: "User berhasil ditambahkan!", variant: 'success' });
      onSuccess();
    } catch (err) {
      catchHandle({ err: err, variant: "error" });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Tambah User Baru
        </h3>

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Nama Lengkap
            </label>
            <Input
              type="text"
              name="fullname"
              placeholder="Contoh: Andi Wijaya"
              value={user.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Nomor HP
            </label>
            <Input
              type="text"
              name="phone_number"
              placeholder="Contoh: 081234567890"
              value={user.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Desa Penugasan
            </label>
            <Input
              type="text"
              name="villageId"
              value={user.villageId}
              disabled
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Role
            </label>
            <Input
              type="text"
              name="role"
              value={user.role}
              disabled
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Password Akun
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Kosongkan untuk default '123456'"
                value={user.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[13px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Masukkan kembali password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[13px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
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
