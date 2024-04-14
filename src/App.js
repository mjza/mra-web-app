import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './css/App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import ToggleThemeButton from './components/ToggleThemeButton';
import HeaderNavbar from './components/HeaderNavbar';
import FooterNavbar from './components/FooterNavbar';
import Login from './components/Login';
import Logout from './components/Logout';
import NotFound from './components/NotFound';

const AppContent = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}`;
    const loginPath = `/login?redirect=${encodeURIComponent(redirectTo)}`;

    return <>
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate replace to={loginPath} />} />
        </Routes>
      </main>
    </>;
  } else {
    return <>
      <HeaderNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/feed" />} />
          <Route path="/feed" element={<News />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/qrcodes" element={<QRCodes />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <FooterNavbar />
    </>;
  }
};

const App = () => {

  return (
    <Router>
      <ThemeProvider>
        <UserProvider>
          <div className="App">
            <AppContent />
          </div>
        </UserProvider>
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
    <Logout />
  </div>
);
const Tickets = () => <div>Tickets Page</div>;
const QRCodes = () => <div>QR Codes Page</div>;
const Messaging = () => <div>Messaging Page</div>;
const Gifts = () => <div>Gifts Page</div>;
