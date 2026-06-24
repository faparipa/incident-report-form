import React from 'react';
import { IncidentRecord } from '../types/incident';

interface MobileRecordCardProps {
  record: IncidentRecord;
}

export const MobileRecordCard: React.FC<MobileRecordCardProps> = ({
  record,
}) => (
  <div className='bg-white p-4 rounded-lg shadow border border-gray-200 space-y-2 text-sm text-gray-900 box-border'>
    <div className='flex justify-between items-start border-b pb-2'>
      <span className='font-bold text-indigo-600'>{record.incidentType}</span>
      <span className='text-xs text-gray-500'>
        {record.date} {record.time}
      </span>
    </div>
    <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600'>
      <div>
        <span className='font-semibold text-gray-700'>Direction:</span>{' '}
        {record.entryExit}
      </div>
      <div>
        <span className='font-semibold text-gray-700'>Nationality:</span>{' '}
        <span className='uppercase'>{record.nationality}</span>
      </div>
      <div>
        <span className='font-semibold text-gray-700'>Age/Gender:</span>{' '}
        {record.age || '-'} / {record.gender || '-'}
      </div>
    </div>
    <div className='mt-3 p-2.5 bg-slate-50 border border-gray-200 rounded text-xs font-mono text-gray-800 select-all cursor-pointer'>
      <p className='font-sans font-bold text-gray-400 mb-1 uppercase tracking-wider text-[9px]'>
        Generated Report (Tap to select):
      </p>
      {record.report}
    </div>
  </div>
);
