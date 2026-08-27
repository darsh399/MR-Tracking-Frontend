import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByIdAction } from "../redux/slices/authSlice";
import { toggleAdminUserStatus } from "../redux/slices/adminSlice";
import "./GetUserById.css";

const GetUserById = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState("profile");
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleSuccess, setToggleSuccess] = useState(false);

  const { selectedUser, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserByIdAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (toggleSuccess) {
      const timer = setTimeout(() => setToggleSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [toggleSuccess]);

  const user = selectedUser?.user;
  const profile = selectedUser?.profile;
  const leaves = selectedUser?.leaves || [];
  const visits = selectedUser?.visits || [];
  const doctors = selectedUser?.doctors || [];

  const statusBadge = () => {
    if (!user?.approved) return <span className="badge pending">⏳ Pending</span>;
    return user?.isActive
      ? <span className="badge active">✓ Active</span>
      : <span className="badge inactive">✕ Inactive</span>;
  };

  const handleToggleStatus = async () => {
    try {
      setToggleLoading(true);
      await dispatch(toggleAdminUserStatus(user._id));
      await dispatch(getUserByIdAction(id));
      setToggleSuccess(true);
    } catch (err) {
      console.error("Toggle status failed:", err);
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div className="header-title-section">
          <h1>👤 User Details</h1>
          <p className="subtitle">Admin User Management Dashboard</p>
        </div>
        <div className="header-buttons">
          <button className="btn btn-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="btn btn-home" onClick={() => navigate("/")}>
            🏠 Home
          </button>
        </div>
      </div>

      {toggleSuccess && (
        <div className="success-alert">
          ✓ Status updated successfully!
        </div>
      )}

      {loading && <div className="loading"><span className="spinner"></span>Loading...</div>}
      {error && <div className="error-alert">❌ Error: {error}</div>}

      {/* HEADER CARD */}
      {user && (
        <div className="card header-card">
          <div className="header-content">
            <div className="header-left">
              <h2>{user.userName}</h2>
              <div className="header-meta">
                <span>📧 {user.email}</span>
                <span>📱 {user.mobileNo}</span>
                <span>🏢 {user.companyName}</span>
              </div>
            </div>
            <div className="header-right">
              {statusBadge()}
            </div>
          </div>

          <div className="action-buttons">
            <button
              className={`toggle-btn ${user.isActive ? "deactivate" : "activate"}`}
              onClick={handleToggleStatus}
              disabled={toggleLoading}
            >
              {toggleLoading ? (
                <>
                  <span className="spinner-small"></span>
                  {user.isActive ? "Deactivating..." : "Activating..."}
                </>
              ) : (
                <>
                  {user.isActive ? "🔴 Deactivate User" : "🟢 Activate User"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            onClick={() => setTab("profile")}
            className={`tab-btn ${tab === "profile" ? "active" : ""}`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setTab("leaves")}
            className={`tab-btn ${tab === "leaves" ? "active" : ""}`}
          >
            📋 Leaves
          </button>
          <button
            onClick={() => setTab("visits")}
            className={`tab-btn ${tab === "visits" ? "active" : ""}`}
          >
            🏥 Visits
          </button>
          <button
            onClick={() => setTab("doctors")}
            className={`tab-btn ${tab === "doctors" ? "active" : ""}`}
          >
            👨‍⚕️ Doctors
          </button>
        </div>
      </div>

      {/* PROFILE TAB */}
      {tab === "profile" && profile && (
        <div className="card profile-card">
          <h3>📝 Profile Information</h3>
          <div className="profile-grid">
            <div className="profile-box">
              <h4>Employee Info</h4>
              <div className="info-row">
                <span className="label">ID:</span>
                <span className="value">{profile.employeeId}</span>
              </div>
              <div className="info-row">
                <span className="label">Department:</span>
                <span className="value">{profile.department}</span>
              </div>
              <div className="info-row">
                <span className="label">Joining Date:</span>
                <span className="value">{new Date(profile.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="profile-box">
              <h4>Personal Info</h4>
              <div className="info-row">
                <span className="label">Blood Group:</span>
                <span className="value">{profile.bloodGroup || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">Aadhar:</span>
                <span className="value">{profile.aadharNumber || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">PAN:</span>
                <span className="value">{profile.panNumber || "N/A"}</span>
              </div>
            </div>

            <div className="profile-box">
              <h4>Address</h4>
              <div className="info-row">
                <span className="label">City:</span>
                <span className="value">{profile.address?.city || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">State:</span>
                <span className="value">{profile.address?.state || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">Pincode:</span>
                <span className="value">{profile.address?.pincode || "N/A"}</span>
              </div>
            </div>

            <div className="profile-box">
              <h4>Leave Balance</h4>
              <div className="leave-balance">
                <div className="balance-item">
                  <span className="balance-label">Sick</span>
                  <span className="balance-count">{profile.leaveBalance?.sick || 0}</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Casual</span>
                  <span className="balance-count">{profile.leaveBalance?.casual || 0}</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">Maternity</span>
                  <span className="balance-count">{profile.leaveBalance?.maternity || 0}</span>
                </div>
              </div>
            </div>

            {profile.documents && (
              <div className="profile-box full-width">
                <h4>📎 Documents</h4>
                <div className="documents-list">
                  {profile.documents?.salarySlips?.length > 0 && (
                    <div className="doc-section">
                      <strong>Salary Slips:</strong>
                      {profile.documents.salarySlips.map((d, i) => (
                        <a key={i} href={d} target="_blank" rel="noopener noreferrer" className="doc-link">
                          📄 Salary Slip {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                  {profile.documents?.offerLetters?.length > 0 && (
                    <div className="doc-section">
                      <strong>Offer Letters:</strong>
                      {profile.documents.offerLetters.map((d, i) => (
                        <a key={i} href={d} target="_blank" rel="noopener noreferrer" className="doc-link">
                          📄 Offer Letter {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                  {profile.documents?.relievingLetters?.length > 0 && (
                    <div className="doc-section">
                      <strong>Relieving Letters:</strong>
                      {profile.documents.relievingLetters.map((d, i) => (
                        <a key={i} href={d} target="_blank" rel="noopener noreferrer" className="doc-link">
                          📄 Relieving Letter {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEAVES TAB */}
      {tab === "leaves" && (
        <div className="card">
          <h3>📋 Leave Records</h3>
          {leaves.length > 0 ? (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l, i) => (
                    <tr key={i}>
                      <td>{l.type}</td>
                      <td><span className={`status-badge ${l.status?.toLowerCase()}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No leave records found</p>
          )}
        </div>
      )}

      {/* VISITS TAB */}
      {tab === "visits" && (
        <div className="card">
          <h3>🏥 Visit History</h3>
          {visits.length > 0 ? (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Visit Date</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((v, i) => (
                    <tr key={i}>
                      <td>{v.doctorName}</td>
                      <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No visit records found</p>
          )}
        </div>
      )}

      {/* DOCTORS TAB */}
      {tab === "doctors" && (
        <div className="card">
          <h3>👨‍⚕️ Associated Doctors</h3>
          {doctors.length > 0 ? (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d, i) => (
                    <tr key={i}>
                      <td>{d.name}</td>
                      <td>{d.specialization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No doctors found</p>
          )}
        </div>
      )}

      <div className="footer-buttons">
        <button className="btn btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button className="btn btn-home" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default GetUserById;