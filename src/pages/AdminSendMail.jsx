import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendCompanyEmail } from '../redux/slices/adminSlice';
import './AdminDashboard.css';

const AdminSendMail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { emailStatus, emailError } = useSelector((state) => state.admin);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleSendMail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      alert('Please enter both subject and body.');
      return;
    }

    try {
      await dispatch(sendCompanyEmail({ subject: emailSubject.trim(), body: emailBody.trim() })).unwrap();
      setEmailSubject('');
      setEmailBody('');
    } catch (sendError) {
      console.error('Send mail failed:', sendError);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate('/admin-dashboard')} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back to Dashboard
        </button>
      </div>

      <section className="page-header">
        <h1>Send Email to Company Employees</h1>
        <p>Compose a message and send it to every employee associated with your company.</p>
      </section>

      <section className="send-mail-section">
        <div className="section-header email-header">
          <h2>📧 Broadcast Email</h2>
          <p>All employees in your company will receive this message.</p>
        </div>
        <div className="email-form">
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Email subject"
            className="email-subject-input"
          />
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Email body"
            className="email-body-input"
            rows={8}
          />
          <div className="email-actions">
            <button className="btn btn-primary" type="button" onClick={handleSendMail} disabled={emailStatus === 'pending'}>
              {emailStatus === 'pending' ? 'Sending…' : 'Send to All'}
            </button>
            {emailStatus === 'success' && <span className="email-feedback success">Message sent to all employees.</span>}
            {emailStatus === 'error' && <span className="email-feedback error">Failed to send email: {emailError}</span>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSendMail;
