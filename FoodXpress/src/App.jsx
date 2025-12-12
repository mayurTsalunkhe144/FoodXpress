import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import './styles/global.css'

// Module imports
import { Navbar, Header, HomePage } from './modules/home-navigation';
import { ErrorBoundary } from './shared';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <ErrorBoundary>
      <Navbar />
      {isHomePage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<div>Menu Page - Coming Soon</div>} />
        <Route path="/restaurants" element={<div>Restaurants Page - Coming Soon</div>} />
        <Route path="/offers" element={<div>Offers Page - Coming Soon</div>} />
        <Route path="/cart" element={<div>Cart Page - Coming Soon</div>} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
