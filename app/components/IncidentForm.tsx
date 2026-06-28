'use client';

import { COUNTRY_CODES } from '../utils/countryCodes';
import { FormLabel } from '../components/FormLabel';
import { DesktopRecordsTable } from '../components/DesktopTable';
import { MobileRecordCard } from '../components/MobileCard';
import { BorderTrafficCounters } from './BorderTrafficCounters';
import { BorderTrafficTable } from './BorderTrafficTable';
import { useIncidentForm } from '../utils/useIncidentForm';
import { INCIDENT_TYPES } from '../utils/constants';

export default function IncidentForm() {
  const {
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
  } = useIncidentForm();

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
                  {INCIDENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
                  placeholder='e.g., ROU'
                  required
                  maxLength={3}
                  value={formData.nationality}
                  onChange={handleChange}
                  list='nationality-list'
                  className={`${inputClasses} uppercase font-semibold`}
                />
                <datalist id='nationality-list'>
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </datalist>
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
                      placeholder='e.g., SIS Art. 38'
                      value={formData.reason}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                )}

              {formData.incidentType.startsWith('Hit in Database') && (
                <>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Docu Type' />
                    <input
                      type='text'
                      name='docuType'
                      placeholder='e.g., ID'
                      value={formData.docuType}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Seizing Country Code' />
                    <input
                      type='text'
                      name='seizingCountry'
                      maxLength={3}
                      value={formData.seizingCountry}
                      onChange={handleChange}
                      className={`${inputClasses} uppercase font-semibold`}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DYNAMIC SECTIONS */}
          {isMinor && (
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
                      placeholder='Cigarettes'
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
                      placeholder='200 packs'
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
                      placeholder='luggage'
                      value={formData.whereFounded}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {formData.incidentType === 'Stolen Vehicles' && (
            <>
              <hr className='border-gray-200' />
              <div className='w-full'>
                <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>
                  Stolen Vehicle Details
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full'>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Vehicle Brand / Model' />
                    <input
                      type='text'
                      name='carType'
                      placeholder='BMW X5'
                      value={formData.carType}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Vehicle Color' />
                    <input
                      type='text'
                      name='carColor'
                      placeholder='Black'
                      value={formData.carColor}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Vehicle Age (Years)' />
                    <input
                      type='number'
                      name='carOld'
                      min='0'
                      placeholder='5'
                      value={formData.carOld}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className='flex flex-col w-full'>
                    <FormLabel label='Registered Country' />
                    <input
                      type='text'
                      name='carRegisteredCountry'
                      placeholder='DEU'
                      value={formData.carRegisteredCountry}
                      onChange={handleChange}
                      className={`${inputClasses} uppercase`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <hr className='border-gray-200' />

          <div className='w-full'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-4'>
              Additional Information
            </h3>
            <div className='flex flex-col w-full'>
              <FormLabel label='Other Details / Remarks / Actions Taken' />
              <textarea
                name='otherDetails'
                rows={3}
                placeholder='Enter any other relevant information...'
                value={formData.otherDetails}
                onChange={handleChange}
                className='mt-1 block w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base box-border resize-y'
              />
            </div>
          </div>

          <div className='pt-4 w-full flex flex-col sm:flex-row gap-3'>
            <button
              type='submit'
              className={`w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-semibold rounded-md text-white transition-colors cursor-pointer ${
                editingIndex > -1
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {editingIndex > -1
                ? 'Update & Regenerate Report'
                : 'Add Incident Record'}
            </button>

            {editingIndex > -1 && (
              <button
                type='button'
                onClick={handleCancelEdit}
                className='w-full sm:w-auto inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-base font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer'
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <BorderTrafficCounters onRefresh={loadTrafficLogs} />

      {submittedRecords.length > 0 && (
        <div className='space-y-4 w-full'>
          <div className='flex justify-between items-center px-1'>
            <h2 className='text-lg sm:text-xl font-bold text-gray-300'>
              Registered Incidents Logs
            </h2>
            <button
              onClick={handleClearAll}
              className='px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xm font-semibold rounded shadow transition-colors cursor-pointer'
            >
              Clear All Logs
            </button>
          </div>

          <DesktopRecordsTable
            records={submittedRecords}
            onEdit={handleStartEdit}
          />

          <div className='block lg:hidden space-y-4 w-full box-border'>
            {submittedRecords.map((record, index) => (
              <MobileRecordCard
                key={index}
                record={record}
                index={index}
                onEdit={handleStartEdit}
              />
            ))}
          </div>
        </div>
      )}
      <BorderTrafficTable
        trafficLogs={trafficLogs}
        onClear={handleClearTrafficLogs}
      />
    </div>
  );
}
