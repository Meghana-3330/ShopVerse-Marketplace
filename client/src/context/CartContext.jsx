import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shopverse_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shopverse_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === product._id);

      if (existingIndex > -1) {
        // Update quantity if already in cart
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + qtyToAdd;
        // Limit to available stock
        const maxStock = product.stock !== undefined ? product.stock : 999;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            discount: product.discount || 0,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            category: product.category,
            stock: product.stock,
            vendor: product.vendor?._id || product.vendor,
            vendorStoreName: product.vendor?.vendorProfile?.storeName || product.vendorStoreName || 'Marketplace Vendor',
            quantity: Math.min(qtyToAdd, product.stock || 999)
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const maxStock = item.stock !== undefined ? item.stock : 999;
          return {
            ...item,
            quantity: Math.min(qty, maxStock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('shopverse_cart');
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Delivery: Free over ₹1000, else flat ₹99
  const deliveryCharge = cartItems.length === 0 || subtotal >= 1000 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;
  const freeDeliveryThreshold = 1000;
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryCharge,
        grandTotal,
        freeDeliveryThreshold,
        freeDeliveryRemaining
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
