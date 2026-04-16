import { fetchUsersAction } from "../redux/action/dataAction"
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GetAllUsers = () =>{
const dispatch = useDispatch();
const { users, loading, error } = useSelector((state) => state.dataReducer);

useEffect(() => {
    dispatch(fetchUsersAction());
}, [dispatch]);

return (
    <div>
        <h2>All Users</h2>
        {loading && <p>Loading users...</p>}  
        {error && <p>Error: {error}</p>}
        {users && users.length > 0 ? (
            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Mobile No</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td ><Link to={`/users/${user._id}`}>{user.fullName || user.userName || user.email}</Link></td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                        <td>{user.mobileNo || 'N/A'}</td>
                        <td><button>ACTIVE</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        ) : (
            !loading && <p>No users found.</p>
        )}
    </div>      
)
}

export default GetAllUsers;