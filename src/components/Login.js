import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoadingOverlay from './LoadingOverlay';

const Login = () => {
    const { login } = useUser();
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Parse the URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        const response = await fetch('https://auth.myreport.app/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        setLoading(false);

        if (response.status === 200) {
            login(data);
            navigate(redirect, { replace: true });
        } else {
            setError(data.message || 'Login failed, please try again.');
        }
    };

    return (
        <div className="container">
            {loading && <LoadingOverlay />}
            <form className="mt-5" onSubmit={handleSubmit}>
                <h2 className="mb-3">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="usernameOrEmail" className="form-label">Username or Email</label>
                    <input
                        type="text"
                        className="form-control"
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        value={credentials.usernameOrEmail}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            &nbsp;Login...
                        </>
                    ) : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
