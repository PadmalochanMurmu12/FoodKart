import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
            <motion.div 
                animate={{ 
                    x: [0, -10, 10, -10, 10, 0],
                    rotate: [0, -5, 5, -5, 5, 0] 
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-8"
            >
                <i className="fa-solid fa-circle-exclamation text-5xl text-orange-500"></i>
            </motion.div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-4">Payment Canceled</h1>
            <p className="text-slate-500 text-lg mb-10 max-w-md">
                No charges were made. Your cart is still waiting for you if you change your mind!
            </p>

            <div className="flex gap-4">
                <button 
                    onClick={() => navigate('/cart')}
                    className="bg-white border-2 border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-full hover:bg-slate-100 transition-all"
                >
                    Try Again
                </button>
                <button 
                    onClick={() => navigate('/menu')}
                    className="bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:shadow-lg transition-all"
                >
                    View Menu
                </button>
            </div>
        </div>
    );
};

export default Cancel;