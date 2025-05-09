'use client';
import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { signUp } from '@/lib/auth';
import { useActionState } from 'react';
import SubmitButton from '@/app/components/ui/submitButton';
import { Label } from '@/app/components/ui/label';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [state, action] = useActionState(signUp, undefined);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', birthdate: '', gender: '',
    university: '', userType: '', formation: '', graduationYear: '', degree: '', occupation: '',
    subject: '', rank: '', interests: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value || null }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const step1Complete = formData.firstName && formData.lastName && formData.email && formData.password;
  const step2Complete =formData.userType === 'public' || (formData.university && formData.userType);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form action={action}>
        {/* Hidden inputs for all form data */}
        <input type="hidden" name="firstName" value={formData.firstName} />
        <input type="hidden" name="lastName" value={formData.lastName} />
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="password" value={formData.password} />
        <input type="hidden" name="phone" value={formData.phone} />
        <input type="hidden" name="birthdate" value={formData.birthdate} />
        <input type="hidden" name="gender" value={formData.gender} />
        <input type="hidden" name="university" value={formData.university} />
        <input type="hidden" name="userType" value={formData.userType} />
        <input type="hidden" name="formation" value={formData.formation} />
        <input type="hidden" name="graduationYear" value={formData.graduationYear} />
        <input type="hidden" name="degree" value={formData.degree} />
        <input type="hidden" name="occupation" value={formData.occupation} />
        <input type="hidden" name="subject" value={formData.subject} />
        <input type="hidden" name="rank" value={formData.rank} />
        <input type="hidden" name="interests" value={JSON.stringify(formData.interests)} />

        <Card className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden border-0">
          <div className="flex flex-col md:flex-row">
            {/* Brand/Illustration Section */}
            <div className="hidden md:flex w-full md:w-2/5 bg-customBlue/5 items-center justify-center p-8 
                          bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI1IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMTIzLCAyNTUsIDAuMDgpIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')]">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-customBlue/10 flex items-center justify-center mx-auto 
                              shadow-inner border border-customBlue/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-customBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-customBlue to-blue-600 text-transparent">
                  BrainWave
                </h2>
                <p className="text-gray-600 mt-2 text-lg">Start your journey with us</p>
              </div>
            </div>
            
            {/* Form Section */}
            <div className="w-full md:w-3/5">
              <CardHeader className="p-10 pb-6 border-b">
                <CardTitle className="text-3xl font-bold text-gray-800">Create Your Account</CardTitle>
                <p className="text-lg text-gray-600 mt-2">Step {step} of 3</p>
              </CardHeader>
              
              <CardContent className="p-10 pt-6 space-y-6">
                {state?.message && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                    <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {state.message}
                  </div>
                )}

                {/* Step Indicator */}
                <div className="flex justify-between items-center mb-6">
                  {[1, 2, 3].map((stepNumber) => (
                    <React.Fragment key={stepNumber}>
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                          ${step >= stepNumber ? 'bg-customBlue text-white' : 'bg-gray-200'} 
                          transition-all duration-300`}>
                          {stepNumber}
                        </div>
                        <span className={`text-xs mt-1 ${step >= stepNumber ? 'text-customBlue font-medium' : 'text-gray-400'}`}>
                          {stepNumber === 1 ? 'Personal' : stepNumber === 2 ? 'Professional' : 'Interests'}
                        </span>
                      </div>
                      {stepNumber < 3 && (
                        <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${step > stepNumber ? 'bg-customBlue' : 'bg-gray-200'}`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="firstName" className="block text-md font-medium text-gray-700 mb-2">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                        />
                        {state?.error?.firstName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {state.error.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="block text-md font-medium text-gray-700 mb-2">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                        />
                        {state?.error?.lastName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {state.error.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="block text-md font-medium text-gray-700 mb-2">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                      />
                      {state?.error?.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {state.error.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="block text-md font-medium text-gray-700 mb-2">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                      />
                      {state?.error?.password && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                          <p className="font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Password requirements:
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {Array.isArray(state.error.password) ? (
                              state.error.password.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))
                            ) : (
                              <li>{state.error.password}</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="phone" className="block text-md font-medium text-gray-700 mb-2">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (123) 456-7890"
                          value={formData.phone}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                        />
                        {state?.error?.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {state.error.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="birthdate" className="block text-md font-medium text-gray-700 mb-2">
                          Birthdate
                        </Label>
                        <Input
                          id="birthdate"
                          name="birthdate"
                          type="date"
                          value={formData.birthdate}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                        />
                        {state?.error?.birthdate && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {state.error.birthdate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gender" className="block text-md font-medium text-gray-700 mb-2">
                        Gender
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange('gender', value)}
                      >
                        <SelectTrigger className="h-12 text-md px-4 py-3 focus:ring-2 focus:ring-customBlue">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {state?.error?.gender && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {state.error.gender}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-customBlue to-blue-600 hover:from-customBlue/90 hover:to-blue-600/90 
                                  text-white py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                  text-lg font-semibold h-12 flex items-center justify-center"
                        disabled={!step1Complete}
                      >
                        Continue
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
                {step === 2 && (
                  <div className="space-y-5">
                    
                    <div>
                      <Label htmlFor="userType" className="block text-md font-medium text-gray-700 mb-2">
                        I am a
                      </Label>
                      <Select
                        value={formData.userType}
                        onValueChange={(value) => handleSelectChange('userType', value)}
                      >
                        <SelectTrigger className="h-12 text-md px-4 py-3 focus:ring-2 focus:ring-customBlue">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Current Student</SelectItem>
                          <SelectItem value="alumni">Alumni</SelectItem>
                          <SelectItem value="professor">Professor</SelectItem>
                          <SelectItem value="public">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {state?.error?.userType && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {state.error.userType}
                        </p>
                      )}
                    </div>
                    {formData.userType !== 'public' && (
                    <div>
                      <Label htmlFor="university" className="block text-md font-medium text-gray-700 mb-2">
                        University
                      </Label>
                      <Input
                        id="university"
                        name="university"
                        placeholder="Your university name"
                        value={formData.university}
                        onChange={handleChange}
                        className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                      />
                      {state?.error?.university && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {state.error.university}
                        </p>
                      )}
                    </div>
                  )}

                      {formData.userType === 'student' && (
                        <div>
                          <Label htmlFor="formation" className="block text-md font-medium text-gray-700 mb-2">
                            Current Program
                          </Label>
                          <Input
                            id="formation"
                            name="formation"
                            placeholder="e.g. Computer Science, MBA"
                            value={formData.formation}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                          />
                          {state?.error?.formation && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {state.error.formation}
                            </p>
                          )}
                        </div>
                      )}

                      {formData.userType === 'alumni' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <Label htmlFor="graduationYear" className="block text-md font-medium text-gray-700 mb-2">
                                Graduation Year
                              </Label>
                              <Input
                                id="graduationYear"
                                name="graduationYear"
                                type="date"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                              />
                              {state?.error?.graduationYear && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {state.error.graduationYear}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="degree" className="block text-md font-medium text-gray-700 mb-2">
                                Degree Earned
                              </Label>
                              <Input
                                id="degree"
                                name="degree"
                                placeholder="e.g. B.Sc, Ph.D"
                                value={formData.degree}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                              />
                              {state?.error?.degree && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {state.error.degree}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="occupation" className="block text-md font-medium text-gray-700 mb-2">
                              Current Occupation
                            </Label>
                            <Input
                              id="occupation"
                              name="occupation"
                              placeholder="e.g. Software Engineer at Google"
                              value={formData.occupation}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                            />
                            {state?.error?.occupation && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {state.error.occupation}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {formData.userType === 'professor' && (
                        <>
                          <div>
                            <Label htmlFor="subject" className="block text-md font-medium text-gray-700 mb-2">
                              Teaching Subject
                            </Label>
                            <Input
                              id="subject"
                              name="subject"
                              type="text"
                              placeholder="e.g. Artificial Intelligence"
                              value={formData.subject}
                              onChange={handleChange}
                              className="focus:ring-2 focus:ring-customBlue focus:border-customBlue h-12 text-md px-4 py-3"
                            />
                            {state?.error?.subject && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {state.error.subject}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="rank" className="block text-md font-medium text-gray-700 mb-2">
                              Academic Rank
                            </Label>
                            <Select
                              value={formData.rank}
                              onValueChange={(value) => handleSelectChange('rank', value)}
                            >
                              <SelectTrigger className="h-12 text-md px-4 py-3 focus:ring-2 focus:ring-customBlue">
                                <SelectValue placeholder="Select your rank" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="assistant">Assistant Professor</SelectItem>
                                <SelectItem value="associate">Associate Professor</SelectItem>
                                <SelectItem value="full">Full Professor</SelectItem>
                                <SelectItem value="lecturer">Lecturer</SelectItem>
                              </SelectContent>
                            </Select>
                            {state?.error?.rank && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {state.error.rank}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                  
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-gray-300 hover:border-customBlue/30"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-customBlue to-blue-600 hover:from-customBlue/90 hover:to-blue-600/90 
                                  text-white py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                  text-lg font-semibold h-12 flex items-center justify-center"
                        disabled={!step2Complete}
                      >
                        Continue
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Interests and Submission */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <Label className="block text-md font-medium text-gray-700 mb-2">
                        Select Your Interests (Choose at least 2)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Artificial Intelligence', 'Web Development', 'Data Science', 
                          'Cybersecurity', 'Blockchain', 'Cloud Computing', 
                          'Machine Learning', 'Mobile Dev', 'UX/UI Design'].map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                            className={`h-12 rounded-lg transition-all ${formData.interests.includes(interest) 
                              ? 'bg-customBlue text-white' 
                              : 'hover:border-customBlue/30'}`}
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                      {state?.error?.interests && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {state.error.interests}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-gray-300 hover:border-customBlue/30"
                      >
                        Back
                      </Button>
                      <SubmitButton className="bg-gradient-to-r from-customBlue to-blue-600 hover:from-customBlue/90 hover:to-blue-600/90 
                                  text-white py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                  text-lg font-semibold h-12 flex items-center justify-center">
                        Complete Registration
                      </SubmitButton>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SignUpPage;