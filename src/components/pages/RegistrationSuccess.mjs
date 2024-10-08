import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationSuccess = () => {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center feature-box">
            <div className="text-center">
                <h1 className="display-4 text-success">Registration Successful!</h1>
                <p className="fs-3 text-warning">Please activate your account.</p>
                <p className="lead">
                    A confirmation link has been sent to your email address. <br className="d-none d-sm-block"/>Please click on that link to activate your account.
                </p>
                <Link to="/" className="btn btn-primary">Back to Homepage</Link>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
