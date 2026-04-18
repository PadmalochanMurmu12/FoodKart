import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Headers = () => {
    const { carts } = useSelector((state) => state.allCart);

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 h-20 flex items-center transition-all duration-300">
            {/* Switched to justify-end to align cart perfectly right */}
            <div className="container mx-auto px-6 flex justify-end items-center">
                
                {/* Just the Cart Icon - No Logo, No Borders */}
                <NavLink 
                    to="/cart" 
                    className="group relative p-3 text-slate-700 hover:text-emerald-600 transition-colors"
                    data-testid="nav-cart-link"
                >
                    <i className="fa-solid fa-cart-shopping text-2xl"></i>
                    
                    {carts.length > 0 && (
                        <span 
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white"
                            data-testid="cart-badge-count"
                        >
                            {carts.length}
                        </span>
                    )}
                </NavLink>

            </div>
        </header>
    );
}

export default Headers;