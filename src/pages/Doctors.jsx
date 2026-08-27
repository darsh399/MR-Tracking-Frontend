import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadDoctors } from '../redux/slices/doctorSlice';
import './Doctors.css';

const Doctors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    dispatch(loadDoctors());
  }, [dispatch]);

  const cityOptions = useMemo(() => {
    const cities = doctors.map((doctor) => doctor.city?.trim()).filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!cityFilter) return doctors;
    return doctors.filter((doctor) => doctor.city?.toLowerCase() === cityFilter.toLowerCase());
  }, [cityFilter, doctors]);

  return (
    <div className="doctors-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <header className="doctors-header">
        <h2>All Doctors</h2>
        <p>View every doctor in your company. Click a card to see full details.</p>
      </header>

      <section className="doctors-controls">
        <label>
          Filter by city
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading ? (
        <p>Loading doctors…</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredDoctors.length === 0 ? (
        <p>No doctors found for this company yet.</p>
      ) : (
        <ul className="doctor-cards">
          {filteredDoctors.map((doctor) => (
            <li key={doctor._id} className="doctor-card">
              <Link className="doctor-card-link" to={`/doctors/${doctor._id}`}>
                <div className="doctor-card-header">
                  <h3>{doctor.doctorName}</h3>
                  {doctor.city && <span className="doctor-city">{doctor.city}</span>}
                </div>
                <p className="doctor-meta">{doctor.specialty}</p>
                <p>{doctor.clinicName}</p>
                {doctor.location?.lat !== undefined && doctor.location?.lng !== undefined && (
                  <p className="doctor-location">
                    Location: {doctor.location.lat.toFixed(4)}, {doctor.location.lng.toFixed(4)}
                  </p>
                )}
                {doctor.contactNumber && <p>Contact: {doctor.contactNumber}</p>}
                <p className="doctor-creator">
                  Added by: {doctor.mr?.userName || doctor.mr?.email || 'Unknown'}
                  {doctor.mr?.role && (
                    <span> ({doctor.mr.role === 'admin' ? 'Admin' : 'MR'})</span>
                  )}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Doctors;
