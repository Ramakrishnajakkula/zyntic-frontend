import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log(`Fetching product with ID: ${id}`);
      const response = await axios.get(`https://zyntic-backend.vercel.app/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Product data received:", response.data);
      
      if (response.data) {
        // Clean the data to ensure it doesn't contain fields that cause issues
        const { _id, __v, createdAt, updatedAt, ...cleanData } = response.data;
        setFormData(cleanData);
      } else {
        setError("Product data is empty or in unexpected format");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      
      if (err.response) {
        console.error("Server response:", err.response.data);
        
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (err.response.status === 404) {
          setError("Product not found");
        } else {
          setError(`Server error: ${err.response.data.message || "Unknown error"}`);
        }
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError(`Failed to load product details: ${err.message}`);
      }
    } finally {
      setIsFetching(false);
    }
  };

  // Add the missing validateForm function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) <= 0) 
      newErrors.price = "Price must be a positive number";
    
    if (formData.rating && (isNaN(formData.rating) || Number(formData.rating) < 0 || Number(formData.rating) > 5))
      newErrors.rating = "Rating must be between 0 and 5";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (id) {
        await axios.put(`https://zyntic-backend.vercel.app/api/products/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("https://zyntic-backend.vercel.app//api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/products");
    } catch (err) {
      console.error("Error saving product:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("Failed to save product. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: "70vh" }}
      >
        <div className="text-center">
          <div className="spinner-border" style={{ color: "rgb(255, 112, 67)" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh", padding: "2rem 0" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 style={{ color: "#2d3748" }}>{id ? "Edit Product" : "Add Product"}</h2>
                  <Link 
                    to="/products" 
                    className="btn btn-outline-secondary"
                  >
                    Back to List
                  </Link>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label" style={{ color: "#4a5568" }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label" style={{ color: "#4a5568" }}>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control form-control-lg"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter product description"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="form-label" style={{ color: "#4a5568" }}>
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      className={`form-control form-control-lg ${errors.category ? 'is-invalid' : ''}`}
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter product category"
                    />
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label" style={{ color: "#4a5568" }}>
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        className={`form-control form-control-lg ${errors.price ? 'is-invalid' : ''}`}
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="rating" className="form-label" style={{ color: "#4a5568" }}>
                        Rating (0-5)
                      </label>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        className={`form-control form-control-lg ${errors.rating ? 'is-invalid' : ''}`}
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        max="5"
                      />
                      {errors.rating && <div className="invalid-feedback">{errors.rating}</div>}
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-lg"
                      style={{
                        backgroundColor: "rgb(255, 112, 67)",
                        color: "white",
                      }}
                      disabled={isLoading}
                      onMouseOver={(e) => e.target.style.backgroundColor = "rgb(172, 58, 4)"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "rgb(255, 112, 67)"}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {id ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        id ? "Update Product" : "Save Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;