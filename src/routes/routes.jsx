import { Route, Routes } from 'react-router-dom';
import UserData from '../components/UserData';
import Signup from '../pages/Signup';
import Login from '../components/Login';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import UpdateProfile from '../pages/UpdateProfile';
import MainLayout from '../pages/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import GetAllUsers from '../components/GetAllUsers';
const AllRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/users/:userId" element={<UserData />} />
        <Route path="/users" element={<GetAllUsers />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;