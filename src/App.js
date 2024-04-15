import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './css/App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import ToggleThemeButton from './components/ui/ToggleThemeButton';
import PublicUserHeaderNavbar from './components/layout/public/HeaderNavbar';
import PublicUserFooterNavbar from './components/layout/public/FooterNavbar';
import UserHeaderNavbar from './components/layout/users/HeaderNavbar';
import UserFooterNavbar from './components/layout/users/FooterNavbar';
import SignIn from './components/features/authentication/SignIn';
import SignOut from './components/features/authentication/SignOut';
import NotFound from './components/pages/NotFound';

const AppContent = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    const redirectTo = `${location.pathname}${location.search}`;
    const signInPath = `/signin?redirect=${encodeURIComponent(redirectTo)}`;

    return <>
      <PublicUserHeaderNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to={signInPath} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Empty />} />
          <Route path="/forgot-password" element={<Empty />} />
          <Route path="/reset-password" element={<Empty />} />
          <Route path="/forgot_username" element={<Empty />} />
          <Route path="/news" element={<Empty />} />
          <Route path="/tickets" element={<Empty />} />
          <Route path="/qrcodes" element={<Empty />} />
          <Route path="*" element={<Navigate replace to={signInPath} />} />
        </Routes>
      </main>
      <PublicUserFooterNavbar />
    </>;
  } else {
    return <>
      <UserHeaderNavbar />
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
      <UserFooterNavbar />
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
  <div className='mh-100 py-5 feature-row'>
    <h1>News Page</h1>
    <ToggleThemeButton />  {/* Theme toggle button included */}
    <SignOut />
  </div>
);
const Tickets = () => <div>Tickets Page</div>;
const QRCodes = () => <div>QR Codes Page</div>;
const Messaging = () => <div>Messaging Page</div>;
const Gifts = () => <div>Gifts Page</div>;
const Empty = () => <div>Reserved for work</div>;
