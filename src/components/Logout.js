import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import LoadingOverlay from './LoadingOverlay';

const Logout = () => {
    const { user, logout } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '', type: 'primary' });

    const handleLogout = async () => {
        if (!user) {
            setIsRedirecting(true); // Redirect if there's no user to log out
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('https://auth.myreport.app/v1/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                setLoading(false);
                setDialogContent({
                    title: 'Logout Failed',
                    message: data.message || 'Failed to logout.',
                    type: 'danger'
                });
                setShowDialog(true);
            } else {
                performLogout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            setDialogContent({
                title: 'Error',
                message: 'Network or server error during logout.',
                type: 'danger'
            });
            setLoading(false);
            setShowDialog(true);
        }
    };

    const performLogout = () => {
        logout();
        setLoading(false);
        setIsRedirecting(true);
        setShowDialog(false);
    };

    if (isRedirecting) {
        return <Navigate to="/login" replace={true} />;
    }

    return (
        <div className="container mt-5">
            {loading && <LoadingOverlay />}
            {showDialog &&
                <ConfirmDialog
                    show={showDialog}
                    onHide={performLogout}
                    onConfirm={performLogout}
                    title={dialogContent.title}
                    message={dialogContent.message}
                    type={dialogContent.type}
                    onCancel={null}  // Not providing onCancel to make the dialog only dismissible
                />
            }
            <button className="btn btn-danger" onClick={handleLogout} disabled={loading}>
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        &nbsp;Logout...
                    </>
                ) : "Logout"}
            </button>
        </div>
    );
};

export default Logout;
