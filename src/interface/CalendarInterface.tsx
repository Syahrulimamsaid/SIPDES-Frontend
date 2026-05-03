export interface Calendar {
  id: string;
  name: string;
  date: string;
  type: "h" | "t" | "off" | "fm";
}