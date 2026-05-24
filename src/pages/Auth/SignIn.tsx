import { useEffect, useState } from "react";
import { Toast } from "../../components/ui/alert/Toast";
import AuthController from "../../controller/AuthController";
import { useNavigate } from "react-router";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/ui/button/Button";
import FingerPrint from "@fingerprintjs/fingerprintjs";
import { catchHandle } from "../../helpers/catchHandle";

interface Auth {
  phone: string;
  password: string;
}

function SignIn() {
  const authController = new AuthController();
  const navigate = useNavigate();

  const [auth, setAuth] = useState<Auth>({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuth((prev) => ({ ...prev, [name]: value }));
  };

  const getDevice = async () => {
    const fpPromise = FingerPrint.load();
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authController.login(auth.phone, auth.password, await getDevice());
      Toast({ message: "Login Success", variant: "success" });
      navigate("/");
    } catch (err: unknown) {
      catchHandle({ err, variant: "warning" });
    } finally { 
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-linear-to-br from-indigo-600 to-blue-600 text-white flex flex-col items-center justify-center p-8 text-center">
          <img
            src="/assets/pati.png"
            alt="Kab. Pati"
            className="w-30 h-40 mb-5"
          />
          <h1 className="text-3xl font-bold mb-2">SIPDES</h1>

          <p className="text-sm text-white/80 leading-relaxed">
            Sistem Informasi Presensi Desa untuk mempermudah pencatatan
            kehadiran berbasis lokasi secara real-time dan akurat.
          </p>
        </div>

        <div className="p-8 md:p-10">
          {deferredPrompt && (
            <div className="mb-6 flex items-center justify-between bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg">
              <p className="text-xs text-blue-600">
                Install aplikasi untuk pengalaman lebih optimal
              </p>

              <button
                onClick={installApp}
                className="text-xs font-medium bg-blue-600 hover:bg-indigo-600 text-white px-3 py-1 rounded-md transition"
              >
                Install
              </button>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              Masuk ke Akun
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Silakan masukkan nomor HP dan password Anda
            </p>
          </div>

          <form onSubmit={login} className="space-y-5">
            <div>
              <Label>
                Nomor HP <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                name="phone"
                placeholder="Contoh: 081234567890"
                onChange={handleChange}
                value={auth.phone}
                required
              />
            </div>

            <div>
              <Label>
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "password" : "text"}
                  name="password"
                  placeholder="Masukkan password"
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="text-gray-500 w-5 h-5" />
                  ) : (
                    <EyeOff className="text-gray-500 w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            <Button
              className="w-full mt-10"
              size="md"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </form>
          {/* <div className="flex items-center justify-center mt-5">
            <button
              type="button"
              className="text-sm font-medium text-blue-500 transition hover:text-blue-600 hover:underline dark:text-blue-300"
            >
              Login sebagai Admin →
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
