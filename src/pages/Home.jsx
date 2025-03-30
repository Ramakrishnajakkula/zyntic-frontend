import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import axios from "axios";

function Home() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    topCategory: "",
    averagePrice: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        console.log("Home: User data from localStorage:", userData);
        console.log("Home: User role:", userData.role);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    fetchStats();
  }, []);

  const isAdmin = user?.role === 'admin';
  console.log("Home: isAdmin =", isAdmin);

  const fetchStats = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Making API request to fetch products");
      console.log("Token exists:", !!token);
      
      const response = await axios.get("https://zyntic-backend.vercel.app/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("API response received:", response.status);
      
      if (response.data.products) {
        console.log(`Found ${response.data.products.length} products`);
        const products = response.data.products;
        
        // Calculate total
        const total = products.length;
        
        // Calculate average price
        const totalPrice = products.reduce((sum, product) => {
          const price = parseFloat(product.price) || 0;
          return sum + price;
        }, 0);
        const avgPrice = total > 0 ? (totalPrice / total).toFixed(2) : 0;
        
        // Find top category
        const categories = {};
        products.forEach(product => {
          if (product.category) {
            categories[product.category] = (categories[product.category] || 0) + 1;
          }
        });
        
        let topCategory = "None";
        const categoriesArray = Object.entries(categories);
        if (categoriesArray.length > 0) {
          topCategory = categoriesArray.sort((a, b) => b[1] - a[1])[0][0];
        }
        
        console.log("Stats calculated:", { 
          totalProducts: total, 
          topCategory, 
          averagePrice: avgPrice 
        });
        
        setStats({
          totalProducts: total,
          topCategory,
          averagePrice: avgPrice
        });
      } else {
        console.warn("API response missing products array");
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      
      if (err.response) {
        // The server responded with an error status
        console.error("Server error details:", {
          status: err.response.status,
          data: err.response.data
        });
        
        if (err.response.status === 401) {
          console.log("Authentication error, redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setError(`Server error: ${err.response.data?.message || "Unknown error"}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response received from server:", err.request);
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        // Error in setting up the request
        console.error("Request setup error:", err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    console.log("Retrying data fetch");
    fetchStats();
  };

  return (
    <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}>
      <NavBar />
      
      <div className="container px-3 py-4">
        <div className="row justify-content-center mb-5">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-center" style={{ color: "#2d3748", fontSize: "calc(1.5rem + 1.5vw)" }}>
              Welcome to Zynetic
            </h1>
            <p className="text-center text-muted lead">
              Manage your products efficiently
            </p>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            <div className="d-flex justify-content-between align-items-center">
              <div>{error}</div>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "rgb(255, 112, 67)" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading product statistics...</p>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-3 p-md-4">
                    <div className="display-4 fw-bold mb-2" style={{ color: "rgb(255, 112, 67)", fontSize: "calc(1.5rem + 1.5vw)" }}>
                      {stats.totalProducts}
                    </div>
                    <h5 className="card-title fs-6">Total Products</h5>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-3 p-md-4">
                    <div className="display-4 fw-bold mb-2" style={{ color: "rgb(255, 112, 67)", fontSize: "calc(1.5rem + 1.5vw)" }}>
                      {stats.topCategory}
                    </div>
                    <h5 className="card-title fs-6">Top Category</h5>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-3 p-md-4">
                    <div className="display-4 fw-bold mb-2" style={{ color: "rgb(255, 112, 67)", fontSize: "calc(1.5rem + 1.5vw)" }}>
                      ${stats.averagePrice}
                    </div>
                    <h5 className="card-title fs-6">Average Price</h5>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row justify-content-center mb-4">
              <div className="col-12 col-md-10 col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <h4 className="card-title mb-3 fs-5">Quick Actions</h4>
                    
                    <div className="d-grid gap-2">
                      <Link 
                        to="/products" 
                        className="btn"
                        style={{ 
                          backgroundColor: "#4a5568",
                          color: "white",
                          padding: "0.6rem"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#2d3748"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#4a5568"}
                      >
                        View All Products
                      </Link>
                      
                      {isAdmin ? (
                        <Link 
                          to="/products/new" 
                          className="btn"
                          style={{ 
                            backgroundColor: "rgb(255, 112, 67)",
                            color: "white",
                            padding: "0.6rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "rgb(172, 58, 4)"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "rgb(255, 112, 67)"}
                        >
                          Add New Product
                        </Link>
                      ) : (
                        <Link 
                          to="/products" 
                          className="btn"
                          style={{ 
                            backgroundColor: "rgb(255, 112, 67)",
                            color: "white",
                            padding: "0.6rem"
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = "rgb(172, 58, 4)"}
                          onMouseOut={(e) => e.target.style.backgroundColor = "rgb(255, 112, 67)"}
                        >
                          Rate Products
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;