'use client';

import { useState } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  role: 'STUDENT' | 'PROFESSOR' | 'ALUMNI';
}

export default function EditProfile({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  role,
}: EditProfileModalProps) {
  const [localData, setLocalData] = useState(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = { ...localData, [e.target.name]: e.target.value };
    setLocalData(updated);
    setFormData(updated); // sync with parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-lg bg-opacity-50 shadow-2xl flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Edit {role.toLowerCase()} Profile</h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto ">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={localData.firstName || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={localData.lastName || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="university"
            placeholder="University"
            value={localData.university || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="date"
            name="birthdate"
            placeholder="Birthdate"
            value={localData.birthdate ? localData.birthdate.slice(0, 10) : ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
      
          {role === 'STUDENT' && (
            <>
              <input
                type="text"
                name="formation"
                placeholder="Formation"
                value={localData.formation || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              
            </>
          )}

          {role === 'PROFESSOR' && (
            <>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={localData.subject || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="rank"
                placeholder="Rank"
                value={localData.rank || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </>
          )}

          {role === 'ALUMNI' && (
            <>
              <input
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={localData.occupation || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={localData.degree || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="graduationYear"
                placeholder="Graduation Year"
                value={localData.graduationYear || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
          className="bg-red-700 hover:bg-gray-100 hover:border-2 hover:border-b-red-900 hover:text-red-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(localData)}
          className="bg-blue-900 hover:bg-gray-100 hover:border-2 hover:border-b-blue-900 hover:text-blue-900 text-white px-4 h-10 rounded-lg font-semibold  flex items-center justify-center"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
