'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        // Firebase Registration Logic එක මෙතනට එකතු කරන්න පුළුවන්
        alert(`Account created for: ${name} (${email})`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f9fafb', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

                {/* Title */}
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', color: '#111827', fontFamily: 'serif' }}>
                    Create Account
                </h2>
                <p style={{ textTransform: 'none', color: '#6b7280', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>
                    Sign up to get started with Viola Gifts
                </p>

                {/* Form */}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Full Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{ width: '100%', backgroundColor: '#111827', color: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '10px' }}
                    >
                        Sign Up
                    </button>
                </form>

                {/* Login Link */}
                <p style={{ textTransform: 'none', textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}
