import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByIdAction } from "../redux/slices/authSlice";
const GetUserById = () => {
    console.log('GetUserById component rendered');
  const dispatch = useDispatch();
  const { selectedUser, loading, error } = useSelector((state) => state.auth);  
    const [userId, setUserId] = useState('');
    const { id } = useParams();
    console.log('User ID from URL params:', id);
    
    // Optionally, you could dispatch an action here to fetch the user by ID if it's not already in the state

  useEffect(() => {
    if (id) {
      dispatch(getUserByIdAction(id));
    }
    }, [dispatch, id]);



   console.log('Selected user from state:', selectedUser);
    return (
        <div className="get-user-page">
            <h2>Get User By ID</h2>
            {
                selectedUser ? (
                    <div className="user-details">
                        <p><strong>ID:</strong> {selectedUser._id}</p>
                        <p><strong>Name:</strong> {selectedUser.userName}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>   
                    </div>
                ) : (
                    <p>No user selected. Please enter a user ID to fetch details.</p>
                )
            }
           </div>
    );
}

export default GetUserById;