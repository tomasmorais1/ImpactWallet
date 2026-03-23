import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, UserPlus, Send, Gift, Share2, Trophy, TrendingUp, 
  Coins, ArrowRightLeft, Award, Star, Check, X 
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
  onSendPoints: (friendId: string, amount: number) => void;
  onRequestPoints: (friendId: string, amount: number) => void;
}

export function Friends({ totalPoints, onSendPoints, onRequestPoints }: FriendsProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'add' | 'trade'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [tradeType, setTradeType] = useState<'send' | 'request'>('send');

  // Mock friends data
  const [friends, setFriends] = useState<Friend[]>([
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

  const [recentActivity] = useState([
    { id: '1', friend: 'Sarah Johnson', action: 'sent you', points: 50, time: '2 hours ago' },
    { id: '2', friend: 'Mike Chen', action: 'unlocked', achievement: 'Budget Master', time: '5 hours ago' },
    { id: '3', friend: 'Alex Rivera', action: 'reached', milestone: 'Level 9', time: '1 day ago' },
  ]);

  const handleTrade = () => {
    if (!selectedFriend || !tradeAmount) return;
    
    const amount = parseInt(tradeAmount);
    if (tradeType === 'send' && amount <= totalPoints) {
      onSendPoints(selectedFriend.id, amount);
      setShowTradeDialog(false);
      setTradeAmount('');
      setSelectedFriend(null);
    } else if (tradeType === 'request') {
      onRequestPoints(selectedFriend.id, amount);
      setShowTradeDialog(false);
      setTradeAmount('');
      setSelectedFriend(null);
    }
  };

  const openTradeDialog = (friend: Friend, type: 'send' | 'request') => {
    setSelectedFriend(friend);
    setTradeType(type);
    setShowTradeDialog(true);
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 8) return 'bg-purple-500';
    if (level >= 5) return 'bg-blue-500';
    if (level >= 3) return 'bg-emerald-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
     <Card className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 border-0 text-white overflow-hidden">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Friends</h2>
                <p className="text-purple-100 text-sm">{friends.length} friends · {friends.filter(f => f.status === 'online').length} online</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80">Your Points</p>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-amber-300" />
                <span className="text-xl font-bold text-white">{totalPoints}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'friends'
              ? 'bg-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4 inline mr-1.5" />
          Friends
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'add'
              ? 'bg-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserPlus className="h-4 w-4 inline mr-1.5" />
          Add Friends
        </button>
        <button
          onClick={() => setActiveTab('trade')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'trade'
              ? 'bg-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4 inline mr-1.5" />
          Activity
        </button>
      </div>

      {/* Friends List Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-4">
          {/* Search */}
          <Input 
            placeholder="Search friends..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11"
          />

          {/* Friends Grid */}
          <div className="space-y-3">
            {friends.map((friend) => (
              <Card key={friend.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                          {friend.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${
                        friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold truncate">{friend.name}</h4>
                        <Badge className={`${getLevelBadgeColor(friend.level)} text-white text-xs`}>
                          L{friend.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Coins className="h-3 w-3 text-amber-500" />
                          {friend.points}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-purple-500" />
                          {friend.sharedAchievements}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                          {friend.savingsStreak} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9"
                      onClick={() => openTradeDialog(friend, 'send')}
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Send Points
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-9"
                      onClick={() => openTradeDialog(friend, 'request')}
                    >
                      <Gift className="h-3.5 w-3.5 mr-1.5" />
                      Request
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-3"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Friends Tab */}
      {activeTab === 'add' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search Users</CardTitle>
              <CardDescription>Find friends by username or email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Enter username or email..." className="h-11" />
              <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Search
              </Button>
            </CardContent>
          </Card>

          {/* Friend Requests */}
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Friend Requests</CardTitle>
                <CardDescription>{pendingRequests.length} pending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
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
              </CardContent>
            </Card>
          )}

          {/* Invite Friends */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">Invite Friends</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Share Impact Wallet and earn bonus points</p>
                </div>
              </div>
              <Button variant="outline" className="w-full h-9 border-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900">
                <Share2 className="h-3.5 w-3.5 mr-2" />
                Share Invite Link
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'trade' && (
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>See what your friends are up to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                  {activity.points ? (
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
                      <Coins className="h-5 w-5 text-amber-600" />
                    </div>
                  ) : activity.achievement ? (
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{activity.friend}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      {activity.points && (
                        <span className="font-semibold text-amber-600">{activity.points} points</span>
                      )}
                      {activity.achievement && (
                        <span className="font-semibold text-purple-600">{activity.achievement}</span>
                      )}
                      {activity.milestone && (
                        <span className="font-semibold text-blue-600">{activity.milestone}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trade Dialog */}
      {showTradeDialog && selectedFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowTradeDialog(false)}>
          <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-base">
                {tradeType === 'send' ? 'Send Points' : 'Request Points'}
              </CardTitle>
              <CardDescription>
                {tradeType === 'send' 
                  ? `Send points to ${selectedFriend.name}`
                  : `Request points from ${selectedFriend.name}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-secondary/50">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
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
                  disabled={!tradeAmount || (tradeType === 'send' && parseInt(tradeAmount) > totalPoints)}
                >
                  {tradeType === 'send' ? 'Send' : 'Request'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
