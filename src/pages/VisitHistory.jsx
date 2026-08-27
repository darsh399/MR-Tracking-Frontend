import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadVisitHistory } from '../redux/slices/visitSlice';
import './VisitHistory.css';

const VisitHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { history, loading, error } = useSelector((state) => state.visits);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filters, setFilters] = useState({ doctorName: '', startDate: '', endDate: '' });

  useEffect(() => {
    dispatch(loadVisitHistory(filters));
  }, [dispatch, filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const pageTitle = currentUser?.role === 'admin' ? 'All Company Visits' : 'My Visits';
  const pageDescription = currentUser?.role === 'admin'
    ? 'Review all doctor visits across your company and location match status.'
    : 'Review your doctor visits and location match status.';


  return (
    <div className="visit-history-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <section className="page-header">
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </section>

      <div className="history-filters">
        <label>
          Doctor name
          <input name="doctorName" value={filters.doctorName} onChange={handleChange} placeholder="Search doctor" />
        </label>
        <label>
          From
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        </label>
        <label>
          To
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </label>
      </div>

      {loading && <p className="status-message">Loading visit history...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Location</th>
              <th>Coordinates</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((visit) => (
              <tr key={visit._id}>
                <td>{visit.doctor?.doctorName || 'N/A'}</td>
                <td>{visit.doctor?.specialty || 'N/A'}</td>
                <td>{visit.doctor?.clinicName || 'N/A'}</td>
                <td>
                  {visit.location?.lat != null && visit.location?.lng != null
                    ? `${visit.location.lat.toFixed(4)}, ${visit.location.lng.toFixed(4)}`
                    : 'N/A'}
                </td>
                <td>{new Date(visit.timestamp).toLocaleString()}</td>
                <td>{visit.locationMatched ? 'Matched' : 'Not matched'}</td>
                <td>
                  <button type="button" className="view-location-btn" onClick={() => setSelectedVisit(visit)}>
                    View location
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && history.length === 0 && <p className="no-data">No visits found.</p>}
      </div>

      {selectedVisit && (
        <section className="visit-location-preview">
          <h2>Visit Location</h2>
          <p>
            {selectedVisit.doctor?.doctorName || 'N/A'} - {selectedVisit.doctor?.clinicName || 'N/A'}
          </p>
          {selectedVisit.location?.lat != null && selectedVisit.location?.lng != null ? (
            <>
              <p>
                Coordinates: {selectedVisit.location.lat.toFixed(4)}, {selectedVisit.location.lng.toFixed(4)}
              </p>
              <div className="visit-location-map">
                <iframe
                  title="Visit location"
                  src={`https://www.google.com/maps?q=${selectedVisit.location.lat},${selectedVisit.location.lng}&z=16&output=embed`}
                  loading="lazy"
                />
              </div>
            </>
          ) : (
            <p className="no-data">Geolocation data not available for this visit.</p>
          )}
          <button type="button" className="close-preview-btn" onClick={() => setSelectedVisit(null)}>
            Close preview
          </button>
        </section>
      )}
    </div>
  );
};

export default VisitHistory;
