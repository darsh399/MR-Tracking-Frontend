import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from '../pages/Signup';
import Login from '../components/Login';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import UpdateProfile from '../pages/UpdateProfile';
import CompleteProfile from '../pages/CompleteProfile';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import MainLayout from '../pages/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import AddVisit from '../pages/AddVisit';
import VisitHistory from '../pages/VisitHistory';
import GetUserById from '../pages/GetUserById';
import MrDashboard from '../pages/MrDashboard';
import Doctors from '../pages/Doctors';
import DoctorDetail from '../pages/DoctorDetail';
import AdminDoctorDetail from '../pages/AdminDoctorDetail';
import ResetPassword from '../components/ResetPassword';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import LeaveManagement from '../pages/LeaveManagement';
import LeaveRequests from '../pages/LeaveRequests';

const AllRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route>
          <Route path="/user/:id" element={<GetUserById />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/leaves" element={<LeaveRequests />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['mr']} />}>
          <Route path="/mr-dashboard" element={<MrDashboard />} />
          <Route path="/mr/add-visit" element={<AddVisit />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['mr', 'admin']} />}>
          <Route path="/visits" element={<VisitHistory />} />
          <Route path="/mr/visit-history" element={<VisitHistory />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/leaves" element={<LeaveManagement />} />
          <Route path="/admin/doctor/:id" element={<AdminDoctorDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;