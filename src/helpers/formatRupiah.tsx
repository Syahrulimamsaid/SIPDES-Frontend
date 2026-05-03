export const formatRupiah = (val: any) => {
  return parseInt(val).toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};
