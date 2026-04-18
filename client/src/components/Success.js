import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { emptycartIteam } from '../redux/features/cartSlice';

const Success = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // SDET Logic: Clear Redux and LocalStorage immediately on successful landing
        dispatch(emptycartIteam());
        localStorage.removeItem("checkout_pending");
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <div className="mb-8 flex items-center justify-center bg-emerald-50 rounded-full w-32 h-32">
                <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                    />
                </svg>
            </div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <h1 className="text-4xl font-black text-slate-900 mb-4">Order Confirmed!</h1>
                <p className="text-slate-500 text-lg mb-10 max-w-sm mx-auto font-medium">
                    Your kitchen-to-door journey has begun. We'll notify you when it's out for delivery.
                </p>
                <button 
                    onClick={() => window.location.replace('/')}
                    className="bg-slate-900 text-white font-bold px-10 py-4 rounded-full hover:bg-emerald-600 transition-all active:scale-95 shadow-xl hover:shadow-emerald-200"
                    data-testid="success-home-btn"
                >
                    Return to Home
                </button>
            </motion.div>
        </div>
    );
};

export default Success;