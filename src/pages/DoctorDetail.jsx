import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDoctorById } from '../api/doctorApi';
import './DoctorDetail.css';

const DoctorDetail = () => {
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

  if (loading) return <div className="doctor-detail-page"><p>Loading doctor details…</p></div>;
  if (error) return <div className="doctor-detail-page"><p className="error-message">{error}</p></div>;

  return (
    <div className="doctor-detail-page">
      <div className="detail-header">
        <div>
          <h1>{doctor.doctorName}</h1>
          <p>Full doctor profile, MR owner, and clinic details.</p>
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h3>📋 General Information</h3>
          <div className="info-row">
            <span>Doctor Name</span>
            <strong>{doctor.doctorName}</strong>
          </div>
          <div className="info-row">
            <span>Specialty</span>
            <strong>{doctor.specialty || 'Not specified'}</strong>
          </div>
          <div className="info-row">
            <span>Clinic Name</span>
            <strong>{doctor.clinicName || 'Not specified'}</strong>
          </div>
          <div className="info-row">
            <span>City</span>
            <strong>{doctor.city || 'Not specified'}</strong>
          </div>
          <div className="info-row">
            <span>Created</span>
            <strong>{doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'N/A'}</strong>
          </div>
        </div>

        <div className="detail-card">
          <h3>📍 Contact & Location</h3>
          <div className="info-row">
            <span>Contact Number</span>
            <strong>{doctor.contactNumber || 'Not provided'}</strong>
          </div>
          <div className="info-row">
            <span>Coordinates</span>
            <strong>
              {doctor.location?.lat !== undefined && doctor.location?.lng !== undefined
                ? `${doctor.location.lat.toFixed(4)}, ${doctor.location.lng.toFixed(4)}`
                : 'N/A'}
            </strong>
          </div>
          {doctor.location?.lat !== undefined && doctor.location?.lng !== undefined && (
            <div className="map-container">
              <iframe
                title="Doctor Location"
                src={`https://www.google.com/maps?q=${doctor.location.lat},${doctor.location.lng}&z=15&output=embed`}
                loading="lazy"
                frameBorder="0"
              />
            </div>
          )}
        </div>

        <div className="detail-card">
          <h3>👤 Added By</h3>
          <div className="info-row">
            <span>MR Name</span>
            <strong>{doctor.mr?.userName || doctor.mr?.email || 'Unknown'}</strong>
          </div>
          <div className="info-row">
            <span>MR Email</span>
            <strong>{doctor.mr?.email || 'Not available'}</strong>
          </div>
          <div className="info-row">
            <span>MR Role</span>
            <strong>{doctor.mr?.role === 'admin' ? 'Admin' : 'MR'}</strong>
          </div>
          <div className="info-row">
            <span>Company</span>
            <strong>{doctor.companyName || 'Not available'}</strong>
          </div>
        </div>

        <div className="detail-card full-width">
          <h3>🏥 Additional Details</h3>
          <div className="info-row">
            <span>Doctor ID</span>
            <strong>{doctor._id}</strong>
          </div>
          <div className="info-row">
            <span>Company ID</span>
            <strong>{doctor.company || 'Not specified'}</strong>
          </div>
        </div>
      </div>

      <div className="action-footer">
        <button className="primary-button" onClick={handleAddVisit}>
          ➕ Add Visit
        </button>
      </div>
    </div>
  );
};

export default DoctorDetail;
