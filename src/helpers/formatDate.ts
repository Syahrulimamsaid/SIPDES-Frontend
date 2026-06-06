export const formatDate = (dateStr: string) => {
  if (dateStr.includes("T")) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return dateStr;
};
