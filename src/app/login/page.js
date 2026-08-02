'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Firebase Login Logic එක පස්සේ මෙතනට එකතු කරන්න පුළුවන්
        alert(`Logging in with: ${email}`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f9fafb', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

                {/* Viola Gifts Brand Logo */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
                    <div style={{ width: "54px", height: "54px", borderRadius: "50%", backgroundColor: "#f472b6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(244,114,182,0.4)", marginBottom: "12px" }}>
                        <span style={{ fontSize: "26px" }}>🎁</span>
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.5px", margin: 0 }}>Viola Gifts</h2>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#9333ea", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>Crafted With Love</span>
                </div>
                {/* Title */}
                <h2 style={{ fontSize: '26px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', color: '#111827', fontFamily: 'serif' }}>
                    Welcome Back
                </h2>
                <p style={{ textTransform: 'none', color: '#6b7280', textAlign: 'center', fontSize: '14px', marginBottom: '32px' }}>
                    Please enter your details to sign in
                </p>

                {/* Form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                                Password
                            </label>
                            <a href="#" style={{ fontSize: '12px', color: '#9333ea', textDecoration: 'none', fontWeight: '500' }}>
                                Forgot password?
                            </a>
                        </div>
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
                        style={{ width: '100%', backgroundColor: '#111827', color: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' }}
                    >
                        Sign In
                    </button>
                </form>

                {/* Register Link */}
                <p style={{ textTransform: 'none', textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
}