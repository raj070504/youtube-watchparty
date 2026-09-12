import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, LogIn, Video, Clock, Users, ArrowRight, Play, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Role } from '@watchparty/shared';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Create Room State
  const [createTitle, setCreateTitle] = useState('');
  const [createVideoUrl, setCreateVideoUrl] = useState('');
  const [creating, setCreating] = useState(false);

  // Join Room State
  const [joinInput, setJoinInput] = useState('');
  const [joining, setJoining] = useState(false);

  // Recent Rooms State
  const [myRooms, setMyRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.getMyRooms();
        setMyRooms(res.rooms || []);
      } catch (err) {
        console.warn('Failed to load user rooms:', err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await api.createRoom(createTitle, createVideoUrl);
      showToast('Room created!', 'success');
      navigate(`/room/${res.room.shortCode}`);
    } catch (err) {
      showToast((err as Error).message || 'Failed to create room', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = joinInput.trim();
    if (!cleanInput) return;

    setJoining(true);

    // If a full URL was pasted like http://localhost:3000/room/ABC123
    let code = cleanInput;
    if (cleanInput.includes('/room/')) {
      const parts = cleanInput.split('/room/');
      code = parts[1].split('?')[0].split('/')[0];
    }

    navigate(`/room/${code.toUpperCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-extrabold text-black uppercase">
            Welcome, {user?.username}!
          </h1>
          <p className="text-sm text-black font-bold">
            Host a new watch party or enter a room code to join.
          </p>
        </div>
      </div>

      {/* Action Cards: Create & Join */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Room Card */}
        <div className="bg-white border-4 border-black p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black uppercase">Create Room</h2>
            </div>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1.5">
                Room Title (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Movie Night"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1.5">
                Starting Video URL (optional)
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={createVideoUrl}
                onChange={(e) => setCreateVideoUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-4 mt-4 bg-black hover:bg-white hover:text-black border-2 border-black text-white font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {creating ? (
                <div className="w-4 h-4 border-2 border-black border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Create</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Join Room Card */}
        <div className="bg-white border-4 border-black p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center text-black bg-white">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black uppercase">Join Room</h2>
            </div>
          </div>

          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1.5">
                Room Code or Link
              </label>
              <input
                type="text"
                required
                placeholder="PARTY1"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold uppercase focus:outline-none focus:bg-gray-100 transition-colors tracking-widest font-mono"
              />
            </div>

            <div className="pt-7">
              <button
                type="submit"
                disabled={joining || !joinInput.trim()}
                className="w-full py-4 mt-4 bg-black hover:bg-white hover:text-black border-2 border-black text-white font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {joining ? (
                  <div className="w-4 h-4 border-2 border-black border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Join</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Your Recent Rooms List */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">
            Recent Rooms
          </h2>
        </div>

        {loadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-gray-200 border-2 border-black animate-pulse" />
            ))}
          </div>
        ) : myRooms.length === 0 ? (
          <div className="p-8 bg-white border-4 border-black border-dashed text-center text-black">
            <p className="text-sm font-bold uppercase">No recent rooms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/room/${r.shortCode}`)}
                className="group cursor-pointer p-4 bg-white border-4 border-black hover:bg-gray-100 transition-all flex flex-col justify-between space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-black uppercase line-clamp-1">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 border border-black text-black">
                        {r.shortCode}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 uppercase border border-black ${
                        r.role === Role.HOST ? 'bg-black text-white' : 'bg-white text-black'
                      }`}>
                        {r.role}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-black pt-2 border-t-2 border-black">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{r.participantCount} users</span>
                  </div>
                  <span>Host: {r.creator}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
