import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [platforms, setPlatforms] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false,
  });
  const [postText, setPostText] = useState('');
  const [imageURL, setImageURL] = useState('https://placehold.co/600x400');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Check for existing token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    }
    
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success) {
      alert(`Successfully connected ${success.replace('_connected', '')} account!`);
      if (savedToken) fetchConnectedAccounts(savedToken);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (error) {
      alert(`Connection failed: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        fetchConnectedAccounts(authToken);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('token');
    }
  };

  // Fetch connected social accounts
  const fetchConnectedAccounts = async (authToken) => {
    try {
      const response = await axios.get('http://localhost:5000/api/social/accounts', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data.success) {
        setConnectedAccounts(response.data.accounts);
      }
    } catch (error) {
      console.error('Failed to fetch connected accounts:', error);
    }
  };

  // Handle authentication (login/register)
  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? 'login' : 'register';
      const payload = authMode === 'login' 
        ? { email: authData.email, password: authData.password }
        : authData;

      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        setToken(newToken);
        setUser(newUser);
        setIsLoggedIn(true);
        localStorage.setItem('token', newToken);
        setShowAuthModal(false);
        setAuthData({ name: '', email: '', password: '' });
        fetchConnectedAccounts(newToken);
        alert(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToken('');
    setUser(null);
    setIsLoggedIn(false);
    setConnectedAccounts([]);
    localStorage.removeItem('token');
  };

  // Connect social media account
  const connectSocialAccount = async (platform) => {
    if (!isLoggedIn) {
      alert('Please log in first to connect social media accounts');
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/social/${platform}/auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Open OAuth URL in new window
        window.open(response.data.authUrl, '_self');
      } else if (response.data.setup_required) {
        alert(response.data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || `Failed to connect ${platform}`;
      alert(message);
    }
  };

  // Check if platform is connected
  const isPlatformConnected = (platform) => {
    return connectedAccounts.some(account => account.platform === platform);
  };

  const handleToggle = (platform) => {
    if (!isLoggedIn) {
      alert('Please log in to select platforms for posting');
      setShowAuthModal(true);
      return;
    }

    if (!isPlatformConnected(platform)) {
      const shouldConnect = window.confirm(
        `You haven't connected your ${platform} account yet. Would you like to connect it now?`
      );
      if (shouldConnect) {
        connectSocialAccount(platform);
        return;
      }
    }

    setPlatforms((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert('Please log in to post to social media');
      setShowAuthModal(true);
      return;
    }

    const selectedPlatforms = Object.keys(platforms).filter((p) => platforms[p]);
    if (selectedPlatforms.length === 0) return alert('Select at least one platform.');
    if (!postText.trim()) return alert('Please enter some text for your post.');

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/posts', { 
        text: postText, 
        imageUrl: imageURL, 
        platforms: selectedPlatforms 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(response.data.message);
        setPostText('');
        setImageURL('https://placehold.co/600x400');
        setPlatforms({
          facebook: false,
          instagram: false,
          twitter: false,
          linkedin: false,
        });
      } else {
        alert(response.data.message || 'Failed to post');
      }
    } catch (err) {
      console.error('Error posting:', err);
      if (err.response) {
        const errorData = err.response.data;
        if (errorData.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map(e => `${e.platform}: ${e.error}`).join('\n');
          alert(`Posting failed:\n${errorMessages}`);
        } else {
          alert(`Failed to post: ${errorData.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        alert('Failed to connect to server. Make sure the backend is running on port 5000.');
      } else {
        alert('Failed to post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold">SocialSync</h1>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.name}!</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition text-sm"
            >
              Login / Register
            </button>
          )}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition text-sm"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Form */}
        <section className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          
          {/* Platform Selection */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Select Platforms:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(platforms).map((platform) => {
                const isConnected = isPlatformConnected(platform);
                const isSelected = platforms[platform];
                
                return (
                  <div key={platform} className="relative">
                    <button
                      onClick={() => handleToggle(platform)}
                      className={`px-3 py-1 rounded-full text-sm capitalize transition flex items-center space-x-2 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={isConnected ? `Connected to ${platform}` : `${platform} not connected`}
                    >
                      <span>{platform}</span>
                      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </button>
                    {!isConnected && isLoggedIn && (
                      <button
                        onClick={() => connectSocialAccount(platform)}
                        className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-blue-600"
                        title={`Connect ${platform}`}
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {isLoggedIn && (
              <p className="text-xs text-gray-500 mt-2">
                Green dots = connected, Red dots = not connected. Click + to connect accounts.
              </p>
            )}
          </div>

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className={`w-full p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 h-32 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          />
          
          <input
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Image URL (optional)"
            className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          />
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-md transition"
          >
            {loading ? 'Posting...' : 'Post Now'}
          </button>
        </section>

        {/* Preview Section */}
        <section className={`lg:col-span-2 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className={`p-4 rounded-md border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
            {postText ? (
              <>
                <p className="mb-3">{postText}</p>
                {imageURL && (
                  <img 
                    src={imageURL} 
                    alt="Post preview" 
                    className="max-w-full h-auto rounded-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </>
            ) : (
              <p className="text-gray-500 italic">Your post preview will appear here...</p>
            )}
          </div>
        </section>
      </main>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">
              {authMode === 'login' ? 'Login' : 'Register'}
            </h2>
            
            <div className="space-y-4">
              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={authData.name}
                  onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                />
              )}
              
              <input
                type="email"
                placeholder="Email Address"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
              
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                className={`w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAuth}
                disabled={loading}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-md transition"
              >
                {loading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Register')}
              </button>
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 