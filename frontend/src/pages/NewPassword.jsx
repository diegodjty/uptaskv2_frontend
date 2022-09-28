import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../config/axiosClient';
import Alert from '../components/Alert';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [alert, setAlert] = useState({});
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setAlert({
        msg: 'Password needs at least 6 charaters',
        error: true,
      });

      return;
    }

    try {
      const url = `/users/forgot-password/${params.token}`;

      const { data } = await axiosClient.post(url, { password });
      setAlert({
        msg: data.msg,
        error: false,
      });
      setPasswordChanged(true);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  useEffect(() => {
    const testToken = async () => {
      try {
        await axiosClient(`/users/forgot-password/${params.token}`);
        setValidToken(true);
      } catch (error) {
        console.log(error.response.data);
        setAlert({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    testToken();
  }, []);

  const { msg } = alert;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize ">
        Reestablish your password dont lose access to your{' '}
        <span className="text-slate-700">projects</span>
      </h1>
      {msg && <Alert alert={alert} />}
      {validToken && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label
              htmlFor="password"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="New Password"
              className=" w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value={'Save New Password'}
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase cursor-pointer font-bold rounded hover:bg-sky-800 transition-colors "
          />
        </form>
      )}
      {passwordChanged && (
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Login
        </Link>
      )}
    </>
  );
};

export default NewPassword;
