import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  Home, 
  Terminal, 
  Users, 
  LogIn, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  PlusSquare
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <Code className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 font-bold text-xl">CodeArena</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {user && (
              <button 
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              >
                <Home size={18} className="mr-1" />
                <span>Home</span>
              </Link>
              <Link 
                to="/mocktest" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              >
                <Terminal size={18} className="mr-1" />
                <span>AI Mocktest</span>
              </Link>
              <Link 
                to="/create-room" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              >
                <PlusSquare size={18} className="mr-1" />
                <span>Create Room</span>
              </Link>
              <Link 
                to="/join-room" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              >
                <Users size={18} className="mr-1" />
                <span>Join Room</span>
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center text-gray-300 hover:text-white focus:outline-none"
                >
                  <User size={24} className="text-indigo-400" />
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <Settings size={16} className="mr-2" />
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              >
                <LogIn size={18} className="mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      {user && sidebarOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/dashboard" 
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <Home size={18} className="mr-2" />
              <span>Home</span>
            </Link>
            <Link 
              to="/mocktest" 
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <Terminal size={18} className="mr-2" />
              <span>AI Mocktest</span>
            </Link>
            <Link 
              to="/create-room" 
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <PlusSquare size={18} className="mr-2" />
              <span>Create Room</span>
            </Link>
            <Link 
              to="/join-room" 
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <Users size={18} className="mr-2" />
              <span>Join Room</span>
            </Link>
            <Link 
              to="/profile" 
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <User size={18} className="mr-2" />
              <span>Profile</span>
            </Link>
            <Link 
              to="/settings" 
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings size={18} className="mr-2" />
              <span>Settings</span>
            </Link>
            <button 
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium flex items-center"
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;