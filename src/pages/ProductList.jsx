import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("https://zyntic-backend.vercel.app/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("Failed to load products. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://zyntic-backend.vercel.app/api/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh", padding: "2rem 0" }}>
      <div className="container">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ color: "#2d3748" }}>Product List</h2>
              <Link 
                to="/products/new" 
                className="btn"
                style={{
                  backgroundColor: "rgb(255, 112, 67)",
                  color: "white",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "rgb(172, 58, 4)"}
                onMouseOut={(e) => e.target.style.backgroundColor = "rgb(255, 112, 67)"}
              >
                Add Product
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by name"
                value={filter}
                onChange={handleFilterChange}
              />
            </div>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price}</td>
                        <td>{product.rating}</td>
                        <td>
                          <Link
                            to={`/products/edit/${product._id}`}
                            className="btn btn-sm me-2"
                            style={{ 
                              backgroundColor: "#4a5568",
                              color: "white" 
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#2d3748"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#4a5568"}
                          >
                            Edit
                          </Link>
                          <button 
                            className="btn btn-sm" 
                            style={{ 
                              backgroundColor: "#e53e3e",
                              color: "white" 
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#c53030"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#e53e3e"}
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No products found. Try a different search or add a new product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;