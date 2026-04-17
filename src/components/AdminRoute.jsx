import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.auth);
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
