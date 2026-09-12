import React, { useState } from 'react';
import { Crown, Shield, User, MoreVertical, ShieldCheck, ArrowRightLeft, UserX } from 'lucide-react';
import { RoomParticipantDTO, Role } from '@watchparty/shared';
import { useAuth } from '../../context/AuthContext';

interface ParticipantsPanelProps {
  participants: RoomParticipantDTO[];
  userRole: Role;
  onAssignRole: (targetUserId: string, newRole: Role) => void;
  onTransferHost: (targetUserId: string) => void;
  onRemoveParticipant: (targetUserId: string) => void;
}

export const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({
  participants,
  userRole,
  onAssignRole,
  onTransferHost,
  onRemoveParticipant,
}) => {
  const { user } = useAuth();
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  const isHost = userRole === Role.HOST;

  const renderRoleBadge = (role: Role) => {
    switch (role) {
      case Role.HOST:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-2 border-black bg-black text-white">
            <Crown className="w-3 h-3 fill-current" />
            Host
          </span>
        );
      case Role.MODERATOR:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-2 border-black bg-white text-black">
            <Shield className="w-3 h-3" />
            Mod
          </span>
        );
      case Role.PARTICIPANT:
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-white text-black">
            <User className="w-3 h-3" />
            Viewer
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-black" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-black">Participants</h3>
        </div>
        <span className="text-[11px] font-mono text-black bg-white border border-black font-bold px-2 py-0.5">
          {participants.length} online
        </span>
      </div>

      {/* Participants List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[160px] max-h-[300px]">
        {participants.map((p) => {
          const isMe = p.userId === user?.id;
          const isTargetHost = p.role === Role.HOST;
          const showActions = isHost && !isMe && !isTargetHost;

          return (
            <div
              key={p.userId}
              className={`flex items-center justify-between p-2.5 border-2 transition-all ${
                isMe
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black hover:bg-gray-100'
              }`}
            >
              {/* User info */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className={`w-8 h-8 border-2 border-black flex items-center justify-center font-bold text-xs ${isMe ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    {p.username.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 ring-1 ring-black ${
                      p.isOnline ? 'bg-black' : 'bg-white'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold">{p.username}</span>
                    {isMe && <span className="text-[10px] font-bold">(You)</span>}
                  </div>
                  <div className="mt-0.5">{renderRoleBadge(p.role)}</div>
                </div>
              </div>

              {/* Host Action Controls */}
              {showActions && (
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuUserId(activeMenuUserId === p.userId ? null : p.userId)}
                    className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuUserId === p.userId && (
                    <div className="absolute right-0 top-8 z-30 w-44 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 space-y-1">
                      {p.role === Role.PARTICIPANT ? (
                        <button
                          onClick={() => {
                            onAssignRole(p.userId, Role.MODERATOR);
                            setActiveMenuUserId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-black font-bold hover:bg-gray-100 transition-colors text-left uppercase border border-transparent hover:border-black"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Make Moderator
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onAssignRole(p.userId, Role.PARTICIPANT);
                            setActiveMenuUserId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-black font-bold hover:bg-gray-100 transition-colors text-left uppercase border border-transparent hover:border-black"
                        >
                          <User className="w-3.5 h-3.5" />
                          Demote to Viewer
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`Transfer HOST privileges to ${p.username}? You will become a participant.`)) {
                            onTransferHost(p.userId);
                            setActiveMenuUserId(null);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-black font-bold hover:bg-gray-100 transition-colors text-left uppercase border border-transparent hover:border-black"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Transfer Host
                      </button>

                      <div className="h-0.5 bg-black my-1" />

                      <button
                        onClick={() => {
                          if (window.confirm(`Kick ${p.username} from the room?`)) {
                            onRemoveParticipant(p.userId);
                            setActiveMenuUserId(null);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-black font-bold hover:bg-gray-100 transition-colors text-left uppercase border border-transparent hover:border-black"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Remove User
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
