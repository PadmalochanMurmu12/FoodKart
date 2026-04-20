import React, { useState } from 'react';
import CardsData from "./CardData";
import { addToCart } from '../redux/features/cartSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const Home = () => {
    // Keep the source of truth intact
    const [cartData] = useState(CardsData);
    // New State: Track what the user is typing
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();

    // The Engine: Filter data dynamically based on the search query
    const filteredData = cartData.filter((item) =>
        item.dish.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const send = (item) => {
        dispatch(addToCart(item));
        toast.success(`${item.dish} added to cart!`, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <main className="bg-white min-h-screen">
            <section className="py-16 px-6 max-w-7xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
                    What's on your <span className="text-emerald-500">mind?</span>
                </h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    Discover the best meals from top-rated local kitchens, delivered fresh to your doorstep.
                </p>
                
                {/* Fully Wired Search Bar */}
                <div className="mt-10 max-w-xl mx-auto relative group">
                    <input 
                        type="text" 
                        placeholder="Search for dishes, cuisines..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        data-testid="inventory-search"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-24">
                {/* SDET Hook: Show a message if search finds nothing */}
                {filteredData.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 text-xl font-bold">
                        No dishes found matching "{searchQuery}" 🍜
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* We map over filteredData now, not cartData */}
                        {filteredData.map((element, index) => (
                            <div 
                                key={index}
                                className="group flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform hover:-translate-y-2"
                                data-testid={`food-card-${index}`}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={element.imgdata} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        alt={element.dish}
                                    />
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                        <span className="text-sm font-bold text-slate-900">{element.rating}</span>
                                        <i className="fa-solid fa-star text-yellow-500 text-[10px]"></i>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                            {element.dish}
                                        </h3>
                                        <span className="text-lg font-black text-slate-900">
                                            ₹{element.price}
                                        </span>
                                    </div>
                                    
                                    <p className="text-slate-500 text-sm mb-6 flex-1">
                                        {element.address}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        {/* BUG FIX: Changed -space-x-2 to gap-3 and added object-contain */}
                                        <div className="flex gap-3 items-center">
                                            <img src={element.arrimg} className="w-8 h-8 object-contain" alt="icon" />
                                            <img src={element.delimg} className="w-8 h-8 object-contain" alt="delivery" />
                                        </div>

                                        <button 
                                            onClick={() => send(element)}
                                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl transition-all active:scale-95 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200"
                                            data-testid={`add-to-cart-btn-${index}`}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;