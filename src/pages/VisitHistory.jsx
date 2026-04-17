import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadVisitHistory } from '../redux/slices/visitSlice';
import './VisitHistory.css';

const VisitHistory = () => {
  const dispatch = useDispatch();
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

  return (
    <div className="visit-history-page">
      <section className="page-header">
        <h1>Visit History</h1>
        <p>Review your doctor visits and location match status.</p>
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
                <td>{visit.doctorName}</td>
                <td>{visit.specialty}</td>
                <td>{visit.clinicName}</td>
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
            {selectedVisit.doctorName} - {selectedVisit.clinicName}
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
