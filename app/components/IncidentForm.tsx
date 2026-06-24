'use client';

import React, { useState, useEffect } from 'react';

import { IncidentRecord } from '../types/incident';
import { getTodayDateString } from '../utils/date';

import { FormLabel } from '../components/FormLabel';
import { DesktopRecordsTable } from '../components/DesktopTable';
import { MobileRecordCard } from '../components/MobileCard';
import { generateReport } from '../utils/reportgenerator';

export default function IncidentForm() {
  const [formData, setFormData] = useState<IncidentRecord>({
    incidentType: '',
    date: '',
    time: '',
    entryExit: '',
    nationality: '',
    gender: '',
    age: '',
    reason: '',
    overstayDays: '',
    penalty: '',
    banTime: '',
    carColor: '',
    carType: '',
    carOld: '',
    carRegisteredCountry: '',
    docuType: '',
    whatGoods: '',
    amountGoods: '',
    whereFounded: '',
    parensOld: '',
    parentGender: '',
  });

  const [submittedRecords, setSubmittedRecords] = useState<IncidentRecord[]>(
    []
  );

  useEffect(() => {
    setFormData((prev) => ({ ...prev, date: getTodayDateString() }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedText = generateReport(formData);
    setSubmittedRecords((prev) => [
      ...prev,
      { ...formData, report: generatedText },
    ]);

    setFormData({
      incidentType: '',
      date: getTodayDateString(),
      time: '',
      entryExit: '',
      nationality: '',
      gender: '',
      age: '',
      reason: '',
      overstayDays: '',
      penalty: '',
      banTime: '',
      carColor: '',
      carType: '',
      carOld: '',
      carRegisteredCountry: '',
      docuType: '',
      whatGoods: '',
      amountGoods: '',
      whereFounded: '',
      parensOld: '',
      parentGender: '',
    });
  };

  const isMinor = formData.age !== '' && parseInt(formData.age, 10) < 18;
  const inputClasses =
    'mt-1 block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base box-border';

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6 sm:space-y-10 box-border overflow-hidden'>
      <div className='w-full bg-white shadow-md rounded-lg p-4 sm:p-6 border border-gray-200 box-border'>
        <h2 className='text-xl sm:text-2xl font-bold mb-6 text-gray-900 border-b pb-2'>
          Incident Registration Form
        </h2>

        <form onSubmit={handleSubmit} className='space-y-6 w-full'>
          {/* INCIDENT INFORMATION */}
          <div className='w-full'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>
              Incident Information
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
              <div className='flex flex-col w-full'>
                <FormLabel label='Incident Type' required />
                <select
                  name='incidentType'
                  required
                  value={formData.incidentType}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value=''>Select type...</option>
                  <option value='Hit in Database'>Hit in Database</option>
                  <option value='Refusal of Entry'>Refusal of Entry</option>
                  <option value='Overstay'>Overstay</option>
                  <option value='Administrative'>Administrative</option>
                  <option value='Asylum Request'>Asylum Request</option>
                  <option value='Avoiding Border Control'>
                    Avoiding Border Control
                  </option>
                  <option value='Document Fraud'>Document Fraud</option>
                  <option value='FTF Suspicious Travel'>
                    FTF Suspicious Travel
                  </option>
                  <option value='Hiding in Transportation Means/Clandestine'>
                    Hiding in Transportation Means/Clandestine
                  </option>
                  <option value='Hit in Database – related to Terrorist / Extremist activities'>
                    Hit in Database – related to Terrorist / Extremist
                    activities
                  </option>
                  <option value='Illegal Border- Crossing'>
                    Illegal Border- Crossing
                  </option>
                  <option value='Readmission'>Readmission</option>
                  <option value='Smuggling of goods'>Smuggling of goods</option>
                  <option value='Stolen Vehicles'>Stolen Vehicles</option>
                  <option value='Trafficking in Human Beings'>
                    Trafficking in Human Beings
                  </option>
                  <option value='Other'>Other</option>
                </select>
              </div>

              <div className='grid grid-cols-2 gap-2 w-full'>
                <div className='flex flex-col w-full'>
                  <FormLabel label='Date' required />
                  <input
                    type='date'
                    name='date'
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
                <div className='flex flex-col w-full'>
                  <FormLabel label='Time' required />
                  <input
                    type='time'
                    name='time'
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className='flex flex-col w-full'>
                <FormLabel label='Entry / Exit' required />
                <select
                  name='entryExit'
                  required
                  value={formData.entryExit}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value=''>Select direction...</option>
                  <option value='Entry'>Entry</option>
                  <option value='Exit'>Exit</option>
                </select>
              </div>
            </div>
          </div>

          <hr className='border-gray-200' />

          {/* PERSONAL DETAILS */}
          <div className='w-full'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>
              Personal Details &amp; Enforcement
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full'>
              <div className='flex flex-col w-full'>
                <FormLabel label='Nationality' required />
                <input
                  type='text'
                  name='nationality'
                  placeholder='e.g., ROU, MDL, SRB'
                  required
                  value={formData.nationality}
                  onChange={handleChange}
                  className={`${inputClasses} uppercase`}
                />
              </div>

              <div className='flex flex-col w-full'>
                <FormLabel label='Gender' />
                <select
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value=''>Select...</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
              </div>

              <div className='flex flex-col w-full'>
                <FormLabel label='Age (y/o)' />
                <input
                  type='number'
                  name='age'
                  min='0'
                  placeholder='65'
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {formData.incidentType === 'Overstay' && (
                <>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Overstay / Day' />
                    <input
                      type='number'
                      name='overstayDays'
                      min='0'
                      value={formData.overstayDays}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Penalty (RON)' />
                    <input
                      type='number'
                      name='penalty'
                      min='0'
                      value={formData.penalty}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Ban Time' />
                    <input
                      type='text'
                      name='banTime'
                      placeholder='e.g., 12 months'
                      value={formData.banTime}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </>
              )}

              {formData.incidentType !== 'Overstay' &&
                formData.incidentType !== '' && (
                  <div className='flex flex-col w-full col-span-1 sm:col-span-2'>
                    <FormLabel label='Reason / Article' />
                    <input
                      type='text'
                      name='reason'
                      placeholder='e.g., SIS Art. 38, Reason F'
                      value={formData.reason}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                )}

              {formData.incidentType.startsWith('Hit in Database') && (
                <div className='flex flex-col w-full'>
                  <FormLabel label='Docu Type' />
                  <input
                    type='text'
                    name='docuType'
                    placeholder='e.g., ID, Passport'
                    value={formData.docuType}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC COMPANION SECTION */}
          {formData.incidentType === 'Refusal of Entry' && isMinor && (
            <>
              <hr className='border-gray-200' />
              <div className='w-full'>
                <h3 className='text-base sm:text-lg font-bold text-red-700 mb-4'>
                  Travelling Companion (Parent Details)
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Parent Gender' />
                    <select
                      name='parentGender'
                      value={formData.parentGender}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value=''>Select...</option>
                      <option value='female'>Mother</option>
                      <option value='male'>Father</option>
                    </select>
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Parent Age (y/o)' />
                    <input
                      type='number'
                      name='parensOld'
                      min='0'
                      value={formData.parensOld}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* DYNAMIC SMUGGLING SECTION */}
          {formData.incidentType === 'Smuggling of goods' && (
            <>
              <hr className='border-gray-200' />
              <div className='w-full'>
                <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>
                  Smuggled Goods Details
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full'>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='What Goods' />
                    <input
                      type='text'
                      name='whatGoods'
                      placeholder='e.g., Cigarettes'
                      value={formData.whatGoods}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Amount / Quantity' />
                    <input
                      type='text'
                      name='amountGoods'
                      placeholder='e.g., 200 packs'
                      value={formData.amountGoods}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Where Founded' />
                    <input
                      type='text'
                      name='whereFounded'
                      placeholder='e.g., luggage under the cloths'
                      value={formData.whereFounded}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className='pt-4 w-full'>
            <button
              type='submit'
              className='w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer'
            >
              Add Incident Record
            </button>
          </div>
        </form>
      </div>

      {/* LOGS OUTPUT */}
      {submittedRecords.length > 0 && (
        <div className='space-y-4 w-full'>
          <h2 className='text-lg sm:text-xl font-bold text-gray-900 px-1'>
            Registered Incidents Logs
          </h2>
          <DesktopRecordsTable records={submittedRecords} />
          <div className='block lg:hidden space-y-4 w-full box-border'>
            {submittedRecords.map((record, index) => (
              <MobileRecordCard key={index} record={record} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
