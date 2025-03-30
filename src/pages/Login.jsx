import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use direct URL to backend
      const response = await axios.post("https://zyntic-backend.vercel.app/api/auth/login", formData);
      
      console.log("Login successful");
      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      navigate("/products");
    } catch (err) {
      console.error("Login error details:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
  className="min-vh-100 d-flex justify-content-center align-items-center w-100" 
  style={{ 
    backgroundColor: "#f7fafc"
  }}
>
      <div className="container">
        <div className="row justify-content-center">
        <div className="col-12 col-sm-6 col-md-8 col-lg-5">
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
                      {isLoading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>

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