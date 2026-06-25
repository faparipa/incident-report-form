import * as XLSX from 'xlsx';
import { IncidentRecord } from '../types/incident';

export const exportAllRecordsToExcel = (records: IncidentRecord[]) => {
  if (records.length === 0) return;

  // 1. Az adatok átalakítása az Excel sorainak megfelelő formátumba
  const rows = records.map((record) => {
    // Összerakjuk a részletek mezőt úgy, ahogy a táblázatban is megjelent
    let details = '-';
    if (record.incidentType === 'Overstay') {
      details = `Days: ${record.overstayDays || '-'}, Ban: ${
        record.banTime || '-'
      }`;
    } else if (record.incidentType === 'Refusal of Entry') {
      details = `Reason: ${record.reason || '-'}`;
    } else if (record.incidentType.startsWith('Hit in Database')) {
      details = `Hit: ${record.reason || '-'} (${
        record.docuType || 'ID'
      }), Country: ${record.seizingCountry || 'ROU'}`;
    } else if (record.incidentType === 'Smuggling of goods') {
      details = `Goods: ${record.whatGoods || '-'}, Amt: ${
        record.amountGoods || '-'
      }`;
    } else if (record.incidentType === 'Stolen Vehicles') {
      details = `Vehicle: ${record.carType || '-'} (${
        record.carColor || '-'
      }), Reg: ${record.carRegisteredCountry || '-'}`;
    }

    return {
      'Generated Report': record.report || '',
      'Incident Type': record.incidentType,
      Date: record.date,
      Time: record.time || '',
      Direction: record.entryExit || '',
      Nationality: record.nationality?.toUpperCase() || '',
      Age: record.age ? `${record.age} y/o` : '-',
      Gender: record.gender || '-',
      'Specific Details': details,
    };
  });

  // 2. Új munkalap (Worksheet) létrehozása az adatokból
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 3. Új munkafüzet (Workbook) létrehozása
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Incident Reports');

  // 4. Oszlopszélességek automatikus igazítása, hogy ne vágja le a szöveget
  const maxWp = [
    { wch: 50 },
    { wch: 25 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 8 },
    { wch: 10 },
    { wch: 40 },
  ];
  worksheet['!cols'] = maxWp;

  // 5. Letöltés indítása a böngészőben
  const fileName = `All_Incident_Reports_${
    new Date().toISOString().split('T')[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
