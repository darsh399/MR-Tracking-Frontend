import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const GetUserById = () => {
    console.log('GetUserById component rendered');
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.auth);  
    const [userId, setUserId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId.trim()) {
            dispatch(getUserByIdAction(userId));
        }   
    };

    return (
        <div className="get-user-page">
            <h2>Get User By ID</h2>
            <form onSubmit={handleSubmit} className="get-user-form">    
                <input
                    type="text"
                    placeholder="Enter user ID"
                    value={userId}

                    onChange={(e) => setUserId(e.target.value)}
                />
                <button type="submit">Fetch User</button>
            </form> 
            {loading && <p>Loading user data...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {selectedUser && (
                <div className="user-details">
                     <h3>User Details</h3>
                    <p><strong>Name:</strong> {selectedUser.userName}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Mobile No:</strong> {selectedUser.mobileNo}</p>


                </div>
            )}
        </div>
    );
}

export default GetUserById;