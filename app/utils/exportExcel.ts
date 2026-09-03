import * as XLSX from 'xlsx';
import { IncidentRecord } from '../types/incident';

export const exportAllRecordsToExcel = (records: IncidentRecord[]) => {
  if (records.length === 0 && !localStorage.getItem('dailyTrafficLogs')) return;

  const rows = records.map((record, index) => {
    const formattedDate = record.date ? record.date.replace(/-/g, '.') : '';

    let details = '-';
    if (record.incidentType.startsWith('Hit in Database')) {
      details = `Hit: SIS 38 (Id), Country: ${record.seizingCountry || 'POL'}`;
    } else if (record.incidentType === 'Overstay') {
      details = `Days: ${record.overstayDays || '-'}, Ban: ${
        record.banTime || '-'
      }`;
    } else if (record.incidentType === 'Refusal of Entry') {
      details = `Reason: ${record.reason || '-'}`;
    } else if (record.incidentType === 'Smuggling of goods') {
      details = `Goods: ${record.whatGoods || '-'}, Amt: ${
        record.amountGoods || '-'
      }`;
    } else if (record.incidentType === 'Stolen Vehicles') {
      details = `Vehicle: ${record.carType || '-'} (${
        record.carColor || '-'
      }), Reg: ${record.carRegisteredCountry || '-'}`;
    } else if (record.otherDetails) {
      details = record.otherDetails;
    }

    return {
      'Tasks assigned in BCP/FP per profile': 'First line border checks',
      'No. of Incid.': 1,
      'Incidents type': record.incidentType,
      'Persons/ Migrants': 1,
      'Nationalities / Role of person': record.nationality?.toUpperCase() || '',
      'JORA Number': 'N/A',
      'Frontex involvement': 'NO',
      'Ref No.': index + 1,
      'Generated Report': record.report || '',
      ' ': '', // <-- ÚJ: Üres oszlop beszúrása (a kulcs egy szóköz, az érték üres string)
      Date: formattedDate,
      Time: record.time || '',
      Direction: record.entryExit || '',
      Age: record.age ? `${record.age}y/o` : '-',
      Gender: record.gender ? record.gender.toLowerCase() : '-',
      'Specific Details': details,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  if (typeof window !== 'undefined') {
    const savedTraffic = localStorage.getItem('dailyTrafficLogs');
    if (savedTraffic) {
      try {
        const trafficLogs = JSON.parse(savedTraffic);

        if (trafficLogs.length > 0) {
          const startRow = rows.length > 0 ? rows.length + 5 : 2;

          const latestLog = trafficLogs[trafficLogs.length - 1];
          const formattedTrafficDate = latestLog.date
            ? latestLog.date.replace(/-/g, '.')
            : '';

          const trafficRowsLayout = [
            ['DAILY BORDER TRAFFIC SUMMARIES', formattedTrafficDate], // Cím + Dátum
            ['Total Entry Traffic', Number(latestLog.entry) || 0], // Belépő adat
            ['Total Exit Traffic', Number(latestLog.exit) || 0], // Kilépő adat
          ];

          // Beillesztés a munkalapra a kiszámolt kezdősortól
          XLSX.utils.sheet_add_aoa(worksheet, [['']], {
            origin: `A${startRow - 1}`,
          }); // Biztonsági üres sor
          XLSX.utils.sheet_add_aoa(worksheet, trafficRowsLayout, {
            origin: `A${startRow}`,
          });
        }
      } catch (e) {
        console.error('Hiba a forgalmi adatok exportálásakor:', e);
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Incident & Traffic Report'
  );

  // 5. Oszlopszélességek igazítása (beillesztve az üres oszlop szélessége is)
  const maxWp = [
    { wch: 32 }, // Tasks assigned in BCP/FP per profile
    { wch: 12 }, // No. of Incid.
    { wch: 25 }, // Incidents type
    { wch: 16 }, // Persons/ Migrants
    { wch: 25 }, // Nationalities / Role of person
    { wch: 12 }, // JORA Number
    { wch: 18 }, // Frontex involvement
    { wch: 10 }, // Ref No.
    { wch: 65 }, // Generated Report
    { wch: 5 }, // <-- ÚJ: Az üres oszlop szélessége (keskeny elválasztó sáv)
    { wch: 14 }, // Date
    { wch: 10 }, // Time
    { wch: 12 }, // Direction
    { wch: 10 }, // Age
    { wch: 10 }, // Gender
    { wch: 45 }, // Specific Details
  ];
  worksheet['!cols'] = maxWp;

  const rowHeights = [];

  rowHeights[0] = { hpt: 40 };
  for (let i = 1; i <= rows.length; i++) {
    rowHeights[i] = { hpt: 22 };
  }

  worksheet['!rows'] = rowHeights;

  const todayFormatted = new Date()
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '.');
  const fileName = `Incident_and_Traffic_Report_${todayFormatted}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
