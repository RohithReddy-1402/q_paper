import React, { useState, useEffect } from 'react';
import '../index.css';
const CrackerShotsEffect = () => {
  const [shots, setShots] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const startCrackers = () => {
    setIsActive(true);
    setShots([]);
    setExplosions([]);

    setTimeout(() => {
      setIsActive(false);
      setShots([]);
      setExplosions([]);
    }, 16000);
  };

  const createShot = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#fd79a8', '#fdcb6e'];
    const startX = Math.random() * (window.innerWidth - 100) + 50;
    const targetY = Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.1;

    const shot = {
      id: Date.now() + Math.random(),
      x: startX,
      y: window.innerHeight - 50,
      targetY: targetY,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: [],
    };

    return shot;
  };
  useEffect(() => {
    startCrackers()
  }, [])
  const createExplosion = (shot) => {
    const particleCount = Math.random() * 100 + 25;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const velocity = Math.random() * 8 + 2;

      newParticles.push({
        id: Date.now() + Math.random() + i,
        x: shot.x,
        y: shot.targetY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: shot.color,
        size: Math.random() * 3 + 1,
        life: 120,
        maxLife: 120,
        type: Math.random() > 0.7 ? 'spark' : 'particle',
      });
    }

    return newParticles;
  };
  useEffect(() => {
    if (!isActive) return;

    const animateShots = () => {
      setShots(prev =>
        prev.map(shot => {
          const newY = shot.y - 8;
          const newTrail = [...shot.trail, { x: shot.x, y: shot.y }].slice(-8);

          if (newY <= shot.targetY) {

            const explosion = createExplosion(shot);
            setExplosions(prevExp => [...prevExp, ...explosion]);
            return null;
          }

          return {
            ...shot,
            y: newY,
            trail: newTrail,
          };
        }).filter(Boolean)
      );
    };

    const shotInterval = setInterval(animateShots, 16);
    return () => clearInterval(shotInterval);
  }, [isActive]);
  useEffect(() => {
    if (!isActive) return;

    const createShotInterval = setInterval(() => {

      const newShot = createShot();
      setShots(prev => [...prev, newShot]);
    }, 400);

    return () => clearInterval(createShotInterval);
  }, [isActive]);
  useEffect(() => {
    if (!isActive) return;

    const animateExplosions = () => {
      setExplosions(prev =>
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.08,
          vx: particle.vx * 0.97,
          life: particle.life - 1,
        })).filter(particle => particle.life > 0)
      );
    };

    const explosionInterval = setInterval(animateExplosions, 16);
    return () => clearInterval(explosionInterval);
  }, [isActive]);

  return (
    <>
      <div className='year-model absolute z-[20000] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl'>
        <span>2</span><span>0</span><span>2</span><span>5</span>
        <span className='absolute animate-bounce top-20 right-0.5'>6</span>
      </div>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Control Button - has pointer events */}
        {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 pointer-events-auto z-50">
        <button
          onClick={startCrackers}
          disabled={isActive}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
            isActive 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isActive ? '🎆 Crackers Active...' : '🧨 Fire Crackers!'}
        </button>
      </div> */}

        {/* Shots */}
        {shots.map(shot => (
          <div key={shot.id}>
            {shot.trail.map((point, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  left: point.x - 1,
                  top: point.y - 1,
                  width: 2,
                  height: 4,
                  backgroundColor: shot.color,
                  opacity: (index + 1) / shot.trail.length * 0.6,
                  boxShadow: `0 0 4px ${shot.color}`,
                }}
              />
            ))}

            <div
              className="absolute rounded-full"
              style={{
                left: shot.x - 2,
                top: shot.y - 3,
                width: 4,
                height: 6,
                backgroundColor: shot.color,
                boxShadow: `0 0 10px ${shot.color}, 0 0 20px ${shot.color}`,
                animation: 'shotGlow 0.1s ease-in-out infinite alternate',
              }}
            />
          </div>
        ))}

        {explosions.map(particle => {
          const opacity = particle.life / particle.maxLife;
          const scale = particle.type === 'spark' ? 1.5 : 1;

          return (
            <div
              key={particle.id}
              className="absolute"
              style={{
                left: particle.x - particle.size / 2,
                top: particle.y - particle.size / 2,
                width: particle.size * scale,
                height: particle.size * scale,
                backgroundColor: particle.color,
                opacity: opacity,
                borderRadius: particle.type === 'spark' ? '0' : '50%',
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                transform: particle.type === 'spark' ? `rotate(${particle.vx * 10}deg)` : 'none',
              }}
            />
          );
        })}

        <style jsx>{`
        @keyframes shotGlow {
          0% {
            box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
          }
          100% {
            box-shadow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 40px currentColor;
          }
        }
      `}</style>
      </div>

    </>
  );
};

export default CrackerShotsEffect;