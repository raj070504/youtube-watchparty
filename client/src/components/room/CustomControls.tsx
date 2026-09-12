import React, { useState } from 'react';
import { Play, Pause, Link as LinkIcon, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { PlayState, Role, extractYouTubeVideoId } from '@watchparty/shared';

interface CustomControlsProps {
  playState: PlayState;
  currentTime: number;
  duration: number;
  userRole: Role;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onChangeVideo: (urlOrId: string) => void;
  onResync: () => void;
}

function formatTime(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const CustomControls: React.FC<CustomControlsProps> = ({
  playState,
  currentTime,
  duration,
  userRole,
  onPlay,
  onPause,
  onSeek,
  onChangeVideo,
  onResync,
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [inputError, setInputError] = useState('');

  const canControl = userRole === Role.HOST || userRole === Role.MODERATOR;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canControl) return;
    const target = parseFloat(e.target.value);
    onSeek(target);
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extracted = extractYouTubeVideoId(videoInput);
    if (!extracted) {
      setInputError('Please enter a valid YouTube URL (watch, youtu.be, shorts) or 11-char ID.');
      return;
    }

    onChangeVideo(videoInput.trim());
    setVideoInput('');
    setInputError('');
    setShowVideoModal(false);
  };

  return (
    <div className="bg-white p-4 border-4 border-black flex flex-col gap-3">
      {/* Progress & Time */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs font-mono font-bold text-black min-w-[40px] text-right">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative group flex items-center">
          <input
            type="range"
            min={0}
            max={duration > 0 ? duration : 100}
            step={0.5}
            value={currentTime}
            onChange={handleSeekChange}
            disabled={!canControl}
            className={`w-full h-2 bg-black appearance-none cursor-pointer accent-black transition-all ${
              !canControl ? 'opacity-60 cursor-not-allowed' : 'hover:h-3'
            }`}
          />
        </div>
        <span className="text-xs font-mono font-bold text-black min-w-[40px]">
          {duration > 0 ? formatTime(duration) : '--:--'}
        </span>
      </div>

      {/* Control Buttons & Role Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          {canControl ? (
            playState === PlayState.PLAYING ? (
              <button
                onClick={onPause}
                className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold uppercase text-xs transition-colors"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={onPlay}
                className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-black hover:bg-white hover:text-black text-white font-bold uppercase text-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </button>
            )
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white text-xs font-bold uppercase text-black">
              <ShieldAlert className="w-3.5 h-3.5 text-black" />
              <span>Viewer Mode</span>
            </div>
          )}

          {/* Re-sync Button */}
          <button
            onClick={onResync}
            title="Force sync player with server"
            className="flex items-center gap-1.5 px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold uppercase text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>

        {/* Change Video Button */}
        {canControl && (
          <button
            onClick={() => setShowVideoModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Change Video</span>
          </button>
        )}
      </div>

      {/* Change Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black max-w-md w-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-black uppercase flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Change Room Video
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-black hover:bg-gray-100 font-bold border-2 border-black w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVideoSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoInput}
                  onChange={(e) => {
                    setVideoInput(e.target.value);
                    setInputError('');
                  }}
                  autoFocus
                  className="w-full px-3.5 py-3 bg-white border-2 border-black text-sm text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
                />
                {inputError && <p className="text-xs font-bold text-black mt-1.5">{inputError}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 text-black text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-black bg-black hover:bg-white hover:text-black text-white text-xs font-bold uppercase transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Load Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
