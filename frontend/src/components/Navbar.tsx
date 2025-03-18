import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home, Pill, FileText, Phone, Menu, X, UserCircle, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export function Navbar() {
  const { profile, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center space-x-2">
              <Pill className="h-6 w-6" />
              <span>PharmaMS</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4 ml-8">
              <Link to="/" className="flex items-center space-x-1 hover:bg-red-700 px-3 py-2 rounded-md">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/about" className="flex items-center space-x-1 hover:bg-red-700 px-3 py-2 rounded-md">
                <FileText className="h-5 w-5" />
                <span>About</span>
              </Link>
              <Link to="/contact" className="flex items-center space-x-1 hover:bg-red-700 px-3 py-2 rounded-md">
                <Phone className="h-5 w-5" />
                <span>Contact</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {profile ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-red-700 rounded-full"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {items.length}
                    </span>
                  )}
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                  {profile.is_staff && (
                    <a
                      href="/d/admin"
                      className="flex items-center space-x-2 hover:bg-red-700 px-3 py-2 rounded-md"
                      title="Admin Panel"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin</span>
                    </a>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 hover:bg-red-700 px-3 py-2 rounded-md"
                    title="Your Profile"
                  >
                    {profile.profile ? (
                      <img
                        src={profile.profile}
                        alt={profile.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8" />
                    )}
                    <span className="font-medium">{profile.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:bg-red-700 px-3 py-2 rounded-md"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:bg-red-700 px-3 py-2 rounded-md flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-yellow-300 flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-red-700 rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 hover:bg-red-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 hover:bg-red-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 hover:bg-red-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {profile ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 hover:bg-red-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/cart"
                  className="block px-3 py-2 hover:bg-red-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart ({items.length})
                </Link>
                {profile.is_staff && (
                  <a
                    href="/d/admin"
                    className="block px-3 py-2 hover:bg-red-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 hover:bg-red-700 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 hover:bg-red-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-yellow-400 text-red-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}