export function statusColor(status: string) {
  const statusColor: Record<string, string> = {
    hadir: "bg-green-100 text-green-700",
    terlambat: "bg-yellow-100 text-yellow-700",
    alpa: "bg-red-100 text-red-700",
    cuti: "bg-blue-100 text-blue-700",
    pulang: "bg-purple-100 text-purple-700",
    masuk: "bg-gray-100 text-gray-700",
    "": "bg-gray-100 text-gray-700",
  };

  return statusColor[status] || "bg-gray-100 text-gray-700";
}
