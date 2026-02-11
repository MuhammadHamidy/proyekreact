import { useState, useEffect } from 'react';
import { Heart, Sparkles, Gift, MapPin, Clock, Calendar } from 'lucide-react';

// Type definitions
interface Balloon {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

interface Firework {
  id: number;
  left: number;
  color: string;
  delay: number;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  color: string;
  rotation: number;
}

type Stage = 'birthday' | 'invitation';

export default function BirthdayInvitation() {
  const [stage, setStage] = useState<Stage>('birthday');
  const [candlesBlown, setCandlesBlown] = useState<number>(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showRSVP, setShowRSVP] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Generate balloons
  useEffect(() => {
    if (stage === 'birthday') {
      const newBalloons: Balloon[] = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        color: ['#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', '#6BCB77'][Math.floor(Math.random() * 5)]
      }));
      setBalloons(newBalloons);
    }
  }, [stage]);

  // Play birthday song
  const playBirthdaySong = () => {
    if (!isPlaying) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [
        { freq: 264, duration: 0.4 }, { freq: 264, duration: 0.4 }, { freq: 297, duration: 0.8 },
        { freq: 264, duration: 0.8 }, { freq: 352, duration: 0.8 }, { freq: 330, duration: 1.6 },
        { freq: 264, duration: 0.4 }, { freq: 264, duration: 0.4 }, { freq: 297, duration: 0.8 },
        { freq: 264, duration: 0.8 }, { freq: 396, duration: 0.8 }, { freq: 352, duration: 1.6 },
      ];

      let currentTime = audioContext.currentTime;
      notes.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);

        currentTime += note.duration;
      });

      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), currentTime * 1000);
    }
  };

  // Blow candle
  const blowCandle = () => {
    if (candlesBlown < 3) {
      setCandlesBlown(prev => prev + 1);
      playBirthdaySong();

      if (candlesBlown === 2) {
        setTimeout(() => {
          triggerFireworks();
          setShowMessage(true);
        }, 500);
      }
    }
  };

  // Trigger fireworks
  const triggerFireworks = () => {
    const colors = ['#FF6B9D', '#FFD93D', '#6BCB77', '#C44569', '#FFA07A'];
    const newFireworks: Firework[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: 20 + Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1
    }));
    setFireworks(newFireworks);

    const newConfetti: Confetti[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    }));
    setConfetti(newConfetti);

    setTimeout(() => {
      setFireworks([]);
      setConfetti([]);
    }, 3000);
  };

  // Pop balloon
  const popBalloon = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    playBirthdaySong();
  };

  const goToInvitation = () => {
    setStage('invitation');
  };

  if (stage === 'birthday') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 overflow-hidden relative">
        {/* Clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 15}%`,
                left: `-20%`,
                animation: `cloudFloat ${20 + i * 5}s linear infinite`,
                animationDelay: `${i * 3}s`
              }}
            >
              <div className="relative">
                <div className="flex items-end">
                  <div className="w-16 h-12 bg-white rounded-full opacity-70"></div>
                  <div className="w-20 h-16 bg-white rounded-full opacity-70 -ml-8"></div>
                  <div className="w-24 h-14 bg-white rounded-full opacity-70 -ml-10"></div>
                  <div className="w-16 h-10 bg-white rounded-full opacity-70 -ml-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Balloons */}
        {balloons.map(balloon => (
          <div
            key={balloon.id}
            onClick={() => popBalloon(balloon.id)}
            className="absolute cursor-pointer transform hover:scale-110 transition-transform"
            style={{
              left: `${balloon.left}%`,
              animation: `float ${balloon.duration}s ease-in-out infinite`,
              animationDelay: `${balloon.delay}s`,
              bottom: '-100px'
            }}
          >
            <div className="relative">
              <div
                className="w-16 h-20 rounded-full relative shadow-lg"
                style={{
                  backgroundColor: balloon.color,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                }}
              >
                <div className="absolute top-2 left-3 w-5 h-7 bg-white opacity-40 rounded-full blur-sm"></div>
                <div className="absolute top-3 left-4 w-3 h-4 bg-white opacity-60 rounded-full"></div>
                <div className="absolute top-8 right-3 w-2 h-3 bg-white opacity-20 rounded-full"></div>
                <div className="absolute bottom-0 inset-x-0 h-6 bg-black opacity-10 rounded-full blur-sm"></div>
              </div>

              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div
                  className="w-3 h-4 rounded-full"
                  style={{
                    backgroundColor: balloon.color,
                    filter: 'brightness(0.8)'
                  }}
                ></div>
              </div>

              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <svg width="2" height="60" className="overflow-visible">
                  <path
                    d="M 1 0 Q 5 15, 1 30 T 1 60"
                    stroke="#888"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* Fireworks */}
        {fireworks.map(fw => (
          <div
            key={fw.id}
            className="absolute"
            style={{
              left: `${fw.left}%`,
              top: '20%',
              animation: `firework 1s ease-out`,
              animationDelay: `${fw.delay}s`
            }}
          >
            <div className="relative">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: fw.color,
                    transform: `rotate(${i * 30}deg) translateY(-50px)`,
                    opacity: 0,
                    animation: `sparkle 1s ease-out`,
                    animationDelay: `${fw.delay}s`
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Confetti */}
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${c.left}%`,
              top: '-10px',
              backgroundColor: c.color,
              animation: `confettiFall 3s linear`,
              animationDelay: `${c.delay}s`,
              transform: `rotate(${c.rotation}deg)`
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
          {/* Photo Frame */}
          <div className="mb-8 animate-fadeIn">
            <div className="relative group">
              <Heart className="absolute -top-6 -left-6 w-8 h-8 text-pink-400 animate-pulse" />
              <Heart className="absolute -top-6 -right-6 w-8 h-8 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <Heart className="absolute -bottom-6 -left-6 w-8 h-8 text-pink-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              <Heart className="absolute -bottom-6 -right-6 w-8 h-8 text-pink-400 animate-pulse" style={{ animationDelay: '0.9s' }} />

              <div className="relative bg-gradient-to-br from-pink-300 via-purple-300 to-pink-300 p-6 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                <div className="bg-white p-4 rounded-2xl shadow-inner">
                  <div className="w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden relative border-4 border-pink-200 shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* <div className="text-center p-8">
                        <Heart className="w-16 h-16 text-pink-300 mx-auto mb-3" />
                        <p className="text-pink-400 font-semibold text-sm">
                          Foto Kita Berdua
                        </p>
                        <p className="text-pink-300 text-xs mt-2">
                    
                        </p>
                      </div> */}
                    </div>

                    <img
                      src="src\assets\image.png"
                      alt="Our Photo"
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent pointer-events-none"></div>
                  </div>
                </div>

                <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-yellow-300 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-yellow-300 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-yellow-300 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-yellow-300 rounded-br-lg"></div>
              </div>

              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border-2 border-pink-300">
                <p className="text-pink-600 font-semibold text-sm whitespace-nowrap">My Love 💕</p>
              </div>
            </div>
          </div>

          {/* Birthday Message */}
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-6xl font-bold text-pink-600 mb-4" style={{ fontFamily: 'cursive' }}>
              Happy Birthday
            </h1>
            <h2 className="text-4xl font-semibold text-purple-600 mb-2" style={{ fontFamily: 'cursive' }}>
              Pebry Ajeng Cahyani 💕
            </h2>
            <p className="text-xl text-gray-700 italic">Tiup lilin dan buat permintaan...</p>
          </div>

          {/* Birthday Cake */}
          <div className="relative mb-8 inline-block">
            <div className="flex justify-center gap-12 mb-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  onClick={() => blowCandle()}
                  className="cursor-pointer transform hover:scale-110 transition-transform"
                >
                  <div className="relative">
                    {candlesBlown <= index && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                        <div className="relative w-6 h-10">
                          <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-flicker"></div>
                          <div className="absolute inset-1 bg-gradient-to-t from-yellow-300 to-white rounded-full opacity-70 animate-flicker"></div>
                        </div>
                      </div>
                    )}

                    {candlesBlown > index && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-12 bg-gray-400 opacity-50 animate-smoke rounded-full"></div>
                      </div>
                    )}

                    <div className="w-5 h-20 bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-400 rounded-sm border-2 border-yellow-500 shadow-lg relative">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-white opacity-30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="relative mb-1">
                <div className="w-80 h-20 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 rounded-t-2xl mx-auto relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-20"></div>

                  <div className="absolute inset-0 flex items-center justify-around px-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-white rounded-full opacity-40"></div>
                    ))}
                  </div>

                  <div className="absolute -top-1 inset-x-0 flex justify-around">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-4 bg-white rounded-b-full opacity-70"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mb-1">
                <div className="w-96 h-24 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 mx-auto relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-10"></div>

                  <div className="absolute inset-0 flex items-center justify-around px-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute -top-1 inset-x-0 flex justify-around">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-4 bg-white rounded-b-full opacity-60"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-8 bg-gradient-to-r from-pink-600 via-pink-700 to-pink-600 rounded-b-2xl mx-auto shadow-2xl">
                  <div className="absolute bottom-0 inset-x-0 h-2 bg-pink-800 rounded-b-2xl"></div>
                </div>
              </div>

              <div className="w-full h-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full mt-2 shadow-inner"></div>
            </div>
          </div>

          {showMessage && (
            <div className="text-center animate-bounceIn bg-white rounded-2xl p-8 shadow-2xl max-w-md">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
              <p className="text-2xl font-semibold text-pink-600 mb-4">
                Selamat Ulang Tahun Pebry Sayangku! 🎉
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Di hari istimewamu ini, aku ingin memberikan sesuatu yang spesial untukmu...
              </p>
              <button
                onClick={goToInvitation}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2 mx-auto"
              >
                <Gift className="w-5 h-5" />
                Buka Undangan
              </button>
            </div>
          )}

          {!showMessage && (
            <p className="text-gray-600 text-sm mt-4 animate-pulse">
              Klik pada lilin untuk meniupnya ✨
            </p>
          )}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-100vh) rotate(5deg); }
          }
          @keyframes cloudFloat {
            0% { transform: translateX(0); }
            100% { transform: translateX(120vw); }
          }
          @keyframes flicker {
            0%, 100% { transform: scale(1) translateY(0); opacity: 1; }
            50% { transform: scale(1.1) translateY(-2px); opacity: 0.8; }
          }
          @keyframes smoke {
            0% { transform: translateY(0) scale(1); opacity: 0.5; }
            100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
          }
          @keyframes firework {
            0% { transform: translateY(0) scale(0); opacity: 1; }
            100% { transform: translateY(-100px) scale(1); opacity: 0; }
          }
          @keyframes sparkle {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Invitation Stage
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <Heart
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${20 + Math.random() * 20}px`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ animationDuration: '3s' }} />
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>
                You're Invited!
              </h1>
              <p className="text-xl opacity-90">Perayaan Ulang Tahun Spesial</p>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-3xl font-semibold text-pink-600 mb-4" style={{ fontFamily: 'cursive' }}>
                Untuk Pebry 💕
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Hari ini adalah hari yang sangat spesial, dan aku ingin merayakannya bersama orang yang paling berarti dalam hidupku.
                Akan ada kejutan spesial yang sudah aku persiapkan untukmu!
              </p>
            </div>

            <div className="space-y-6 bg-pink-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Tanggal</p>
                  <p className="text-gray-600">12 Februari 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Waktu</p>
                  <p className="text-gray-600">10.00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Lokasi</p>
                  <p className="text-gray-600">Rumahku</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Gift className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Dress Code</p>
                  <p className="text-gray-600">Kasual & Cantik seperti biasa ✨</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6">
              <Heart className="w-10 h-10 text-pink-500 mx-auto mb-3" />
              <p className="text-gray-700 italic leading-relaxed">
                "Kehadiranmu adalah hadiah terbaik untukku.
                Aku sudah menyiapkan sesuatu yang spesial dan tidak sabar untuk melihat senyummu!"
              </p>
              <p className="text-pink-600 font-semibold mt-4">
                Dengan cinta, dari yang selalu menyayangimu ❤️
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Mohon konfirmasi kehadiranmu ya sayang 🥺</p>
              <button
                onClick={() => setShowRSVP(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all shadow-lg"
              >
                Aku Pasti Datang! 💕
              </button>
            </div>
          </div>
        </div>

        {/* RSVP Popup */}
        {showRSVP && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-bounceIn relative">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <Heart className="w-24 h-24 text-pink-500 animate-bounce" fill="currentColor" />
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: 'cursive' }}>
                  Yey! Ditunggu Ya!
                </h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  aku tunggu kehadirannya ya sayang 😘
                </p>

                <button
                  onClick={() => setShowRSVP(false)}
                  className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-pink-200 transition-colors"
                >
                  Tutup
                </button>
              </div>

              {/* Decorative confetti */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-spin"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: '8px',
                    height: '8px',
                    backgroundColor: ['#FF6B9D', '#FFD93D', '#6BCB77'][i % 3],
                    animationDuration: `${2 + Math.random()}s`,
                    zIndex: -1
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          {[...Array(5)].map((_, i) => (
            <Heart
              key={i}
              className="text-pink-400 animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                width: `${20 + i * 5}px`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}