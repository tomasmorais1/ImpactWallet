import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Achievements } from './Achievements';
import { ScreenGradientLayout } from './ScreenGradientLayout';
import {
  Users,
  UserPlus,
  Send,
  Gift,
  Share2,
  Trophy,
  TrendingUp,
  ArrowRightLeft,
  Check,
  X,
} from 'lucide-react';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  status: 'online' | 'offline';
  sharedAchievements: number;
  savingsStreak: number;
}

interface FriendsProps {
  totalPoints: number;
  totalSaved: number;
  friendCount: number;
  onSendPoints: (friendId: string, amount: number) => void;
  onRequestPoints: (friendId: string, amount: number) => void;
}

export function Friends({
  totalPoints,
  totalSaved,
  friendCount,
  onSendPoints,
  onRequestPoints,
}: FriendsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [tradeType, setTradeType] = useState<'send' | 'request'>('send');
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const [friends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      points: 450,
      level: 5,
      status: 'online',
      sharedAchievements: 3,
      savingsStreak: 12,
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'MC',
      points: 680,
      level: 7,
      status: 'online',
      sharedAchievements: 5,
      savingsStreak: 24,
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'ED',
      points: 320,
      level: 4,
      status: 'offline',
      sharedAchievements: 2,
      savingsStreak: 8,
    },
    {
      id: '4',
      name: 'Alex Rivera',
      avatar: 'AR',
      points: 890,
      level: 9,
      status: 'online',
      sharedAchievements: 7,
      savingsStreak: 30,
    },
    {
      id: '5',
      name: 'Lisa Park',
      avatar: 'LP',
      points: 240,
      level: 3,
      status: 'offline',
      sharedAchievements: 1,
      savingsStreak: 5,
    },
  ]);

  const [pendingRequests] = useState([
    { id: '1', name: 'Tom Wilson', avatar: 'TW' },
    { id: '2', name: 'Nina Garcia', avatar: 'NG' },
  ]);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrade = () => {
    if (!selectedFriend || !tradeAmount) return;

    const amount = parseInt(tradeAmount, 10);
    if (Number.isNaN(amount) || amount <= 0) return;

    if (tradeType === 'send') {
      if (amount > totalPoints) return;
      onSendPoints(selectedFriend.id, amount);
    } else {
      onRequestPoints(selectedFriend.id, amount);
    }

    setShowTradeDialog(false);
    setTradeAmount('');
    setSelectedFriend(null);
  };

  const openTradeDialog = (friend: Friend, type: 'send' | 'request') => {
    setSelectedFriend(friend);
    setTradeType(type);
    setShowTradeDialog(true);
  };

  return (
    <ScreenGradientLayout variant="default">
      <div className="space-y-4 pb-6">
        {/* Top Hero */}
        <div className="relative px-4 pt-12 pb-8 text-white">
          <div className="relative flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-sm">
              <Users className="h-5 w-5 text-white" strokeWidth={2} />
            </div>

            <div className="flex-1 text-center">
              <p className="text-sm font-medium text-white/90">Friends</p>
              <p className="mt-1 text-sm text-white/80">
                {friends.length} friends · {friends.filter((f) => f.status === 'online').length} online
              </p>
            </div>

            <div className="h-10 w-10" />
          </div>

          <div className="mt-8 flex justify-center gap-12">
            <button
              type="button"
              onClick={() => {
                setShowAddFriends((prev) => !prev);
                setShowAchievements(false);
              }}
              className="group flex flex-col items-center gap-2 transition active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[2px]">
                <UserPlus className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
              </span>
              <span className="w-full max-w-[5.5rem] text-center text-xs font-semibold leading-snug text-white drop-shadow-sm">
                Add Friends
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAchievements((prev) => !prev);
                setShowAddFriends(false);
              }}
              className="group flex flex-col items-center gap-2 transition active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[2px]">
                <Trophy className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
              </span>
              <span className="w-full max-w-[5.5rem] text-center text-xs font-semibold leading-snug text-white drop-shadow-sm">
                Achievements
              </span>
            </button>
          </div>
        </div>

        <div className="px-4 space-y-4">
          {showAddFriends && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Friends</CardTitle>
                <CardDescription>Search users or accept pending requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input placeholder="Enter username or email..." className="h-11 rounded-xl" />
                  <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Search Friend
                  </Button>
                </div>

                {pendingRequests.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold">Pending Requests</p>

                    {pendingRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold">
                            {request.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="font-medium text-sm">{request.name}</p>
                          <p className="text-xs text-muted-foreground">Wants to be friends</p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700">
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-3">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Share2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">Invite Friends</h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          Share Impact Wallet and earn bonus points
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-9 border-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900">
                      <Share2 className="h-3.5 w-3.5 mr-2" />
                      Share Invite Link
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {showAchievements && (
            <Achievements
              totalPoints={totalPoints}
              totalSaved={totalSaved}
              friendCount={friendCount}
            />
          )}

          {!showAchievements && (
            <>
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-xl bg-secondary/50 border-0"
              />

              <div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <Card
                    key={friend.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 border bg-white dark:bg-background"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold">
                              {friend.avatar}
                            </AvatarFallback>
                          </Avatar>

                          <div
                            className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                              friend.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{friend.name}</h4>
                            <span className="text-xs text-muted-foreground">L{friend.level}</span>
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{friend.points} pts</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-emerald-500" />
                              {friend.savingsStreak} days
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => openTradeDialog(friend, 'send')}
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                          Send
                        </Button>

                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => openTradeDialog(friend, 'request')}
                        >
                          <Gift className="h-3.5 w-3.5 mr-1.5" />
                          Request
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {showTradeDialog && selectedFriend && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTradeDialog(false)}
          >
            <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="text-base">
                  {tradeType === 'send' ? 'Send Points' : 'Request Points'}
                </CardTitle>
                <CardDescription>
                  {tradeType === 'send'
                    ? `Send points to ${selectedFriend.name}`
                    : `Request points from ${selectedFriend.name}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-secondary/50">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold">
                      {selectedFriend.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />

                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">YOU</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter points amount"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="h-11"
                    max={tradeType === 'send' ? totalPoints : undefined}
                  />
                  {tradeType === 'send' && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      You have {totalPoints} points available
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTradeDialog(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleTrade}
                    disabled={!tradeAmount || (tradeType === 'send' && parseInt(tradeAmount, 10) > totalPoints)}
                  >
                    {tradeType === 'send' ? 'Send' : 'Request'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ScreenGradientLayout>
  );
}