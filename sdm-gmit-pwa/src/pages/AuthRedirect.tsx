import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';
import axios from 'axios';

/**
 * Intermediary page that redirects users to their role-based dashboard.
 * This page ensures the session is fully established before fetching the role.
 */
export default function AuthRedirect() {
    const { data: session, isPending } = useSession();
    const navigate = useNavigate();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (isPending || hasRedirected) return;

        if (!session) {
            // Not authenticated, go to login
            navigate('/login', { replace: true });
            return;
        }

        // Session is established, now fetch the role
        const fetchRole = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`}/api/user/role`, {
                    withCredentials: true
                });
                const role = res.data.role;

                setHasRedirected(true);

                if (role === 'enumerator') {
                    navigate('/enumerator', { replace: true });
                } else if (role === 'pendamping') {
                    navigate('/pendamping', { replace: true });
                } else {
                    navigate('/admin', { replace: true });
                }
            } catch {
                // Fallback to admin
                setHasRedirected(true);
                navigate('/admin', { replace: true });
            }
        };

        fetchRole();
    }, [session, isPending, hasRedirected, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 text-sm font-medium">Memuat dashboard...</p>
            </div>
        </div>
    );
}
