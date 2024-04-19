import React from 'react';
import { Link } from 'react-router-dom';

const UnderConstruction = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-danger">Under Construction</h1>
                <p className="fs-3 text-warning">We're working on it!</p>
                <p className="lead">
                    This page is currently under construction. We are working hard to improve your experience.
                    Check back soon for updates!
                </p>
                <Link to="/" className="btn btn-primary">Back to Homepage</Link>
            </div>
        </div>
    );
};

export default UnderConstruction;
