import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const OAuth2Redirect: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            localStorage.setItem('token', token);
            window.location.href = '/projects'; 
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-stone-900">Logging you in...</h2>
                <p className="text-stone-500 mt-2">Securing your session with Google.</p>
            </div>
        </div>
    );
};
