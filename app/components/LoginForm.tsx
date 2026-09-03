'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-slate-200'>
        <h2 className='text-2xl font-bold text-center text-slate-800 mb-6'>
          {isRegistering ? 'Create Account' : 'Border Incident Tracker Login'}
        </h2>

        {error && (
          <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-black'
              placeholder='user@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2.5 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-black'
              placeholder='••••••••'
            />
          </div>

          <button
            type='submit'
            className='w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow transition-colors'
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <button
            type='button'
            onClick={() => setIsRegistering(!isRegistering)}
            className='text-sm text-indigo-600 hover:underline'
          >
            {isRegistering
              ? 'Already have an account? Sign in'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
