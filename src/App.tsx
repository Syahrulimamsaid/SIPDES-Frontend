import { BrowserRouter as Router, Routes, Route } from "react-router";
import AuthSignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/Template/OtherPage/NotFound";
// import AppLayout from "./layout/AppLayout";
import AppMobileLayout from "./layout/AppMobileLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AuthMiddleware from "./Middleware/AuthMIddleware";
import GuestOnly from "./Middleware/GuestMiddleware";
import Presence from "./pages/Presence/Index";
import Record from "./pages/Record/Index";

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <ScrollToTop />

        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AuthMiddleware />} path="/">
            <Route element={<AppMobileLayout />} path="/">
              <Route index path="/" element={<Presence />} />
              <Route path="/record" element={<Record />} />
            </Route>

            {/* <Route element={<AppLayout />} path="/"> */}
            {/* Menu */}
            {/* <Route path="/trans" element={<IndexTrans />} />
              <Route path="/trans/add" element={<AddTrans />} />
              <Route
                path="/trans/edit/:id"
                element={<EditTrans />}
              /> */}
            {/* </Route> */}
          </Route>

          <Route
            path="/auth/signin"
            element={<GuestOnly children={<AuthSignIn />} />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
