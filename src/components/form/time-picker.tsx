import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { TimeIcon } from "../../icons";

import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function TimePicker({
  id,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  const flatpickrRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let finalDefaultDate = defaultDate;
    if (typeof defaultDate === "string") {
      const hasDate = defaultDate.includes("-") || defaultDate.includes("/");
      if (hasDate) {
        const parsedDate = new Date(defaultDate);
        if (!isNaN(parsedDate.getTime())) {
          const hours = String(parsedDate.getHours()).padStart(2, "0");
          const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
          finalDefaultDate = `${hours}:${minutes}`;
        }
      }
    }

    const options: any = {
      dateFormat: "H:i",
      defaultDate: finalDefaultDate,
      onChange: (selectedDates: any, dateStr: string, instance: any) => {
        if (onChangeRef.current) {
          if (typeof onChangeRef.current === "function") {
            onChangeRef.current(selectedDates, dateStr, instance);
          } else if (Array.isArray(onChangeRef.current)) {
            onChangeRef.current.forEach((cb) => cb(selectedDates, dateStr, instance));
          }
        }
      },
      enableTime: true,
      noCalendar: true,
      time_24hr: true,
    };

    const instance = flatpickr(`#${id}`, options);
    flatpickrRef.current = Array.isArray(instance) ? instance[0] : instance;

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
      }
    };
  }, [id]);

  useEffect(() => {
    if (flatpickrRef.current && defaultDate) {
      let finalDate = defaultDate;
      if (typeof defaultDate === "string") {
        const hasDate = defaultDate.includes("-") || defaultDate.includes("/");
        if (hasDate) {
          const parsedDate = new Date(defaultDate);
          if (!isNaN(parsedDate.getTime())) {
            const hours = String(parsedDate.getHours()).padStart(2, "0");
            const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
            finalDate = `${hours}:${minutes}`;
          }
        }
      }

      const currentVal = flatpickrRef.current.input.value;
      if (currentVal !== finalDate) {
        flatpickrRef.current.setDate(finalDate, false);
      }
    }
  }, [defaultDate]);

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
          <TimeIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
