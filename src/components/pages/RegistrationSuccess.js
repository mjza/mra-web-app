import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-4">Registration Successful!</h1>
                <p className="fs-3">Please activate your account.</p>
                <p className="lead">
                    A confirmation link has been sent to your email address. Please click on that link to activate your account.
                </p>
                <Link to="/" className="btn btn-primary">Back to Homepage</Link>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
