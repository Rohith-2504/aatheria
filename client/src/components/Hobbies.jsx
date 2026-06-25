import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, ArrowLeft, Award, Zap, HelpCircle } from 'lucide-react';
import './Hobbies.css';

// ==========================================
// WEB AUDIO API SYNTHESIZER
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playHit(volume = 0.5) {
    if (this.isMuted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    // Crack sound (rapid pitch drop + envelope decay)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playMiss() {
    if (this.isMuted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Whoosh noise (lowpass noise sweep)
    const bufferSize = this.ctx.sampleRate * 0.15; // 150ms whoosh
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.15);
  }

  playBowled() {
    if (this.isMuted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Wickets crash (metal clash + high pass noise)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);

    // Burst noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start();
  }

  playBoundary() {
    if (this.isMuted) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Success arpeggio (cheerful tune)
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }
}

const sfx = new SoundFX();

export default function Hobbies() {
  const canvasRef = useRef(null);
  
  // Game state controllers
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(3);
  const [ballsFaced, setBallsFaced] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('cricket_high_score') || '0', 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('#fff');
  const [ballTypeMsg, setBallTypeMsg] = useState('Wait for delivery...');
  
  // Canvas loop mutable references (to bypass React render delays)
  const scoreRef = useRef(0);
  const wicketsRef = useRef(3);
  const ballsFacedRef = useRef(0);
  const gameOverRef = useRef(false);
  
  // Shake effect helper
  const [isShaking, setIsShaking] = useState(false);

  // Load high score
  useEffect(() => {
    localStorage.setItem('cricket_high_score', highScore.toString());
  }, [highScore]);

  // Sync state with mutable refs
  useEffect(() => {
    scoreRef.current = score;
    wicketsRef.current = wickets;
    ballsFacedRef.current = ballsFaced;
    gameOverRef.current = gameOver;
  }, [score, wickets, ballsFaced, gameOver]);

  // Handle Mute
  const handleToggleMute = () => {
    sfx.isMuted = !isMuted;
    setIsMuted(!isMuted);
    sfx.init(); // Initialize audio lazily upon mute button toggle
  };

  // Nav back to portal
  const handleBackToPortal = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
  };

  // KICKSTART THE GAME ENGINE
  const startGame = () => {
    sfx.init(); // Initialize audio context on click
    setScore(0);
    setWickets(3);
    setBallsFaced(0);
    setGameOver(false);
    setIsPlaying(true);
    setFeedbackText('PLAY!');
    setFeedbackColor('#06b6d4');
    setBallTypeMsg('Get Ready...');
  };

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Canvas dimensions (2.5D Stadium Projection)
    canvas.width = 640;
    canvas.height = 500;

    // Ball mechanics
    let ball = {
      x: 320,
      y: 90,
      vx: 0,
      vy: 0,
      radius: 4,
      isActive: false,
      hasBounced: false,
      spin: 0,
      speedMultiplier: 1.0,
      type: 'Normal'
    };

    // Batsman mechanics
    let batsman = {
      x: 320,
      y: 435,
      hitZoneRadius: 28, // Hit box tolerance around the bat crease
      swingProgress: 0,
      isSwinging: false,
      swingCooldown: false
    };

    // Particles system for boundary hits
    let particles = [];
    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 4, // arc upwards
          radius: Math.random() * 3 + 2,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    };

    // Overlay feedback timing text
    let displayMessage = {
      text: '',
      color: '#fff',
      alpha: 0,
      y: 250,
      scale: 1
    };

    const triggerMessage = (text, color) => {
      displayMessage.text = text;
      displayMessage.color = color;
      displayMessage.alpha = 1.0;
      displayMessage.y = 220;
      displayMessage.scale = 1.5;
    };

    // Bowl delivery scheduler
    let bowlTimeoutId = null;
    const scheduleNextDelivery = () => {
      if (wicketsRef.current <= 0 || gameOverRef.current) return;
      
      const delay = Math.random() * 1500 + 1500; // 1.5s - 3.0s between bowls
      setBallTypeMsg('Bowler preparing run-up...');
      
      bowlTimeoutId = setTimeout(() => {
        if (wicketsRef.current <= 0 || gameOverRef.current) return;
        deliverBall();
      }, delay);
    };

    const deliverBall = () => {
      // Pick random ball type
      const types = ['Normal', 'Fast', 'Spin', 'Bouncer'];
      const picked = types[Math.floor(Math.random() * types.length)];
      
      ball.x = 320;
      ball.y = 90;
      ball.isActive = true;
      ball.hasBounced = false;
      ball.radius = 4;
      
      // Reset variables depending on type
      ball.type = picked;
      setBallTypeMsg(`${picked} Delivery Incoming!`);
      
      switch (picked) {
        case 'Fast':
          ball.vy = 6.2;
          ball.vx = (Math.random() - 0.5) * 1.5;
          ball.spin = 0;
          break;
        case 'Spin':
          ball.vy = 3.8;
          ball.vx = (Math.random() - 0.5) * 0.8;
          ball.spin = (Math.random() > 0.5 ? 1 : -1) * 0.65; // curve mid-air
          break;
        case 'Bouncer':
          ball.vy = 4.2;
          ball.vx = (Math.random() - 0.5) * 1.2;
          ball.spin = 0;
          break;
        default: // Normal
          ball.vy = 4.6;
          ball.vx = (Math.random() - 0.5) * 1.0;
          ball.spin = 0;
          break;
      }
    };

    // Game input triggers
    const triggerBatSwing = () => {
      if (batsman.isSwinging || batsman.swingCooldown || gameOverRef.current) return;
      
      sfx.init(); // Resume audio
      batsman.isSwinging = true;
      batsman.swingProgress = 0;
      
      // Timing collision calculations
      if (ball.isActive) {
        const hitDistance = Math.abs(ball.y - batsman.y);
        
        // Inside hit zone!
        if (hitDistance <= batsman.hitZoneRadius) {
          ball.isActive = false; // hit matches
          
          // Calculate score based on exact timing
          let runs = 0;
          let feedback = '';
          let color = '#fff';
          
          if (hitDistance < 6) { // PERFECT TIMING
            const isSix = Math.random() > 0.5;
            runs = isSix ? 6 : 4;
            feedback = isSix ? 'MASSIVE SIX! 6 RUNS!' : 'CRACKING FOUR! 4 RUNS!';
            color = isSix ? '#10b981' : '#06b6d4';
            sfx.playHit(0.85);
            sfx.playBoundary();
            
            // Screen shake
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 250);
            createExplosion(ball.x, ball.y, color);
          } else if (hitDistance < 14) { // GOOD TIMING
            runs = Math.random() > 0.4 ? 4 : 2;
            feedback = runs === 4 ? 'FOUR! Great Shot!' : 'Gently Played! 2 Runs';
            color = runs === 4 ? '#06b6d4' : '#f59e0b';
            sfx.playHit(0.6);
            if (runs === 4) sfx.playBoundary();
            createExplosion(ball.x, ball.y, color);
          } else if (hitDistance < 22) { // AVERAGE TIMING
            runs = 1;
            feedback = 'Single Taken.';
            color = '#f3f4f6';
            sfx.playHit(0.4);
          } else { // POOR TIMING (Edge of bat crease)
            const isCaught = Math.random() > 0.4;
            if (isCaught) {
              runs = 0;
              feedback = 'CAUGHT OUT!';
              color = '#f43f5e';
              setWickets(prev => {
                const next = prev - 1;
                if (next <= 0) triggerGameOver();
                return next;
              });
              sfx.playBowled(); // lost wicket sound
            } else {
              runs = 0;
              feedback = 'Edge! Dot Ball.';
              color = '#6b7280';
              sfx.playHit(0.2);
            }
          }
          
          // Update runs and stats
          setScore(prev => prev + runs);
          setBallsFaced(prev => prev + 1);
          triggerMessage(feedback, color);
          setFeedbackText(feedback);
          setFeedbackColor(color);
          
          scheduleNextDelivery();
        } else {
          // Swing and missed (swung too early or late)
          sfx.playMiss();
        }
      } else {
        // Swing without active ball (air swing)
        sfx.playMiss();
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        triggerBatSwing();
      }
    };

    const handleCanvasClick = (e) => {
      e.preventDefault();
      triggerBatSwing();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousedown', handleCanvasClick);

    // Initial scheduler start
    scheduleNextDelivery();

    // Trigger Game Over
    const triggerGameOver = () => {
      setGameOver(true);
      setHighScore(prev => {
        if (scoreRef.current > prev) {
          return scoreRef.current;
        }
        return prev;
      });
    };

    // DRAW ENGINE LOOP
    let animFrameId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. DRAW STADIUM BACKGROUND ---
      // Grass Field
      ctx.fillStyle = '#1b4a25';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Field perspective lines / boundary circle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Draw ellipse simulating 3D boundary line
      ctx.ellipse(320, 290, 270, 160, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pitch (perspective rectangle)
      ctx.fillStyle = '#e8d3a7';
      ctx.beginPath();
      ctx.moveTo(270, 100); // top-left
      ctx.lineTo(370, 100); // top-right
      ctx.lineTo(440, 480); // bottom-right
      ctx.lineTo(200, 480); // bottom-left
      ctx.closePath();
      ctx.fill();

      // Crease lines (top)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(280, 115);
      ctx.lineTo(360, 115);
      ctx.stroke();

      // Crease lines (bottom batting crease)
      ctx.beginPath();
      ctx.moveTo(215, 435);
      ctx.lineTo(425, 435);
      ctx.stroke();

      // --- 2. DRAW WICKETS / STUMPS ---
      // Top stumps (bowler end)
      ctx.fillStyle = '#ff4e50';
      ctx.fillRect(316, 90, 2, 10);
      ctx.fillRect(320, 90, 2, 10);
      ctx.fillRect(324, 90, 2, 10);
      // Bail
      ctx.fillStyle = '#ff4e50';
      ctx.fillRect(315, 89, 11, 2);

      // Bottom stumps (batting end - behind batsman)
      // Stumps are drawn with a neon cyan light glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00F0FF';
      ctx.fillStyle = '#00F0FF';
      
      ctx.fillRect(311, 410, 3, 25);
      ctx.fillRect(319, 410, 3, 25);
      ctx.fillRect(327, 410, 3, 25);
      
      // Bottom Bail
      ctx.fillRect(310, 408, 20, 3);
      ctx.shadowBlur = 0; // reset shadow

      // Draw Hit Zone circle around bat crease
      ctx.strokeStyle = batsman.isSwinging ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillStyle = batsman.isSwinging ? 'rgba(0, 240, 255, 0.02)' : 'transparent';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(batsman.x, batsman.y, batsman.hitZoneRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // --- 3. PHYSICS UPDATES: BALL ---
      if (ball.isActive) {
        // Curve spin mid-air after bounce
        if (ball.hasBounced) {
          ball.vx += ball.spin * 0.05;
        }

        // Apply velocities
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Ball size scales to simulate 3D projection
        ball.radius = 4 + (ball.y - 90) * 0.028;

        // Bouncing logic
        let bounceY = 270;
        if (ball.type === 'Bouncer') bounceY = 210; // bounces earlier and higher
        
        if (ball.y >= bounceY && !ball.hasBounced) {
          ball.hasBounced = true;
          if (ball.type === 'Bouncer') {
            ball.vy = 2.4; // slows down significantly vertically (lob upwards)
          } else if (ball.type === 'Fast') {
            ball.vy = 5.2;
          } else {
            ball.vy = 3.6;
          }
        }

        // Check if ball went past batsman (missed swing crease)
        if (ball.y >= 460) {
          ball.isActive = false;
          setBallsFaced(prev => prev + 1);

          // Did it hit the stumps? (x position overlap check)
          const hitsWicket = ball.x >= 305 && ball.x <= 335;
          if (hitsWicket) {
            triggerMessage('BOWLED! WICKET DOWN!', '#f43f5e');
            setFeedbackText('BOWLED! OUT!');
            setFeedbackColor('#f43f5e');
            sfx.playBowled();
            
            // Screen shake
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 250);
            createExplosion(320, 420, '#ff4e50');

            setWickets(prev => {
              const next = prev - 1;
              if (next <= 0) triggerGameOver();
              return next;
            });
          } else {
            triggerMessage('Missed! Dot Ball.', '#6b7280');
            setFeedbackText('Dot Ball.');
            setFeedbackColor('#9ca3af');
            sfx.playMiss();
          }

          scheduleNextDelivery();
        }

        // Render Ball (Red leather neon glow)
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff4e50';
        ctx.fillStyle = '#ff4e50';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // --- 4. BATS SWING ANIMATION & BATSMAN RENDER ---
      if (batsman.isSwinging) {
        batsman.swingProgress += 0.09; // Speed of swing arc
        
        if (batsman.swingProgress >= 1) {
          batsman.isSwinging = false;
          batsman.swingProgress = 0;
          batsman.swingCooldown = true;
          // Cooldown before next swing can trigger
          setTimeout(() => {
            batsman.swingCooldown = false;
          }, 150);
        }
      }

      // Draw Batsman (Visual indicator showing bat rotation)
      // Body Center
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(batsman.x - 18, batsman.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Swing Angle
      let swingAngle = -0.5 * Math.PI; // default holding position (upright)
      if (batsman.isSwinging) {
        // Bat swings from -0.8 PI around to 0.4 PI
        swingAngle = -0.9 * Math.PI + batsman.swingProgress * 1.5 * Math.PI;
      }

      // Draw Bat
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(batsman.x - 18, batsman.y);
      // Bat length is 26px
      const batEndX = batsman.x - 18 + Math.cos(swingAngle) * 26;
      const batEndY = batsman.y + Math.sin(swingAngle) * 26;
      ctx.lineTo(batEndX, batEndY);
      ctx.stroke();

      // --- 5. RENDER PARTICLES ---
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // --- 6. RENDER FLOATING MESSAGES ---
      if (displayMessage.alpha > 0) {
        displayMessage.alpha -= 0.015; // fade out slowly
        displayMessage.y -= 0.5; // drift upwards
        displayMessage.scale = Math.max(1, displayMessage.scale - 0.02);

        ctx.save();
        ctx.globalAlpha = displayMessage.alpha;
        ctx.fillStyle = displayMessage.color;
        ctx.font = `bold ${14 * displayMessage.scale}px var(--font-heading, sans-serif)`;
        ctx.textAlign = 'center';
        ctx.fillText(displayMessage.text, 320, displayMessage.y);
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousedown', handleCanvasClick);
      cancelAnimationFrame(animFrameId);
      if (bowlTimeoutId) clearTimeout(bowlTimeoutId);
    };
  }, [isPlaying]);

  return (
    <section id="hobbies" className="hobbies-section section">
      <div className="container">
        <div className="section-header">
          <span className="tagline">Interactive Corner</span>
          <h2>Aatheria Rec-Room</h2>
          <p>
            Take a breather from engineering and print queues. Play a quick arcade match of 
            crease-bound **Neon Cricket** built with spring physics!
          </p>
        </div>

        <div className="hobbies-container">
          {/* Side stats / scoreboard */}
          <div className="hobbies-sidebar">
            <div className="instructions-card">
              <h3>How to Play</h3>
              <ul>
                <li>
                  <span className="instructions-bullet">■</span>
                  <span>Wait for the bowler to pitch the ball down the brown corridor.</span>
                </li>
                <li>
                  <span className="instructions-bullet">■</span>
                  <span>Press the <strong>SPACEBAR</strong> or <strong>CLICK</strong> on the pitch to swing the bat.</span>
                </li>
                <li>
                  <span className="instructions-bullet">■</span>
                  <span>Time your swing perfectly as the ball enters the <strong>cyan hit zone</strong>.</span>
                </li>
                <li>
                  <span className="instructions-bullet">■</span>
                  <span>Perfect hits score <strong>6 or 4 runs</strong>. Missing can get you <strong>bowled</strong>!</span>
                </li>
              </ul>
            </div>

            <div className="scoreboard-card">
              <h3>Scorecard</h3>
              <div className="stat-row">
                <span className="stat-label">Total Runs</span>
                <span className="stat-value score">{score}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Wickets Remaining</span>
                <span className="stat-value wickets">{wickets} / 3</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Deliveries Faced</span>
                <span className="stat-value">{ballsFaced}</span>
              </div>
              <div className="stat-row" style={{ marginTop: '12px', borderTop: '1px solid rgba(6, 182, 212, 0.2)', paddingTop: '16px' }}>
                <span className="stat-label" style={{ color: '#fff', fontWeight: 600 }}>Personal Best</span>
                <span className="stat-value score" style={{ fontSize: '1.2rem' }}>{highScore}</span>
              </div>
            </div>
            
            <button 
              onClick={handleBackToPortal} 
              className="btn btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              data-cursor-lock
            >
              <ArrowLeft size={16} /> Return to Portal
            </button>
          </div>

          {/* Main Game Stage */}
          <div className={`game-arena-card ${isShaking ? 'screenshake' : ''}`} data-cursor-lock>
            <div className="game-controls-bar">
              <div className="game-title-row">
                <h4>Neon Cricket League</h4>
                <span className="game-mode-badge">{ballTypeMsg}</span>
              </div>
              
              <div className="arena-controls">
                <button 
                  onClick={handleToggleMute} 
                  className={`control-btn-icon ${isMuted ? '' : 'active'}`}
                  title={isMuted ? "Unmute sound" : "Mute sound"}
                  data-cursor-lock
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>

            <canvas ref={canvasRef} className="game-canvas" />

            {/* overlay menus */}
            {!isPlaying && (
              <div className="game-overlay">
                <Award size={64} style={{ color: 'var(--color-secondary)', marginBottom: '16px' }} />
                <h2>Arcade Cricket</h2>
                <p>
                  Bat against Normal, Fast, Spin, and Bouncer pitches. Score as many runs as you can before losing 3 wickets!
                </p>
                <button onClick={startGame} className="btn btn-primary" style={{ gap: '8px' }} data-cursor-lock>
                  <Play size={16} /> Play Match
                </button>
              </div>
            )}

            {gameOver && (
              <div className="game-overlay game-over">
                <RotateCcw size={64} style={{ color: 'var(--color-error)', marginBottom: '16px' }} />
                <h2>MATCH OVER!</h2>
                <p>You lost all 3 wickets. Good try operator!</p>
                
                <div className="stats-summary">
                  <div className="summary-item">
                    <span className="summary-label">Final Score</span>
                    <span className="summary-val">{score}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">High Score</span>
                    <span className="summary-val">{highScore}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Balls faced</span>
                    <span className="summary-val">{ballsFaced}</span>
                  </div>
                </div>

                <button onClick={startGame} className="btn btn-primary" style={{ gap: '8px' }} data-cursor-lock>
                  <RotateCcw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
