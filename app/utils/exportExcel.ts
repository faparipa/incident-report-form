// import * as XLSX from 'xlsx';
// import { IncidentRecord } from '../types/incident';

// export const exportAllRecordsToExcel = (records: IncidentRecord[]) => {
//   if (records.length === 0) return;

//   // 1. Az adatok átalakítása az Excel sorainak megfelelő formátumba
//   const rows = records.map((record) => {
//     // Összerakjuk a részletek mezőt úgy, ahogy a táblázatban is megjelent
//     let details = '-';
//     if (record.incidentType === 'Overstay') {
//       details = `Days: ${record.overstayDays || '-'}, Ban: ${
//         record.banTime || '-'
//       }`;
//     } else if (record.incidentType === 'Refusal of Entry') {
//       details = `Reason: ${record.reason || '-'}`;
//     } else if (record.incidentType.startsWith('Hit in Database')) {
//       details = `Hit: ${record.reason || '-'} (${
//         record.docuType || 'ID'
//       }), Country: ${record.seizingCountry || 'ROU'}`;
//     } else if (record.incidentType === 'Smuggling of goods') {
//       details = `Goods: ${record.whatGoods || '-'}, Amt: ${
//         record.amountGoods || '-'
//       }`;
//     } else if (record.incidentType === 'Stolen Vehicles') {
//       details = `Vehicle: ${record.carType || '-'} (${
//         record.carColor || '-'
//       }), Reg: ${record.carRegisteredCountry || '-'}`;
//     }

//     return {
//       'Generated Report': record.report || '',
//       'Incident Type': record.incidentType,
//       Date: record.date,
//       Time: record.time || '',
//       Direction: record.entryExit || '',
//       Nationality: record.nationality?.toUpperCase() || '',
//       Age: record.age ? `${record.age} y/o` : '-',
//       Gender: record.gender || '-',
//       'Specific Details': details,
//     };
//   });

//   // 2. Új munkalap (Worksheet) létrehozása az adatokból
//   const worksheet = XLSX.utils.json_to_sheet(rows);

//   // 3. Új munkafüzet (Workbook) létrehozása
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Incident Reports');

//   // 4. Oszlopszélességek automatikus igazítása, hogy ne vágja le a szöveget
//   const maxWp = [
//     { wch: 50 },
//     { wch: 25 },
//     { wch: 12 },
//     { wch: 10 },
//     { wch: 10 },
//     { wch: 12 },
//     { wch: 8 },
//     { wch: 10 },
//     { wch: 40 },
//   ];
//   worksheet['!cols'] = maxWp;

//   // 5. Letöltés indítása a böngészőben
//   const fileName = `All_Incident_Reports_${
//     new Date().toISOString().split('T')[0]
//   }.xlsx`;
//   XLSX.writeFile(workbook, fileName);
// };
import * as XLSX from 'xlsx';
import { IncidentRecord } from '../types/incident';

export const exportAllRecordsToExcel = (records: IncidentRecord[]) => {
  // Akkor is engedjük az exportálást, ha csak forgalmi adat van, de incidens nincs
  if (records.length === 0 && !localStorage.getItem('dailyTrafficLogs')) return;

  // 1. Incidens adatok átalakítása
  const rows = records.map((record) => {
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

  // 2. Alap munkalap létrehozása az incidensekből
  // Ha nincs incidens, egy üres tömbből hozzuk létre a fejléc megtartásával
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 3. Forgalmi adatok beolvasása és hozzáadása az incidensek ALÁ
  if (typeof window !== 'undefined') {
    const savedTraffic = localStorage.getItem('dailyTrafficLogs');
    if (savedTraffic) {
      try {
        const trafficLogs = JSON.parse(savedTraffic);

        if (trafficLogs.length > 0) {
          // Kiszámoljuk, melyik sorba fűzzük hozzá (incidensek száma + a fejléc + 3 üres sor elválasztásnak)
          const startRow = rows.length > 0 ? rows.length + 4 : 2;

          // Címke/Fejléc a különálló táblázatnak
          XLSX.utils.sheet_add_aoa(
            worksheet,
            [
              [''], // Első üres elválasztó sor
              ['DAILY BORDER TRAFFIC SUMMARIES'], // Második sor: Táblázat címe
              ['Date', 'Total Entry Traffic', 'Total Exit Traffic'], // Harmadik sor: Oszlopfejlécek
            ],
            { origin: `A${startRow - 2}` }
          );

          // A tényleges forgalmi adatok formázása a kis táblázathoz
          const trafficRows = trafficLogs.map((log: any) => [
            log.date,
            Number(log.entry) || 0,
            Number(log.exit) || 0,
          ]);

          // Forgalmi sorok beszúrása az oszlopfejlécek alá
          XLSX.utils.sheet_add_aoa(worksheet, trafficRows, {
            origin: `A${startRow + 1}`,
          });
        }
      } catch (e) {
        console.error('Hiba a forgalmi adatok exportálásakor:', e);
      }
    }
  }

  // 4. Új munkafüzet (Workbook) létrehozása és a munkalap hozzáadása
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Incident & Traffic Report'
  );

  // 5. Oszlopszélességek igazítása
  const maxWp = [
    { wch: 50 }, // Generated Report
    { wch: 25 }, // Incident Type (Ide esik majd a Traffic Date is)
    { wch: 18 }, // Date (Ide esik az Entry Traffic)
    { wch: 18 }, // Time (Ide esik az Exit Traffic)
    { wch: 10 },
    { wch: 12 },
    { wch: 8 },
    { wch: 10 },
    { wch: 40 },
  ];
  worksheet['!cols'] = maxWp;

  // 6. Letöltés indítása
  const fileName = `Incident_and_Traffic_Report_${
    new Date().toISOString().split('T')[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
