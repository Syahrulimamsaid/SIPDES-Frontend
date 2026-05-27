import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import AuthController from "../../../controller/AuthController";
import { Toast } from "../../../components/ui/alert/Toast";
import { catchHandle } from "../../../helpers/catchHandle";

function ChangePassword() {
  const navigate = useNavigate();
  const authController = new AuthController();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      Toast({
        message: "Password baru minimal terdiri dari 8 karakter",
        variant: "warning",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      Toast({
        message: "Konfirmasi password baru tidak cocok",
        variant: "warning",
      });
      return;
    }

    if (form.newPassword === form.oldPassword) {
      Toast({
        message: "Password baru tidak boleh sama dengan password lama",
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      await authController.changePassword({
        old_password: form.oldPassword,
        new_password: form.newPassword,
        confirm_password: form.confirmPassword,
      });

      Toast({
        message: "Password berhasil diubah",
        variant: "success",
      });

      navigate("/profile");
    } catch (err: unknown) {
      catchHandle({ err, variant: "warning" });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.oldPassword !== "" &&
    form.newPassword.length >= 8 &&
    form.confirmPassword === form.newPassword &&
    form.newPassword !== form.oldPassword;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 dark:from-indigo-950 dark:to-blue-900 text-white px-5 pt-6 pb-8 rounded-b-3xl shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm text-white/90 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>

          <div>
            <h1 className="text-xl font-semibold">Ubah Password</h1>
            <p className="text-xs text-white/80 mt-1">
              Ubah password akun SIPDES Anda untuk menjaga keamanan
            </p>
          </div>
        </div>

        <div className="px-4 -mt-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-lg space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>
                  Password Lama <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Masukkan password lama"
                    value={form.oldPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-[13px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label>
                  Password Baru <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Masukkan password baru"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={form.newPassword.length > 0 && form.newPassword.length < 8}
                    success={form.newPassword.length >= 8}
                    hint={
                      form.newPassword.length > 0 && form.newPassword.length < 8
                        ? "Password baru harus minimal 8 karakter"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-[13px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <Label>
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Ulangi password baru"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    error={form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword}
                    success={form.confirmPassword.length > 0 && form.confirmPassword === form.newPassword}
                    hint={
                      form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword
                        ? "Konfirmasi password tidak cocok"
                        : undefined
                    }
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

              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 text-xs">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Keamanan Akun
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
                  <li>Password baru tidak boleh sama dengan password lama.</li>
                  <li>Minimal terdiri dari 8 karakter.</li>
                  <li>Gunakan kombinasi huruf, angka, dan simbol untuk kekuatan optimal.</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 dark:bg-brand-600 dark:hover:bg-brand-700"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Password Baru"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
