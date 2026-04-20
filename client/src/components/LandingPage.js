import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-slate-50 overflow-hidden flex flex-col font-sans">
            
            {/* The "Not A Nav Link" App Name */}
            <div className="absolute top-0 left-0 w-full p-6 z-20">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter cursor-default">
                    FoodKart <span className="text-emerald-500">🍜</span>
                </h1>
            </div>

            {/* Main Interactive Banner Area */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center container mx-auto px-6 pt-24 md:pt-0">
                
                {/* Left Side: Typography & CTA */}
                <div className="md:w-1/2 flex flex-col items-start space-y-6 z-10">
                    
                    {/* Animated Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm tracking-wide animate-bounce shadow-sm">
                        🚀 Lightning Fast Delivery
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
                        Feeling <br/><span className="text-emerald-500 drop-shadow-md">Hungry!!</span>
                    </h2>
                    
                    <p className="text-lg text-slate-500 max-w-md font-medium">
                        Get your favourite foods delivered hot and fresh with just a few clicks.
                    </p>
                    
                    {/* Advanced CTA Button with fill animation */}
                    <button 
                        onClick={() => navigate('/menu')}
                        className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-full overflow-hidden shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1"
                        data-testid="landing-cta-button"
                    >
                        <span className="relative z-10 flex items-center">
                            Order Now
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                        {/* Green hover background fill */}
                        <div className="absolute inset-0 h-full w-full bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                </div>

                {/* Right Side: Animated Visuals */}
                <div className="md:w-1/2 mt-16 md:mt-0 relative flex justify-center items-center w-full">
                    {/* Glowing Background Blob */}
                    <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
                    
                    {/* The Hero Image (Floating Effect) */}
                    <img 
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" 
                        alt="Delicious Burger Banner" 
                        className="relative z-10 w-[90%] max-w-md rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 hover:rotate-2"
                        data-testid="landing-banner-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;