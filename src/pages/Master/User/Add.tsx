import { useState, useEffect } from "react";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import { UserCreate } from "../../../interface/UserInterface";
import UserController from "../../../controller/UserController";
import VillageController from "../../../controller/VillageController";
import { Village } from "../../../interface/VillageInterface";
import { Toast } from "../../../components/ui/alert/Toast";
import { catchHandle } from "../../../helpers/catchHandle";
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
  const villageController = new VillageController();

  const isAdmin = localStorage.getItem("role") === "admin";

  const [villages, setVillages] = useState<Village[]>([]);
  const [user, setUser] = useState<UserCreate>({
    phone_number: "",
    password: "",
    fullname: "",
    role: "umum",
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
    if (isOpen) {
      setUser({
        phone_number: "",
        password: "",
        fullname: "",
        role: "umum",
        villageId: isAdmin ? "" : (localStorage.getItem("village") || ""),
      });
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);

      if (isAdmin) {
        getVillages();
      }
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

    if (!user.password || user.password.trim() === "") {
      Toast({ message: "Password wajib diisi!", variant: 'warning' });
      return;
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      Toast({ message: "Konfirmasi password wajib diisi!", variant: 'warning' });
      return;
    }

    if (user.password !== confirmPassword) {
      Toast({ message: "Password dan konfirmasi password tidak cocok!", variant: 'warning' });
      return;
    }

    try {
      const payload = { ...user };
      if (isAdmin) {
        if (!payload.villageId) {
          Toast({ message: "Desa Penugasan wajib dipilih!", variant: 'warning' });
          return;
        }
      } else {
        payload.role = 'umum';
        payload.villageId = '';
      }
      await userController.create(payload);

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
                value={user.villageId}
                disabled
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Role
            </label>
            {isAdmin ? (
              <Select
                options={roleOptions}
                placeholder="Pilih Role"
                name="role"
                onChange={(val) => setUser({ ...user, role: val })}
                defaultValue={user.role}
              />
            ) : (
              <Input
                type="text"
                name="role"
                value={user.role === "umum" ? "Umum" : user.role === "operator" ? "Operator" : user.role}
                disabled
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Password Akun
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Masukkan password akun"
                value={user.password}
                onChange={handleChange}
                required
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
                required
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
