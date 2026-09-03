import { useState, useEffect } from 'react';
import { IncidentRecord, TrafficLogItem } from '../types/incident';
import { getTodayDateString } from '../utils/date';
import { generateReport } from '../utils/reportgenerator';
import { INITIAL_FORM_DATA } from './constants';
import { db } from '../utils/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

export function useIncidentForm() {
  const [formData, setFormData] = useState<IncidentRecord>(INITIAL_FORM_DATA);
  const [submittedRecords, setSubmittedRecords] = useState<IncidentRecord[]>(
    []
  );
  const [trafficLogs, setTrafficLogs] = useState<TrafficLogItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  // 1. VALÓS IDEJŰ ADATBÁZIS FIGYELÉS (Incidensek)
  useEffect(() => {
    const q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (IncidentRecord & { id: string })[];

      setSubmittedRecords(records);
    });

    return () => unsubscribe();
  }, []);

  // 2. VALÓS IDEJŰ ADATBÁZIS FIGYELÉS (Forgalmi adatok)
  useEffect(() => {
    const q = query(collection(db, 'trafficLogs'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => doc.data() as TrafficLogItem);
      setTrafficLogs(logs);
      localStorage.setItem('dailyTrafficLogs', JSON.stringify(logs));
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(submittedRecords[index]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setFormData({ ...INITIAL_FORM_DATA, date: getTodayDateString() });
  };

  // 3. MENTÉS ÉS MÓDOSÍTÁS FELHŐBE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const generatedText = generateReport(formData);
    const recordWithReport = {
      ...formData,
      report: generatedText,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingIndex > -1) {
        // MÓDOSÍTÁS MÓD
        const targetRecord = submittedRecords[editingIndex] as any;
        if (targetRecord.id) {
          const docRef = doc(db, 'incidents', targetRecord.id);
          await updateDoc(docRef, recordWithReport);
        }
        setEditingIndex(-1);
      } else {
        // ÚJ REKORD MÓD
        await addDoc(collection(db, 'incidents'), {
          ...recordWithReport,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Hiba a mentés során: ', error);
    }

    setFormData({ ...INITIAL_FORM_DATA, date: getTodayDateString() });
  };

  // 4. FORGALMI NAPLÓK TÖRLESE
  const handleClearTrafficLogs = async () => {
    if (window.confirm('Delete all saved traffic logs?')) {
      try {
        localStorage.removeItem('dailyTrafficLogs');
        setTrafficLogs([]);

        // Törlés a Firestore-ból is
        const querySnapshot = await getDocs(collection(db, 'trafficLogs'));
        const deletePromises = querySnapshot.docs.map((document) =>
          deleteDoc(doc(db, 'trafficLogs', document.id))
        );
        await Promise.all(deletePromises);
      } catch (error) {
        console.error('Hiba a forgalmi adatok törlésekor:', error);
      }
    }
  };

  // 5. ÖSSZES ADAT TÖRLÉSE (INCIDENSEK + FORGALOM)
  const handleClearAll = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL registered incidents and daily traffic logs?'
      )
    ) {
      try {
        setSubmittedRecords([]);
        localStorage.removeItem('incidentRecords');
        localStorage.removeItem('dailyTrafficLogs');

        // Incidensek törlése Firestore-ból
        const incidentsSnapshot = await getDocs(collection(db, 'incidents'));
        const deleteIncidentsPromises = incidentsSnapshot.docs.map((document) =>
          deleteDoc(doc(db, 'incidents', document.id))
        );
        await Promise.all(deleteIncidentsPromises);

        // Forgalom törlése Firestore-ból
        const trafficSnapshot = await getDocs(collection(db, 'trafficLogs'));
        const deleteTrafficPromises = trafficSnapshot.docs.map((document) =>
          deleteDoc(doc(db, 'trafficLogs', document.id))
        );
        await Promise.all(deleteTrafficPromises);
      } catch (error) {
        console.error('Hiba az adatok törlésekor:', error);
      }
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
    loadTrafficLogs: () => {},
  };
}
