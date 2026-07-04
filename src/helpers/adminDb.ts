import { User } from "../interface/UserInterface";
import { Village } from "../interface/VillageInterface";
import { Location } from "../interface/LocationInterface";
import { Presence } from "../interface/PresenceInterface";

const DEFAULT_VILLAGES: Village[] = [
  { id: "1", name: "Desa Melati", address: "Jl. Melati No. 10", districtId: "D1" },
  { id: "2", name: "Desa Mawar", address: "Jl. Mawar No. 12", districtId: "D1" },
  { id: "3", name: "Desa Anggrek", address: "Jl. Anggrek No. 15", districtId: "D1" },
  { id: "4", name: "Desa Kamboja", address: "Jl. Kamboja No. 5", districtId: "D2" },
];

const DEFAULT_LOCATIONS: Location[] = [
  { id: "L1", name: "Kantor Desa Melati", lat: -5.1476, lng: 119.4328, radius: 100, villageId: "1" },
  { id: "L2", name: "Kantor Desa Mawar", lat: -5.1522, lng: 119.4412, radius: 150, villageId: "2" },
  { id: "L3", name: "Kantor Desa Anggrek", lat: -5.1611, lng: 119.4299, radius: 100, villageId: "3" },
];

const DEFAULT_USERS: User[] = [
  { id: "U1", fullname: "Ahmad Dahlan", phone_number: "081234567890", role: "operator", villageId: "1" },
  { id: "U2", fullname: "Budi Utomo", phone_number: "081234567891", role: "umum", villageId: "1" },
  { id: "U3", fullname: "Siti Nurbaya", phone_number: "081234567892", role: "umum", villageId: "2" },
  { id: "U4", fullname: "Dewi Sartika", phone_number: "081234567893", role: "umum", villageId: "3" },
  { id: "U5", fullname: "H. Agus Salim", phone_number: "081234567894", role: "umum", villageId: "4" },
];

const DEFAULT_PRESENCES: Presence[] = [
  { id: "P1", userId: "U2", locationId: "L1", date: "2026-05-27", in: "07:45:00", out: "17:00:00", in_lat: -5.1475, in_long: 119.4327, status: "hadir" },
  { id: "P2", userId: "U3", locationId: "L2", date: "2026-05-27", in: "08:15:00", out: "", in_lat: -5.1523, in_long: 119.4413, status: "terlambat" },
  { id: "P3", userId: "U4", locationId: "L3", date: "2026-05-27", in: "", out: "", in_lat: 0, in_long: 0, status: "alpa" },
  { id: "P4", userId: "U5", locationId: "L3", date: "2026-05-26", in: "07:55:00", out: "17:05:00", in_lat: -5.1610, in_long: 119.4298, status: "hadir" },
];

export const initDb = () => {
  if (!localStorage.getItem("admin_villages")) {
    localStorage.setItem("admin_villages", JSON.stringify(DEFAULT_VILLAGES));
  }
  if (!localStorage.getItem("admin_locations")) {
    localStorage.setItem("admin_locations", JSON.stringify(DEFAULT_LOCATIONS));
  }
  if (!localStorage.getItem("admin_users")) {
    localStorage.setItem("admin_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("admin_presences")) {
    localStorage.setItem("admin_presences", JSON.stringify(DEFAULT_PRESENCES));
  }
};

export const getDbVillages = (): Village[] => {
  initDb();
  return JSON.parse(localStorage.getItem("admin_villages") || "[]");
};

export const getDbLocations = (): Location[] => {
  initDb();
  const locs: Location[] = JSON.parse(localStorage.getItem("admin_locations") || "[]");
  const vils = getDbVillages();
  return locs.map(l => ({
    ...l,
    Village: vils.find(v => v.id === l.villageId)
  }));
};

export const getDbUsers = (): User[] => {
  initDb();
  const users: User[] = JSON.parse(localStorage.getItem("admin_users") || "[]");
  const vils = getDbVillages();
  return users.map(u => ({
    ...u,
    village: vils.find(v => v.id === u.villageId)
  }));
};

export const getDbPresences = (): Presence[] => {
  initDb();
  const presences: Presence[] = JSON.parse(localStorage.getItem("admin_presences") || "[]");
  const users = getDbUsers();
  const locations = getDbLocations();
  return presences.map(p => {
    const userObj = users.find(u => u.id === p.userId);
    const locObj = locations.find(l => l.id === p.locationId);
    return {
      ...p,
      user: userObj,
      location_access: locObj ? {
        id: locObj.id,
        locationId: locObj.id,
        location: locObj,
        description: locObj.name
      } : undefined
    };
  });
};

export const saveDbVillages = (villages: Village[]) => {
  localStorage.setItem("admin_villages", JSON.stringify(villages));
};

export const saveDbLocations = (locations: Location[]) => {
  localStorage.setItem("admin_locations", JSON.stringify(locations));
};

export const saveDbUsers = (users: User[]) => {
  localStorage.setItem("admin_users", JSON.stringify(users));
};

export const saveDbPresences = (presences: Presence[]) => {
  localStorage.setItem("admin_presences", JSON.stringify(presences));
};

export const getDbSettings = () => {
  return {
    inTimeLimit: localStorage.getItem("settings_in_time_limit") || "08:00",
    outTimeLimit: localStorage.getItem("settings_out_time_limit") || "17:00",
  };
};

export const saveDbSettings = (inTime: string, outTime: string) => {
  localStorage.setItem("settings_in_time_limit", inTime);
  localStorage.setItem("settings_out_time_limit", outTime);
};
