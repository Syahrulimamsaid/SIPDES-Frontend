import { useEffect, useState } from "react";
import { Toast } from "../../components/ui/alert/Toast";
import AuthController from "../../controller/AuthController";
import { useNavigate } from "react-router";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Button from "../../components/ui/button/Button";

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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    console.log("PWA hook mounted");

    const handler = (e: any) => {
      console.log("beforeinstallprompt triggered");
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

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authController.login(auth.phone, auth.password);
      Toast({ message: "Login Success", variant: "success" });
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        Toast({ message: err.message, variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-5">
          {deferredPrompt && (
            <div className="mb-6 flex items-center justify-between bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 rounded-lg">
              <p className="text-xs text-indigo-600 dark:text-indigo-300">
                Install aplikasi untuk pengalaman lebih cepat
              </p>

              <button
                onClick={installApp}
                className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md"
              >
                Install
              </button>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Sign In
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Masukkan nomor HP dan password untuk melanjutkan
            </p>
          </div>

          <form onSubmit={login} className="space-y-6">
            <div>
              <Label>
                Phone Number <span className="text-error-500">*</span>
              </Label>
              <Input
                type="tel"
                name="phone"
                placeholder="+6281234567890"
                onChange={handleChange}
                value={auth.phone}
                required
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 text-gray-500" />
                  ) : (
                    <EyeCloseIcon className="size-5 text-gray-500" />
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white items-center justify-center p-12">
        <div className="text-center max-w-sm">
          <div className="mb-6 flex justify-center">
            <img
              src="/logo.png"
              alt="SIABE Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">SIPDES</h1>

          <p className="text-white/80 text-sm leading-relaxed">
            Sistem Informasi Absensi Berbasis Elektronik untuk mempermudah
            pengelolaan kehadiran dengan validasi lokasi secara real-time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
