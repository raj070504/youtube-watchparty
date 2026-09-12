import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Users, Shield, Zap, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LandingPage: React.FC = () => {
  const { user, login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(identifier, password);
        showToast('Welcome back!', 'success');
      } else {
        await signup(username, email, password);
        showToast('Account created successfully!', 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      showToast((err as Error).message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Hero */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black uppercase border-b-4 border-black pb-4">
            Watch Videos<br />Together.
          </h1>
          <p className="text-lg text-black font-bold border-l-4 border-black pl-4">
            Create rooms, share codes, and watch in sync.
          </p>
        </div>

        {/* Right Auth Card */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Tabs */}
            <div className="flex border-2 border-black mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-xs font-bold uppercase border-r-2 border-black transition-all ${
                  isLogin
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${
                  !isLogin
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isLogin ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-black mb-1.5">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="alex or alex@example.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-black mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-black mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="alex99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-black mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-black mb-1.5">
                      Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-black hover:bg-white hover:text-black border-2 border-black text-white font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isLogin ? 'Sign In' : 'Join'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
    </div>
  );
};
