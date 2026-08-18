import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../redux/app/features/auth/authSlice.js";

const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    email,
  } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header>
        <h1>Authentication App</h1>

        <nav>
          <NavLink to="/">Home</NavLink>

          {" | "}

          {!isAuthenticated && (
            <>
              <NavLink to="/login">
                Login
              </NavLink>

              {" | "}

              <NavLink to="/register">
                Register
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <>
              <NavLink to="/profile">
                Profile
              </NavLink>

              {" | "}

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {isAuthenticated && (
          <p>
            Logged in as:{" "}
            <strong>{email}</strong>
          </p>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;