import React from 'react';

interface FormLabelProps {
  label: string;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ label, required }) => (
  <label className='block text-sm font-semibold text-gray-900 mb-1'>
    {label} {required && <span className='text-red-500'>*</span>}
  </label>
);
