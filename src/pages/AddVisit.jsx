import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { submitVisit, clearVisitMessage } from '../redux/slices/visitSlice';
import './AddVisit.css';

const AddVisit = () => {
  const dispatch = useDispatch();
  const locationState = useLocation();
  const { loading, error, message } = useSelector((state) => state.visits);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    clinicName: '',
    contactNumber: '',
  });

  useEffect(() => {
    if (locationState.state?.prefillDoctor) {
      const { prefillDoctor } = locationState.state;
      setDoctorId(prefillDoctor._id);
      setFormData({
        doctorName: prefillDoctor.doctorName || '',
        specialty: prefillDoctor.specialty || '',
        clinicName: prefillDoctor.clinicName || '',
        contactNumber: prefillDoctor.contactNumber || '',
      });
    }
  }, [locationState.state]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setGeoError(error.message || 'Unable to retrieve location');
      },
      { enableHighAccuracy: true }
    );

    return () => {
      dispatch(clearVisitMessage());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (location.lat == null || location.lng == null) {
      setGeoError('Please allow location access before submitting');
      return;
    }

    dispatch(submitVisit({
      doctorId,
      ...formData,
      latitude: location.lat,
      longitude: location.lng,
    }));
  };

  return (
    <div className="add-visit-page">
      <section className="page-header">
        <h1>Add Doctor Visit</h1>
        <p>Record a new doctor visit and capture location automatically.</p>
      </section>

      <div className="add-visit-card">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {geoError && <div className="error-message">{geoError}</div>}

        <div className="location-panel">
          <h3>Current location</h3>
          {location.lat != null ? (
            <>
              <p>{`Latitude: ${location.lat.toFixed(5)}, Longitude: ${location.lng.toFixed(5)}`}</p>
              <div className="map-panel">
                <iframe
                  title="Current visit location"
                  src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
                  loading="lazy"
                />
              </div>
            </>
          ) : (
            <p>Fetching current location…</p>
          )}
        </div>

        <form className="visit-form" onSubmit={handleSubmit}>
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
              placeholder="Enter hospital or clinic name"
            />
          </label>
          <label>
            Contact Number (optional)
            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Recording visit…' : 'Submit Visit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVisit;
