import { useEffect, useState } from "react";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import { User, UserCreate } from "../../../interface/UserInterface";
import UserController from "../../../controller/UserController";
import VillageController from "../../../controller/VillageController";
import { Village } from "../../../interface/VillageInterface";
import { catchHandle } from "../../../helpers/catchHandle";
import { Toast } from "../../../components/ui/alert/Toast";
import { Eye, EyeOff } from "lucide-react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user: userData,
  onSuccess,
}: EditUserModalProps) {
  const userController = new UserController();
  const villageController = new VillageController();

  const isAdmin = localStorage.getItem("role") === "admin";

  const [villages, setVillages] = useState<Village[]>([]);
  const [user, setUser] = useState<UserCreate>({
    id: "",
    phone_number: "",
    password: "",
    fullname: "", 
    role: "",
    villageId: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roleOptions = [
    { value: "umum", label: "Umum (Perangkat Desa)" },
    { value: "operator", label: "Operator (Administrator)" },
  ];

  const getVillages = async () => {
    try {
      const data = await villageController.get();
      setVillages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && userData) {
      setUser({
        id: userData.id,
        phone_number: userData.phone_number || "",
        password: "",
        fullname: userData.fullname || "",
        role: userData.role,
        villageId: userData.village?.id || "",
      });
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);

      if (isAdmin) {
        getVillages();
      }
    }
  }, [isOpen, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.fullname.trim() === "" || user.phone_number.trim() === "") {
      Toast({ message: "Nama lengkap dan nomor HP wajib diisi!", variant: 'warning' });
      return;
    }

    if (user.password && user.password !== confirmPassword) {
      Toast({ message: "Password dan konfirmasi password tidak cocok!", variant: 'warning' });
      return;
    }

    if (isAdmin && !user.villageId) {
      Toast({ message: "Desa Penugasan wajib dipilih!", variant: 'warning' });
      return;
    }

    try {
      const payload = { ...user };
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
      }
      await userController.update(user.id!, payload);
      Toast({ message: "Data user berhasil diperbarui!", variant: 'success' });
      onSuccess();
    } catch (err) {
      catchHandle({ err, variant: 'error' });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6 sm:p-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
          Ubah Data User
        </h3>

        <form onSubmit={handleUpdateUser} className="space-y-4">
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
            {isAdmin ? (
              <Select
                options={villages.map((v) => ({ value: v.id, label: v.name }))}
                placeholder="Pilih Desa"
                name="villageId"
                onChange={(val) => setUser({ ...user, villageId: val })}
                defaultValue={user.villageId}
              />
            ) : (
              <Input
                type="text"
                name="villageId"
                value={userData?.village?.name || localStorage.getItem("village") || ""}
                disabled
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Role Sistem
            </label>
            <Select
              options={roleOptions}
              placeholder="Pilih Role"
              name="role"
              onChange={(val) => setUser({ ...user, role: val })}
              defaultValue={user.role}
              disabled={!isAdmin}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Ubah Password Akun
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Masukkan password baru untuk merubah"
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
