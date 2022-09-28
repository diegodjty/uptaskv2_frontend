import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import axiosClient from '../config/axiosClient';
import { useEffect } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [alert, setAlert] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([name, email, password, password2].includes('')) {
      setAlert({
        msg: 'All fields are requird',
        error: true,
      });
      return;
    }

    if (password !== password2) {
      setAlert({
        msg: 'Passwords are different',
        error: true,
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        msg: 'Password minimun 6 characters',
        error: true,
      });
      return;
    }

    setAlert({});

    // Create user in the API
    try {
      const { data } = await axiosClient.post('/users/createUser', {
        name,
        email,
        password,
      });
      setAlert({
        msg: data.msg,
        error: false,
      });

      setName('');
      setEmail('');
      setPassword('');
      setPassword2('');
    } catch (error) {
      //Axios documentation to get error is { error.response }

      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize ">
        Create account and manage your{' '}
        <span className="text-slate-700">projects</span>
      </h1>
      {msg && <Alert alert={alert} />}
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="name"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="confirm-password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm Password"
            className=" w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value={'Create Account'}
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase cursor-pointer font-bold rounded hover:bg-sky-800 transition-colors "
        />
      </form>
      <nav className="lg:flex lg:justify-between ">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Have an account? Login!
        </Link>
      </nav>
    </>
  );
};

export default Register;
