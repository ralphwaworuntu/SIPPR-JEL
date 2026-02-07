
import { useState } from 'react';
import { signUp } from '../lib/auth-client';

const SeedUser = () => {
    const [status, setStatus] = useState('Ready');

    const handleSeed = async () => {
        setStatus('Seeding...');
        try {
            await signUp.email({
                email: 'admin@gmitemaus.org',
                password: 'admin',
                name: 'Admin User'
            }, {
                onSuccess: () => {
                    setStatus('Success: User created!');
                },
                onError: (ctx) => {
                    setStatus(`Error: ${ctx.error.message}`);
                }
            });
        } catch (e: any) {
            setStatus(`Exception: ${e.message}`);
        }
    };

    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Seed Admin User</h1>
            <p className="mb-4">Status: {status}</p>
            <button
                onClick={handleSeed}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Create Admin User
            </button>
        </div>
    );
};

export default SeedUser;
