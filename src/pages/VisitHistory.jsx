import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadVisitHistory } from '../redux/slices/visitSlice';
import './VisitHistory.css';

const VisitHistory = () => {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.visits);
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
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((visit) => (
              <tr key={visit._id}>
                <td>{visit.doctorName}</td>
                <td>{visit.specialty}</td>
                <td>{visit.clinicName}</td>
                <td>{new Date(visit.timestamp).toLocaleString()}</td>
                <td>{visit.locationMatched ? 'Matched' : 'Not matched'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && history.length === 0 && <p className="no-data">No visits found.</p>}
      </div>
    </div>
  );
};

export default VisitHistory;
