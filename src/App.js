import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './css/App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import ToggleThemeButton from './components/ToggleThemeButton';
import HeaderNavbar from './components/HeaderNavbar';
import FooterNavbar from './components/FooterNavbar';

function App() {

  return (
    <Router>
      <ThemeProvider>
        <div className="App">
          <HeaderNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Navigate replace to="/feed" />} />
              <Route path="/feed" element={<News />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/qrcodes" element={<QRCodes />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/gifts" element={<Gifts />} />
            </Routes>
          </main>
          <FooterNavbar />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;

// Dummy components for the route targets
const News = () => (
  <div>
    <h1>News Page</h1>
    <ToggleThemeButton />  {/* Theme toggle button included */}
  </div>
);
const Tickets = () => <div>Tickets Page</div>;
const QRCodes = () => <div>QR Codes Page</div>;
const Messaging = () => <div>Messaging Page</div>;
const Gifts = () => <div>Gifts Page</div>;
