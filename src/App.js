import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './css/App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import PublicUserHeaderNavbar from './components/layout/public/HeaderNavbar';
import PublicUserFooterNavbar from './components/layout/public/FooterNavbar';
import Footer from './components/common/Footer';
import UserHeaderNavbar from './components/layout/users/HeaderNavbar';
import UserFooterNavbar from './components/layout/users/FooterNavbar';
import SignIn from './components/features/authentication/SignIn';
import SignUp from './components/features/authentication/SignUp';
import SignOut from './components/features/authentication/SignOut';
import ForgetUsername from './components/features/authentication/ForgetUsername';
import ForgetPassword from './components/features/authentication/ForgetPassword';
import ResetPassword from './components/features/authentication/ResetPassword';
import NotFound from './components/pages/NotFound';
import UnderConstruction from './components/pages/UnderConstruction';
import RegistrationSuccess from './components/pages/RegistrationSuccess';
import Media from './components/ui/Media';

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

    return <>
      <PublicUserHeaderNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to={signInPath} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/forgot-username" element={<ForgetUsername />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/news" element={<UnderConstruction />} />
          <Route path="/tickets" element={<UnderConstruction />} />
          <Route path="/qrcodes" element={<UnderConstruction />} />
          {infoRoutes()}
          <Route path="*" element={<Navigate replace to={signInPath} />} />
        </Routes>
      </main>
      <Footer />
      <PublicUserFooterNavbar />
    </>;
  } else {
    return <>
      <UserHeaderNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/feed" />} />
          <Route path="/feed" element={<News />} />
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
const News = () => {
  const [mediaUrl, setMediaUrl] = useState(null);//"https://mra-public-bucket.s3.us-east-2.amazonaws.com/images/ca/d1/u46/240517201127005-3576-248e-a2a3-org.jpg");

  const handleDelete = () => {
    setMediaUrl(null);
    // Additional logic for handling delete, e.g., removing from server
    console.log('Media deleted');
  };
  return (
    <div className='mh-100 py-5 feature-row'>
      <h1>&nbsp;</h1>
      <Media
        countryISOCode="ca"
        domain="1"
        acceptedTypes="images"  // Accepted file types
        initialUrl={mediaUrl}  // Initial media URL, if any
        onDelete={handleDelete}  // Callback function for handling delete
      />
      <SignOut />
    </div>
  );
};






