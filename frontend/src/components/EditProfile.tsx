'use client';

import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import {
  getUserProfileAndPosts,
  UserProfile,
  updateProfile
} from '@/lib/profile-actions';

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
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = { ...localData, [e.target.name]: e.target.value };
    setLocalData(updated);
    setFormData(updated); // sync with parent
  };

  const handleProfilePicUpload = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // or session.accessToken if passed
        },
        body: formDataUpload,
      });

      const data = await res.json();
      const url = data.url.startsWith('http')
        ? data.url
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.url}`;

      const updated = { ...localData, profilePicture: url };
      setLocalData(updated);
      setFormData(updated);
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 bg-opacity-40 backdrop-blur-sm shadow-2xl flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Edit {role.toLowerCase()} Profile</h2>

        {/* ✅ Profile Picture Upload Section */}
        <div className="flex flex-col items-center gap-2 mb-4">
          {localData.profilePicture ? (
            <img
              src={localData.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}
          <label className="cursor-pointer text-sm text-gray-800 ">
            {uploading ? 'Uploading...' : 'Click to Change Photo'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleProfilePicUpload(file);
              }}
            />
          </label>
        </div>

        {/* ✅ Form Inputs */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
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

          {/* Conditionally Render Role-Specific Inputs */}
          {role === 'STUDENT' && (
            <input
              type="text"
              name="formation"
              placeholder="Formation"
              value={localData.formation || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
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

        {/* ✅ Buttons */}
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
