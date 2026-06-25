import React from 'react';
import { IncidentRecord } from '../types/incident';

interface DesktopRecordsTableProps {
  records: IncidentRecord[];
}

export const DesktopRecordsTable: React.FC<DesktopRecordsTableProps> = ({
  records,
}) => (
  <div className='hidden lg:block bg-white shadow-md rounded-lg p-6 border border-gray-200 overflow-x-auto w-full'>
    <table className='min-w-full divide-y divide-gray-200 text-sm text-left text-gray-900'>
      <thead className='bg-gray-50 text-xs uppercase font-semibold text-gray-700'>
        <tr>
          <th className='px-4 py-3 min-w-95'>
            Generated Narrative Report (Click to select)
          </th>
          <th className='px-4 py-3 whitespace-nowrap'>Incident Type</th>
          <th className='px-4 py-3 whitespace-nowrap'>Date &amp; Time</th>
          <th className='px-4 py-3 whitespace-nowrap'>Dir.</th>
          <th className='px-4 py-3 whitespace-nowrap'>Nat.</th>
          <th className='px-4 py-3 whitespace-nowrap'>Age/Gen</th>
          <th className='px-4 py-3 whitespace-nowrap'>Details / Reason</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-gray-200 bg-white'>
        {records.map((record, index) => (
          <tr key={index} className='hover:bg-gray-50 transition-colors'>
            <td className='px-4 py-3 text-xs bg-slate-50 font-mono text-gray-700 border-r border-gray-200 select-all cursor-pointer leading-relaxed'>
              {record.report}
            </td>
            <td className='px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap'>
              {record.incidentType}
            </td>
            <td className='px-4 py-3 whitespace-nowrap text-gray-500'>
              {record.date} <span className='text-xs'>{record.time}</span>
            </td>
            <td className='px-4 py-3 whitespace-nowrap'>{record.entryExit}</td>
            <td className='px-4 py-3 font-medium whitespace-nowrap uppercase'>
              {record.nationality}
            </td>
            <td className='px-4 py-3 whitespace-nowrap capitalize'>
              {record.age ? `${record.age} y/o` : '-'} (
              {record.gender ? record.gender.charAt(0) : '-'})
            </td>

            {/* JAVÍTVA: Minden plusz részlet egyetlen szigorú <td> cellán belülre került */}
            <td className='px-4 py-3 text-xs text-gray-600'>
              {record.incidentType === 'Overstay' &&
                `Days: ${record.overstayDays}, Ban: ${record.banTime}`}
              {record.incidentType === 'Refusal of Entry' &&
                `Reason: ${record.reason}`}
              {record.incidentType.startsWith('Hit in Database') &&
                `Hit: ${record.reason} (${record.docuType || 'ID'})`}
              {record.incidentType === 'Smuggling of goods' &&
                `Goods: ${record.whatGoods}, Amt: ${record.amountGoods}`}
              {record.incidentType === 'Stolen Vehicles' &&
                `Vehicle: ${record.carType || '-'} (${
                  record.carColor || '-'
                }), Reg: ${record.carRegisteredCountry?.toUpperCase() || '-'}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
