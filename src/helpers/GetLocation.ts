import { Toast } from "../components/ui/alert/Toast";

export const getLocation = (): Promise<{
  lat: number;
  lng: number;
}> => {
  return new Promise((resolve, reject) => {
    navigator.permissions.query({ name: "geolocation" });
    if (!navigator.geolocation) {
      Toast({
        message: "Geolocation tidak didukung browser",
        variant: "error",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
        Toast({ message: "Lokasi pengguna gagal ditemukan", variant: "error" });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      },
    );
  });
};
