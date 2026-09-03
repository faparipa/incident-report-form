'use client';

import { useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import IncidentForm from './components/IncidentForm';

export default function Home() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
        Report Form
      </h1>
      <div className='max-w-7xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border'>
        <div>
          <span className='text-sm text-gray-500'>Logged in as:</span>
          <span className='ml-2 font-medium text-slate-800'>{user.email}</span>
        </div>
        <button
          onClick={logout}
          className='px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-md shadow transition-colors'
        >
          Sign Out
        </button>
      </div>

      <IncidentForm />
    </div>
  );
}
