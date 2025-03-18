import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { PaymentModal } from '../components/PaymentModal';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = async () => {
    const totalAmount = total();
    
    if (!profile) {
      toast.error('Please log in to checkout');
      return;
    }

    if (profile.account_balance < totalAmount) {
      toast.error('Insufficient balance. Please add funds to your account.');
      setShowPayment(true);
      return;
    }

    try {
      // Place orders one by one
      for (const item of items) {
        await api.post(`/v1/order/${item.id}`, {
          quantity: item.quantity,
        });
      }
      
      clearCart();
      toast.success('Orders placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place orders:', error);
      toast.error('Failed to place orders');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">Add some medicines to get started!</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Browse Medicines</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200 last:border-0"
          >
            <img
              src={item.picture}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1 mt-4 sm:mt-0 sm:ml-6">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <div className="mt-2 flex items-center space-x-4">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-lg font-semibold text-gray-900">
                KSh {(item.price * item.quantity).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">KSh {item.price.toLocaleString()} each</p>
            </div>
          </div>
        ))}

        <div className="mt-8 border-t border-gray-200 pt-8">
          {profile && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Your Balance:</span>
                <span className="text-lg font-semibold">
                  KSh {profile.account_balance.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between text-xl font-semibold text-gray-900">
            <span>Total</span>
            <span>KSh {total().toLocaleString()}</span>
          </div>

          {profile && profile.account_balance < total() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Your account balance is insufficient for this purchase. Please add funds to your account using M-PESA.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={clearCart}
              className="px-6 py-3 border border-red-600 text-red-600 rounded-md font-medium hover:bg-red-50 flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-5 w-5" />
              <span>Clear Cart</span>
            </button>
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={total()}
          onClose={() => setShowPayment(false)}
          onConfirm={() => {
            setShowPayment(false);
            handleCheckout();
          }}
        />
      )}
    </div>
  );
}