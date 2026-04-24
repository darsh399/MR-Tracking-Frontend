import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { useState } from "react";
import {resetUserPassword} from './../redux/slices/profileSlice.js';
const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [isShowPassword, setIsShowPassword] = useState(false);
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state) => state.auth)
    const { loading, error, success, profile } = useSelector((state) => state.profile);
    
    const inputHandler = (e) => {
           const {name, value} = e.target;
           setFormData((prev) => ({
            ...prev,
            [name]: value
           }))
    }
    const passwordHandler = () => {
        setIsShowPassword((prev) => !prev)
    }
    const formHandler = async (e) => {
       e.preventDefault();
     const result = await dispatch(resetUserPassword(formData));

     if (result.meta.requestStatus === "fulfilled") {
      setFormData({
    currentPassword: '',
    newPassword: ''
    });
}
    }

return (
  <div className="reset-container">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
        ← Back
      </button>
    </div>
    <form className="reset-card" onSubmit={formHandler}>
      <h1>{currentUser?.userName || "User"}</h1>

      <input
        name="currentPassword"
        onChange={inputHandler}
        value={formData.currentPassword}
        placeholder="Enter Current Password"
        type={isShowPassword ? "string" : "password"}
      />

      <input
        name="newPassword"
        onChange={inputHandler}
        value={formData.newPassword}
        placeholder="Enter New Password"
        type={isShowPassword ? "string" : "password"}
      />
      <input type='checkbox' value={isShowPassword} onChange={passwordHandler}/>
      <label>{isShowPassword ? 'HIDE PASSWORD' : 'SHOW PASSWORD'}</label>
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "UPDATE PASSWORD"}
      </button>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">Password updated successfully</p>}
    </form>
  </div>
);
}
export default ResetPassword;