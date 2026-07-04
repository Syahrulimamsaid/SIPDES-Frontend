import { BrowserRouter as Router, Routes, Route } from "react-router";
import AuthSignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/Template/OtherPage/NotFound";
import AppMobileLayout from "./layout/AppMobileLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AuthMiddleware from "./Middleware/AuthMIddleware";
import GuestOnly from "./Middleware/GuestMiddleware";
import Presence from "./pages/User/Presence/Index";
import Record from "./pages/User/Record/Index";
import Profile from "./pages/User/Profile/Index";
import ChangePassword from "./pages/User/Profile/ChangePassword";
import RecordDetail from "./pages/User/Record/Detail";
import About from "./pages/About";
import AppLayout from "./layout/AppLayout";
import AccessMiddleware from "./Middleware/AccessMiddleware";
import Dashboard from "./pages/Operator/Dashboard/Home";
import ListPresensi from "./pages/Operator/Presence/Index";
import AddPresence from "./pages/Operator/Presence/Add";
import UserManagement from "./pages/Operator/Master/User/Index";
import SettingManagement from "./pages/Admin/Setting/Index";
import LokasiManagement from "./pages/Operator/Master/Lokasi/Index";
import LaporanManagement from "./pages/Operator/Laporan/Index";
import Notification from "./pages/User/Presence/Notification/Index";
import CalendarManagement from "./pages/Operator/Master/Calendar/Index";
import DashboardAdmin from "./pages/Admin/Dashboard/Home";
import CalendarManagementAdmin from "./pages/Admin/Master/Calendar/Index";
import Setting from "./pages/Admin/Setting/Index";
import DesaManagement from "./pages/Admin/Master/Desa/Index";
import SubDistrictManagement from "./pages/Admin/Master/SubDistrict/Index";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          zIndex: 999999,
        }}
      />
      <Router>
        <ScrollToTop />

        <Routes>
          <Route element={<AuthMiddleware />} path="/">
            <Route element={<AccessMiddleware access="umum"><AppMobileLayout /></AccessMiddleware>} path="/">
              <Route index path="/" element={<Presence />} />

              <Route path="/notification" element={<Notification />} />

              <Route path="/record" element={<Record />} />
              <Route path="/record/detail/:id" element={<RecordDetail />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/change-password" element={<ChangePassword />} />
              <Route path="/about" element={<About />} />
            </Route>

            <Route element={<AccessMiddleware access="operator"><AppLayout /></AccessMiddleware>} path="/operator">
              <Route index element={<Dashboard />} />

              <Route path="presensi">
                <Route index element={<ListPresensi />} />
                <Route path="add" element={<AddPresence />} />
              </Route>

              <Route path="master/user" element={<UserManagement />} />
              <Route path="master/setting" element={<SettingManagement />} />
              <Route path="master/lokasi" element={<LokasiManagement />} />
              <Route path="master/calendar" element={<CalendarManagement />} />
              <Route path="laporan" element={<LaporanManagement />} />
            </Route>

            <Route element={<AccessMiddleware access="admin"><AppLayout /></AccessMiddleware>} path="/admin">
              <Route index element={<DashboardAdmin />} />

              <Route path="presensi">
                <Route index element={<ListPresensi />} />
                <Route path="add" element={<AddPresence />} />
              </Route>

              <Route path="laporan" element={<LaporanManagement />} />

              <Route path="master">
                <Route path="user" element={<UserManagement />} />
                <Route path="setting" element={<SettingManagement />} />
                <Route path="lokasi" element={<LokasiManagement />} />
                <Route path="calendar" element={<CalendarManagementAdmin />} />
                <Route path="desa" element={<DesaManagement />} />
                <Route path="sub-district" element={<SubDistrictManagement />} />
              </Route>

              <Route path="setting" element={<Setting />} />
            </Route>
          </Route>

          <Route
            path="/auth/signin"
            element={<GuestOnly children={<AuthSignIn />} />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
