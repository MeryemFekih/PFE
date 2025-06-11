'use client';

import { useEffect } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram
} from 'react-icons/fa';
import homeAnimation from "@/assets/animations/home.json";
import { coworking, planner, uni } from '@/assets/animations';
import Lottie from 'lottie-react';

export default function LandingPage() {
  

    useEffect(() => {
      // Handle fade animations
      const fadeEls = document.querySelectorAll('.fade-in, .fade-in-up');
      
      const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      }, { threshold: 0.9});
      
      fadeEls.forEach(el => fadeObserver.observe(el));
  
      // Handle timeline animations with progressive activation
      const timelineItemEls = document.querySelectorAll('.timeline-item');
      
      const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const tick = entry.target.querySelector('.tick');
            
            // Animate the item
            entry.target.classList.add('opacity-100', 'translate-y-0');
            
            if (tick) {
              tick.classList.add(
                'bg-green-500',
                'border-green-500',
                'text-white',
                'scale-110'
              );
              
              // Find previous siblings and ensure they're also activated
              let prevSibling = entry.target.previousElementSibling;
              while (prevSibling && prevSibling.classList.contains('timeline-item')) {
                prevSibling.classList.add('opacity-100', 'translate-y-0');
                const prevTick = prevSibling.querySelector('.tick');
                if (prevTick) {
                  prevTick.classList.add(
                    'bg-green-500',
                    'border-green-500',
                    'text-white',
                    'scale-110'
                  );
                }
                prevSibling = prevSibling.previousElementSibling;
              }
            }
          }
        });
      }, { threshold: 1, rootMargin: '-70px' });
      
      timelineItemEls.forEach(el => timelineObserver.observe(el));
      
      // Cleanup observers on component unmount
      return () => {
        fadeObserver.disconnect();
        timelineObserver.disconnect();
      };
    }, []);
  

  const features = [
    {
      title: 'Virtual Coworking',
      animation: coworking,
      subfeatures: [
        {
          name: 'Collaborative Workspaces',
          description: 'Create virtual rooms for real-time collaboration with teammates.',
        },
        {
          name: 'One-Click Sharing',
          description: 'Instantly share rooms with colleagues via a simple link.',
        },
        {
          name: 'Live Meetings',
          description: 'Host virtual study sessions.',
        },
      ],
    },
    {
      title: 'Planner',
      animation: planner,
      subfeatures: [
        {
          name: 'Time Management',
          description: 'Plan your studies effectively.',
        },
        {
          name: 'Task Management',
          description: 'Create, organize, and complete tasks with satisfaction.',
        },
        {
          name: 'Calendar Integration',
          description: 'Seamlessly integrate with your existing calendar apps.',
        },
      ],
    },
    {
      title: 'University Hub',
      animation: uni,
      subfeatures: [
        {
          name: 'Alumni Network',
          description: 'Connect with graduates and build professional relationships.',
        },
        {
          name: 'Course Library',
          description: 'Access shared lectures, tutorials, and educational content.',
        },
        {
          name: 'Discussion Forums',
          description: 'Engage in meaningful conversations with your community.',
        },
      ],
    },
  ];
  
  return (
    <div className="font-[Poppins] text-gray-800 bg-gray-50 overflow-x-hidden">
     
      <header className="shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-900">
            Brain<span className="text-blue-700">Wave</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/." className="text-indigo-700 font-semibold">Accueil</a>
            <div className="flex gap-3">
              <a href="/auth/signIn" className="border font-semibold border-indigo-800 text-indigo-900 text-center w-27 px-4 py-2 rounded-full hover:bg-blue-50">Connect</a>
              <a href="/auth/signUp" className="bg-indigo-800 text-white text-center w-27 px-4 py-2 rounded-full hover:bg-blue-700">Register</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 to-blue-800 text-white">
        <div className="container mx-auto px-30 pt-60 pb-10 h-40 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-bold fade-in opacity-0 translate-y-10 transition duration-700">
              Let's Make Your <span className="text-blue-200">Life Better</span> Together
            </h1>
            <p className="text-xl text-blue-100 mb-8 fade-in opacity-0 translate-y-10 transition duration-700 delay-200">
              Enhance your academic and professional journey with a smart platform designed for seamless collaboration and growth.
            </p>
            <div className="flex gap-4">
            <a href="/auth/signUp" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/30">
                Start Now
            </a>
            <a href="#" className="border-2 border-white px-6 py-3 rounded-full font-medium text-white hover:bg-white hover:text-indigo-900 transition-all duration-300 hover:border-indigo-900">
                Learn More
            </a>
            </div>
          </div>
          <div className="md:w-1/3">
            <Lottie animationData={homeAnimation} loop={true} />
          </div>
        </div>
        <svg className="relative bottom-0 w-full" viewBox="0 0 1440 250">
          <path fill="#f9fafb" fillOpacity="1" d="M0,224L48,224C96,224,192,224,288,213.3C384,203,480,181,576,181.3C672,181,768,203,864,202.7C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128V320H0V224Z" />
        </svg>
      </section>

      
   {/* Features Section */}
   <section className="flex flex-col gap-2 m-auto bg-gray-50 pt-10 pb-24 px-6">
        <h2 className="text-3xl font-bold text-indigo-900 text-center mb-16">How can BrainWave helps you ?</h2>
        <div className="max-w-7xl mx-auto space-y-24">
        {features.map((feature, idx) => {
  const isPlanner = feature.title === "Planner";
  return (
    <div
      key={idx}
      className={`fade-in-up opacity-0 translate-y-10 transition-all duration-700 ease-out flex flex-col md:flex-row ${
        isPlanner ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Image Section */}
      <div className="w-full md:w-xl px-6">
        <Lottie animationData={feature.animation} loop={true} className="h-65 w-full object-contain" />
      </div>

      {/* Text Section */}
      <div className=" md:w-1/2 space-y-3">
        <h2 className="text-2xl font-bold text-indigo-900 text-center p-1 rounded-full bg-gray-200  ">{feature.title}</h2>
        <div className="timeline-container relative pl-5 mr-5 border-l-4 border-gray-300 space-y-10">
          {feature.subfeatures.map((sub, i) => (
            <div 
              key={i} 
              className="timeline-item ps-2 relative opacity-0 translate-y-6 transition-all duration-700 ease-out"
            >
              <div className="tick absolute -left-10 top-0 px-3 py-2 rounded-full flex items-center justify-center text-s font-bold transform transition-all duration-700">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{sub.name}</h3>
              <p className="text-gray-600">{sub.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
})}

        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gradient-to-b from-indigo-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          <div  className='ml-15 '>
            <h3 className="text-2xl font-bold mb-2">Brain<span className="text-blue-400">Wave</span></h3>
            <p>The next generation academic and networking platform.</p>
          </div>
          <div className='text-center ' >
            <h4 className="font-semibold  mb-2">Explore</h4>
            <ul className="space-y-1">
              <li><a href="#">Coworking</a></li>
              <li><a href="#">Planner</a></li>
              <li><a href="#">University</a></li>

            </ul>
          </div>
         
          <div className='text-center '>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center border-t border-white/20 pt-6">
          <p className="">&copy; 2025 BrainWave. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
  );
}
