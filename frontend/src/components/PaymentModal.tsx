import React from 'react';
import { X, Smartphone } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function PaymentModal({ amount, onClose, onConfirm }: PaymentModalProps) {
  const { profile } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">M-PESA Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Amount to Pay:</span>
                <span className="text-xl font-bold text-red-600">
                  KSh {amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Balance:</span>
                <span className="text-lg font-semibold text-gray-900">
                  KSh {profile?.account_balance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Smartphone className="h-5 w-5" />
                <span>Pay via M-PESA:</span>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                <p className="font-medium">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to M-PESA menu</li>
                  <li>Select "Lipa na M-PESA"</li>
                  <li>Select "Pay Bill"</li>
                  <li>Enter Business Number: <span className="font-bold">000000</span></li>
                  <li>Enter Account Number: <span className="font-bold">{profile?.username}</span></li>
                  <li>Enter Amount: <span className="font-bold">KSh {amount.toLocaleString()}</span></li>
                  <li>Enter your M-PESA PIN</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}