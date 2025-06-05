// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [mood, setMood] = useState('');
  const [lastMood, setLastMood] = useState('');
  const [moodLogs, setMoodLogs] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const moodEmojis = ['😊', '😔', '😴', '😡', '🤔', '😍', '🤗', '😰', '🎉', '😎'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setXp(data.xp || 0);
          setLevel(Math.floor((data.xp || 0) / 100) + 1);
          const logs = data.moodLogs || [];
          setMoodLogs(logs);
          if (logs.length > 0) {
            setLastMood(logs[logs.length - 1].mood);
          }
        } else {
          await setDoc(docRef, { xp: 0, moodLogs: [] });
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleMoodSubmit = async () => {
    if (!mood.trim()) {
      alert("Please enter a mood.");
      return;
    }

    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const data = userSnap.exists() ? userSnap.data() : { xp: 0, moodLogs: [] };
      const newXp = (data.xp || 0) + 10;
      const newMoodLogs = [...(data.moodLogs || [])];
      
      newMoodLogs.push({
        mood: mood,
        date: new Date().toISOString(),
      });

      await updateDoc(userRef, {
        xp: newXp,
        moodLogs: newMoodLogs,
      });

      setXp(newXp);
      setLevel(Math.floor(newXp / 100) + 1);
      setLastMood(mood);
      setMoodLogs(newMoodLogs);
      setMood('');
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting mood:', error);
      alert('Error submitting mood: ' + error.message);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMood(mood + emoji);
  };

  const getProgressPercentage = () => {
    const currentLevelXP = xp % 100;
    return (currentLevelXP / 100) * 100;
  };

  const getStreakDays = () => {
    if (moodLogs.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = moodLogs.length - 1; i >= 0; i--) {
      const logDate = new Date(moodLogs[i].date);
      const daysDiff = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in first</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-background">
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="user-info">
          <div className="avatar">
            <span className="avatar-emoji">🎮</span>
          </div>
          <div className="user-details">
            <h2>Welcome back!</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <span>Logout</span>
          <span>🚪</span>
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card xp-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Experience Points</h3>
            <div className="xp-display">{xp} XP</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p>{100 - (xp % 100)} XP to next level</p>
          </div>
        </div>

        <div className="stat-card level-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Current Level</h3>
            <div className="level-display">{level}</div>
            <p className="level-title">
              {level === 1 ? 'Novice Explorer' : 
               level <= 5 ? 'Mood Tracker' :
               level <= 10 ? 'Emotion Master' :
               'Wellness Guru'}
            </p>
          </div>
        </div>

        <div className="stat-card streak-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <div className="streak-display">{getStreakDays()}</div>
            <p>{getStreakDays() === 1 ? 'day' : 'days'} in a row</p>
          </div>
        </div>

        <div className="stat-card mood-card">
          <div className="stat-icon">💭</div>
          <div className="stat-content">
            <h3>Last Mood</h3>
            <div className="last-mood">{lastMood || '❓'}</div>
            <p>{lastMood ? 'Keep it up!' : 'Share your first mood'}</p>
          </div>
        </div>
      </div>

      <div className="mood-input-section">
        <div className="mood-card">
          <h3>How are you feeling today?</h3>
          <p className="mood-subtitle">Express yourself and earn 10 XP!</p>
          
          <div className="emoji-picker">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                className="emoji-btn"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="mood-input-group">
            <input
              type="text"
              placeholder="Type your mood or click emojis above..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mood-input"
              onKeyDown={(e) => e.key === 'Enter' && handleMoodSubmit()}
            />
            <button 
              onClick={handleMoodSubmit} 
              className="submit-mood-btn"
              disabled={!mood.trim()}
            >
              <span>Submit</span>
              <span>🚀</span>
            </button>
          </div>
        </div>
      </div>

      <div className="recent-moods">
        <h3>Recent Moods</h3>
        <div className="mood-timeline">
          {moodLogs.slice(-5).reverse().map((log, index) => (
            <div key={index} className="mood-entry">
              <div className="mood-emoji">{log.mood}</div>
              <div className="mood-date">
                {new Date(log.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {moodLogs.length === 0 && (
            <p className="no-moods">No moods logged yet. Start your journey!</p>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="success-notification">
          <div className="success-content">
            <span className="success-icon">🎉</span>
            <div>
              <h4>Mood logged successfully!</h4>
              <p>+10 XP earned</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;