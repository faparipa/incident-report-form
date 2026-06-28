import { IncidentRecordsListProps } from '../types/incident';

import { exportAllRecordsToExcel } from '../utils/exportExcel';

export function DesktopRecordsTable({
  records,
  onEdit,
}: IncidentRecordsListProps) {
  return (
    <div className='space-y-4 w-full'>
      {/* EXCEL LETÖLTÉS GOMB */}
      <div className='flex justify-end'>
        <button
          onClick={() => exportAllRecordsToExcel(records)}
          disabled={records.length === 0}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm  rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer font-semibold'
        >
          📊 Download All to Excel ({records.length})
        </button>
      </div>
      <div className='hidden lg:block w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
        <table className='min-w-full divide-y divide-gray-200 bg-white text-sm'>
          <thead className='bg-gray-50 text-left font-semibold text-gray-900'>
            <tr>
              <th className='px-4 py-3'>Generated Report</th>
              <th className='px-4 py-3'>Type</th>
              <th className='px-4 py-3'>Date/Time</th>
              <th className='px-4 py-3'>Dir</th>
              <th className='px-4 py-3'>Nat</th>
              <th className='px-4 py-3'>Age/Gen</th>
              <th className='px-4 py-3'>Details</th>
              <th className='px-4 py-3 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {records.map((record, index) => (
              <tr key={index} className='hover:bg-gray-50 transition-colors'>
                <td className='px-4 py-3 text-xs bg-slate-50 font-mono text-gray-700 border-r border-gray-200 select-all cursor-pointer leading-relaxed max-w-xs truncate'>
                  {record.report}
                </td>
                <td className='px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap'>
                  {record.incidentType}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-gray-500'>
                  {record.date} <span className='text-xs'>{record.time}</span>
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-gray-700'>
                  {record.entryExit}
                </td>
                <td className='px-4 py-3 font-medium whitespace-nowrap text-gray-700 uppercase'>
                  {record.nationality}
                </td>
                <td className='px-4 py-3 whitespace-nowrap text-gray-700 capitalize'>
                  {record.age ? `${record.age} y/o` : '-'} (
                  {record.gender ? record.gender.charAt(0) : '-'})
                </td>
                <td className='px-4 py-3 text-xs text-gray-700'>
                  {record.incidentType === 'Overstay' &&
                    `Days: ${record.overstayDays}, Ban: ${record.banTime}`}
                  {record.incidentType === 'Refusal of Entry' &&
                    `Reason: ${record.reason}`}
                  {record.incidentType.startsWith('Hit in Database') &&
                    `Hit: ${record.reason} (${record.docuType || 'ID'})`}
                  {record.incidentType === 'Smuggling of goods' &&
                    `Goods: ${record.whatGoods}, Amt: ${record.amountGoods}`}
                  {record.incidentType === 'Stolen Vehicles' &&
                    `Vehicle: ${record.carType || '-'}, Reg: ${
                      record.carRegisteredCountry?.toUpperCase() || '-'
                    }`}
                </td>
                <td>
                  <button
                    onClick={() => onEdit(index)}
                    className='px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded shadow transition-colors cursor-pointer'
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
