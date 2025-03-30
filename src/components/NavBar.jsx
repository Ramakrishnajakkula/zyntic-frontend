import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get user info from localStorage
    const userString = localStorage.getItem('user');
    console.log("NavBar: Raw user string from localStorage:", userString);
    
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        console.log("NavBar: Parsed user data:", userData);
        console.log("NavBar: User role:", userData.role);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);
  
  const isAdmin = user?.role === 'admin';
  console.log("NavBar: isAdmin =", isAdmin);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{ backgroundColor: "white" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ color: "rgb(255, 112, 67)" }}>
          Zynetic
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen ? "true" : "false"} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active fw-bold' : ''}`}
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/products' ? 'active fw-bold' : ''}`}
                to="/products"
                onClick={() => setIsMenuOpen(false)}
              >
                Product List
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/products/new' ? 'active fw-bold' : ''}`}
                  to="/products/new"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Product
                </Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {user && (
              <span className="me-3 text-muted d-none d-md-block">
                <small>
                  {user.username} 
                  {isAdmin && <span className="ms-1 badge bg-secondary">Admin</span>}
                </small>
              </span>
            )}
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;