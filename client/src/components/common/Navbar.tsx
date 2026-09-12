import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Youtube, Play, LogOut, Radio, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { status } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:scale-105 transition-transform bg-white">
            <Youtube className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-black uppercase">
              WatchParty
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 border border-black text-black">
              Live
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Connection Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 border border-black text-xs text-black font-bold">
                <Radio className={`w-3.5 h-3.5 ${
                  status === 'connected' ? 'text-black animate-pulse' :
                  status === 'connecting' || status === 'reconnecting' ? 'text-black animate-spin' :
                  'text-black'
                }`} />
                <span className="capitalize">{status}</span>
              </div>

              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-black hover:bg-gray-100 text-black transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black text-sm bg-white">
                <div className="w-6 h-6 border border-black font-bold flex items-center justify-center text-xs text-black">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-black">{user.username}</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="text-xs font-bold px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
