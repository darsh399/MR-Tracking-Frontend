import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadLeaveRequests, updateLeaveStatus } from '../redux/slices/leaveSlice';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const dispatch = useDispatch();
  const { requests: leaveRequests, loading, error, success } = useSelector((state) => state.leave);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(loadLeaveRequests());
  }, [dispatch]);

  useEffect(() => {
    if (success === 'Leave request updated successfully') {
      dispatch(loadLeaveRequests());
      setSelectedRequest(null);
    }
  }, [success, dispatch]);

  const filteredRequests = leaveRequests.filter(request => {
    const matchesText = request.user?.userName.toLowerCase().includes(filter.toLowerCase()) ||
                        request.profile?.employeeId?.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesText && matchesStatus;
  });

  return (
    <div className="leave-management-page">
      <div className="page-header">
        <Link to="/admin-dashboard" className="back-button">← Back to Dashboard</Link>
        <h1>Leave Management</h1>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by name or employee ID"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="status-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading && <p className="status-message">Loading leave requests…</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="leave-requests-list">
        {filteredRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          filteredRequests.map((request) => (
            <div 
              key={request._id} 
              className="leave-request-card"
              onClick={() => setSelectedRequest(request)}
              style={{ cursor: 'pointer' }}
            >
              <div className="leave-request-info">
                <h4>{request.user?.userName || 'Unknown User'}</h4>
                <p>Employee ID: {request.profile?.employeeId || 'N/A'}</p>
                <p>Type: {request.leaveType}</p>
                <p>From: {new Date(request.startDate).toLocaleDateString()} To: {new Date(request.endDate).toLocaleDateString()}</p>
                <p>Days: {request.daysRequested}</p>
                <p>Reason: {request.reason}</p>
                <p>Status: <span className={`status-${request.status}`}>{request.status}</span></p>
                {request.attachments && request.attachments.length > 0 && (
                  <p className="has-attachments">📎 {request.attachments.length} attachment(s)</p>
                )}
              </div>
              <div className="leave-request-actions">
                {request.status === 'pending' && (
                  <>
                    <button className="approve-button" onClick={(e) => { e.stopPropagation(); dispatch(updateLeaveStatus({ id: request._id, status: 'approved' })); }}>
                      Approve
                    </button>
                    <button className="reject-button" onClick={(e) => { e.stopPropagation(); dispatch(updateLeaveStatus({ id: request._id, status: 'rejected' })); }}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setSelectedRequest(null)}>✕</button>
            
            <div className="modal-header">
              <h2>Leave Request Details</h2>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Employee Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <p>{selectedRequest.user?.userName || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <p>{selectedRequest.user?.email || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Employee ID:</label>
                    <p>{selectedRequest.profile?.employeeId || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <p>{selectedRequest.profile?.role || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Leave Request Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Leave Type:</label>
                    <p>{selectedRequest.leaveType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Start Date:</label>
                    <p>{new Date(selectedRequest.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>End Date:</label>
                    <p>{new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Days Requested:</label>
                    <p>{selectedRequest.daysRequested} days</p>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Reason:</label>
                  <p>{selectedRequest.reason}</p>
                </div>
              </div>

              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div className="detail-section">
                  <h3>Attachments</h3>
                  <div className="attachments-list">
                    {selectedRequest.attachments.map((attachment, index) => {
                      // Construct view URL - path is stored as "attachments/filename"
                      const viewUrl = `/uploads/${attachment.path}`;
                      const downloadUrl = `/api/leave/download/${selectedRequest._id}/${index}`;
                      
                      const handleDownload = async () => {
                        try {
                          const response = await fetch(downloadUrl);
                          if (!response.ok) {
                            throw new Error('Download failed');
                          }
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = attachment.filename;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error('Download failed:', error);
                          alert('Failed to download file');
                        }
                      };

                      return (
                        <div key={index} className="attachment-item">
                          <span className="attachment-name">{attachment.filename}</span>
                          <span className="attachment-size">({(attachment.size / 1024).toFixed(2)} KB)</span>
                          <div className="attachment-actions">
                            <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="view-button">
                              👁️ View
                            </a>
                            <button onClick={handleDownload} className="download-button">
                              ⬇️ Download
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Status</h3>
                <p className={`status-${selectedRequest.status}`}>{selectedRequest.status.toUpperCase()}</p>
                <p className="submitted-date">Submitted on: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {selectedRequest.status === 'pending' && (
              <div className="modal-actions">
                <button 
                  className="approve-button" 
                  onClick={() => {
                    dispatch(updateLeaveStatus({ id: selectedRequest._id, status: 'approved' }));
                  }}
                >
                  Approve Request
                </button>
                <button 
                  className="reject-button" 
                  onClick={() => {
                    dispatch(updateLeaveStatus({ id: selectedRequest._id, status: 'rejected' }));
                  }}
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;