import {  Clock3, Navigation} from "lucide-react";

type NotificationCategory = "masuk" | "pulang";

interface NotificationCardProps {
  message: string;
  time: string;
  category: NotificationCategory;
  location?: string;
  messageChild?: React.ReactNode;
}

const categoryConfig = {
  masuk: {
    label: "Masuk",
    icon: Navigation,
    badge: "bg-green-50 text-green-700 border border-green-200",
    iconBox: "bg-green-100 text-green-600 border border-green-200",
  },

  pulang: {
    label: "Pulang",
    icon: Navigation,
    badge: "bg-orange-50 text-orange-700 border border-orange-200",
    iconBox: "bg-orange-100 text-orange-600 border border-orange-200",
  },

  // holiday: {
  //   label: "Hari Libur",
  //   icon: CalendarDays,
  //   badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  //   iconBox: "bg-emerald-100 text-emerald-600 border border-emerald-200",
  // },
};

export default function NotificationCard({
  message,
  time,
  category,
  messageChild,
  location,
}: NotificationCardProps) {
  const config = categoryConfig[category];

  return (
    <div className="group flex items-start gap-4 p-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${config.iconBox}`}
      >
        <Navigation/>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${config.badge}`}
          >
            {config.label}
          </span>

         <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock3 size={12} />
            {time}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {message} {messageChild}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 dark:border-gray-700 dark:bg-gray-800">
            📍 {location}
          </span>

        </div>
      </div>
    </div>
  );
}
