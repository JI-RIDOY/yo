import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaSnowflake, FaFire, FaStar, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const { currentUser, loginWithGoogle } = useAuth();
  const [timeLeft, setTimeLeft] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [newYearReached, setNewYearReached] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showNewYearMessage, setShowNewYearMessage] = useState(false);

  // Countdown to New Year
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const newYear = new Date(`January 1, ${currentYear + 1} 00:00:00`);
      const difference = newYear - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    };

    const updateTimer = () => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      
      // Check if countdown has reached zero
      if (time.total <= 0 && !newYearReached) {
        setNewYearReached(true);
        setShowNewYearMessage(true);
        setShowConfetti(true);
        
        // Play celebration sound (optional)
        if (typeof Audio !== 'undefined') {
          const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-new-year-horn-610.mp3');
          audio.play().catch(e => console.log("Audio play failed:", e));
        }
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [newYearReached]);

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 5,
      duration: Math.random() * 10 + 5
    }));
    setParticles(newParticles);
  }, []);

  // Auto-hide the New Year message after 10 seconds
  useEffect(() => {
    if (showNewYearMessage) {
      const timer = setTimeout(() => {
        setShowNewYearMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showNewYearMessage]);

  // Auto-stop confetti after 8 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const countdownItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 opacity-20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(particle.id) * 50, 0],
              rotate: 360
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 150 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%'
                }}
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: '110vh',
                  rotate: 360,
                  x: Math.sin(i) * 100
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  ease: "easeOut"
                }}
              >
                <FaStar className={`w-full h-full ${i % 5 === 0 ? 'text-yellow-400' : i % 5 === 1 ? 'text-pink-400' : i % 5 === 2 ? 'text-blue-400' : i % 5 === 3 ? 'text-green-400' : 'text-red-400'}`} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* New Year Celebration Message */}
      <AnimatePresence>
        {showNewYearMessage && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative z-50 text-center p-12 rounded-3xl bg-gradient-to-br from-yellow-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 shadow-2xl max-w-2xl mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  scale: { repeat: Infinity, duration: 2 },
                  rotate: { repeat: Infinity, duration: 3 }
                }}
                className="text-8xl mb-8"
              >
                🎊
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500"
              >
                HAPPY NEW YEAR!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-white mb-8"
              >
                Welcome to {new Date().getFullYear() + 1}!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-200 mb-10 max-w-xl mx-auto"
              >
                May this new year bring you happiness, success, and countless joyful moments!
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewYearMessage(false)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg"
              >
                Continue Celebration
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
            {newYearReached ? '🎊 Happy New Year! 🎊' : '🎉 New Year Countdown 🎉'}
          </h1>
          <p className="text-md text-gray-300 mb-2">
            {newYearReached 
              ? 'Welcome to an amazing new year!' 
              : 'Welcome to the celebration of new beginnings!'
            }
          </p>
          <p className="text-sm text-gray-400">
            {newYearReached
              ? 'Cheers to new adventures and memories!'
              : 'Join us in counting down to an amazing year ahead'
            }
          </p>
        </motion.div>

        {/* Countdown Timer or Celebration Message */}
        {!newYearReached ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="max-w-xl mx-auto mb-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {countdownItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-2xl border border-purple-500/20">
                    <motion.div
                      key={item.value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-bold text-white mb-2"
                    >
                      {String(item.value).padStart(2, '0')}
                    </motion.div>
                    <div className="text-gray-400 text-sm md:text-lg uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur opacity-30 -z-10"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="max-w-3xl mx-auto mb-10 text-center"
          >
            <div className="bg-gradient-to-br from-yellow-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-6"
              >
                🎆✨🎇
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-6">
                The Celebration Has Begun!
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                It's {new Date().getFullYear() + 1}! Time for new beginnings, fresh starts, and amazing adventures!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl"
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-bold text-white">Set Goals</h3>
                  <p className="text-sm text-gray-300">Make this year count</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl"
                >
                  <div className="text-3xl mb-2">❤️</div>
                  <h3 className="font-bold text-white">Spread Love</h3>
                  <p className="text-sm text-gray-300">Share joy with everyone</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl"
                >
                  <div className="text-3xl mb-2">✨</div>
                  <h3 className="font-bold text-white">Celebrate</h3>
                  <p className="text-sm text-gray-300">Enjoy every moment</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Auth Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
            {currentUser ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-6"
                >
                  <FaBell className="w-16 h-16 mx-auto text-yellow-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {newYearReached ? '🎊 Happy New Year! 🎊' : '🎊 Thanks for Joining! 🎊'}
                </h2>
                <p className="text-gray-300 mb-6">
                  {newYearReached 
                    ? 'Wishing you an amazing year ahead!' 
                    : 'A warm New Year message will be sent to you soon!'
                  }
                </p>
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                  <p className="text-lg font-semibold text-green-400">
                    Welcome, {currentUser.displayName || 'Friend'}!
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {currentUser.email}
                  </p>
                </div>
                {newYearReached && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewYearMessage(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg"
                  >
                    Show Celebration Again
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  {newYearReached ? 'Join the Celebration!' : 'Join the Countdown!'}
                </h2>
                <p className="text-gray-300 mb-8">
                  {newYearReached
                    ? 'Sign in to receive special New Year wishes and celebrate with us!'
                    : 'Sign in to receive a special New Year wish and be part of our celebration!'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="group-hover:scale-110 transition-transform"
                  >
                    <FaGoogle />
                  </motion.div>
                  <span>Continue with Google</span>
                </motion.button>
                <p className="text-sm text-gray-400 mt-6">
                  Secure login • No spam • Only festive wishes!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Additional Festive Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="flex justify-center gap-8 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                className="text-4xl"
              >
                {i === 1 ? '🎆' : i === 2 ? '✨' : i === 3 ? '🎇' : i === 4 ? '🥂' : '🎊'}
              </motion.div>
            ))}
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {newYearReached
              ? '"The beginning is the most important part of the work."'
              : '"Cheers to a new year and another chance for us to get it right."'
            }
            <br />
            <span className="text-sm opacity-75">
              {newYearReached ? '- Plato' : '- Oprah Winfrey'}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-8 text-gray-500 text-sm"
      >
        <p>Made with ❤️ for New Year Celebrations • {newYearReached ? new Date().getFullYear() + 1 : new Date().getFullYear()}</p>
      </motion.footer>
    </div>
  );
}

export default Hero;