import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDoctorById } from '../api/doctorApi';
import './AdminDoctorDetail.css';

const AdminDoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const response = await fetchDoctorById(id);
        setDoctor(response);
      } catch (err) {
        setError(err.message || 'Unable to load doctor details');
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleAddVisit = () => {
    if (!doctor) return;
    navigate('/mr/add-visit', { state: { prefillDoctor: doctor } });
  };

  if (loading) {
    return (
      <div className="admin-doctor-detail-page">
        <div className="loading">
          <span className="spinner"></span> Loading doctor details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-doctor-detail-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
            ← Back
          </button>
        </div>
        <div className="error-alert">❌ {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-doctor-detail-page">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h1>👨‍⚕️ Doctor Details</h1>
      </div>

      {doctor && (
        <>
          <div className="doctor-header-card">
            <div className="doctor-name-section">
              <h2>{doctor.doctorName}</h2>
              <p className="specialty">{doctor.specialty}</p>
              <p className="clinic">{doctor.clinicName}</p>
            </div>
            <div className="doctor-status">
              <span className="status-badge active">✓ Active</span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-card">
              <h3>📋 General Information</h3>
              <div className="info-group">
                <div className="info-row">
                  <label>Doctor Name</label>
                  <p>{doctor.doctorName}</p>
                </div>
                <div className="info-row">
                  <label>Specialty</label>
                  <p>{doctor.specialty || 'Not specified'}</p>
                </div>
                <div className="info-row">
                  <label>Clinic Name</label>
                  <p>{doctor.clinicName || 'Not specified'}</p>
                </div>
                <div className="info-row">
                  <label>City</label>
                  <p>{doctor.city || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h3>📍 Location & Contact</h3>
              <div className="info-group">
                <div className="info-row">
                  <label>Contact Number</label>
                  <p>{doctor.contactNumber || 'Not provided'}</p>
                </div>
                {doctor.location?.lat !== undefined && doctor.location?.lng !== undefined && (
                  <div className="info-row">
                    <label>Coordinates</label>
                    <p>
                      Lat: {doctor.location.lat.toFixed(4)}, Lng: {doctor.location.lng.toFixed(4)}
                    </p>
                  </div>
                )}
                {doctor.location?.lat !== undefined && doctor.location?.lng !== undefined && (
                  <div className="map-container">
                    <iframe
                      title="Doctor Location"
                      src={`https://www.google.com/maps?q=${doctor.location.lat},${doctor.location.lng}&z=15&output=embed`}
                      loading="lazy"
                      style={{ width: '100%', height: '250px', borderRadius: '8px', border: 'none' }}
                    ></iframe>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-card">
              <h3>👤 Added By</h3>
              <div className="info-group">
                <div className="info-row">
                  <label>User Name</label>
                  <p>{doctor.mr?.userName || doctor.mr?.email || 'Unknown'}</p>
                </div>
                <div className="info-row">
                  <label>User Email</label>
                  <p>{doctor.mr?.email || 'Not available'}</p>
                </div>
                <div className="info-row">
                  <label>User Role</label>
                  <span className="role-badge">{doctor.mr?.role === 'admin' ? 'Admin' : 'MR'}</span>
                </div>
              </div>
            </div>

            <div className="detail-card full-width">
              <h3>🏥 Additional Details</h3>
              <div className="info-group">
                <div className="info-row">
                  <label>Registration Date</label>
                  <p>{new Date(doctor.createdAt).toLocaleDateString()}</p>
                </div>
                {doctor.experience && (
                  <div className="info-row">
                    <label>Experience</label>
                    <p>{doctor.experience} years</p>
                  </div>
                )}
                {doctor.qualifications && (
                  <div className="info-row">
                    <label>Qualifications</label>
                    <p>{doctor.qualifications}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleAddVisit}>
              ➕ Add Visit
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              ← Back to Doctors
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDoctorDetail;
