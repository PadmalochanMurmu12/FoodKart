import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Headers from './components/Headers';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import CartDetails from './components/CartDetails';
import Success from './components/Success';
import Cancel from './components/Cancel';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Dynamically update the document title based on the current route
    switch (location.pathname) {
      case '/':
        document.title = "Food-Kart | Best Meals in Town";
        break;
      case '/menu':
        document.title = "Explore Menus | Food-Kart"; 
        break;
      case '/cart':
        document.title = "Checkout Your Cart | Food-Kart";
        break;
      case '/success':
        document.title = "Order Confirmed | Food-Kart";
        break;
      case '/cancel':
        document.title = "Payment Cancelled | Food-Kart";
        break;
      default:
        document.title = "Food-Kart"; // Fallback for 404s or unmapped routes
    }
  }, [location.pathname]);

  return (
    <>
      {/* Logic: Hide Header ONLY on the root Landing Page */}
      {location.pathname !== '/' && <Headers />}
      
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/menu' element={<Home />} />
        <Route path='/cart' element={<CartDetails />} />
        <Route path='/success' element={<Success />} />
        <Route path='/cancel' element={<Cancel />} />
      </Routes>
      
      <Toaster />
    </>
  );
}

export default App;