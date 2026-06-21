import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import "flatpickr/dist/plugins/monthSelect/style.css";

import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption | DateOption[];
  label?: string;
  Type?: "date" | "date-time";
  placeholder?: string;
  viewMode?: "month" | "date";
  minDate?: Date;
  maxDate?: Date;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  Type,
  defaultDate,
  placeholder,
  viewMode = "date",
  minDate,
  maxDate,
}: PropsType) {
  useEffect(() => {
    const options: any = {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: Type == 'date-time' ? "Y-m-d H:i" : "Y-m-d",
      defaultDate,
      onChange,
      enableTime: Type == 'date-time' ? true : false,
      noCalendar: false,
      minDate,
      maxDate,
    };

    if (viewMode === "month") {
      options.plugins = [
        monthSelectPlugin({
          shorthand: true,
          dateFormat: "Y-m",
          altFormat: "F Y",
          theme: "light",
        }),
      ];
      options.dateFormat = "Y-m";
    }

    const flatPickr = flatpickr(`#${id}`, options);

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, Type, viewMode, minDate, maxDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}


