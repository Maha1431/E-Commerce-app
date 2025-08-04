import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl, cartItems, getUserCart } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPasword] = useState('');
  const [email, setEmail] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (currentState === 'Sign Up') {
        response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
      } else {
        response = await axios.post(backendUrl + '/api/user/login', { email, password });
      }

      if (response.data.success) {
        const loginToken = response.data.token;
        setToken(loginToken);
        localStorage.setItem('token', loginToken);

        await axios.post(
          backendUrl + '/api/cart/merge',
          { cart: cartItems },
          { headers: { token: loginToken } }
        );

        await getUserCart(loginToken);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      return toast.error("Enter a valid email");
    }
    try {
      const res = await axios.post(backendUrl + '/api/user/forgot-password', {
        email: forgotEmail,
      });
      toast.success(res.data.message);
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Login' ? null : (
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />
        )}
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(e) => setPasword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p onClick={() => setShowForgotModal(true)} className='cursor-pointer text-blue-600'>Forgot your password?</p>
          {
            currentState === 'Login'
              ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
              : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
          }
        </div>
        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] sm:w-96">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-400 mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="bg-gray-200 text-black px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
