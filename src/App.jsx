import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProductDetail from "./pages/ProductDetail"; // Add this import!
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Get the base path - use environment variable or default to empty string for local dev
  const basePath = import.meta.env.BASE_URL || "/zyntic-frontend";
  
  // Check for authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;
    
    // If user is authenticated and trying to access login/signup, redirect to home
    if (token && (currentPath.endsWith("/login") || currentPath.endsWith("/signup") || 
                  currentPath === "/" || currentPath === basePath + "/")) {
      window.location.href = basePath ? `${basePath}/` : "/";
    }
  }, [basePath]);
  
  return (
    <Router basename={basePath}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
             { <div>
                {/* <NavBar /> */}
                <ProductList />
              </div>}
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <div>
                <NavBar />
                <ProductForm />
              </div>
            </ProtectedRoute>
          }
        />
        {/* Product detail route */}
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <div>
                <NavBar />
                <ProductForm />
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Fallback route - redirect authenticated users to home, others to login */}
        <Route 
          path="*" 
          element={
            localStorage.getItem("token") 
              ? <Navigate to="/" /> 
              : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;