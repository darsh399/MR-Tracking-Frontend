import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadAdminUsers, toggleAdminUserStatus } from "../redux/slices/adminSlice";
import "./GetUserById.css";

const GetUserById = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
    const { id } = useParams();
    console.log('GetUserById component rendered with user ID:', id);
  
  const selectedUser = users.find((user) => user._id === id);

 console.log('Selected user details:', selectedUser);
  useEffect(() => {
    if (!users.length) {
      dispatch(loadAdminUsers());
    }
  }, [dispatch, users.length]);

  return (
    <div className="get-user-page">
      <div className="card">
        <h2>User Details</h2>

        {loading && <p className="loading">Loading user...</p>}
        {error && <p className="error">{error}</p>}

        {selectedUser ? (
          <div className="user-details">
            <p><strong>Name:</strong> <span>{selectedUser.userName}</span></p>
            <p><strong>Email:</strong> <span>{selectedUser.email}</span></p>
            <p><strong>Role:</strong> <span>{selectedUser.role}</span></p>
            <p><strong>Company:</strong> <span>{selectedUser.companyName}</span></p>
            <p><strong>Mobile No:</strong> <span>{selectedUser.mobileNo}</span></p>
            <p>
              <strong>Status:</strong>{" "}
              <span>
                {selectedUser.approved
                  ? selectedUser.isActive
                    ? "Active"
                    : "Inactive"
                  : "Pending Approval"}
              </span>
            </p>

            <button
              className={selectedUser.isActive ? "deactivate-btn" : "activate-btn"}
              onClick={() => dispatch(toggleAdminUserStatus(selectedUser._id))}
            >
              {selectedUser.isActive ? "Deactivate User" : "Activate User"}
            </button>
          </div>
        ) : (
          !loading && <p className="empty">User not found.</p>
        )}
      </div>
    </div>
  );
};

export default GetUserById;