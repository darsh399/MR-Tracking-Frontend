import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadUserProfile } from '../redux/slices/profileSlice';
import { loadCurrentUser } from '../redux/slices/authSlice';
import { loadLeaveRequests, requestLeave } from '../redux/slices/leaveSlice';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading: profileLoading } = useSelector((state) => state.profile);
  const { currentUser, loading: userLoading } = useSelector((state) => state.auth);
  const { requests, loading: leaveLoading, error: leaveError, success: leaveSuccess } = useSelector((state) => state.leave);
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    dispatch(loadCurrentUser());
    dispatch(loadUserProfile());
    dispatch(loadLeaveRequests());
  }, [dispatch]);

  useEffect(() => {
    if (leaveSuccess) {
      setFormSuccess(leaveSuccess);
      setFormError(null);
      setLeaveType('sick');
      setStartDate('');
      setEndDate('');
      setReason('');
      dispatch(loadLeaveRequests());
      dispatch(loadUserProfile());
    }
    if (leaveError) {
      setFormError(leaveError);
    }
  }, [leaveSuccess, leaveError, dispatch]);

  const profileCompleted = currentUser?.profileCompleted || profile?.profileCompleted;
  const availableBalance = profile?.leaveBalance || {};

  const handleLeaveSubmit = (event) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!startDate || !endDate || !reason.trim()) {
      setFormError('Please complete all leave fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      setFormError('Please select a valid date range.');
      return;
    }

    const daysRequested = Math.floor((end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) + 1;
    const remaining = availableBalance[leaveType] ?? 0;
    if (daysRequested > remaining) {
      setFormError(`You only have ${remaining} ${leaveType} day(s) remaining.`);
      return;
    }

    dispatch(requestLeave({ leaveType, startDate, endDate, reason }));
  };

  return (
    <div className="employee-dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
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
              <p><strong>Location:</strong> {profile?.address?.city}, {profile?.address?.state}</p>
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
              <p><strong>Available sick leave:</strong> {availableBalance.sick ?? 0}</p>
              <p><strong>Available casual leave:</strong> {availableBalance.casual ?? 0}</p>
              <p><strong>Maternity leave:</strong> {availableBalance.maternity ?? 0}</p>
              <p className="note">Sick and casual leave accrue at 0.77 days per month.</p>
            </div>
          )}
        </section>

        <section className="card leave-apply-card">
          <h2>Apply for leave</h2>
          {formError && <div className="form-error">{formError}</div>}
          {formSuccess && <div className="form-success">{formSuccess}</div>}
          <form className="leave-form" onSubmit={handleLeaveSubmit}>
            <label>
              Leave type
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
                <option value="maternity">Maternity</option>
              </select>
            </label>
            <label>
              Start date
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              End date
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <label>
              Reason
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="3" />
            </label>
            <button type="submit" className="button primary">Submit leave request</button>
          </form>
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
                  <p>Days: {request.daysRequested}</p>
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
