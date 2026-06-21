import { useEffect, useRef } from "react";
import { ReportPresence } from "../../../interface/ReportInterface";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../../components/ui/table";
import { StatsPresence } from "../../../interface/StatsInterface";

interface ReportPdfProps {
  report: ReportPresence[];
  filter: {
    startDate: Date;
    endDate: Date;
    userId: string;
  };
  stats: StatsPresence
}

export default function ReportPdf({ report, filter, stats }: ReportPdfProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const formatDate = (d: Date | string) => {
    if (!d) return "-";
    const dateObj = d instanceof Date ? d : new Date(d);
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const todayDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  useEffect(() => {
    // Wait a brief moment to ensure Tailwind CSS styles and DOM are fully painted
    const doc = containerRef.current?.ownerDocument;
    const win = doc?.defaultView;
    if (win) {
      setTimeout(() => {
        win.print();
        win.close();
      }, 800);
    }
  }, []);

  return (
    <div ref={containerRef} className="p-10 bg-white text-gray-800 font-sans antialiased">
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8 border-b-4 border-double border-gray-700 pb-4">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-gray-900">
          Laporan Rekapitulasi Presensi Perangkat Desa
        </h1>
        <h2 className="text-sm font-semibold tracking-wider text-gray-600 mt-1 uppercase">
          Sistem Informasi Presensi Desa (SIPDES)
        </h2>
      </div>

      {/* Metadata */}
      <div className="mb-6 text-sm leading-relaxed text-gray-700">
        <Table className="min-w-0 w-auto border-none">
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold pr-2 py-0.5">Periode Tanggal</TableCell>
              <TableCell className="py-0.5">: {formatDate(filter.startDate)} s/d {formatDate(filter.endDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold pr-2 py-0.5">Tanggal Cetak</TableCell>
              <TableCell className="py-0.5">: {todayDate}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Kehadiran Rata-rata
          </div>
          <div className="text-lg font-bold mt-1 text-emerald-600">
            {stats.presentase_hadir}%
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Total Hari Hadir
          </div>
          <div className="text-lg font-bold mt-1 text-gray-900">
            {stats.hadir_total} Hari
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Frekuensi Terlambat
          </div>
          <div className="text-lg font-bold mt-1 text-amber-500">
            {stats.terlambat_total} Kali
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            Total Alpa
          </div>
          <div className="text-lg font-bold mt-1 text-red-500">
            {stats.alpha_total} Hari
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Table className="w-full border-collapse mb-10 text-xs border border-gray-300">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableCell isHeader className="border border-gray-300 p-2 text-center w-[5%] font-bold text-gray-700 uppercase">
              No
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-left font-bold text-gray-700 uppercase">
              Nama Perangkat Desa
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-left font-bold text-gray-700 uppercase">
              Desa Wilayah
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-center font-bold text-gray-700 uppercase">
              Tepat Waktu
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-center font-bold text-gray-700 uppercase">
              Terlambat
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-center font-bold text-gray-700 uppercase">
              Cuti / Izin
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-center font-bold text-gray-700 uppercase">
              Alpa
            </TableCell>
            <TableCell isHeader className="border border-gray-300 p-2 text-center w-[15%] font-bold text-gray-700 uppercase">
              Persentase
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.map((data, index) => (
            <TableRow key={data.user.id} className="border border-gray-250 odd:bg-white even:bg-gray-50/50">
              <TableCell className="border border-gray-200 p-2 text-center">{index + 1}</TableCell>
              <TableCell className="border border-gray-200 p-2 font-semibold text-gray-900">{data.user.fullname}</TableCell>
              <TableCell className="border border-gray-200 p-2 text-gray-700">{data.user.village?.name || "-"}</TableCell>
              <TableCell className="border border-gray-200 p-2 text-center text-emerald-600 font-medium">
                {data.jumlah_hadir_tepat_waktu} Hari
              </TableCell>
              <TableCell className="border border-gray-200 p-2 text-center text-amber-600 font-medium">
                {data.jumlah_terlambat} Hari
              </TableCell>
              <TableCell className="border border-gray-200 p-2 text-center text-blue-600 font-medium">
                {data.jumlah_cuti_izin} Hari
              </TableCell>
              <TableCell className="border border-gray-200 p-2 text-center text-red-500 font-medium">
                {data.alpa} Hari
              </TableCell>
              <TableCell className="border border-gray-200 p-2 text-center font-bold text-gray-900">
                {data.persentase_kehadiran}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Signature Section */}
      <div className="flex justify-end mt-12 text-sm text-gray-800">
        <div className="text-center w-[250px]">
          <p>Mengesahkan,</p>
          <p className="font-semibold mt-1">Operator SIPDES</p>
          <div className="h-[75px]" />
          <p className="font-bold underline text-gray-900">
            .......................................
          </p>
        </div>
      </div>
    </div>
  );
}
