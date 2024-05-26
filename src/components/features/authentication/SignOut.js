import React, { useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import ConfirmDialog from '../../common/ConfirmDialog';
import LoadingOverlay from '../../ui/LoadingOverlay';
import { logoutService } from '../../../services/auth';

const SignOut = () => {
    const { user, logout } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '', type: 'primary' });
    const performLogout = () => {
        setIsRedirecting(true);
        setShowDialog(false);
        setLoading(false);
    };

    const handleLogout = async () => {
        if (!user || !user.token) {
            setIsRedirecting(true); // Redirect if there's no user to log out
            return;
        }

        try {
            setLoading(true);
            const { token } = user;
            if (logout()) {
                await logoutService(token);
            }
            performLogout();
        } catch (error) {
            setDialogContent({
                title: 'Logout Failed',
                message: error.message,
                type: 'danger'
            });
            setLoading(false);
            setShowDialog(true);
        }
    };

    if (isRedirecting) {
        return <Navigate to="/signin" replace={true} />;
    }

    return (
        <div className="container m-0 p-0">
            {loading && <LoadingOverlay />}
            {showDialog &&
                <ConfirmDialog
                    show={showDialog}
                    onHide={performLogout}
                    onConfirm={performLogout}
                    title={dialogContent.title}
                    message={dialogContent.message}
                    type={dialogContent.type}
                    onCancel={null}
                />
            }
            <button className="btn btn-danger w-100" onClick={handleLogout} disabled={loading}>
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        &nbsp;Sign out...
                    </>
                ) : "Sign out"}
            </button>
        </div>
    );
};

export default SignOut;
