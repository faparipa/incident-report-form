import { useState, useEffect } from 'react';
import { IncidentRecord, TrafficLogItem } from '../types/incident';
import { getTodayDateString } from './date';
import { generateReport } from './reportgenerator';
import { INITIAL_FORM_DATA } from './constants';
import { db } from './firebase';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export function useIncidentForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<IncidentRecord>(INITIAL_FORM_DATA);
  const [submittedRecords, setSubmittedRecords] = useState<IncidentRecord[]>(
    []
  );
  const [trafficLogs, setTrafficLogs] = useState<TrafficLogItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  // 1. VALÓS IDEJŰ ADATBÁZIS FIGYELÉS (Incidensek user-id alapján)
  useEffect(() => {
    if (!user) {
      setSubmittedRecords([]);
      return;
    }

    const q = query(
      collection(db, 'incidents'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (IncidentRecord & { id: string; createdAt?: string })[];

        // Kliensoldali rendezés createdAt szerint csökkenő sorrendbe (legújabb elöl)
        records.sort((a, b) => {
          const dateA = a.createdAt || '';
          const dateB = b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setSubmittedRecords(records);
      },
      (error) => {
        console.error('Firestore incidents stream error:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 2. VALÓS IDEJŰ ADATBÁZIS FIGYELÉS (Forgalmi adatok user-id alapján)
  useEffect(() => {
    if (!user) {
      setTrafficLogs([]);
      return;
    }

    const q = query(
      collection(db, 'trafficLogs'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => doc.data() as TrafficLogItem);

        // Kliensoldali rendezés dátum szerint csökkenő sorrendbe
        logs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

        setTrafficLogs(logs);
        localStorage.setItem('dailyTrafficLogs', JSON.stringify(logs));
      },
      (error) => {
        console.error('Firestore trafficLogs stream error:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

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
    if (!user) return;

    const generatedText = generateReport(formData);
    const recordWithReport = {
      ...formData,
      userId: user.uid,
      report: generatedText,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingIndex > -1) {
        // Szerkesztés
        const targetRecord = submittedRecords[editingIndex] as any;
        if (targetRecord.id) {
          const docRef = doc(db, 'incidents', targetRecord.id);
          await updateDoc(docRef, recordWithReport);
        }
        setEditingIndex(-1);
      } else {
        // Új rekord
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

  // 4. SAJÁT FORGALMI NAPLÓK TÖRLÉSE
  const handleClearTrafficLogs = async () => {
    if (!user) return;
    if (window.confirm('Delete all saved traffic logs?')) {
      try {
        localStorage.removeItem('dailyTrafficLogs');
        setTrafficLogs([]);

        const q = query(
          collection(db, 'trafficLogs'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map((document) =>
          deleteDoc(doc(db, 'trafficLogs', document.id))
        );
        await Promise.all(deletePromises);
      } catch (error) {
        console.error('Hiba a forgalmi adatok törlésekor:', error);
      }
    }
  };

  // 5. SAJÁT ÖSSZES ADAT TÖRLÉSE
  const handleClearAll = async () => {
    if (!user) return;
    if (
      window.confirm(
        'Are you sure you want to delete ALL your registered incidents and daily traffic logs?'
      )
    ) {
      try {
        setSubmittedRecords([]);
        localStorage.removeItem('incidentRecords');
        localStorage.removeItem('dailyTrafficLogs');

        // Csak a saját incidensek törlése
        const qIncidents = query(
          collection(db, 'incidents'),
          where('userId', '==', user.uid)
        );
        const incidentsSnapshot = await getDocs(qIncidents);
        const deleteIncidentsPromises = incidentsSnapshot.docs.map((document) =>
          deleteDoc(doc(db, 'incidents', document.id))
        );
        await Promise.all(deleteIncidentsPromises);

        // Csak a saját forgalmi adatok törlése
        const qTraffic = query(
          collection(db, 'trafficLogs'),
          where('userId', '==', user.uid)
        );
        const trafficSnapshot = await getDocs(qTraffic);
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
