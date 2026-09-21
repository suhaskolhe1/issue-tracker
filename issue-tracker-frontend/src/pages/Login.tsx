import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUser } from '../features/auth/authService';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await loginUser({ email, password });

            localStorage.setItem('token', response.token);

            window.location.href = '/projects';

        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials or server error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-stone-200 rounded-sm p-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-stone-900 mb-2">Sign In</h1>
                    <p className="text-stone-600">Enter your credentials to access the platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@company.com"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-sm text-sm">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
