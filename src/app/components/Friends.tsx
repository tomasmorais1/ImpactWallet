import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Achievements } from './Achievements';
import { ScreenGradientLayout } from './ScreenGradientLayout';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
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
  Crown,
  MessageCircle,
  Plus,
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

type GroupChatMessageType = 'system' | 'message' | 'vote';

interface GroupChatMessage {
  id: string;
  type: GroupChatMessageType;
  authorName: string;
  text: string;
  createdAt: string;
}

interface DonationVote {
  id: string;
  ngoName: string;
  points: number;
  euroAmount: number;
  createdBy: string;
  status: 'open' | 'approved' | 'rejected';
  votes: {
    friendId: string;
    vote: 'yes' | 'no';
  }[];
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
}

interface DonationGroup {
  id: string;
  name: string;
  adminId: string;
  members: GroupMember[];
  createdAt: string;
  groupPoints: number;
  chatMessages: GroupChatMessage[];
  activeVote: DonationVote | null;
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
  const currentUser = {
    id: 'me',
    name: 'You',
    avatar: 'YO',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [tradeType, setTradeType] = useState<'send' | 'request'>('send');
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [showAddPointsSheet, setShowAddPointsSheet] = useState(false);
  const [selectedGroupPoints, setSelectedGroupPoints] = useState<number>(0);

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

  const [groups, setGroups] = useState<DonationGroup[]>([
    {
      id: 'group-1',
      name: 'Close Friends',
      adminId: 'me',
      members: [
        { id: 'me', name: 'You', avatar: 'YO' },
        { id: '1', name: 'Sarah Johnson', avatar: 'SJ' },
        { id: '2', name: 'Mike Chen', avatar: 'MC' },
        { id: '4', name: 'Alex Rivera', avatar: 'AR' },
      ],
      createdAt: new Date().toISOString(),
      groupPoints: 300,
      chatMessages: [
        {
          id: 'msg-1',
          type: 'vote',
          authorName: 'System',
          text: 'Donation vote created for WWF.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'msg-2',
          type: 'message',
          authorName: 'Mike Chen',
          text: 'I think we should support this one.',
          createdAt: new Date().toISOString(),
        },
      ],
      activeVote: {
        id: 'vote-1',
        ngoName: 'WWF',
        points: 1200,
        euroAmount: 12,
        createdBy: 'You',
        status: 'open',
        votes: [
          { friendId: '1', vote: 'yes' },
          { friendId: '2', vote: 'yes' },
        ],
      },
    },
  ]);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
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

  const toggleGroupMember = (friendId: string) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleCreateGroup = () => {
    const cleanName = groupName.trim();
    if (!cleanName || selectedGroupMembers.length === 0) return;

    const pickedFriends = friends
      .filter((friend) => selectedGroupMembers.includes(friend.id))
      .map((friend) => ({
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar,
      }));

    const newGroup: DonationGroup = {
      id: `group-${Date.now()}`,
      name: cleanName,
      adminId: currentUser.id,
      members: [{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }, ...pickedFriends],
      createdAt: new Date().toISOString(),
      groupPoints: 0,
      chatMessages: [],
      activeVote: null,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setGroupName('');
    setSelectedGroupMembers([]);
    setShowCreateGroup(false);
    setSelectedGroupId(newGroup.id);
  };

  const handleSendChatMessage = () => {
    if (!selectedGroup || !chatInput.trim()) return;

    const messageText = chatInput.trim();

    setGroups((prev) =>
      prev.map((group) =>
        group.id === selectedGroup.id
          ? {
              ...group,
              chatMessages: [
                ...group.chatMessages,
                {
                  id: `msg-${Date.now()}`,
                  type: 'message',
                  authorName: currentUser.name,
                  text: messageText,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : group
      )
    );

    setChatInput('');
  };

  const handleAddPointsToGroup = () => {
    if (!selectedGroup) return;
    if (selectedGroupPoints <= 0 || selectedGroupPoints > totalPoints) return;

    onSendPoints(selectedGroup.id, selectedGroupPoints);

    setGroups((prev) =>
      prev.map((group) =>
        group.id === selectedGroup.id
          ? {
              ...group,
              groupPoints: group.groupPoints + selectedGroupPoints,
              chatMessages: [
                ...group.chatMessages,
                {
                  id: `msg-${Date.now()}`,
                  type: 'message',
                  authorName: currentUser.name,
                  text: `added ${selectedGroupPoints} points to the group.`,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : group
      )
    );

    setShowAddPointsSheet(false);
    setSelectedGroupPoints(0);
  };

  const getMemberName = (group: DonationGroup, memberId: string) =>
    group.members.find((member) => member.id === memberId)?.name ?? 'Unknown';

  const handleVote = (groupId: string, voteValue: 'yes' | 'no') => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId || !group.activeVote || group.activeVote.status !== 'open') {
          return group;
        }

        const alreadyVoted = group.activeVote.votes.some((vote) => vote.friendId === currentUser.id);
        if (alreadyVoted) return group;

        const updatedVotes = [...group.activeVote.votes, { friendId: currentUser.id, vote: voteValue }];
        const membersCount = group.members.length;
        const majority = Math.ceil(membersCount / 2);
        const yesVotes = updatedVotes.filter((vote) => vote.vote === 'yes').length;
        const noVotes = updatedVotes.filter((vote) => vote.vote === 'no').length;

        let nextStatus: DonationVote['status'] = 'open';
        if (yesVotes >= majority) nextStatus = 'approved';
        if (noVotes >= majority) nextStatus = 'rejected';

        const voteMessage =
          voteValue === 'yes'
            ? `${currentUser.name} voted YES.`
            : `${currentUser.name} voted NO.`;

        const resultMessage =
          nextStatus === 'approved'
            ? `Donation approved for ${group.activeVote.ngoName}.`
            : nextStatus === 'rejected'
              ? `Donation rejected for ${group.activeVote.ngoName}.`
              : '';

        return {
          ...group,
          activeVote: {
            ...group.activeVote,
            votes: updatedVotes,
            status: nextStatus,
          },
          chatMessages: [
            ...group.chatMessages,
            {
              id: `msg-${Date.now()}-${Math.random()}`,
              type: 'message',
              authorName: currentUser.name,
              text: voteMessage,
              createdAt: new Date().toISOString(),
            },
            ...(resultMessage
              ? [
                  {
                    id: `msg-${Date.now()}-${Math.random()}-result`,
                    type: 'system' as const,
                    authorName: 'System',
                    text: resultMessage,
                    createdAt: new Date().toISOString(),
                  },
                ]
              : []),
          ],
        };
      })
    );
  };

  return (
    <ScreenGradientLayout variant="default">
      <div className="space-y-4 pb-6">
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

          <div className="mt-8 flex justify-center gap-8">
            <button
              type="button"
              onClick={() => {
                setShowAddFriends((prev) => !prev);
                setShowAchievements(false);
                setShowCreateGroup(false);
                setSelectedGroupId(null);
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
                setShowCreateGroup((prev) => !prev);
                setShowAddFriends(false);
                setShowAchievements(false);
                setSelectedGroupId(null);
              }}
              className="group flex flex-col items-center gap-2 transition active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[2px]">
                <Plus className="h-[18px] w-[18px] text-white" strokeWidth={2.25} />
              </span>
              <span className="w-full max-w-[5.5rem] text-center text-xs font-semibold leading-snug text-white drop-shadow-sm">
                Create Group
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAchievements((prev) => !prev);
                setShowAddFriends(false);
                setShowCreateGroup(false);
                setSelectedGroupId(null);
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

        <div className="space-y-4 px-4">
          {showAddFriends && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Friends</CardTitle>
                <CardDescription>Search users or accept pending requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input placeholder="Enter username or email..." className="h-11 rounded-xl" />
                  <Button className="h-10 w-full bg-emerald-600 hover:bg-emerald-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Search Friend
                  </Button>
                </div>

                {pendingRequests.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold">Pending Requests</p>

                    {pendingRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white">
                            {request.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="text-sm font-medium">{request.name}</p>
                          <p className="text-xs text-muted-foreground">Wants to be friends</p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="h-8 bg-emerald-600 px-3 hover:bg-emerald-700">
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

                <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardContent className="pt-5 pb-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                        <Share2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                          Invite Friends
                        </h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          Share Impact Wallet and earn bonus points
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="h-9 w-full border-emerald-300">
                      <Share2 className="mr-2 h-3.5 w-3.5" />
                      Share Invite Link
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {showCreateGroup && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create Group</CardTitle>
                <CardDescription>Create a group chat with your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group name</label>
                  <Input
                    placeholder="e.g. Best Friends"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">Select friends</p>

                  {friends.map((friend) => {
                    const isSelected = selectedGroupMembers.includes(friend.id);

                    return (
                      <button
                        key={friend.id}
                        type="button"
                        onClick={() => toggleGroupMember(friend.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                            : 'border-border bg-secondary/30'
                        }`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="text-sm font-medium">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">Level {friend.level}</p>
                        </div>

                        {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                <Button
                  className="h-10 w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedGroupMembers.length === 0}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
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

          {!showAchievements && !showAddFriends && !showCreateGroup && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Groups</CardTitle>
                  <CardDescription>Open the chat without leaving this page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`w-full rounded-xl border p-4 transition ${
                        selectedGroupId === group.id
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                          : 'bg-white dark:bg-background'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold">{group.name}</h4>
                            {group.adminId === currentUser.id && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                <Crown className="h-3 w-3" />
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {group.members.length} members
                          </p>
                        </div>

                        <Button
                          size="sm"
                          className="shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                          onClick={() =>
                            setSelectedGroupId((prev) => (prev === group.id ? null : group.id))
                          }
                        >
                          <MessageCircle className="mr-1.5 h-4 w-4" />
                          {selectedGroupId === group.id ? 'Close' : 'Chat'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {selectedGroup && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                          {selectedGroup.name}
                          {selectedGroup.adminId === currentUser.id && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              <Crown className="h-3 w-3" />
                              Admin
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>{selectedGroup.members.length} members</CardDescription>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGroupId(null);
                          setChatInput('');
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedGroup.members.map((member) => (
                        <span
                          key={member.id}
                          className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {member.name}
                          {member.id === selectedGroup.adminId ? ' • admin' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <div className="rounded-full border border-border bg-muted/30 px-4 py-2 text-sm font-semibold">
                        Group Points: {selectedGroup.groupPoints}
                      </div>
                    </div>

                    <div className="h-[360px] space-y-3 overflow-y-auto rounded-2xl border bg-muted/20 p-3">
                      {selectedGroup.chatMessages
                        .filter((message) => message.type !== 'system')
                        .map((message) => {
                          const isMe = message.authorName === currentUser.name;

                          return (
                            <div key={message.id}>
                              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                  className={`flex max-w-[78%] flex-col ${
                                    isMe ? 'items-end' : 'items-start'
                                  }`}
                                >
                                  <span className="mb-1 px-1 text-[11px] text-muted-foreground">
                                    {message.authorName}
                                  </span>

                                  <div
                                    className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                                      isMe
                                        ? 'rounded-br-md bg-emerald-600 text-white'
                                        : 'rounded-bl-md border bg-background text-foreground'
                                    }`}
                                  >
                                    {message.text}
                                  </div>
                                </div>
                              </div>

                              {message.type === 'vote' && selectedGroup.activeVote && (
                                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                                  <div className="space-y-1">
                                    <p className="text-sm font-semibold">
                                      {selectedGroup.activeVote.ngoName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {selectedGroup.activeVote.euroAmount} € · {selectedGroup.activeVote.points} pts
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Status: {selectedGroup.activeVote.status}
                                    </p>
                                  </div>

                                  <div className="mt-3 space-y-1">
                                    {selectedGroup.activeVote.votes.map((vote) => (
                                      <p key={vote.friendId} className="text-xs text-muted-foreground">
                                        {getMemberName(selectedGroup, vote.friendId)} voted{' '}
                                        <span
                                          className={
                                            vote.vote === 'yes' ? 'text-emerald-600' : 'text-red-500'
                                          }
                                        >
                                          {vote.vote.toUpperCase()}
                                        </span>
                                      </p>
                                    ))}
                                  </div>

                                  {!selectedGroup.activeVote.votes.some(
                                    (vote) => vote.friendId === currentUser.id
                                  ) && selectedGroup.activeVote.status === 'open' && (
                                    <div className="mt-3 flex gap-2">
                                      <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => handleVote(selectedGroup.id, 'yes')}
                                      >
                                        Vote Yes
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleVote(selectedGroup.id, 'no')}
                                      >
                                        Vote No
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border bg-background p-2">
                      <Input
                        placeholder="Write a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendChatMessage();
                        }}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() => {
                          setSelectedGroupPoints(Math.min(100, totalPoints));
                          setShowAddPointsSheet(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        className="h-10 w-10 rounded-full bg-emerald-600 p-0 hover:bg-emerald-700"
                        onClick={handleSendChatMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-xl border-0 bg-secondary/50"
              />

              <div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <Card
                    key={friend.id}
                    className="overflow-hidden border bg-white transition-all duration-300 hover:shadow-lg dark:bg-background"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white">
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
                            <h4 className="text-sm font-semibold">{friend.name}</h4>
                            <span className="text-xs text-muted-foreground">L{friend.level}</span>
                          </div>

                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{friend.points} pts</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-emerald-500" />
                              {friend.savingsStreak} days
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => openTradeDialog(friend, 'send')}
                        >
                          <Send className="mr-1.5 h-3.5 w-3.5" />
                          Send
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => openTradeDialog(friend, 'request')}
                        >
                          <Gift className="mr-1.5 h-3.5 w-3.5" />
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

        <Sheet open={showAddPointsSheet} onOpenChange={setShowAddPointsSheet}>
          <SheetContent
            side="bottom"
            className="max-h-[40vh] overflow-y-auto rounded-t-2xl border-t bg-background px-4 pb-4 pt-1 sm:mx-auto sm:max-w-md"
          >
            <SheetHeader className="space-y-0 py-0 text-left">
              <SheetTitle className="text-base leading-none">Add points</SheetTitle>
              <p className="mt-0.5 text-xs leading-none text-muted-foreground">
                {selectedGroup?.name ?? 'Group'}
              </p>
            </SheetHeader>

<div className="mt-0.5 rounded-xl border border-dashed border-border bg-muted/20 p-1.5 text-[11px] leading-tight text-muted-foreground">              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Points</span>
                <span className="text-xl font-bold tabular-nums">{selectedGroupPoints}</span>
              </div>

              <input
                type="range"
                min={0}
                max={totalPoints}
                step={1}
                value={selectedGroupPoints}
                onChange={(e) => setSelectedGroupPoints(parseInt(e.target.value, 10))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-emerald-600"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{totalPoints}</span>
              </div>

              <Button
                type="button"
                size="sm"
                className="w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => setSelectedGroupPoints(totalPoints)}
              >
                MAX
              </Button>
            </div>

            <div className="mt-0.5 rounded-xl border border-dashed border-border bg-muted/20 p-1.5 text-[11px] leading-tight text-muted-foreground">
              Group total after adding:
              <strong className="ml-1 text-foreground">
                {(selectedGroup?.groupPoints ?? 0) + selectedGroupPoints} pts
              </strong>
            </div>

            <div className="mt-1 rounded-xl border border-border bg-muted/30 p-2 text-[11px] leading-tight text-muted-foreground">
              You currently have <strong className="text-foreground">{totalPoints} pts</strong>.
            </div>

            <Button
              type="button"
              className="mt-1.5 h-10 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/90"
              onClick={handleAddPointsToGroup}
              disabled={selectedGroupPoints <= 0 || selectedGroupPoints > totalPoints}
            >
              Confirm add · {selectedGroupPoints} pts
            </Button>
          </SheetContent>
        </Sheet>

        {showTradeDialog && selectedFriend && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
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
                <div className="flex items-center justify-center gap-3 rounded-xl bg-secondary/50 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white">
                      {selectedFriend.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
                    <span className="text-sm font-bold text-white">YOU</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter points amount"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="h-11"
                    max={tradeType === 'send' ? totalPoints : undefined}
                  />
                  {tradeType === 'send' && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
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
                    disabled={
                      !tradeAmount ||
                      (tradeType === 'send' && parseInt(tradeAmount, 10) > totalPoints)
                    }
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