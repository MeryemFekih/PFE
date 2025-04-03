'use client';
import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { signUp } from '@/lib/auth';
import SubmitButton from '@/app/components/ui/submitButton';
import { useFormState } from 'react-dom';
import { Label } from '@/app/components/ui/label';
import NextButton from '@/app/components/ui/nextButton';

const SignUpPage = () => {
  const [state, action] = useFormState(signUp, undefined);
  const [step, setStep] = useState(1);
  const [formData1, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', birthdate: '', gender: '',
    university: '', userType: '', formation: '', graduationYear: '', degree: '', occupation: '',
    subject: '', rank: '', interests: [] as string[]
  });

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value}));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => {
      const updatedFormData = { ...prev, gender: value.trim() };
      console.log("Current Gender Value:", updatedFormData.gender);
      return updatedFormData;
    });
  };
  
  const handleNext = () => {
  
    setStep((prev) => prev + 1);
  };
    

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };

  return (
    <form action={action}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {state?.message &&   (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <Card className="w-full max-w-md p-6 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-customBlue">Sign Up - Step {step}/3</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData1.firstName}
                    onChange={handleChange}
                  />
                </div>
                { state?.error?.firstName && (
                  <p className="text-sm text-red-500">{state.error.firstName}</p>
                )}

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData1.lastName}
                    onChange={handleChange}
                  />
                </div>
                { state?.error?.lastName && (
                  <p className="text-sm text-red-500">{state.error.lastName}</p>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData1.email}
                    onChange={handleChange}
                  />
                </div>
                {state?.error?.email && (
                  <p className="text-sm text-red-500">{state.error.email}</p>
                )}

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData1.password}
                    onChange={handleChange}
                  />
                </div>
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

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData1.phone}
                    onChange={handleChange}
                  />
                </div>
                {state?.error?.phone && (
                  <p className="text-sm text-red-500">{state.error.phone}</p>
                )}

                <div>
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData1.birthdate}
                    onChange={handleChange}
                  />
                </div>
                { state?.error?.birthdate && (
                  <p className="text-sm text-red-500">{state.error.birthdate}</p>
                )}

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value: string) => handleSelectChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" id='male'>Male</SelectItem>
                    <SelectItem value="female" id='female'>Female</SelectItem>
                  </SelectContent>
                </Select>
                {state?.error?.gender && (
                  <p className="text-sm text-red-500">{state.error.gender}</p>
                )}
              </div>
                <SubmitButton  >
                  Next
                </SubmitButton>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    name="university"
                    placeholder="University"
                    value={formData1.university}
                    onChange={handleChange}
                    required
                  />
                </div>
                

                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <Select onValueChange={(value: string) => handleSelectChange( value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {state?.error?.userType && <p className="text-sm text-red-500">{state.error.userType}</p>}

                {/* Additional conditional fields */}
                {formData1.userType === 'alumni' && (
                  <>
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        type="date"
                        value={formData1.graduationYear}
                        onChange={handleChange}
                      />
                    </div>
                    {formData1.graduationYear && state?.error?.graduationYear && (
                      <p className="text-sm text-red-500">{state.error.graduationYear}</p>
                    )}

                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        name="degree"
                        type="text"
                        placeholder="Degree"
                        value={formData1.degree}
                        onChange={handleChange}
                      />
                    </div>
                    {formData1.degree && state?.error?.degree && (
                      <p className="text-sm text-red-500">{state.error.degree}</p>
                    )}

                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        type="text"
                        placeholder="Occupation"
                        value={formData1.occupation}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {formData1.userType === 'professor' && (
                  <>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        value={formData1.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="rank">Rank</Label>
                      <Input
                        id="rank"
                        name="rank"
                        type="text"
                        placeholder="Rank"
                        value={formData1.rank}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {formData1.userType === 'student' && (
                  <div>
                    <Label htmlFor="formation">Formation (Licence, Master, etc.)</Label>
                    <Input
                      id="formation"
                      name="formation"
                      type="text"
                      placeholder="Formation (Licence, Master, etc.)"
                      value={formData1.formation}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button id="backStep2" onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <Button id="nextStep2" onClick={handleNext} className="bg-customBlue hover:bg-opacity-80">
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm font-medium">Select Interests</p>
                <div className="grid grid-cols-2 gap-2">
                  {['AI', 'Web Dev', 'Data Science', 'Cybersecurity', 'Blockchain', 'Cloud Computing'].map((interest) => (
                    <Button
                      id={interest}
                      key={interest}
                      variant={formData1.interests.includes(interest) ? 'default' : 'outline'}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          interests: prev.interests.includes(interest)
                            ? prev.interests.filter(i => i !== interest)
                            : [...prev.interests, interest]
                        }));
                      }}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button id="backStep2" onClick={handleBack} variant="outline">
                    Back
                  </Button>
                  <SubmitButton>Finish</SubmitButton>
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
