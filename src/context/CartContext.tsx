"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
    _id: string;
    title: string;
    price: number;
    category: string;
    imageUrl?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    isInCart: (itemId: string) => boolean;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("sparkiit_cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem("sparkiit_cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            if (prev.find((i) => i._id === item._id)) {
                setIsCartOpen(true); // Open anyway to show it's there
                return prev;
            }
            setIsCartOpen(true); // Open automatically on add
            return [...prev, item];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const isInCart = (itemId: string) => {
        return cartItems.some((item) => item._id === itemId);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            isInCart,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
