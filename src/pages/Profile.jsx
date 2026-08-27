import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserProfile } from '../redux/slices/profileSlice';
import { loadCurrentUser } from '../redux/slices/authSlice';
import { loadLeaveRequests, requestLeave } from '../redux/slices/leaveSlice';
import './AuthPage.css';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading: userLoading } = useSelector((state) => state.auth);
  const { profile, loading: profileLoading } = useSelector((state) => state.profile);
  const { requests, loading: leaveLoading, error: leaveError, success: leaveSuccess } = useSelector((state) => state.leave);
  console.log('Profile component render:',profile);
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
    if (currentUser?.profileCompleted && !profile && !profileLoading) {
      dispatch(loadUserProfile());
    }
  }, [currentUser, profile, profileLoading, dispatch]);

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

  const profileExists = Boolean(profile && Object.keys(profile).length);
  const isLoading = (userLoading || profileLoading) && !currentUser && !profileExists;
  const profileCompleted = Boolean(currentUser?.profileCompleted);
  const showPendingProfile = profileCompleted && !profileExists && !isLoading;
  const leaveBalance = profile?.leaveBalance || { sick: 0, casual: 0, maternity: 0 };
  const displayName = currentUser?.userName || currentUser?.email || 'Employee';
  
  const calculateRequestedDays = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    if (Number.isNaN(startDateObj.getTime()) || Number.isNaN(endDateObj.getTime())) return 0;
    const diff = endDateObj.setHours(0, 0, 0, 0) - startDateObj.setHours(0, 0, 0, 0);
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmitLeave = (event) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!startDate || !endDate || !reason.trim()) {
      setFormError('Please provide leave dates and a reason.');
      return;
    }

    const daysRequested = calculateRequestedDays(startDate, endDate);
    if (daysRequested <= 0) {
      setFormError('Please select a valid leave date range.');
      return;
    }

    const remaining = leaveBalance[leaveType] ?? 0;
    if (daysRequested > remaining) {
      setFormError(`You only have ${remaining} day(s) of ${leaveType} leave remaining.`);
      return;
    }

    dispatch(requestLeave({ leaveType, startDate, endDate, reason }));
  };

  return (
    <div className="profile-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <div className="profile-header">
        <div>
          <p className="eyebrow">Your employee profile</p>
          <h1>{displayName}</h1>
          <p>Review your profile details, leave balances, and submit a new leave request from one place.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="profile-loading">Loading profile data…</div>
      ) : (
        <div className="profile-grid">
          <section className="profile-card">
            <div className="card-title">
              <h2>Profile details</h2>
            </div>
            {!profileExists ? (
              showPendingProfile ? (
                <p className="profile-note">Your onboarding is complete. Loading profile details…</p>
              ) : (
                <p className="profile-note">Your profile is not complete yet. Complete onboarding to unlock leave features.</p>
              )
            ) : (
              <div className="profile-details">
                <div className="detail-row">
                  <span>Full name</span>
                  <strong>{profile.user?.userName || currentUser?.userName}</strong>
                </div>
                <div className="detail-row">
                  <span>Email</span>
                  <strong>{profile.user?.email || currentUser?.email}</strong>
                </div>
                <div className="detail-row">
                  <span>Role</span>
                  <strong>{profile.role}</strong>
                </div>
                <div className="detail-row">
                  <span>Employee ID</span>
                  <strong>{profile.employeeId}</strong>
                </div>
                <div className="detail-row">
                  <span>Department</span>
                  <strong>{profile.department}</strong>
                </div>
                <div className="detail-row">
                  <span>Joining date</span>
                  <strong>{new Date(profile.joiningDate).toLocaleDateString()}</strong>
                </div>
                <div className="detail-row">
                  <span>Experience status</span>
                  <strong>{profile.experienceType === 'experienced' ? 'Experienced' : 'Fresher'}</strong>
                </div>
                {profile.experienceType === 'experienced' && (
                  <>
                    <div className="detail-row">
                      <span>Previous company</span>
                      <strong>{profile.previousCompany || 'N/A'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Total experience</span>
                      <strong>{profile.totalExperienceMonths} month(s)</strong>
                    </div>
                  </>
                )}
                <div className="detail-row">
                  <span>Address</span>
                  <strong>{profile.address?.city}, {profile.address?.state} - {profile.address?.pincode}</strong>
                </div>
                <div className="detail-row">
                  <span>Emergency contact</span>
                  <strong>{profile.emergencyContact}</strong>
                </div>
              </div>
            )}
          </section>

          <section className="settings-card">
            <div className="card-title">
              <h2>Settings</h2>
            </div>
            <p className="settings-note">Quick access to account settings for your profile and password.</p>
            <div className="settings-list">
              <Link className="settings-link" to="/update-profile">Update Profile</Link>
              <Link className="settings-link" to="/reset-password">Reset Password</Link>
            </div>
          </section>

          <section className="leave-card">
            <div className="card-title">
              <h2>Leave balances</h2>
            </div>
            <div className="leave-summary-grid">
              <div className="leave-tile sick-tile">
                <p>Sick leave</p>
                <strong>{leaveBalance.sick?.toFixed(2) ?? '0.00'} days</strong>
              </div>
              <div className="leave-tile casual-tile">
                <p>Casual leave</p>
                <strong>{leaveBalance.casual?.toFixed(2) ?? '0.00'} days</strong>
              </div>
              <div className="leave-tile maternity-tile">
                <p>Maternity leave</p>
                <strong>{leaveBalance.maternity?.toFixed(2) ?? '0.00'} days</strong>
              </div>
            </div>
            <p className="leave-note">Sick and casual leave accrue at 0.77 days per month after onboarding.</p>

            <div className="apply-leave-section">
              <h3>Apply for leave</h3>
              {formError && <div className="input-error">{formError}</div>}
              {formSuccess && <div className="form-success">{formSuccess}</div>}
              <form className="leave-form" onSubmit={handleSubmitLeave}>
                <div className="form-row">
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
                </div>
                <div className="form-row">
                  <label>
                    End date
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </label>
                  <label>
                    Reason
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="3" />
                  </label>
                </div>
                <button type="submit" className="button primary">Apply leave</button>
              </form>
            </div>
          </section>

          <section className="request-card">
            <div className="card-title">
              <h2>Recent leave requests</h2>
            </div>
            {leaveLoading ? (
              <p>Loading leave requests…</p>
            ) : requests?.length ? (
              <ul className="request-list">
                {requests.slice(0, 5).map((request) => (
                  <li key={request._id} className="request-item">
                    <div>
                      <p className="request-title">{request.leaveType} leave</p>
                      <p>{new Date(request.startDate).toLocaleDateString()} — {new Date(request.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className={`status-pill status-${request.status}`}>
                      {request.status}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No leave requests submitted yet.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Profile;
