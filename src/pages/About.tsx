import {
  MapPin,
  ShieldCheck,
  Clock3,
  Smartphone,
  Users,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <MapPin size={24} />,
      title: "Presensi Berbasis Lokasi",
      description:
        "Validasi lokasi dilakukan secara real-time untuk memastikan kehadiran tercatat secara akurat sesuai area yang ditentukan.",
    },
    {
      icon: <Clock3 size={24} />,
      title: "Realtime & Cepat",
      description:
        "Data presensi masuk dan pulang tercatat langsung ke sistem tanpa proses manual.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Aman & Transparan",
      description:
        "Setiap aktivitas presensi tersimpan dengan aman dan dapat dipantau oleh admin desa.",
    },
    {
      icon: <Smartphone size={24} />,
      title: "Responsif di Semua Device",
      description:
        "Dapat digunakan melalui smartphone maupun desktop dengan tampilan modern dan ringan.",
    },
  ];

  const benefits = [
    "Mengurangi manipulasi data kehadiran",
    "Monitoring presensi lebih mudah",
    "Meningkatkan disiplin perangkat desa",
    "Akses cepat dan praktis",
    "Rekap presensi otomatis",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-700 via-blue-600 to-cyan-500 opacity-95" />

          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl translate-x-20 translate-y-20" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm mb-6 backdrop-blur">
                  <Globe size={16} />
                  Sistem Presensi Digital Desa
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  SIPDES
                </h1>

                <p className="mt-5 text-lg text-white/85 leading-relaxed max-w-xl">
                  SIPDES adalah sistem presensi desa berbasis lokasi real-time
                  yang dirancang untuk membantu perangkat desa melakukan absensi
                  secara digital, cepat, aman, dan akurat.
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition">
                    Mulai Presensi
                  </button>

                  <button className="border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition">
                    Pelajari Sistem
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-5 mt-12">
                  <div>
                    <h2 className="text-3xl font-bold text-white">100%</h2>
                    <p className="text-sm text-white/70 mt-1">
                      Digital Presensi
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white">Realtime</h2>
                    <p className="text-sm text-white/70 mt-1">
                      Monitoring Data
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white">Akurat</h2>
                    <p className="text-sm text-white/70 mt-1">
                      Validasi Lokasi
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Dashboard SIPDES
                      </h3>
                      <p className="text-sm text-gray-500">
                        Monitoring Presensi Desa
                      </p>
                    </div>

                    <div className="bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      Online
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: "Presensi Masuk",
                        value: "97%",
                      },
                      {
                        name: "Presensi Pulang",
                        value: "91%",
                      },
                      {
                        name: "Validasi Lokasi",
                        value: "100%",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.name}
                          </span>

                          <span className="font-semibold text-indigo-600">
                            {item.value}
                          </span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-linear-to-r from-indigo-600 to-blue-500 w-[90%]" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-600 text-white p-2 rounded-xl">
                        <CheckCircle2 size={18} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">
                          Sistem Presensi Aktif
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          Semua data kehadiran perangkat desa tersinkronisasi
                          secara otomatis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Fitur Unggulan SIPDES
            </h2>

            <p className="text-gray-500 mt-4">
              Sistem dirancang untuk mempermudah pengelolaan kehadiran perangkat
              desa dengan teknologi modern dan antarmuka yang sederhana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center mb-5">
                  {feature.icon}
                </div>

                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-medium">
                <Users size={16} />
                Manfaat Sistem
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold mt-6 text-gray-900 dark:text-white leading-tight">
                Solusi modern untuk pengelolaan presensi desa
              </h2>

              <p className="text-gray-500 mt-5 leading-relaxed">
                SIPDES membantu pemerintah desa meningkatkan efisiensi,
                transparansi, dan kedisiplinan melalui sistem presensi digital
                yang terintegrasi.
              </p>

              <div className="space-y-4 mt-8">
                {benefits.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <div className="bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 p-1 rounded-full">
                      <CheckCircle2 size={16} />
                    </div>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-600 to-blue-600 dark:from-indigo-950 dark:to-blue-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold">
                Presensi lebih praktis dan efisien
              </h3>

              <p className="text-white/80 mt-4 leading-relaxed">
                Dengan validasi lokasi dan sistem realtime, proses absensi
                menjadi lebih terpercaya dan mudah dipantau kapan saja.
              </p>

              <div className="mt-8 space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex justify-between items-center">
                  <span>Monitoring Kehadiran</span>
                  <ArrowRight size={18} />
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex justify-between items-center">
                  <span>Validasi Lokasi Otomatis</span>
                  <ArrowRight size={18} />
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex justify-between items-center">
                  <span>Rekap Data Presensi</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2026 SIPDES — Sistem Presensi Desa Digital
        </footer>
      </div>
    </div>
  );
};

export default About;
