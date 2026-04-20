import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const Headers = () => {
    const { carts } = useSelector((state) => state.allCart);

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 h-20 flex items-center transition-all duration-300">
            {/* BUG FIX: Changed justify-end to justify-between to space the Logo and Cart */}
            <div className="container mx-auto px-6 flex justify-between items-center">
                
                {/* The "Home" Link - Using the Brand Logo as standard UX practice */}
                <NavLink 
                    to="/" 
                    className="flex items-center gap-3 group decoration-transparent"
                    data-testid="nav-home-link"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 transition-colors">
                        <i className="fa-solid fa-house text-slate-500 group-hover:text-emerald-600 transition-colors text-lg"></i>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors m-0 hidden sm:block">
                        FoodKart <span className="text-emerald-500">🍜</span>
                    </h1>
                </NavLink>

                {/* Just the Cart Icon */}
                <NavLink 
                    to="/cart" 
                    className="group relative p-3 text-slate-700 hover:text-emerald-600 transition-colors"
                    data-testid="nav-cart-link"
                >
                    <i className="fa-solid fa-cart-shopping text-2xl"></i>
                    
                    {carts.length > 0 && (
                        <span 
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm"
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