import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import {
  Shield,
  Code,
  Mail,
  Copy,
  Check,
  MessageSquare,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  availability: string;
}

interface Category {
  title: string;
  description: string;
  icon: React.ReactNode;
  themeColor: string;
  contacts: Contact[];
}

export default function Support() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const supportCategories: Category[] = [
    {
      title: "Admin Sistem (Admin Kabupaten)",
      description: "Hubungi Admin Kabupaten untuk mengurus pendaftaran akun desa baru, verifikasi data utama, pemulihan akun penting, serta kebijakan umum sistem.",
      icon: <Shield className="size-6 text-indigo-600 dark:text-indigo-400" />,
      themeColor: "from-indigo-500/10 to-blue-500/10 text-indigo-600 dark:text-indigo-400",
      contacts: [
        {
          id: "admin-1",
          name: "Layanan Admin Utama",
          role: "System Admin Kabupaten",
          phone: "+6281234567890",
          email: "admin@sipdes.go.id",
          availability: "Senin - Jumat, 08:00 - 16:00 WIB",
        },
        {
          id: "admin-2",
          name: "Syarif Hidayat",
          role: "Helpdesk & Verifikator",
          phone: "+6281234567891",
          email: "syarif.helpdesk@sipdes.go.id",
          availability: "Senin - Jumat, 08:00 - 16:00 WIB",
        },
      ],
    },
    {
      title: "Tim Developer (SIPDES)",
      description: "Hubungi tim pengembang jika Anda menemukan kegagalan sistem (bug), aplikasi error, kendala integrasi API, atau usulan fitur baru.",
      icon: <Code className="size-6 text-purple-600 dark:text-purple-400" />,
      themeColor: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400",
      contacts: [
        {
          id: "dev-1",
          name: "SIPDES Dev Team",
          role: "Technical Support",
          phone: "+6281456789012",
          email: "support@sipdes.go.id",
          availability: "Setiap Hari (24/7 untuk gangguan kritis)",
        },
      ],
    }
  ];

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    toast.success(`Nomor ${phone} disalin ke clipboard!`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <>
      <PageMeta
        title="Layanan Dukungan & Support - SIPDES"
        description="Hubungi kontak dukungan teknis, admin kabupaten, operator desa, dan layanan lokasi SIPDES."
      />
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl tracking-tight">
            Pusat Bantuan & Dukungan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Butuh bantuan? Silakan hubungi kontak person resmi SIPDES di bawah ini sesuai dengan kategori kendala yang Anda hadapi.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {supportCategories.map((category, idx) => (
            <div
              key={idx}
              className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-linear-to-br ${category.themeColor} shrink-0`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {category.description}
                </p>

                <div className="space-y-3.5 pt-2">
                  {category.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80 space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {contact.name}
                          </h4>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                            {contact.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2 py-0.5 rounded-full border border-gray-150 dark:border-gray-800/50 shrink-0">
                          <Clock size={11} className="text-gray-400 shrink-0" />
                          <span>{contact.availability}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm shadow-emerald-500/10 cursor-pointer transition-colors"
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`mailto:${contact.email}`}
                          className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Mail size={13} />
                          <span>Email</span>
                        </a>

                        <button
                          onClick={() => handleCopy(contact.phone, contact.id)}
                          className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-400 text-xs font-semibold cursor-pointer transition-colors ml-auto"
                        >
                          {copiedId === contact.id ? (
                            <>
                              <Check size={13} className="text-emerald-500" />
                              <span className="text-emerald-500">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Salin No</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
