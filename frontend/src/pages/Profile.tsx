import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, fetchProfile } = useAuthStore();

  useEffect(() => {
    document.title = 'My Profile - PharmaMS';
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-red-600">
          <h3 className="text-lg leading-6 font-medium text-white">
            Profile Information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            {profile.profile ? (
              <img
                src={profile.profile}
                alt={profile.username}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <User className="h-8 w-8 text-red-600" />
              </div>
            )}
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {profile.first_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile.username}
              </h4>
              <p className="text-sm text-gray-500">@{profile.username}</p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.email || '-'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.location || '-'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Account Balance</dt>
              <dd className="mt-1 text-3xl font-semibold text-red-600">
                KSh {profile.account_balance.toLocaleString()}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <Link
              to="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}