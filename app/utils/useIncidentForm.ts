import { useState, useEffect } from 'react';
import { IncidentRecord, TrafficLogItem } from '../types/incident';
import { getTodayDateString } from '../utils/date';
import { generateReport } from '../utils/reportgenerator';
import { INITIAL_FORM_DATA } from './constants';

export function useIncidentForm() {
  const [formData, setFormData] = useState<IncidentRecord>(INITIAL_FORM_DATA);
  const [submittedRecords, setSubmittedRecords] = useState<IncidentRecord[]>(
    []
  );
  const [trafficLogs, setTrafficLogs] = useState<TrafficLogItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const loadTrafficLogs = () => {
    const saved = localStorage.getItem('dailyTrafficLogs');
    setTrafficLogs(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, date: getTodayDateString() }));
    const savedRecords = localStorage.getItem('incidentRecords');
    if (savedRecords) setSubmittedRecords(JSON.parse(savedRecords));
    loadTrafficLogs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ÚJ: Szerkesztés elindítása (visszatöltés a formba)
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(submittedRecords[index]);
    // Automatikusan felgördítjük a felhasználót az űrlap tetejére
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ÚJ: Szerkesztés megszakítása
  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setFormData({ ...INITIAL_FORM_DATA, date: getTodayDateString() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // A report GENERÁLÁSA MINDIG AZ ÚJ ADATOK ALAPJÁN TÖRTÉNIK
    const generatedText = generateReport(formData);
    const recordWithReport = { ...formData, report: generatedText };

    let updatedRecords = [...submittedRecords];

    if (editingIndex > -1) {
      // MODOSÍTÁS MÓD: Kicseréljük az adott indexen lévő elemet
      updatedRecords[editingIndex] = recordWithReport;
      setEditingIndex(-1); // Kilépünk a szerkesztésből
    } else {
      // ÚJ REKORD MÓD: Hozzáadjuk a listához
      updatedRecords.push(recordWithReport);
    }

    setSubmittedRecords(updatedRecords);
    localStorage.setItem('incidentRecords', JSON.stringify(updatedRecords));

    // Form alaphelyzetbe állítása
    setFormData({ ...INITIAL_FORM_DATA, date: getTodayDateString() });
  };

  const handleClearTrafficLogs = () => {
    if (window.confirm('Delete all saved traffic logs?')) {
      localStorage.removeItem('dailyTrafficLogs');
      loadTrafficLogs();
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL registered incidents and daily traffic logs?'
      )
    ) {
      setSubmittedRecords([]);
      localStorage.removeItem('incidentRecords');
      localStorage.removeItem('dailyTrafficLogs');
      loadTrafficLogs();
    }
  };

  const isMinor = formData.age !== '' && parseInt(formData.age, 10) < 18;

  return {
    formData,
    submittedRecords,
    trafficLogs,
    isMinor,
    editingIndex,
    handleStartEdit,
    handleCancelEdit,
    handleChange,
    handleSubmit,
    handleClearTrafficLogs,
    handleClearAll,
    loadTrafficLogs,
  };
}
