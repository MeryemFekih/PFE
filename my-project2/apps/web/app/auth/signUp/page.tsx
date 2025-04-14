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
    setFormData(prev => ({ ...prev, [field]: value || null}));
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
  const step2Complete = formData.university && formData.userType;

  return (
    <form action={action}>
      {/* Hidden inputs for all form data */}
      <input type="hidden" name="firstName" value={formData.firstName } />
      <input type="hidden" name="lastName" value={formData.lastName} />
      <input type="hidden" name="email" value={formData.email} />
      <input type="hidden" name="password" value={formData.password} />
      <input type="hidden" name="phone" value={formData.phone} />
      <input type="hidden" name="birthdate" value={formData.birthdate} />
      <input type="hidden" name="gender" value={formData.gender} />
      <input type="hidden" name="university" value={formData.university} />
      <input type="hidden" name="userType" value={formData.userType} />
      <input type="hidden" name="formation" value={formData.formation } />
      <input type="hidden" name="graduationYear" value={formData.graduationYear }/>
      <input type="hidden" name="degree" value={formData.degree}  />
      <input type="hidden" name="occupation" value={formData.occupation} />
      <input type="hidden" name="subject" value={formData.subject } />
      <input type="hidden" name="rank" value={formData.rank} />
      <input type="hidden" name="interests" value={JSON.stringify(formData.interests)} />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <Card className="w-full max-w-md p-6 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-customBlue">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step Indicator */}
            <div className="flex justify-center mb-6">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${step >= stepNumber ? 'bg-customBlue text-white' : 'bg-gray-200'}`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && <div className="w-16 h-1 bg-gray-200 mx-2"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {state?.error?.firstName && (
                    <p className="text-sm text-red-500">{state.error.firstName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {state?.error?.lastName && (
                    <p className="text-sm text-red-500">{state.error.lastName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {state?.error?.email && (
                    <p className="text-sm text-red-500">{state.error.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {state?.error?.password && (
                    <div className="text-sm text-red-500">
                      <p>Password must:</p>
                      <ul>
                        {state.error.password.map((error) => (
                          <li key={error}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {state?.error?.phone && (
                    <p className="text-sm text-red-500">{state.error.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                  {state?.error?.birthdate && (
                    <p className="text-sm text-red-500">{state.error.birthdate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {state?.error?.gender && (
                    <p className="text-sm text-red-500">{state.error.gender}</p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-customBlue hover:bg-opacity-80"
                    disabled={!step1Complete}
                  >
                    Next: Professional Info
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    name="university"
                    placeholder="University"
                    value={formData.university}
                    onChange={handleChange}
                  />
                  {state?.error?.university && (
                    <p className="text-sm text-red-500">{state.error.university}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value) => handleSelectChange('userType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                    </SelectContent>
                  </Select>
                  {state?.error?.userType && (
                    <p className="text-sm text-red-500">{state.error.userType}</p>
                  )}
                </div>

                {formData.userType === 'student' && (
                  <div>
                    <Label htmlFor="formation">Formation</Label>
                    <Input
                      id="formation"
                      name="formation"
                      placeholder="Formation (Licence, Master, etc.)"
                      value={formData.formation}
                      onChange={handleChange}
                    />
                    {state?.error?.formation && (
                      <p className="text-sm text-red-500">{state.error.formation}</p>
                    )}
                  </div>
                )}

                {formData.userType === 'alumni' && (
                  <>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        type="date"
                        value={formData.graduationYear}
                        onChange={handleChange}
                      />
                      {state?.error?.graduationYear && (
                        <p className="text-sm text-red-500">{state.error.graduationYear}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        name="degree"
                        placeholder="Degree"
                        value={formData.degree}
                        onChange={handleChange}
                      />
                      {state?.error?.degree && (
                        <p className="text-sm text-red-500">{state.error.degree}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        placeholder="Occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                      />
                      {state?.error?.occupation && (
                        <p className="text-sm text-red-500">{state.error.occupation}</p>
                      )}
                    </div>
                  </>
                )}

                {formData.userType === 'professor' && (
                  <>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                       id="subject"
                       name="subject"
                       type="text"
                       placeholder="Subject"
                       value={formData.subject}
                       onChange={handleChange}
                      />
                      {state?.error?.subject && (
                        <p className="text-sm text-red-500">{state.error.subject}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="rank">Rank</Label>
                      <Input
                        id="rank"
                        name="rank"
                        type="text"
                        placeholder="Rank"
                        value={formData.rank}
                        onChange={handleChange}
                      />
                      {state?.error?.rank && (
                        <p className="text-sm text-red-500">{state.error.rank}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-customBlue hover:bg-opacity-80"
                    disabled={!step2Complete}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Interests and Submission */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Select Interests</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['AI', 'Web Dev', 'Data Science', 'Cybersecurity', 'Blockchain', 'Cloud Computing'].map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  {state?.error?.interests && (
                    <p className="text-sm text-red-500">{state.error.interests}</p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <SubmitButton>Create Account</SubmitButton>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default SignUpPage;