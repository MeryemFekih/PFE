'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormState, SignupFormSchema } from '@/lib/schemas';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import SubmitButton from '@/components/ui/submitButton';
import { signUp } from '@/lib/auth';
import { useActionState } from 'react';

type Inputs = z.infer<typeof SignupFormSchema>;

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['firstName', 'lastName', 'email', 'password', 'phone', 'birthdate', 'gender']
  },
  {
    id: 'Step 2',
    name: 'Professional Information',
    fields: ['userType', 'university', 'identification', 'formation', 'graduationYear', 'degree', 'occupation', 'subject', 'rank']
  },
  { 
    id: 'Step 3', 
    name: 'Interests',
    fields: ['interests']
  }
];

const SignUpPage = () => {
  const [previousStep, setPreviousStep] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [state, action] = useActionState(
    async (_prevState: FormState | undefined, formData: FormData): Promise<FormState> => {
      // Convert FormData to a proper Inputs object
      const payload: Partial<Inputs> = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone: formData.get("phone") as string,
        birthdate: formData.get("birthdate") as string,
        gender: formData.get("gender") as "male" | "female",
        userType: formData.get("userType") as "student" | "alumni" | "professor" | "public",
        university: formData.get("university") as string,
        identification: formData.get("identification") as string,
        formation: formData.get("formation") as string,
        graduationYear: formData.get("graduationYear") as string,
        degree: formData.get("degree") as string,
        occupation: formData.get("occupation") as string,
        subject: formData.get("subject") as string,
        rank: formData.get("rank") as "assistant" | "associate" | "full" | "lecturer",
      };
  
      const interestsJson = formData.get("interests");
      if (interestsJson) {
        try {
          payload.interests = JSON.parse(interestsJson as string);
        } catch (e) {
          console.error("Failed to parse interests", e);
        }
      }
  
      return await signUp(payload as Inputs);
    },
    undefined
  );
  
  
  const {
    register,
    watch,
    trigger,
    formState: { errors },
    setValue,
    getValues
  } = useForm<Inputs>({
    resolver: zodResolver(SignupFormSchema),
    criteriaMode: "all",
    defaultValues: {
      interests: []
    }
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    await signUp(data);
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    let fieldsToValidate: FieldName[] = [];
    
    // Step-specific validation
    if (currentStep === 0) {
      // Step 1: Personal Information
      fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'phone', 'birthdate', 'gender'];
    } 
    else if (currentStep === 1) {
      // Step 2: Professional Information - dynamic based on userType
      const isUserTypeValid = await trigger(['userType'], { shouldFocus: true });
      if (!isUserTypeValid) return;
  
      const userType = watch('userType');
      fieldsToValidate = ['userType']; // Always validate userType
  
      // Add fields based on user type
      if (userType === 'student') {
        fieldsToValidate.push('university', 'identification', 'formation');
      } 
      else if (userType === 'alumni') {
        fieldsToValidate.push('university', 'identification', 'graduationYear', 'degree', 'occupation');
      } 
      else if (userType === 'professor') {
        fieldsToValidate.push('university', 'identification', 'subject', 'rank');
      }
      // 'public' users don't need additional fields
    }
    else if (currentStep === 2) {
      // Step 3: Interests
      fieldsToValidate = ['interests'];
    }
  
    // Validate the relevant fields
    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (!isValid) return;
  
    // Only proceed if validation passes
    setPreviousStep(currentStep);
    setCurrentStep(step => step + 1);
  };
  
  

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(step => step - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = getValues('interests') || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    setValue('interests', newInterests);
  };

  const interestOptions = [
    'Artificial Intelligence', 'Web Development', 'Data Science', 
    'Cybersecurity', 'Blockchain', 'Cloud Computing', 
    'Machine Learning', 'Mobile Development', 'UX/UI Design',
    'Game Development', 'DevOps', 'Quantum Computing'
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <form className="w-full max-w-4xl" action={action}>
        {/* Hidden inputs for all form data */}
        <input type="hidden" name="firstName" value={watch('firstName') ?? ''} />
        <input type="hidden" name="lastName" value={watch('lastName') ?? ''} />
        <input type="hidden" name="email" value={watch('email') ?? ''} />
        <input type="hidden" name="password" value={watch('password') ?? ''} />
        <input type="hidden" name="phone" value={watch('phone') ?? ''} />
        <input type="hidden" name="birthdate" value={watch('birthdate') ?? ''} />
        <input type="hidden" name="gender" value={watch('gender') ?? ''} />
        <input type="hidden" name="university" value={watch('university') ?? ''} />
        <input type="hidden" name="userType" value={watch('userType') ?? ''} />
        <input type="hidden" name="formation" value={watch('formation') ?? ''} />
        <input type="hidden" name="graduationYear" value={watch('graduationYear') ?? ''} />
        <input type="hidden" name="degree" value={watch('degree') ?? ''} />
        <input type="hidden" name="occupation" value={watch('occupation') ?? ''} />
        <input type="hidden" name="subject" value={watch('subject') ?? ''} />
        <input type="hidden" name="rank" value={watch('rank') ?? ''} />
        <input type="hidden" name="identification" value={watch('identification') ?? ''} />
        <input type="hidden" name="interests" value={JSON.stringify(watch('interests') ?? [])} />
        
        <Card className="w-full shadow-lg rounded-xl overflow-hidden border-0">
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
                <p className="text-lg text-gray-600 mt-2">Step {currentStep + 1} of {steps.length}</p>
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
                <nav aria-label='Progress'>
                  <ol role='list' className='flex justify-between items-center mb-6 px-2'>
                    {steps.map((step, index) => (
                      <li key={step.name} className='flex flex-col items-center relative z-10'>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                          ${currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200'} 
                          ${currentStep === index ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
                          {index + 1}
                        </div>
                        <span className={`text-xs mt-1 ${currentStep >= index ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                          {step.name}
                        </span>
                        {index < steps.length - 1 && (
                          <div className={`flex-1 h-1 mx-1 transition-all duration-500 ${currentStep > index ? 'bg-blue-600' : 'bg-gray-200'} absolute top-5 left-full -ml-1 w-16`}></div>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>

                {/* Step 1: Personal Information */}
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="firstName" className="block text-md font-medium text-gray-700 mb-2">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          {...register('firstName')}
                          name="firstName"
                          placeholder="First Name"
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                        />
                        {errors.firstName?.message && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="block text-md font-medium text-gray-700 mb-2">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          {...register('lastName')}
                          name="lastName"
                          placeholder="Last Name"
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                        />
                        {errors.lastName?.message && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.lastName.message}
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
                        type="email"
                        {...register('email')}
                        name="email"
                        placeholder="your.email@example.com"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                      />
                      {errors.email?.message && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="block text-md font-medium text-gray-700 mb-2">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        name="password"
                        placeholder="Create a password"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                      />
                     {errors.password?.types && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <p className="font-medium flex items-center mb-1">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Password requirements:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {Object.values(errors.password.types).map((msg, index) => (
                            <li key={index}>{msg}</li>
                          ))}
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
                          type="tel"
                          {...register('phone')}
                          name="phone"
                          placeholder="+1 (123) 456-7890"
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                        />
                        {errors.phone?.message && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="birthdate" className="block text-md font-medium text-gray-700 mb-2">
                          Birthdate
                        </Label>
                        <Input
                          id="birthdate"
                          type="date"
                          {...register('birthdate')}
                          name="birthdate"
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                        />
                        {errors.birthdate?.message && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.birthdate.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gender" className="block text-md font-medium text-gray-700 mb-2">
                        Gender
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('gender', value as 'male' | 'female')}

                        defaultValue={watch('gender')}
                        name="gender"
                      >
                        <SelectTrigger className="h-12 text-md px-4 py-3 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender?.message && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="userType" className="block text-md font-medium text-gray-700 mb-2">
                        I am a
                      </Label>
                      <Select
                        onValueChange={(value) => setValue('userType', value as 'student' | 'alumni' | 'professor' | 'public')}
                        defaultValue={watch('userType')}
                        name="userType"
                      >
                        <SelectTrigger className="h-12 text-md px-4 py-3 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Current Student</SelectItem>
                          <SelectItem value="alumni">Alumni</SelectItem>
                          <SelectItem value="professor">Professor</SelectItem>
                          <SelectItem value="public">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.userType?.message && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.userType.message}
                        </p>
                      )}
                    </div>

                    {['student', 'alumni', 'professor'].includes(watch('userType')) && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="university" className="block text-md font-medium text-gray-700 mb-2">
                              University
                            </Label>
                            <Input
                              id="university"
                              {...register('university')}
                              name="university"
                              placeholder="Your university name"
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                            />
                            {errors.university?.message && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.university.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="identification" className="block text-md font-medium text-gray-700 mb-2">
                              Student/Staff ID
                            </Label>
                            <Input
                              id="identification"
                              {...register('identification')}
                              name="identification"
                              placeholder="SID or Staff ID"
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                            />
                            {errors.identification?.message && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.identification.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {watch('userType') === 'student' && (
                          <div>
                            <Label htmlFor="formation" className="block text-md font-medium text-gray-700 mb-2">
                              Current Program
                            </Label>
                            <Input
                              id="formation"
                              {...register('formation')}
                              name="formation"
                              placeholder="e.g. Computer Science, MBA"
                              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                            />
                            {errors.formation?.message && (
                              <p className="mt-1 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.formation.message}
                              </p>
                            )}
                          </div>
                        )}

                        {watch('userType') === 'alumni' && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                <Label htmlFor="graduationYear" className="block text-md font-medium text-gray-700 mb-2">
                                  Graduation Year
                                </Label>
                                <Input
                                  id="graduationYear"
                                  type="date"
                                  {...register('graduationYear')}
                                  name="graduationYear"
                                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                                />
                                {errors.graduationYear?.message && (
                                  <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.graduationYear.message}
                                  </p>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="degree" className="block text-md font-medium text-gray-700 mb-2">
                                  Degree Earned
                                </Label>
                                <Input
                                  id="degree"
                                  {...register('degree')}
                                  name="degree"
                                  placeholder="e.g. B.Sc, Ph.D"
                                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                                />
                                {errors.degree?.message && (
                                  <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.degree.message}
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
                                {...register('occupation')}
                                name="occupation"
                                placeholder="e.g. Software Engineer at Google"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                              />
                              {errors.occupation?.message && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.occupation.message}
                                </p>
                              )}
                            </div>
                          </>
                        )}

                        {watch('userType') === 'professor' && (
                          <>
                            <div>
                              <Label htmlFor="subject" className="block text-md font-medium text-gray-700 mb-2">
                                Teaching Subject
                              </Label>
                              <Input
                                id="subject"
                                {...register('subject')}
                                name="subject"
                                placeholder="e.g. Artificial Intelligence"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-md px-4 py-3"
                              />
                              {errors.subject?.message && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.subject.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="rank" className="block text-md font-medium text-gray-700 mb-2">
                                Academic Rank
                              </Label>
                              <Select
                                onValueChange={(value) => setValue('rank', value as 'assistant' | 'associate' | 'full' | 'lecturer' | null)}
                                name="rank"
                                defaultValue={watch('rank') ?? undefined}

                              >
                                <SelectTrigger className="h-12 text-md px-4 py-3 focus:ring-2 focus:ring-blue-500">
                                  <SelectValue placeholder="Select your rank" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="assistant">Assistant Professor</SelectItem>
                                  <SelectItem value="associate">Associate Professor</SelectItem>
                                  <SelectItem value="full">Full Professor</SelectItem>
                                  <SelectItem value="lecturer">Lecturer</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.rank?.message && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {errors.rank.message}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Interests and Submission */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="block text-md font-medium text-gray-700 mb-2">
                        Select Your Interests (Choose at least 2)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {interestOptions.map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant={watch('interests')?.includes(interest) ? 'default' : 'outline'}
                            name="interests"
                            className={`h-12 rounded-lg transition-all ${watch('interests')?.includes(interest) 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:border-blue-300'}`}
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                      {errors.interests?.message && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.interests.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    onClick={prev}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="h-12 px-6 rounded-xl border-gray-300 hover:border-blue-300"
                  >
                    Back
                  </Button>
                  {currentStep === steps.length - 1 ? (
                    <SubmitButton className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600/90 hover:to-blue-500/90 
                              text-white py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                              text-lg font-semibold h-12 flex items-center justify-center">
                      Complete Registration
                    </SubmitButton>
                  ) : (
                    <Button
                      type="button"
                      onClick={next}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600/90 hover:to-blue-500/90 
                                text-white py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
                                text-lg font-semibold h-12 flex items-center justify-center"
                    >
                      Continue
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default SignUpPage;