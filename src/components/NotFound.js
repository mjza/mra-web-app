import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Oops!</span> Page not found.</p>
                <p className="lead">
                    The page you are looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>
                <Link to="/" className="btn btn-primary">Go to Homepage</Link>
            </div>
        </div>
    );
};

export default NotFound;
