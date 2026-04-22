import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadLeaveRequests, requestLeave, clearLeaveMessage } from '../redux/slices/leaveSlice';
import { loadUserProfile } from '../redux/slices/profileSlice';
import './LeaveRequests.css';

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { requests: leaveRequests, loading, error, success } = useSelector((state) => state.leave);
  const { profile, loading: profileLoading } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.auth);
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(loadLeaveRequests());
    dispatch(loadUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (success === 'Leave request submitted successfully') {
      setLeaveType('sick');
      setStartDate('');
      setEndDate('');
      setReason('');
      setAttachments([]);
      setShowForm(false);
      dispatch(loadLeaveRequests());
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearLeaveMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearLeaveMessage());
  }, [showForm, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting leave request with data:', {
      leaveType,
      startDate,
        endDate,
        reason,
        attachments: attachments.map(file => file.name),
    });
    if (!startDate || !endDate || !reason) {
      return;
    }
    
    const formData = new FormData();
    formData.append('leaveType', leaveType);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('reason', reason);
    
    // Add attachments if any
    attachments.forEach((file) => {
      formData.append('attachment', file);
    });
    console.log('Submitting leave request with data:', {
      leaveType,
      startDate,    
        endDate,
        reason,
        attachments: attachments.map(file => file.name),
    });
    dispatch(requestLeave(formData));
  };

  const dashboardPath = currentUser?.role === 'admin' ? '/admin-dashboard' : '/dashboard';

  return (
    <div className="leave-requests-page">
      <div className="page-header">
        <Link to={dashboardPath} className="back-button">← Back to Dashboard</Link>
        <h1>My Leaves</h1>
        <button className="apply-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'View Requests' : 'Apply for Leave'}
        </button>
      </div>

      {showForm ? (
        <div className="leave-form-container">
          <h2>Apply for Leave</h2>
          
          {profile && (
            <div className="leave-balance">
              <h3>Your Leave Balance</h3>
              <div className="balance-grid">
                <div className="balance-item">
                  <span className="balance-label">Sick Leave:</span>
                  <span className="balance-value">{profile.leaveBalance?.sick || 0} days</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Casual Leave:</span>
                  <span className="balance-value">{profile.leaveBalance?.casual || 0} days</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Maternity Leave:</span>
                  <span className="balance-value">{profile.leaveBalance?.maternity || 0} days</span>
                </div>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit} className="leave-form">
            <div className="form-group">
              <label htmlFor="leaveType">Leave Type</label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="maternity">Maternity Leave</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
                <label htmlFor="reason">Reason for Leave</label>
                <textarea
                  id="reason"
                  value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide a reason for your leave request"
                    required
                ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Attachments (Optional) - Reports, Medical Documents, etc.</label>
              <input
                type="file"
                id="attachments"
                multiple
                onChange={(e) => setAttachments(Array.from(e.target.files))}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
              />
              {attachments.length > 0 && (
                <div className="file-list">
                  <p>Selected files:</p>
                  <ul>
                    {attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {loading && <p className="status-message">Loading leave requests…</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="leave-requests-list">
            {leaveRequests.length === 0 ? (
              <p>No leave requests submitted yet.</p>
            ) : (
              leaveRequests.map((request) => (
                <div key={request._id} className="leave-request-card">
                  <div className="leave-request-info">
                    <h4>Leave Request</h4>
                    <p>Type: {request.leaveType}</p>
                    <p>From: {new Date(request.startDate).toLocaleDateString()} To: {new Date(request.endDate).toLocaleDateString()}</p>
                    <p>Days: {request.daysRequested}</p>
                    <p>Reason: {request.reason}</p>
                    <p>Status: <span className={`status-${request.status}`}>{request.status}</span></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveRequests;