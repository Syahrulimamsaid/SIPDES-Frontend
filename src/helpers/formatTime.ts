export const formatTime = (timeStr: string) => {
  if (timeStr.includes("T")) {
    return new Date(timeStr).toTimeString().slice(0, 5);
  }
  return timeStr.slice(0, 5);
};
