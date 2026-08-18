import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearAuthError,
  loginUser,
} from "../redux/app/features/auth/authSlice.js";

const Login = () => {
  const dispatch = useDispatch();

  const {
    email: loggedInEmail,
    isAuthenticated,
    isLoading,
    error,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email: formData.email.trim(),
      password: formData.password,
    };

    const resultAction = await dispatch(loginUser(loginData));

    if (loginUser.fulfilled.match(resultAction)) {
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <section>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {isAuthenticated && (
        <p>Welcome {loggedInEmail}</p>
      )}
    </section>
  );
};

export default Login;