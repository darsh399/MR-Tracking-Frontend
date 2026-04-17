import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser } from '../redux/slices/authSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const shouldSkipFetch = location.pathname === '/login' || location.pathname === '/signup';
    if (shouldSkipFetch || currentUser) return;

    dispatch(loadCurrentUser());
  }, [dispatch, location.pathname, currentUser]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;