import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center feature-box">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <p className="fs-3 text-warning">Oops! Page not found.</p>
                <p className="lead">
                    The page you are looking for might have been removed, <br className="d-none d-sm-block"/>
                    had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/" className="btn btn-primary">Go to Homepage</Link>
            </div>
        </div>
    );
};

export default NotFound;
