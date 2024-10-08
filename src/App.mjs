import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Footer from './components/common/Footer.mjs';
import ForgetPassword from './components/features/authentication/ForgetPassword.mjs';
import ForgetUsername from './components/features/authentication/ForgetUsername.mjs';
import ResendActivation from './components/features/authentication/ResendActivation.mjs';
import ResetPassword from './components/features/authentication/ResetPassword.mjs';
import SignIn from './components/features/authentication/SignIn.mjs';
import SignUp from './components/features/authentication/SignUp.mjs';
import Ticketing from './components/features/ticketing/Ticketing.mjs';
import Feed from './components/features/user/Feed.mjs';
import Profile from './components/features/user/Profile.mjs';
import PublicUserFooterNavbar from './components/layout/public/FooterNavbar.mjs';
import PublicUserHeaderNavbar from './components/layout/public/HeaderNavbar.mjs';
import UserFooterNavbar from './components/layout/users/FooterNavbar.mjs';
import UserHeaderNavbar from './components/layout/users/HeaderNavbar.mjs';
import NotFound from './components/pages/NotFound.mjs';
import RegistrationSuccess from './components/pages/RegistrationSuccess.mjs';
import UnderConstruction from './components/pages/UnderConstruction.mjs';
import { ThemeProvider } from './contexts/ThemeContext.mjs';
import { UserProvider, useUser } from './contexts/UserContext.mjs';
import './scss/App.scss';


const infoRoutes = () => [
  <Route key="about" path="/about" element={<UnderConstruction />} />,
  <Route key="accessibility" path="/accessibility" element={<UnderConstruction />} />,
  <Route key="user-agreement" path="/user-agreement" element={<UnderConstruction />} />,
  <Route key="privacy" path="/privacy" element={<UnderConstruction />} />,
  <Route key="cookie-policy" path="/cookie-policy" element={<UnderConstruction />} />,
  <Route key="copyright" path="/copyright" element={<UnderConstruction />} />,
  <Route key="brand" path="/brand" element={<UnderConstruction />} />
];


const AppContent = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!user || !user.token) {
    const redirectTo = `${location.pathname}${location.search}`;
    const signInPath = `/signin?redirect=${encodeURIComponent(redirectTo)}`;

    return (
    <>
      <PublicUserHeaderNavbar />
      <main className='py-5'>
        <Routes>
          <Route path="/" element={<Navigate replace to={signInPath} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/forgot-username" element={<ForgetUsername />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/resend-activation" element={<ResendActivation />} />
          <Route path="/news" element={<UnderConstruction />} />
          <Route path="/tickets" element={<UnderConstruction />} />
          <Route path="/qrcodes" element={<UnderConstruction />} />
          {infoRoutes()}
          <Route path="*" element={<Navigate replace to={signInPath} />} />
        </Routes>
      </main>
      <Footer />
      <PublicUserFooterNavbar />
    </>
    );
  } else {
    return (
      <div className="d-flex flex-column min-vh-100">
        <UserHeaderNavbar />
        <main className='my-5'>
          <Routes>
            <Route path="/" element={<Navigate replace to="/feed" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/new-ticket/:stepId" element={<Ticketing />} />
            <Route path="/news" element={<UnderConstruction />} />
            <Route path="/tickets" element={<UnderConstruction />} />
            <Route path="/qrcodes" element={<UnderConstruction />} />
            <Route path="/messaging" element={<UnderConstruction />} />
            <Route path="/gifts" element={<UnderConstruction />} />
            {infoRoutes()}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <UserFooterNavbar />
      </div>
    );
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









