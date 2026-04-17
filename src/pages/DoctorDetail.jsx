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
      <section className="page-header">
        <h1>{doctor.doctorName}</h1>
        <p>Review this doctor's profile and click to add a new visit.</p>
      </section>

      <div className="doctor-detail-card">
        <div className="detail-row">
          <span>Specialty</span>
          <strong>{doctor.specialty}</strong>
        </div>
        <div className="detail-row">
          <span>Clinic</span>
          <strong>{doctor.clinicName}</strong>
        </div>
        <div className="detail-row">
          <span>City</span>
          <strong>{doctor.city || 'Not specified'}</strong>
        </div>
        <div className="detail-row">
          <span>Contact</span>
          <strong>{doctor.contactNumber || 'Not provided'}</strong>
        </div>
        <button className="primary-button" onClick={handleAddVisit}>
          Add visit for this doctor
        </button>
      </div>
    </div>
  );
};

export default DoctorDetail;
