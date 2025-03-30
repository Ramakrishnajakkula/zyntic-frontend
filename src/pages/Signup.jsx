import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    confirmPassword: "",
    role: "user" // Default role is user
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      // Use direct URL to backend instead of relying on proxy
      const { email, password, role } = formData;
      const response = await axios.post("https://zyntic-backend.vercel.app/api/auth/signup", { 
        email, 
        password,
        role 
      });
      
      console.log("Signup successful:", response.data);
      // Optionally store token if returned
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      navigate("/login");
    } catch (err) {
      console.error("Signup error details:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please make sure the backend server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100" 
      style={{ backgroundColor: "#f7fafc" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4" style={{ color: "#2d3748" }}>
                  Sign Up
                </h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

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
                      minLength="6"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label"
                      style={{ color: "#4a5568" }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="role"
                      className="form-label"
                      style={{ color: "#4a5568" }}>
                      Account Type
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="form-text text-muted">
                      Admin users can manage products, regular users can only rate products.
                    </div>
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
                          Signing up...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <p className="mb-0" style={{ color: "#4a5568" }}>
                    Already have an account?{" "}
                    <Link
                      to="/login"
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
                      Login
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

export default Signup;