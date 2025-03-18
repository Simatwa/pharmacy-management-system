import React from 'react';
import { X, ShoppingCart, Package, Calendar } from 'lucide-react';
import { Medicine } from '../lib/types';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

interface MedicineModalProps {
  medicine: Medicine;
  onClose: () => void;
}

export function MedicineModal({ medicine, onClose }: MedicineModalProps) {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addToCart(medicine, 1);
    toast.success(`Added ${medicine.name} to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{medicine.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6">
            <img
              src={medicine.picture}
              alt={medicine.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                {medicine.category}
              </span>
              <div className="flex items-center text-gray-500">
                <Calendar className="h-5 w-5 mr-1" />
                <span>Last updated: {new Date(medicine.updated_at).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{medicine.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-red-600">
                  KSh {medicine.price.toLocaleString()}
                </span>
                <div className="flex items-center text-gray-500">
                  <Package className="h-5 w-5 mr-1" />
                  <span>Stock: {medicine.stock}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center space-x-2 bg-yellow-400 text-red-600 px-6 py-3 rounded-md font-medium hover:bg-yellow-300 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}