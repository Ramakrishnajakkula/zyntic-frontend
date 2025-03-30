import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar'; // Fix this path
import ProductRating from './ProductRating';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get user info
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);
  
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://zyntic-backend.vercel.app/api/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Find user's existing rating if any
  const userRating = product?.ratings?.find(
    rating => rating.userId === user?.id
  );
  
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://zyntic-backend.vercel.app/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Redirect to products list after successful deletion
      navigate('/products');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      setIsDeleting(false);
    }
  };
  
  const handleRatingSubmit = (updatedProduct) => {
    // Update the product state with the new rating data
    setProduct(updatedProduct);
  };
  
  return (
    <div style={{ backgroundColor: "#f7fafc", minHeight: "100vh" }}>
      <NavBar />
      
      <div className="container py-4">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "rgb(255, 112, 67)" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : product ? (
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h2 className="card-title mb-3">{product.name}</h2>
                  
                  <div className="d-flex justify-content-between mb-4">
                    <div>
                      <span className="badge bg-secondary me-2">{product.category}</span>
                      <span className="text-warning me-2">
                        {product.averageRating} ★
                      </span>
                      <span className="text-muted">
                        ({product.ratings?.length || 0} ratings)
                      </span>
                    </div>
                    <h4 className="text-primary">${product.price.toFixed(2)}</h4>
                  </div>
                  
                  <p className="card-text mb-4">{product.description}</p>
                  
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="d-flex gap-2 mb-4">
                      <Link 
                        to={`/products/edit/${product._id}`} 
                        className="btn"
                        style={{ backgroundColor: "#4a5568", color: "white" }}
                      >
                        Edit Product
                      </Link>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Deleting...
                          </>
                        ) : (
                          'Delete Product'
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Back button */}
                  <Link to="/products" className="btn btn-outline-secondary">
                    Back to Products
                  </Link>
                </div>
              </div>
              
              {/* Rating section for non-admin users */}
              {!isAdmin && (
                <ProductRating 
                  productId={product._id} 
                  existingRating={userRating} 
                  onRatingSubmit={handleRatingSubmit}
                />
              )}
              
              {/* Display all ratings */}
              {product.ratings && product.ratings.length > 0 && (
                <div className="card border-0 shadow-sm mt-4">
                  <div className="card-body p-3 p-md-4">
                    <h5 className="card-title mb-4">Customer Reviews</h5>
                    
                    {product.ratings.map((rating, index) => (
                      <div key={index} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between mb-2">
                          <div>
                            <span className="text-warning me-2">
                              {rating.value} ★
                            </span>
                            <small className="text-muted">
                              {new Date(rating.date).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="mb-0">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">Product not found</div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;