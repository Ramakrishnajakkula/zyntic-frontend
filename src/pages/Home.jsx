import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("https://zyntic-backend.vercel.app/api/products", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.products) {
          const products = response.data.products;
          
          // Calculate total
          const total = products.length;
          
          // Calculate average price
          const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price), 0);
          const avgPrice = total > 0 ? (totalPrice / total).toFixed(2) : 0;
          
          // Find top category
          const categories = {};
          products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
          });
          
          const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
          
          setStats({
            totalProducts: total,
            topCategory,
            averagePrice: avgPrice
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load product statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}>
      <NavBar />
      
      <div className="container px-3 py-4">
  <div className="row justify-content-center mb-4">
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
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "rgb(255, 112, 67)" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
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