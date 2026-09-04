'use client';

import React, { useState, useEffect } from 'react';
import { FormLabel } from './FormLabel';
import { getTodayDateString } from '../utils/date';
import { BorderTrafficCountersProps } from '../types/incident';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';

export function BorderTrafficCounters({
  onRefresh,
}: BorderTrafficCountersProps) {
  const { user } = useAuth();
  const [trafficStats, setTrafficStats] = useState({
    dailyEntryTraffic: '',
    dailyExitTraffic: '',
  });

  useEffect(() => {
    const savedCurrent = localStorage.getItem('currentTrafficInput');
    if (savedCurrent) {
      try {
        setTrafficStats(JSON.parse(savedCurrent));
      } catch (e) {}
    }
  }, []);

  const handleTrafficChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...trafficStats, [name]: value };
    setTrafficStats(updated);
    localStorage.setItem('currentTrafficInput', JSON.stringify(updated));
  };

  const handleSaveTraffic = async () => {
    if (!user) {
      alert('Please log in first!');
      return;
    }

    if (!trafficStats.dailyEntryTraffic && !trafficStats.dailyExitTraffic) {
      alert('Please fill in entry or exit traffic before saving!');
      return;
    }

    const today = getTodayDateString();
    const entryVal = Number(trafficStats.dailyEntryTraffic) || 0;
    const exitVal = Number(trafficStats.dailyExitTraffic) || 0;

    try {
      // 1. Mentés a Firestore-ba a BEJELENTKEZETT USER ID-JÁVAL
      await addDoc(collection(db, 'trafficLogs'), {
        userId: user.uid,
        date: today,
        entry: entryVal,
        exit: exitVal,
        createdAt: new Date().toISOString(),
      });

      // 2. Form alaphelyzetbe állítása
      setTrafficStats({ dailyEntryTraffic: '', dailyExitTraffic: '' });
      localStorage.removeItem('currentTrafficInput');

      // 3. Szülő értesítése
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Hiba a forgalom mentésekor:', error);
      alert('Failed to save traffic stats to database.');
    }
  };

  const inputClasses =
    'mt-1 block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base box-border';

  return (
    <div className='w-full bg-slate-50 shadow-md rounded-lg p-4 sm:p-6 border border-slate-200 box-border'>
      <div className='border-b pb-2 mb-4'>
        <h2 className='text-lg sm:text-xl font-bold text-slate-900'>
          End of Day Border Traffic Counters
        </h2>
        <p className='text-xs text-gray-500 mt-0.5'>
          Enter total traffic numbers at the end of the shift.
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4'>
        <div className='flex flex-col w-full'>
          <FormLabel label='Total Entry Traffic' />
          <input
            type='number'
            name='dailyEntryTraffic'
            min='0'
            placeholder='e.g., 1420'
            value={trafficStats.dailyEntryTraffic}
            onChange={handleTrafficChange}
            className={inputClasses}
          />
        </div>
        <div className='flex flex-col w-full'>
          <FormLabel label='Total Exit Traffic' />
          <input
            type='number'
            name='dailyExitTraffic'
            min='0'
            placeholder='e.g., 1185'
            value={trafficStats.dailyExitTraffic}
            onChange={handleTrafficChange}
            className={inputClasses}
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <button
          type='button'
          onClick={handleSaveTraffic}
          className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow transition-colors cursor-pointer text-sm'
        >
          Save Traffic Stats
        </button>
      </div>
    </div>
  );
}
