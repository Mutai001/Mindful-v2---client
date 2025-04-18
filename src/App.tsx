import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CheckoutPage from "./Components/CheckoutPage";
import Header from "./Components/Header";
import Chatbot from "./Components/Chatbot";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import DetailsCaseStudies from "./Components/DetailedCaseStudies";
import DoctorsList from "./Components/DoctorsList";
import BookTraining from "./Components/BookTraining";
import UserDashboard from './Components/UserDashboard';
import Sidebar from "./Components/Sidebar";
import { Toaster } from "react-hot-toast";
import UserPayment from "./Components/Payments";
import Session from "./Components/session";
import BookSession from "./Components/BookSession";
import Appointment from "./Components/Appointments";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AppointmentTable from "./Components/Admin/AppointmentTable";
import Users from "./pages/Admin/Users";
import Sessions from "./pages/Admin/Sessions";
import Bookings from "./pages/Admin/Bookings";
import Therapists from "./pages/Admin/Therapists";
import Payments from "./pages/Admin/Payments";
import TherapistsDashboard from "./pages/Therapists/TherapistsDashboard";
import BookPayment from "./Components/BookPayment";
import Confirmation from "./Components/Confirmation";
import UserBookings from "./Components/UserBookings";
import TherapistsBookings from "./Components/Therapists/TherapistsSession";
import AppointmentsRequests from "./Components/Therapists/AppointmentRequests";
import PatientOverview from "./Components/Therapists/PatientsOverview";
import UserMessage from "./Components/UserMessage";
import Profile from "./Components/Therapists/Profile";
import Settings from "./Components/Therapists/Settings";
import DoctorsList2 from "./Components/DoctorsList2";
import Specialists from "./Components/Specialists";
import NotFoundPage from "./pages/NotFound";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { JSX, ReactNode } from "react";

// Layout component with Header and Footer
const MainLayout = ({ children }: { children?: ReactNode }): JSX.Element => (
  <>
    <Header />
    {children || <Outlet />}
    <Footer />
  </>
);

// Layout without Header and Footer
const BlankLayout = ({ children }: { children?: ReactNode }): JSX.Element => (
  <>{children || <Outlet />}</>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Routes with header and footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/chatbot" element={<Chatbot />} /> */}
          <Route path="/hero" element={<Hero />} />
          <Route path="/case" element={<DetailsCaseStudies />} />
          <Route path="/doctor" element={<DoctorsList />} />
          <Route path="/sessions" element={<DoctorsList2 />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/booktraining" element={<BookTraining />} />
          <Route path="/checkout" element={<CheckoutPage amount={100} />} />
        </Route>

        {/* Auth routes without header and footer */}
        <Route element={<BlankLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User dashboard routes without header and footer */}
        <Route element={<BlankLayout />}>
        <Route path="/sidebar" element={<Sidebar isOpen={true} toggleSidebar={() => {}} />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/payment" element={<UserPayment />} />
          <Route path="/sessions" element={<Session />} />
          <Route path="/book-session" element={<BookSession />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/book-payment" element={<BookPayment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/user-bookings" element={<UserBookings />} />
          <Route path="/user-message" element={<UserMessage />} />
          <Route path="/chatbot" element={<Chatbot />} />

        </Route>

        {/* Admin dashboard routes without header and footer */}
        <Route element={<BlankLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AppointmentTable />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/sessions" element={<Sessions />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/therapists" element={<Therapists />} />
          <Route path="/admin/payments" element={<Payments />} />
        </Route>

        {/* Therapist dashboard routes without header and footer */}
        <Route element={<BlankLayout />}>
          <Route path="/therapist-dashboard/:id" element={<TherapistsDashboard />} />
          <Route path="/therapist-bookings" element={<TherapistsBookings therapistId={3} />} />
          <Route path="/appointments-requests" element={<AppointmentsRequests therapistId={5} />} />
          <Route path="/patient-overview" element={<PatientOverview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Error pages */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;