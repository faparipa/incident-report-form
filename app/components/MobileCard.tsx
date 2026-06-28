import { MobileRecordCardProps } from '../types/incident';

export function MobileRecordCard({
  record,
  index,
  onEdit,
}: MobileRecordCardProps) {
  return (
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

      {record.incidentType === 'Stolen Vehicles' && (
        <div className='bg-slate-50 p-2.5 rounded border border-gray-200 text-xs text-gray-700 space-y-0.5 shadow-sm'>
          <p className='font-bold text-indigo-600 uppercase tracking-wider text-[9px] mb-1'>
            Vehicle Details:
          </p>
          <div>
            <span className='font-semibold text-gray-600'>Brand/Model:</span>{' '}
            {record.carType || '-'}
          </div>
          <div>
            <span className='font-semibold text-gray-600'>Color / Age:</span>{' '}
            {record.carColor || '-'} /{' '}
            {record.carOld ? `${record.carOld} y/o` : '-'}
          </div>
          <div>
            <span className='font-semibold text-gray-600'>Registered in:</span>{' '}
            <span className='uppercase font-medium'>
              {record.carRegisteredCountry || '-'}
            </span>
          </div>
        </div>
      )}

      <div className='mt-3 p-2.5 bg-slate-50 border border-gray-200 rounded text-xs font-mono text-gray-800 select-all cursor-pointer'>
        <p className='font-sans font-bold text-gray-400 mb-1 uppercase tracking-wider text-[9px]'>
          Generated Report (Tap to select):
        </p>
        {record.report}
      </div>

      <div className='pt-2 flex justify-end border-t border-gray-100'>
        <button
          onClick={() => onEdit(index)}
          className='px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded shadow transition-colors cursor-pointer'
        >
          Edit
        </button>
      </div>
    </div>
  );
}
