import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeToCart, removeSingleIteams, emptycartIteam } from '../redux/features/cartSlice';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const CartDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { carts } = useSelector((state) => state.allCart);
    
    const [totalprice, setPrice] = useState(0);
    const [totalquantity, setTotalQuantity] = useState(0);

    // --- LOGIC 1: THE TOAST ENGINE (WITH BFCACHE SUPPORT) ---
    useEffect(() => {
        const handlePaymentInterruption = () => {
            const queryParams = new URLSearchParams(location.search);
            const stripeCanceled = queryParams.get('canceled');
            const manualBack = localStorage.getItem("checkout_pending");

            if (stripeCanceled === 'true' || manualBack === 'true') {
                setTimeout(() => {
                    toast.error("Payment was interrupted. Your items are still here!", {
                        icon: '⚠️',
                        duration: 4000,
                        position: 'top-center',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }, 100);

                // CLEANUP
                localStorage.removeItem("checkout_pending");
                
                if (stripeCanceled === 'true') {
                    navigate('/cart', { replace: true });
                }
            }
        };

        // Trigger 1: Normal React component mount/update
        handlePaymentInterruption();

        // Trigger 2: Browser Back Button (Page restored from BFCache)
        const onPageShow = (event) => {
            if (event.persisted) {
                console.log("Page restored from BFCache. Checking for pending checkouts...");
                handlePaymentInterruption();
            }
        };

        window.addEventListener('pageshow', onPageShow);
        
        return () => {
            window.removeEventListener('pageshow', onPageShow);
        };
    }, [location.search, navigate]);

    // --- LOGIC 2: CALCULATION ENGINE ---
    useEffect(() => {
        let price = 0;
        let quantity = 0;
        carts.forEach((ele) => {
            price += ele.price * ele.qnty;
            quantity += ele.qnty;
        });
        setPrice(price);
        setTotalQuantity(quantity);
    }, [carts]);

    // --- LOGIC 3: ACTION HANDLERS ---
    const handleIncrement = (e) => dispatch(addToCart(e));
    const handleQuantityDecrease = (e) => dispatch(removeSingleIteams(e)); 
    const handleFullRemove = (id) => {
        dispatch(removeToCart(id));
        toast.success("Item removed from your cart");
    };
    const emptycart = () => {
        dispatch(emptycartIteam());
        toast.success("Your cart is now empty");
    };

    // --- LOGIC 4: STRIPE HANDOFF (PRODUCTION READY) ---
    const makePayment = async () => {
        if (carts.length === 0) return;

        try {
            localStorage.setItem("checkout_pending", "true");
            
            // PRODUCTION FIX: Fetch backend URL from environment variables
            const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:7000";
            
            const response = await fetch(`${API_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: carts })
            });
            
            const session = await response.json();
            if (session.url) {
                window.location.href = session.url;
            } else {
                localStorage.removeItem("checkout_pending");
                toast.error("Failed to reach Stripe");
            }
        } catch (error) {
            localStorage.removeItem("checkout_pending");
            toast.error("Connection Error ❎");
        }
    };

    // --- UI RENDER ---
    return (
        <main className="bg-slate-50 min-h-screen py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Cart Header */}
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Your Cart <span className="text-emerald-500">{carts.length > 0 ? `(${carts.length})` : ''}</span>
                    </h2>
                    {carts.length > 0 && (
                        <button 
                            onClick={emptycart}
                            className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                            data-testid="empty-cart-btn"
                        >
                            <i className="fa-solid fa-trash-can"></i> Clear All
                        </button>
                    )}
                </div>

                {carts.length === 0 ? (
                    /* Empty State UX */
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="w-48 h-48 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <i className="fa-solid fa-cart-shopping text-6xl text-slate-300"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Your cart is feeling light!</h3>
                        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Let's get some delicious food in here.</p>
                        <button 
                            onClick={() => navigate('/menu')}
                            className="bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-emerald-600 hover:shadow-lg transition-all active:scale-95"
                            data-testid="back-to-menu-btn"
                        >
                            Explore Menu
                        </button>
                    </div>
                ) : (
                    /* Active Cart Layout */
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Left Side: Items List */}
                        <div className="flex-1 bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
                            <ul className="divide-y divide-slate-100">
                                {carts.map((data, index) => (
                                    <li key={index} className="p-6 flex flex-col sm:flex-row items-center gap-6 group hover:bg-slate-50 transition-colors" data-testid={`cart-item-${index}`}>
                                        
                                        {/* Product Image */}
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                                            <img src={data.imgdata} alt={data.dish} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="text-xl font-bold text-slate-900 mb-1">{data.dish}</h4>
                                            <p className="text-slate-500 font-medium">₹{data.price} <span className="text-sm font-normal">/ item</span></p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-xl">
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                                onClick={data.qnty <= 1 ? () => handleFullRemove(data.id) : () => handleQuantityDecrease(data)}
                                                data-testid={`decrease-qty-${index}`}
                                            >
                                                <i className="fa-solid fa-minus text-xs"></i>
                                            </button>
                                            <span className="w-6 text-center font-bold text-slate-900" data-testid={`item-qty-${index}`}>{data.qnty}</span>
                                            <button 
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                                onClick={() => handleIncrement(data)}
                                                data-testid={`increase-qty-${index}`}
                                            >
                                                <i className="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>

                                        {/* Item Total & Delete */}
                                        <div className="flex items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                                            <span className="text-xl font-black text-slate-900 min-w-[80px] text-right" data-testid={`item-total-${index}`}>
                                                ₹{data.qnty * data.price}
                                            </span>
                                            <button 
                                                className="text-slate-300 hover:text-red-500 transition-all w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50"
                                                onClick={() => handleFullRemove(data.id)}
                                                data-testid={`delete-item-${index}`}
                                            >
                                                <i className="fa-solid fa-trash text-sm"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="w-full lg:w-96">
                            <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-28 shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4">Order Summary</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Total Items</span>
                                        <span className="font-bold text-white" data-testid="summary-total-items">{totalquantity}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Delivery Fee</span>
                                        <span className="text-emerald-400 font-bold">Free</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-700 pt-6 mb-8 flex justify-between items-end">
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                                        <p className="text-3xl font-black text-white" data-testid="summary-total-price">₹{totalprice}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={makePayment}
                                    className="w-full bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex justify-center items-center gap-2 group"
                                    data-testid="checkout-btn"
                                >
                                    Proceed to Checkout
                                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
};

export default CartDetails;