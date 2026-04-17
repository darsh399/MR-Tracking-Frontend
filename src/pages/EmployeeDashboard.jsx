import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserProfile } from '../redux/slices/profileSlice';
import { loadCurrentUser } from '../redux/slices/authSlice';
import { loadLeaveRequests } from '../redux/slices/leaveSlice';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading: profileLoading } = useSelector((state) => state.profile);
  const { currentUser, loading: userLoading } = useSelector((state) => state.auth);
  const { requests, loading: leaveLoading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(loadCurrentUser());
    dispatch(loadUserProfile());
    dispatch(loadLeaveRequests());
  }, [dispatch]);

  const profileCompleted = currentUser?.profileCompleted || profile?.profileCompleted;

  return (
    <div className="employee-dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>{currentUser?.userName || 'Employee'}</h1>
          <p>{currentUser?.companyName || 'Your company'} employee dashboard.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card profile-card">
          <h2>Your profile</h2>
          {profileLoading || userLoading ? (
            <p>Loading profile…</p>
          ) : profileCompleted ? (
            <div>
              <p><strong>Employee ID:</strong> {profile?.employeeId || 'Pending'}</p>
              <p><strong>Department:</strong> {profile?.department || 'Not set'}</p>
              <p><strong>Location:</strong> {profile?.city}, {profile?.state}</p>
              <p><strong>Role:</strong> {currentUser?.role}</p>
              <p><strong>Profile status:</strong> Completed</p>
            </div>
          ) : (
            <p>Your profile is not complete yet. Please finish onboarding.</p>
          )}
        </section>

        <section className="card stats-card">
          <h2>Leave balances</h2>
          {profileLoading ? (
            <p>Loading balances…</p>
          ) : (
            <div>
              <p><strong>Available sick leave:</strong> {profile?.leaveBalance?.sickLeave ?? 0}</p>
              <p><strong>Available casual leave:</strong> {profile?.leaveBalance?.casualLeave ?? 0}</p>
              <p><strong>Maternity leave:</strong> {profile?.leaveBalance?.maternityLeave ?? 0}</p>
            </div>
          )}
        </section>

        <section className="card requests-card">
          <h2>Recent leave requests</h2>
          {leaveLoading ? (
            <p>Loading leave data…</p>
          ) : requests?.length ? (
            <ul>
              {requests.slice(0, 3).map((request) => (
                <li key={request._id}>
                  <p>{request.leaveType} leave — {new Date(request.startDate).toLocaleDateString()}</p>
                  <p>Status: {request.status}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No leave requests yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
