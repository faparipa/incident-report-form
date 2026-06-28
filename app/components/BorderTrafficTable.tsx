'use client';

import { BorderTrafficTableProps } from '../types/incident';

export function BorderTrafficTable({
  trafficLogs,
  onClear,
}: BorderTrafficTableProps) {
  if (trafficLogs.length === 0) return null;

  return (
    <div className='w-full bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 shadow-sm'>
      <div className='flex justify-between items-center mb-3 border-b border-emerald-200 pb-1.5'>
        <h3 className='text-sm font-bold text-emerald-900 uppercase tracking-wider'>
          Saved Daily Traffic Summaries
        </h3>
        <button
          onClick={onClear}
          className='px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow transition-colors cursor-pointer'
        >
          Clear Traffic Logs
        </button>
      </div>
      <div className='overflow-x-auto rounded border border-emerald-200 bg-white'>
        <table className='min-w-full divide-y divide-emerald-200 text-sm text-left text-gray-700'>
          <thead className='bg-emerald-100/70 text-emerald-900 font-semibold'>
            <tr>
              <th className='px-4 py-2'>Date</th>
              <th className='px-4 py-2'>Total Entry</th>
              <th className='px-4 py-2'>Total Exit</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {trafficLogs.map((log, index) => (
              <tr
                key={index}
                className='hover:bg-emerald-50/30 transition-colors'
              >
                <td className='px-4 py-2 font-medium text-gray-900'>
                  {log.date}
                </td>
                <td className='px-4 py-2 text-emerald-700 font-semibold'>
                  {log.entry}
                </td>
                <td className='px-4 py-2 text-indigo-700 font-semibold'>
                  {log.exit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
