import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(
        "https://zyntic-backend.vercel.app/api/auth/login", 
        formData
      );
      
      console.log("Login response user data:", response.data.user);
      console.log("User role from API:", response.data.user.role);
      
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      
      // Store user data including role
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // For debugging - verify what we stored
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("User data saved to localStorage:", storedUser);
      console.log("Role saved to localStorage:", storedUser.role);
      
      // Show success message with role info
      setLoginSuccess(true);
      setUserRole(response.data.user.role);
      
      // Redirect to the home page after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Login failed. Please try again.");
        }
      } else if (err.request) {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex justify-content-center align-items-center w-100" 
      style={{ 
        backgroundColor: "#f7fafc",
        padding: "2rem 0"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4" style={{ color: "#2d3748" }}>
                  Login
                </h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                {loginSuccess && (
                  <div className="alert alert-success" role="alert">
                    <div className="mb-2">Login successful!</div>
                    <div>
                      You are logged in as an <strong>{userRole === 'admin' ? 'Admin' : 'User'}</strong>.
                      {userRole === 'admin' 
                        ? ' You have full access to manage products.' 
                        : ' You can view and rate products.'}
                    </div>
                    <div className="mt-2">
                      <small>Redirecting to dashboard...</small>
                    </div>
                  </div>
                )}

                {!loginSuccess && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="form-label"
                        style={{ color: "#4a5568" }}>
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="form-label"
                        style={{ color: "#4a5568" }}>
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="mb-4">
                      <button
                        type="submit"
                        className="btn btn-lg w-100"
                        style={{
                          backgroundColor: "rgb(255, 112, 67)",
                          color: "white",
                        }}
                        disabled={isLoading}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "rgb(172, 58, 4)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "rgb(255, 112, 67)")
                        }>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-center mt-3">
                  <p className="mb-0" style={{ color: "#4a5568" }}>
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="fw-bold"
                      style={{
                        color: "rgb(255, 112, 67)",
                        textDecoration: "none",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.color = "rgb(172, 58, 4)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.color = "rgb(255, 112, 67)")
                      }>
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;