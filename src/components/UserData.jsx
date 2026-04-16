import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserByIdAction } from "../redux/action/dataAction";
import "./UserData.css";

const UserData = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector(
    (state) => state.dataReducer
  );

  useEffect(() => {
    dispatch(getUserByIdAction(userId));
  }, [dispatch, userId]);

  return (
    <div className="user-container">
      <div className="user-card">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>

        {loading && <p>Loading user data...</p>}
        {error && <p>Error: {error}</p>}

        {selectedUser && (
          <div className="user-info">
            <h2>User Details</h2>
            <p><span>Name:</span> {selectedUser.fullName || selectedUser.userName || selectedUser.email}</p>
            <p><span>Email:</span> {selectedUser.email}</p>
            <p><span>Role:</span> {selectedUser.isAdmin ? "Admin" : "User"}</p>
            <p><span>Mobile:</span> {selectedUser.mobileNo || "N/A"}</p>
            <p><span>Status:</span> {selectedUser.isActive ? "Active" : "Inactive"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserData;