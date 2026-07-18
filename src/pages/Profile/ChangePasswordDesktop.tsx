import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, } from "lucide-react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import AuthController from "../../controller/AuthController";
import { Toast } from "../../components/ui/alert/Toast";
import { catchHandle } from "../../helpers/catchHandle";
import PageMeta from "../../components/common/PageMeta";

export default function ChangePasswordDesktop() {
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

      navigate(-1);
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
    <>
      <PageMeta
        title="Ubah Password - SIPDES"
        description="Pengaturan keamanan ubah password"
      />
      <div className="space-y-6 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Kembali ke Profil
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Ubah Password Akun
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Perbarui password Anda untuk menjaga keamanan akun.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Form Kiri */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
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

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? "Menyimpan..." : "Simpan Password Baru"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Kanan */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-gray-100 bg-indigo-50/50 p-5 dark:border-indigo-900/20 dark:bg-indigo-950/20 space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-1.5 text-sm">
                <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
                Panduan Keamanan Password
              </h4>
              <ul className="list-disc list-inside space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <li>Password baru tidak boleh sama dengan password lama.</li>
                <li>Minimal terdiri dari 8 karakter.</li>
                <li>Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk kekuatan optimal.</li>
                <li>Hindari menggunakan informasi pribadi seperti tanggal lahir.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
