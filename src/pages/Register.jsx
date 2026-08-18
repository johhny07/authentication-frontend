import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  clearAuthError,
  registerUser,
  resetRegisterStatus,
} from "../redux/app/features/auth/authSlice.js";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    registerSuccess,
    registerMessage,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

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

    const registerData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    const resultAction = await dispatch(
      registerUser(registerData)
    );

    if (registerUser.fulfilled.match(resultAction)) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
    }
  };

  useEffect(() => {
    if (!registerSuccess) {
      return;
    }

    const timerId = setTimeout(() => {
      dispatch(resetRegisterStatus());
      navigate("/login");
    }, 1500);

    return () => {
      clearTimeout(timerId);
    };
  }, [dispatch, navigate, registerSuccess]);

  useEffect(() => {
    return () => {
      dispatch(resetRegisterStatus());
    };
  }, [dispatch]);

  return (
    <section>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">
            First Name
          </label>

          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            autoComplete="given-name"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="last_name">
            Last Name
          </label>

          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            autoComplete="family-name"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="register-email">
            Email
          </label>

          <input
            id="register-email"
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
          <label htmlFor="register-password">
            Password
          </label>

          <input
            id="register-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {registerSuccess && (
        <p role="status">
          {registerMessage} Redirecting to login...
        </p>
      )}

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </section>
  );
};

export default Register;