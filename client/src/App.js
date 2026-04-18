import { Routes, Route, useLocation } from 'react-router-dom';
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