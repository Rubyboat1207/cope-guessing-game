import React, { useRef, useState } from 'react';
import { Upload, Reply, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import _210percent from '/src/assets/pfp/210percent.jpg'
import _wiryweare from '/src/assets/pfp/wiryweare.png'
import _bigf_ from '/src/assets/pfp/bigf_.png'
import _bioluminescentcod from '/src/assets/pfp/bioluminescentcod.webp'
import _dirtybandaidgaming from '/src/assets/pfp/dirtybandaidgaming.webp'
import _doublesnapps from '/src/assets/pfp/doublesnapps.png'
import _lundshurk from '/src/assets/pfp/lundshurk.png'
import _napalmintheair from '/src/assets/pfp/napalmintheair.png'
import _rubyboat from '/src/assets/pfp/rubyboat.png'
import dayjs from 'dayjs';

interface Message {
  user: string,
  message: string,
  date: number,
  msg_id: number,
  replying_to: number | null
}

interface CopeMember {
  username: string,
  nickname: string,
  avatar: string | null,
  avatarColor: string,
  status?: string
}

// Confetti component
const Confetti = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  const confettiCount = 100;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(confettiCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: -10,
          }}
          initial={{ y: -10, rotate: 0 }}
          animate={{
            y: window.innerHeight + 10,
            rotate: Math.random() * 720 - 360,
            x: Math.random() * 200 - 100,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            ease: "linear",
            delay: Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
};

const DiscordMessageViewer = () => {
  const [screen, setScreen] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [maxGuesses, setMaxGuesses] = useState(3);
  const [guessesLeft, setGuessesLeft] = useState(maxGuesses);
  const [selectedUser, setSelectedUser] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeMessage, setShakeMessage] = useState(false);
  
  const [users, setUsers] = useState<CopeMember[]>([
    {
      username: '210percent',
      nickname: '210Percent',
      avatar: _210percent,
      avatarColor: '#000'
    },
    {
      username: 'bigf_',
      nickname: 'nicholas',
      avatar: _bigf_,
      avatarColor: '#000'
    },
    {
      username: 'bioluminescentcod',
      nickname: 'bioluminescentcod',
      avatar: _bioluminescentcod,
      avatarColor: '#000'
    },
    {
      username: 'dirtybandaidgaming',
      nickname: 'dirty band-aid gaming',
      avatar: _dirtybandaidgaming,
      avatarColor: '#000'
    },
    {
      username: 'doublesnapps',
      nickname: 'DoubleSnapps',
      avatar: _doublesnapps,
      avatarColor: '#000'
    },
    {
      username: 'lundshurk',
      nickname: 'Lundshurk',
      avatar: _lundshurk,
      avatarColor: '#000'
    },
    {
      username: 'napalmintheair',
      nickname: 'Napalm',
      avatar: _napalmintheair,
      avatarColor: '#000'
    },
    {
      username: 'rubyboat',
      nickname: 'Rubyboat',
      avatar: _rubyboat,
      avatarColor: '#000'
    },
    {
      username: 'wiryweare',
      nickname: 'Cyrus',
      avatar: _wiryweare,
      avatarColor: '#000'
    },
  ]);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if(event.target == null) {
        return;
      }
      try {
        const data = JSON.parse((event.target.result || '').toString());
        // Filter messages to only those with usernames
        const filteredMessages = data.filter((msg: Message) => msg.user && msg.user.trim() !== '' && msg.message);
        setMessages(filteredMessages);
        setScreen(2);
        // Display a random message
        if (filteredMessages.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredMessages.length);
          setCurrentMessage(filteredMessages[randomIndex]);
          showRandomMessage()
        }
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if(!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      processFile(file);
    }
  };

  const handleUserUpdate = <K extends keyof CopeMember>(index: number, field: K, value: CopeMember[K]) => {
    const newUsers: CopeMember[] = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers);
  };

  const handleAvatarUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files == null) {
      return;
    }
    
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target == null) {
          return;
        }
        handleUserUpdate(index, 'avatar', (event.target.result || '').toString());
      };
      reader.readAsDataURL(file);
    }
  };

  const addUser = () => {
    setUsers([...users, {
      username: 'newuser',
      nickname: 'New User',
      avatar: null,
      avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16),
      status: ''
    }]);
  };

  const showRandomMessage = () => {
    const userNameDict: {[key: string]: true} = users.reduce((acc, cv) => ({...acc, [cv.username]: true}), {})
    console.log(userNameDict)
    const avaliablemessages = messages.filter(m => userNameDict[m.user])
    console.log('Messages not in userNameDict:', avaliablemessages.filter(m => !userNameDict[m.user]).length);
    if (avaliablemessages.length > 0) {
      const randomIndex = Math.floor(Math.random() * avaliablemessages.length);
      setCurrentMessage(avaliablemessages[randomIndex]);
      setGuessesLeft(maxGuesses);
      setSelectedUser('');
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const handleGuess = () => {
    if (!selectedUser || !currentMessage) return;
    
    setTotalGuesses(totalGuesses + 1);
    
    if (selectedUser === currentMessage.user) {
      setIsCorrect(true);
      setCorrectGuesses(correctGuesses + 1);
      setStreak(streak + 1);
      setShowResult(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      setGuessesLeft(guessesLeft - 1);
      setShakeMessage(true);
      setTimeout(() => setShakeMessage(false), 600);
      if (guessesLeft - 1 === 0) {
        setShowResult(true);
        setStreak(0);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = dayjs(timestamp * 1000);
    const now = dayjs();
    const yesterday = now.subtract(1, 'day');

    const timeString = date.format('h:mm A');

    if (date.isSame(yesterday, 'day')) {
      return `Yesterday at ${timeString}`;
    } else if (date.isSame(now, 'day')) {
      return `Today at ${timeString}`;
    }

    return `${date.format('MM/DD/YYYY')} ${timeString}`;
  };

  const getUserInfo = (username: string) => {
    return users.find(u => u.username === username) || {
      username: username,
      nickname: username,
      avatar: null,
      avatarColor: '#5865F2',
      status: ''
    };
  };

  const renderMessage = (message: Message, isReply = false, hideAuthor = false) => {
    const user = getUserInfo(message.user);
    
    return (
      <div className={`flex ${isReply ? 'mb-1' : 'mb-4'} ${isReply ? 'opacity-60' : ''}`}>
        {!isReply && (
          <div className="mr-4 flex-shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {hideAuthor ? (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-xl">?</span>
                </div>
              ) : (
                user.avatar ? (
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.nickname.charAt(0).toUpperCase()}
                  </div>
                )
              )}
            </motion.div>
          </div>
        )}
        <div className={`flex-1 ${isReply ? 'ml-14' : ''}`}>
          {!isReply && (
            <div className="flex items-baseline mb-1">
              <motion.span 
                className="font-medium text-white mr-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {hideAuthor ? '???' : user.nickname}
              </motion.span>
              <motion.span 
                className="text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {formatDate(message.date)}
              </motion.span>
            </div>
          )}
          <motion.div 
            className={`text-gray-100 ${isReply ? 'text-sm flex items-center' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isReply && (
              <>
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-4 h-4 rounded-full mr-1" />
                ) : (
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs mr-1"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {user.nickname.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-300 mr-1">@{user.nickname}</span>
              </>
            )}
            {message.message}
          </motion.div>
        </div>
      </div>
    );
  };

  const correctnessPercentage = totalGuesses > 0 ? Math.round((correctGuesses / totalGuesses) * 100) : 0;

  if (screen === 1) {
    return (
      <div className="min-h-screen bg-gray-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* File Upload Section */}
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Cope Guessing game</h2>
            <p className="text-gray-400 mb-6">Update the users if you want before uploading. Once you upload, the game starts instantly.</p>
            
            <label 
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
                  : 'border-gray-600 hover:bg-gray-800'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm text-gray-400">
                {isDragging ? 'Drop file here' : 'Upload or drag the cope archive'}
              </span>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleFileUpload} 
                accept=".json" 
              />
            </label>
          </div>

          {/* Game Settings */}
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-6">Game Settings</h3>
            <div className="flex items-center gap-4">
              <label className="text-gray-400">Max Guesses:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxGuesses}
                onChange={(e) => setMaxGuesses(parseInt(e.target.value) || 3)}
                className="w-20 bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* User Configuration Section */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-6">User Profiles</h3>
            
            {users.map((user, index) => (
              <div key={user.username + index} className="mb-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <label className="cursor-pointer">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-20 h-20 rounded-full" />
                      ) : (
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold hover:opacity-80"
                          style={{ backgroundColor: user.avatarColor }}
                        >
                          {user.nickname.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <input type="file" className="hidden" onChange={(e) => handleAvatarUpload(index, e)} accept="image/*" />
                    </label>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      value={user.nickname}
                      onChange={(e) => handleUserUpdate(index, 'nickname', e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nickname"
                    />
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) => handleUserUpdate(index, 'username', e.target.value)}
                      className="w-full bg-gray-700 text-gray-400 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Username"
                    />
                    {user.status && (
                      <div className="mt-2 text-xs text-gray-500">
                        <input
                          type="text"
                          value={user.status}
                          onChange={(e) => handleUserUpdate(index, 'status', e.target.value)}
                          className="w-full bg-transparent text-gray-500 focus:outline-none"
                          placeholder="Status"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={addUser}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white p-8">
      {showConfetti && <Confetti />}
      <div className="max-w-4xl mx-auto">
        {/* Stats Bar */}
        <motion.div 
          className="bg-gray-900 rounded-lg p-4 mb-4 flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Streak: {streak}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              <span>Accuracy: {correctnessPercentage}%</span>
            </div>
            <div className="text-gray-400">
              {correctGuesses}/{totalGuesses} correct
            </div>
          </div>
          <button
            onClick={() => setScreen(1)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
          >
            Back
          </button>
        </motion.div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Who sent this message?</h2>
            <div className="text-sm text-gray-400">
              Guesses left: {guessesLeft}/{maxGuesses}
            </div>
          </div>
          
          {currentMessage && (
            <>
              <motion.div 
                className="bg-gray-700 rounded p-4 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: shakeMessage ? [0, -10, 10, -10, 10, 0] : 0,
                  backgroundColor: shakeMessage ? ['#374151', '#7f1d1d', '#374151'] : '#374151'
                }}
                transition={{ 
                  type: "spring",
                  x: { duration: 0.5 },
                  backgroundColor: { duration: 0.6 }
                }}
              >
                {/* Show reply if this message is replying to another */}
                {currentMessage.replying_to && messages.find(m => m.msg_id === currentMessage.replying_to) && (
                  <div className="mb-2">
                    <div className="flex items-start ml-10">
                      <div className="flex items-center text-gray-400 mr-2">
                        <Reply className="w-4 h-4" style={{ transform: 'scaleX(-1) rotate(180deg)' }} />
                      </div>
                      <div className="flex-1 bg-gray-600 bg-opacity-30 rounded px-2 py-1 text-sm">
                        {(() => {
                          const replyMsg = messages.find(m => m.msg_id === currentMessage.replying_to);
                          if (!replyMsg) return null;
                          const replyUser = getUserInfo(replyMsg.user);
                          return (
                            <div className="flex items-center">
                              {replyUser.avatar ? (
                                <img src={replyUser.avatar} alt="" className="w-4 h-4 rounded-full mr-1" />
                              ) : (
                                <div 
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs mr-1"
                                  style={{ backgroundColor: replyUser.avatarColor }}
                                >
                                  {replyUser.nickname.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-blue-400 mr-1">@{replyUser.nickname}</span>
                              <span className="text-gray-300 truncate">{replyMsg.message}</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Main message */}
                {renderMessage(currentMessage, false, !showResult)}
              </motion.div>

              {/* Guessing Section */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    disabled={showResult}
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select a user...</option>
                    {users.map(user => (
                      <option key={user.username} value={user.username}>
                        {user.nickname}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleGuess}
                    disabled={!selectedUser || showResult}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
                  >
                    Guess
                  </button>
                </div>

                {/* Result Display */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded text-center ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                      {isCorrect ? (
                        <>
                          <h3 className="text-xl font-bold mb-2">Correct! 🎉</h3>
                          <p>It was {getUserInfo(currentMessage.user).nickname}</p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
                          <p>The correct answer was: {getUserInfo(currentMessage.user).nickname}</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {showResult && (
                  <button
                    onClick={showRandomMessage}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
                  >
                    Next Message
                  </button>
                )}
              </div>
            </>
          )}
          
          {!currentMessage && messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No messages loaded. Please upload a JSON file.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscordMessageViewer;