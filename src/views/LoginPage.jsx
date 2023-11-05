import FullPageLoader from "../components/FullPageLoader.jsx";
import { useState, useEffect } from "react";
import { auth } from "../firebase/config.js";
import { useDispatch } from "react-redux";
import { setUser } from "../store/usersSlice.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

function LoginPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loginType, setLoginType] = useState("login");
  const [userCredentials, setUserCredentials] = useState({});
  const [error, setError] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({ id: user.uid, email: user.email }));
    } else {
      dispatch(setUser(null));
    }
    if (isLoading) {
      setIsLoading(false);
    }
  });

  function handleCredentials(e) {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    });
  }

  function handleSignUp(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    ).catch((errorObj) => {
      setError(errorObj.message);
    });
  }

  function handleLogin(e) {
    e.preventDefault();
    signInWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    ).catch((errorObj) => {
      setError(errorObj.message);
    });
  }

  function handlePasswordReset(e) {
    e.preventDefault();
    const email = prompt("Please enter your email");
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Email sent! Check your inbox for password reset instructions.");
      })
      .catch((errorObj) => {
        setError(errorObj.message);
      });
  }

  return (
    <>
      {isLoading && <FullPageLoader></FullPageLoader>}

      <div className="container login-page">
        <section>
          <h1>Welcome to the Book App</h1>
          <p>Login or create an account to continue</p>
          <div className="login-type">
            <button
              className={`btn ${loginType == "login" ? "selected" : ""}`}
              onClick={() => setLoginType("login")}
            >
              Login
            </button>
            <button
              className={`btn ${loginType == "signup" ? "selected" : ""}`}
              onClick={() => setLoginType("signup")}
            >
              Signup
            </button>
          </div>
          <form className="add-form login">
            <div className="form-control">
              <label>Email *</label>
              <input
                onChange={(e) => handleCredentials(e)}
                type="text"
                name="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-control">
              <label>Password *</label>
              <input
                onChange={(e) => handleCredentials(e)}
                type="password"
                name="password"
                placeholder="Enter your password"
              />
            </div>
            {loginType == "login" ? (
              <button
                onClick={(e) => handleLogin(e)}
                className="active btn btn-block"
              >
                Login
              </button>
            ) : (
              <button
                onClick={(e) => handleSignUp(e)}
                className="active btn btn-block"
              >
                Sign Up
              </button>
            )}

            {error && <div className="error">{error}</div>}

            <p
              onClick={(e) => handlePasswordReset(e)}
              className="forgot-password"
            >
              Forgot Password?
            </p>
          </form>
        </section>
      </div>
    </>
  );
}

export default LoginPage;
