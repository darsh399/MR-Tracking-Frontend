import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loadDoctors, addDoctor, clearDoctorMessage } from '../redux/slices/doctorSlice';
import './MrDashboard.css';

const MrDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors, loading, error, message } = useSelector((state) => state.doctors);
  const [cityFilter, setCityFilter] = useState('');
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    clinicName: '',
    city: '',
    contactNumber: '',
    latitude: '',
    longitude: '',
  });
  const [locationError, setLocationError] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [altitude, setAltitude] = useState('');

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoaded(false);
      return;
    }

    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude: positionAltitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude?.toFixed(6) || '',
          longitude: longitude?.toFixed(6) || '',
        }));
        setAltitude(positionAltitude != null ? positionAltitude.toFixed(2) : 'Unavailable');
        setLocationLoaded(true);
      },
      (error) => {
        setLocationError(error.message || 'Unable to detect location.');
        setLocationLoaded(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    detectLocation();
    dispatch(loadDoctors());
    return () => {
      dispatch(clearDoctorMessage());
    };
  }, [dispatch, detectLocation]);

  const cityOptions = useMemo(() => {
    const cities = doctors
      .map((doctor) => doctor.city?.trim())
      .filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!cityFilter) return doctors;
    return doctors.filter(
      (doctor) => doctor.city?.toLowerCase() === cityFilter.toLowerCase()
    );
  }, [cityFilter, doctors]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(addDoctor(formData)).unwrap();
      setFormData({ doctorName: '', specialty: '', clinicName: '', city: '', contactNumber: '', latitude: '', longitude: '' });
      dispatch(loadDoctors());
    } catch (submitError) {
      console.error('Failed to add doctor:', submitError);
    }
  };

  return (
    <div className="mr-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <h2>MR Dashboard</h2>
      <p>Welcome to your MR dashboard! Log doctor visits, add city-aware doctors, and filter by city.</p>

      <div className="mr-dashboard-actions">
        <Link className="button primary" to="/mr/add-visit">
          Log a visit
        </Link>
        <Link className="button outline" to="/mr/visit-history">
          Visit history
        </Link>
        <Link className="button outline" to="/profile">
          Profile settings
        </Link>
      </div>

      <section className="doctor-management">
        <div className="doctor-setup">
          <h3>Add doctor with city</h3>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          <form className="doctor-form" onSubmit={handleSubmit}>
            <label>
              Doctor Name
              <input
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
                placeholder="Enter doctor name"
              />
            </label>
            <label>
              Specialty
              <input
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                placeholder="Enter specialty"
              />
            </label>
            <label>
              Hospital / Clinic Name
              <input
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                required
                placeholder="Enter clinic name"
              />
            </label>
            <label>
              City
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </label>
            <label>
              Contact Number
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </label>
            <div className="location-fieldset">
              <div className="location-inputs">
                <label>
                  Latitude
                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    readOnly
                    placeholder="Auto-detected latitude"
                  />
                </label>
                <label>
                  Longitude
                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    readOnly
                    placeholder="Auto-detected longitude"
                  />
                </label>
              </div>
              <div className="location-actions">
                <button type="button" className="secondary-button" onClick={detectLocation}>
                  Detect current location
                </button>
                {locationLoaded && altitude && (
                  <span className="altitude-label">Altitude: {altitude} m</span>
                )}
              </div>
            </div>
            {locationError && <p className="location-error">{locationError}</p>}
            {locationLoaded && formData.latitude && formData.longitude && (
              <div className="location-map">
                <iframe
                  title="Doctor location map"
                  src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&z=16&output=embed`}
                  loading="lazy"
                />
              </div>
            )}
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Saving doctor…' : 'Add doctor'}
            </button>
          </form>
        </div>

        <div className="doctor-list">
          <h3>Doctor directory</h3>
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

          {loading ? (
            <p>Loading doctors…</p>
          ) : filteredDoctors.length > 0 ? (
            <ul className="doctor-cards">
              {filteredDoctors.map((doctor) => (
                <li key={doctor._id} className="doctor-card">
                  <h4>
                    <Link className="doctor-card-link" to={`/doctors/${doctor._id}`}>
                      {doctor.doctorName}
                    </Link>
                  </h4>
                  <p>{doctor.specialty}</p>
                  <p>{doctor.clinicName}</p>
                  <p>{doctor.city ? `City: ${doctor.city}` : 'City: not set'}</p>
                  {doctor.location?.lat !== undefined && doctor.location?.lng !== undefined && (
                    <p>Location: {doctor.location.lat.toFixed(4)}, {doctor.location.lng.toFixed(4)}</p>
                  )}
                  {doctor.contactNumber && <p>Contact: {doctor.contactNumber}</p>}
                  <p className="doctor-creator">
                    Added by: {doctor.mr?.userName || doctor.mr?.email || 'Unknown'}
                    {doctor.mr?.role && (
                      <span> ({doctor.mr.role === 'admin' ? 'Admin' : 'MR'})</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No doctors found for this city.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MrDashboard;