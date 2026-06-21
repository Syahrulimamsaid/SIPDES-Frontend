import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import PageMeta from "../../../../components/common/PageMeta";
import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import { Calendar } from "../../../../interface/CalendarInterface";
import CalendarController from "../../../../controller/CalendarController";
import { catchHandle } from "../../../../helpers/catchHandle";
import { X } from "lucide-react";

export default function CalendarManagement() {
  const calendarController = new CalendarController();
  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Calendar | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadData = async () => {
    try {
      const data = await calendarController.get();
      // Format to FullCalendar event inputs
      const formatted = data.map((event) => {
        let calendarType = "Primary";
        if (event.type === "off") calendarType = "Danger";
        else if (event.type === "h") calendarType = "Success";
        else if (event.type === "t") calendarType = "Primary";
        else calendarType = "Warning";

        return {
          id: event.id,
          title: event.name,
          start: event.date ? event.date.split("T")[0] : "",
          extendedProps: {
            calendar: calendarType,
            originalType: event.type,
            originalName: event.name,
          },
        };
      });
      setEvents(formatted);
    } catch (e) {
      catchHandle({ err: e, variant: "error" });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      name: event.extendedProps.originalName || event.title,
      date: event.start?.toISOString().split("T")[0] || "",
      type: event.extendedProps.originalType || "off",
    });
    setIsDetailOpen(true);
  };

  const renderEventContent = (eventInfo: any) => {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
    return (
      <div className={`event-fc-color flex fc-event-main ${colorClass} p-1.5 rounded-lg w-full overflow-hidden text-ellipsis`}>
        <div className="fc-daygrid-event-dot shrink-0"></div>
        <div className="fc-event-title font-medium text-xs leading-5 truncate">{eventInfo.event.title}</div>
      </div>
    );
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "h":
        return "Hari Kerja";
      case "off":
        return "Hari Libur / Off";
      case "t":
        return "Tugas / Kegiatan";
      case "fm":
        return "Lainnya";
      default:
        return "Hari Libur / Off";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "h":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "off":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "t":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
    }
  };

  return (
    <>
      <PageMeta
        title="Kalender Kegiatan & Hari Libur - SIPDES"
        description="Lihat hari libur dan kegiatan penugasan perangkat desa"
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Kalender Kegiatan & Hari Libur
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daftar hari libur atau agenda kegiatan tertentu yang memengaruhi rekapitulasi presensi.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="custom-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="id"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hari Ini",
                month: "Bulan",
                week: "Minggu",
                day: "Hari",
              }}
              events={events}
              selectable={false}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
            />
          </div>
        </div>

        {/* Event Detail Modal */}
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          className="max-w-md p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Detail Kegiatan
              </h3>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition"
              >
                <X size={18} />
              </button>
            </div>

            {selectedEvent && (
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                    Nama Agenda / Keterangan
                  </span>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                    {selectedEvent.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      Tanggal
                    </span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-250 mt-0.5">
                      {selectedEvent.date}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                      Tipe Hari
                    </span>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mt-1 ${getTypeBadgeColor(
                        selectedEvent.type
                      )}`}
                    >
                      {getTypeName(selectedEvent.type)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={() => setIsDetailOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
