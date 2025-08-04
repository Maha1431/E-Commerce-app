import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const ResetPassword = () => {
  const { token } = useParams(); // ✅ Now it gets the token from /reset-password/:token
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const { backendUrl } = useContext(ShopContext);
  console.log(token);

  const handleReset = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password });
      if (res.data.success) {
        toast.success('Password reset successful');
        setSuccess(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  

  return (
    <div className="flex flex-col items-center mt-16 gap-4">
      <h2 className="text-xl font-semibold">Reset Your Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        className="px-3 py-2 border border-gray-800"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset} className="bg-black text-white px-4 py-2">Reset Password</button>
      {success && <p className="text-green-600 mt-2">You can now log in with your new password.</p>}
    </div>
  );
};

export default ResetPassword;
