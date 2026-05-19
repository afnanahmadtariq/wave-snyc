import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  Radio, 
  Zap, 
  RotateCcw, 
  Share2, 
  Sliders, 
  Wifi, 
  Sparkles, 
  Info
} from 'lucide-react'

interface Peer {
  id: string
  name: string
  location: string
  ping: number
  status: 'synced' | 'drifted' | 'syncing'
  avatar: string
}

interface Message {
  id: string
  sender: string
  text: string
  time: string
}

function App() {
  // --- Synthesizer & Audio Labs State ---
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [frequency, setFrequency] = useState(220) // in Hz
  const [amplitude, setAmplitude] = useState(40) // for canvas visualization
  const [waveSpeed, setWaveSpeed] = useState(0.04)
  const [waveType, setWaveType] = useState<'sine' | 'triangle' | 'sawtooth' | 'square'>('sine')
  const [preset, setPreset] = useState<'ambient' | 'chill' | 'synthwave' | 'custom'>('ambient')
  
  // --- Network Sync Simulator State ---
  const [latency, setLatency] = useState(38) // in ms
  const [bufferSize, setBufferSize] = useState(512) // samples
  const [syncCorrectionMode, setSyncCorrectionMode] = useState<'pll' | 'dts' | 'hard'>('pll')
  const [isSyncing, setIsSyncing] = useState(true)
  const [syncConfidence, setSyncConfidence] = useState(99.6)
  const [phaseVariance, setPhaseVariance] = useState(0.02)
  const [activeTab, setActiveTab] = useState<'lab' | 'peers' | 'chat'>('lab')
  
  // --- Simulated Notification banner ---
  const [notification, setNotification] = useState<{ title: string; text: string } | null>(null)
  
  // --- Mock Chat Messages ---
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: '1', sender: 'Sarah (New York)', text: 'The stream latency is down to 15ms. Incredible!', time: '10:42 AM' },
    { id: '2', sender: 'Chloe (Tokyo)', text: 'Phase sync is rock solid on 44.1kHz preset.', time: '10:43 AM' },
    { id: '3', sender: 'Marcus (Berlin)', text: 'Hey guys, syncing in from my modular rig.', time: '10:44 AM' }
  ])
  const [newMsg, setNewMsg] = useState('')

  // --- Mock Peer List ---
  const [peers, setPeers] = useState<Peer[]>([
    { id: '1', name: 'You (Host)', location: 'New York', ping: 12, status: 'synced', avatar: 'Y' },
    { id: '2', name: 'Chloe', location: 'Tokyo', ping: 42, status: 'synced', avatar: 'C' },
    { id: '3', name: 'Marcus', location: 'Berlin', ping: 118, status: 'drifted', avatar: 'M' },
    { id: '4', name: 'Sarah', location: 'London', ping: 25, status: 'synced', avatar: 'S' }
  ])

  // --- Web Audio Refs ---
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const osc2Ref = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const filterNodeRef = useRef<BiquadFilterNode | null>(null)

  // --- Canvas Refs ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const phaseRef = useRef<number>(0)

  // Trigger brief floating notifications
  const triggerNotification = (title: string, text: string) => {
    setNotification({ title, text })
    setTimeout(() => {
      setNotification(null)
    }, 4500)
  }

  // --- Web Audio API Synthesizer Management ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }

  const startSynthesizer = () => {
    try {
      initAudio()
      
      const ctx = audioCtxRef.current
      if (!ctx) return

      // Create nodes
      const osc = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filterNode = ctx.createBiquadFilter()

      // Node Configurations
      osc.type = waveType
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)
      
      // Detuned oscillator for premium rich soundscape
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(frequency * 1.5, ctx.currentTime)
      osc2.detune.setValueAtTime(12, ctx.currentTime)

      gainNode.gain.setValueAtTime(volume * 0.35, ctx.currentTime)
      
      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(frequency * 3.5, ctx.currentTime)
      filterNode.Q.setValueAtTime(1.5, ctx.currentTime)

      // Connections
      osc.connect(filterNode)
      osc2.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Start oscillators
      osc.start()
      osc2.start()

      // Store references
      oscRef.current = osc
      osc2Ref.current = osc2
      gainNodeRef.current = gainNode
      filterNodeRef.current = filterNode

      setIsPlaying(true)
      triggerNotification('Audio Synthesizer Active', `Rich ambient ${waveType} wave generated at ${frequency}Hz.`)
    } catch (err) {
      console.error('Failed to initialize AudioContext synth:', err)
    }
  }

  const stopSynthesizer = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop()
        oscRef.current.disconnect()
      } catch (e) {}
      oscRef.current = null
    }
    if (osc2Ref.current) {
      try {
        osc2Ref.current.stop()
        osc2Ref.current.disconnect()
      } catch (e) {}
      osc2Ref.current = null
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect()
      gainNodeRef.current = null
    }
    if (filterNodeRef.current) {
      filterNodeRef.current.disconnect()
      filterNodeRef.current = null
    }
    setIsPlaying(false)
  }

  const toggleSynth = () => {
    if (isPlaying) {
      stopSynthesizer()
    } else {
      startSynthesizer()
    }
  }

  // Update dynamic synth params when state variables change
  useEffect(() => {
    if (isPlaying && audioCtxRef.current) {
      const ctx = audioCtxRef.current
      if (oscRef.current) {
        oscRef.current.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.05)
        oscRef.current.type = waveType
      }
      if (osc2Ref.current) {
        osc2Ref.current.frequency.setTargetAtTime(frequency * 1.5, ctx.currentTime, 0.05)
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(volume * 0.35, ctx.currentTime, 0.05)
      }
      if (filterNodeRef.current) {
        filterNodeRef.current.frequency.setTargetAtTime(frequency * 3.5, ctx.currentTime, 0.05)
      }
    }
  }, [frequency, waveType, volume, isPlaying])

  // Presets configuration handler
  const applyPreset = (pName: 'ambient' | 'chill' | 'synthwave' | 'custom') => {
    setPreset(pName)
    if (pName === 'ambient') {
      setFrequency(146.83) // D3
      setWaveType('sine')
      setWaveSpeed(0.02)
      setAmplitude(45)
      triggerNotification('Ambient Preset Loaded', 'Deep slow sine drone at 146.8Hz.')
    } else if (pName === 'chill') {
      setFrequency(220.00) // A3
      setWaveType('triangle')
      setWaveSpeed(0.04)
      setAmplitude(35)
      triggerNotification('Chill Lofi Preset Loaded', 'Soft warming triangle oscillation at 220Hz.')
    } else if (pName === 'synthwave') {
      setFrequency(110.00) // A2 bass
      setWaveType('sawtooth')
      setWaveSpeed(0.07)
      setAmplitude(55)
      triggerNotification('Cyber Synthwave Preset Loaded', 'Aggressive detuned sawtooth bassline.')
    }
  }

  // Keep synth clean on component unmount
  useEffect(() => {
    return () => {
      stopSynthesizer()
    }
  }, [])

  // --- Real-time Wave Animation Logic (HTML5 Canvas) ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800)
    let height = (canvas.height = 320)

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth
        height = canvas.height = 320;
      }
    }
    window.addEventListener('resize', handleResize)

    // Drawing loops
    const draw = () => {
      if (!ctx || !canvas) return
      
      // Clear canvas with subtle transparency to create glowing motion trail effect
      ctx.fillStyle = 'rgba(9, 9, 14, 0.22)'
      ctx.fillRect(0, 0, width, height)

      // Draw horizontal reference center line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      // Calculate latency offset drift factor
      const phaseDrift = isSyncing ? 0 : (latency / 120) * Math.PI

      // LAYER 1: Master Reference Sync Wave (Purple/Magenta Glowing wave)
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(168, 85, 247, 0.6)'
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)'
      ctx.lineWidth = 3.5
      ctx.beginPath()
      
      for (let x = 0; x < width; x += 1.5) {
        // Compose multiple wave formulas to build beautiful organic synth waves
        const normalPhase = phaseRef.current + (x * 0.007)
        let y = Math.sin(normalPhase) * amplitude
        
        // Add subtle harmonic detailing based on oscillator selected
        if (waveType === 'triangle') {
          y = Math.asin(Math.sin(normalPhase)) * (amplitude * 1.2)
        } else if (waveType === 'sawtooth') {
          y = (normalPhase % Math.PI - Math.PI / 2) * (amplitude * 0.5)
        } else if (waveType === 'square') {
          y = Math.sign(Math.sin(normalPhase)) * amplitude * 0.7
        }
        
        // Subharmonic modulation layer
        const subHarmonic = Math.sin(phaseRef.current * 0.45 + (x * 0.002)) * (amplitude * 0.3)
        
        ctx.lineTo(x, (height / 2) + y + subHarmonic)
      }
      ctx.stroke()

      // LAYER 2: Client Peer Sync Wave (Cyan Glowing wave - slightly offset by latency)
      ctx.shadowColor = 'rgba(6, 182, 212, 0.6)'
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)'
      ctx.lineWidth = 2.5
      ctx.beginPath()

      for (let x = 0; x < width; x += 1.5) {
        // Introduce lag phase offset
        const lagPhase = phaseRef.current + (x * 0.007) - phaseDrift
        let y = Math.sin(lagPhase) * amplitude

        if (waveType === 'triangle') {
          y = Math.asin(Math.sin(lagPhase)) * (amplitude * 1.2)
        } else if (waveType === 'sawtooth') {
          y = (lagPhase % Math.PI - Math.PI / 2) * (amplitude * 0.5)
        } else if (waveType === 'square') {
          y = Math.sign(Math.sin(lagPhase)) * amplitude * 0.7
        }

        const subHarmonic = Math.sin((phaseRef.current - phaseDrift) * 0.45 + (x * 0.002)) * (amplitude * 0.3)

        ctx.lineTo(x, (height / 2) + y + subHarmonic)
      }
      ctx.stroke()

      // Reset shadow blur
      ctx.shadowBlur = 0

      // Animate phase delta
      phaseRef.current += waveSpeed

      // Increment wave statistics dynamically in real-time
      if (Math.random() < 0.03) {
        if (isSyncing) {
          const varTarget = 0.01 + (latency / 1200) * Math.random()
          setPhaseVariance(parseFloat(varTarget.toFixed(3)))
          setSyncConfidence(parseFloat((100 - varTarget * 8).toFixed(1)))
        } else {
          const driftFactor = (latency / 100) * 1.5 + Math.random()
          setPhaseVariance(parseFloat(driftFactor.toFixed(3)))
          setSyncConfidence(parseFloat(Math.max(30, 95 - driftFactor * 15).toFixed(1)))
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [amplitude, waveSpeed, waveType, latency, isSyncing])

  // --- Network Sync Simulator Actions ---
  const toggleSynchronize = () => {
    if (isSyncing) {
      setIsSyncing(false)
      // Drift Peer 3 significantly
      setPeers(prev => prev.map(p => p.id === '3' ? { ...p, status: 'drifted', ping: 148 } : p))
      triggerNotification('De-synchronized Stream', 'Manual room lock released. Drift offset simulated.')
    } else {
      setIsSyncing(true)
      // Gradually resync peers
      setPeers(prev => prev.map(p => ({ ...p, status: 'synced', ping: Math.max(10, p.ping - 30) })))
      triggerNotification('Synchronizing Room Channels', 'PLL Clock sync matching peer frame alignments...')
    }
  }

  // Handle preset adjustment triggers on sliders
  const handleLatencyChange = (newVal: number) => {
    setLatency(newVal)
    if (newVal > 80) {
      // Flag Tokyo and Berlin peers as high latency warning
      setPeers(prev => prev.map(p => p.id === '3' ? { ...p, status: 'drifted', ping: newVal * 2 } : p))
      if (isSyncing && syncConfidence > 92) {
        triggerNotification('High Latency Jitter', 'Network buffer expanded to prevent underflow drops.')
      }
    } else {
      setPeers(prev => prev.map(p => p.id === '3' && isSyncing ? { ...p, status: 'synced', ping: newVal * 1.5 } : p))
    }
  }

  // Submit simulated Chat messages
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You (Host)',
      text: newMsg,
      time: timeStr
    }
    setChatMessages([...chatMessages, newMessage])
    setNewMsg('')
    
    // Simulate auto AI peer response 1.5s later
    setTimeout(() => {
      const responses = [
        "Perfect sync confidence! Audio sounds pristine here.",
        "We should record this ambient session. The phase variance is incredibly low.",
        "Checking buffer block alignment... DTS correction is working flawlessly.",
        "The sawtooth bass sounds epic. Let's record!"
      ]
      const randomSender = peers[Math.floor(Math.random() * (peers.length - 1)) + 1].name
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: randomSender,
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, replyMsg])
    }, 1500)
  }

  return (
    <>
      {/* Top Navbar */}
      <header className="header-glass">
        <div className="container header-container">
          <div className="logo-wrap" onClick={() => triggerNotification('Wave Sync Suite', 'V1.4.0 static node active.')}>
            <div className="logo-icon-pulse">
              <Radio size={18} className="text-white animate-pulse" />
            </div>
            <span className="logo-text">WAVE SYNC</span>
            <span className="logo-badge">STUDIO</span>
          </div>

          <nav className="nav-links">
            <a href="#visualizer" className="nav-link active">Visualizer</a>
            <a href="#lab" className="nav-link">Audio Lab</a>
            <a href="#sync" className="nav-link">Sync Control</a>
          </nav>

          <div className="header-actions">
            <button 
              className={`btn-primary ${isPlaying ? 'btn-glow-purple' : 'btn-glow-cyan'}`} 
              onClick={toggleSynth}
            >
              {isPlaying ? (
                <>
                  <Pause size={16} />
                  <span>Pause Wave</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Start Audio Synthesizer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ flex: 1, paddingBottom: '80px' }}>
        {/* Hero Section */}
        <section className="hero-section" id="visualizer">
          <div className="hero-glow-blob"></div>
          <span className="hero-subtitle">STATIC-FIRST HIGH PERFORMANCE AUDIO LAB</span>
          <h1 className="hero-title">Real-Time Wave Synchronization & Synthesizer Suite</h1>
          <p className="hero-desc">
            An interactive playground demonstrating real-time low-latency audio wave generation, 
            multiphase alignment visualizers, and simulated peer-to-peer clock synchronization.
          </p>

          {/* Interactive Wave Visualizer Card */}
          <div className="glass-card visualizer-card">
            <div className="visualizer-overlay-info">
              <div className={`status-dot ${isPlaying ? 'pulsing' : 'inactive'}`}></div>
              <span className="logo-badge" style={{ textTransform: 'uppercase' }}>
                {waveType} Wave Form
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isPlaying ? `${frequency.toFixed(1)}Hz Osc Playing` : 'Synthesizer Standby'}
              </span>
            </div>

            <div className="canvas-panel-controls">
              <button onClick={() => {
                setWaveType(w => w === 'sine' ? 'triangle' : w === 'triangle' ? 'sawtooth' : w === 'sawtooth' ? 'square' : 'sine')
                triggerNotification('Waveform Changed', 'Swapping oscillator output node formulation.')
              }}>
                Cycle Waveform
              </button>
              <button onClick={() => {
                setAmplitude(a => a === 40 ? 60 : a === 60 ? 25 : 40)
                triggerNotification('Amplitude Rescaled', 'Visual oscilloscope dynamic range modified.')
              }}>
                Toggle Scale
              </button>
            </div>

            <div className="visualizer-container">
              <canvas ref={canvasRef} className="visualizer-canvas" />
            </div>

            {/* Sync Live Stats Bar */}
            <div className="tuning-panel" style={{ marginTop: '20px', borderTop: 'none', padding: 0 }}>
              <div className="tuning-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="tuning-stat-card">
                  <div className="tuning-stat-val" style={{ color: isSyncing ? 'var(--accent-cyan)' : 'var(--accent-pink)' }}>
                    {isSyncing ? 'LOCKED' : 'DRIFTING'}
                  </div>
                  <div className="tuning-stat-lbl">Phase Alignment</div>
                </div>
                <div className="tuning-stat-card">
                  <div className="tuning-stat-val">{syncConfidence}%</div>
                  <div className="tuning-stat-lbl">Sync Confidence</div>
                </div>
                <div className="tuning-stat-card">
                  <div className="tuning-stat-val" style={{ fontFamily: 'var(--font-mono)' }}>
                    ±{phaseVariance}°
                  </div>
                  <div className="tuning-stat-lbl">Phase Variance</div>
                </div>
                <div className="tuning-stat-card">
                  <div className="tuning-stat-val">{latency}ms</div>
                  <div className="tuning-stat-lbl">Est. Loop Jitter</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid split between Lab and Room Sync */}
        <section className="control-grid" id="lab">
          {/* Left panel: Audio Lab Controls */}
          <div className="glass-card">
            <div className="audio-lab-header">
              <div className="lab-title-wrap">
                <Sliders size={20} className="text-cyan-400" style={{ color: 'var(--accent-cyan)' }} />
                <h3>Synthesizer Control Lab</h3>
              </div>
              <div className="sound-presets">
                <button 
                  className={`preset-btn ${preset === 'ambient' ? 'active' : ''}`}
                  onClick={() => applyPreset('ambient')}
                >
                  Deep Ambient
                </button>
                <button 
                  className={`preset-btn ${preset === 'chill' ? 'active' : ''}`}
                  onClick={() => applyPreset('chill')}
                >
                  Chill Lofi
                </button>
                <button 
                  className={`preset-btn ${preset === 'synthwave' ? 'active' : ''}`}
                  onClick={() => applyPreset('synthwave')}
                >
                  Synthwave Bass
                </button>
              </div>
            </div>

            <div className="slider-group">
              <div className="control-item">
                <div className="control-label">
                  <span>Oscillator Frequency</span>
                  <span className="control-value">{frequency.toFixed(0)} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="60" 
                  max="600" 
                  value={frequency} 
                  onChange={(e) => {
                    setFrequency(parseInt(e.target.value))
                    setPreset('custom')
                  }}
                />
              </div>

              <div className="control-item">
                <div className="control-label">
                  <span>Oscilloscope Wave Amplitude</span>
                  <span className="control-value">{amplitude}px</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  value={amplitude} 
                  onChange={(e) => setAmplitude(parseInt(e.target.value))}
                />
              </div>

              <div className="control-item">
                <div className="control-label">
                  <span>Synthetic Phase Speed</span>
                  <span className="control-value">{(waveSpeed * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.12" 
                  step="0.005"
                  value={waveSpeed} 
                  onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                />
              </div>

              <div className="control-item">
                <div className="control-label">
                  <span>Volume Mixer</span>
                  <span className="control-value">{(volume * 100).toFixed(0)}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={16} className="text-slate-400" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <div className="glass-card" style={{ flex: 1, padding: '16px', background: 'rgba(255, 255, 255, 0.01)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} className="text-cyan-400" style={{ color: 'var(--accent-cyan)' }} />
                  Synth Detune Active
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  A dual sub-oscillator detunes the output pitch by +12 cents to produce rich spatial resonance.
                </p>
              </div>
              <div className="glass-card" style={{ flex: 1, padding: '16px', background: 'rgba(255, 255, 255, 0.01)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} className="text-purple-400" style={{ color: 'var(--accent-purple)' }} />
                  Filter Node Loaded
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Active Biquad Lowpass filter caps high frequencies at 3.5x core pitch, maintaining audio warmth.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Sync Suite & Peer list */}
          <div className="glass-card" id="sync">
            <div className="sync-room-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} style={{ color: 'var(--accent-purple)' }} />
                <h3>Sync Multi-Room</h3>
              </div>
              <span className={`pulse-badge ${isSyncing ? 'syncing' : ''}`}>
                <Wifi size={12} />
                <span>{isSyncing ? 'SYNC ACTIVE' : 'FREE DRIFT'}</span>
              </span>
            </div>

            {/* Sync control Tabs */}
            <div className="sound-presets" style={{ marginBottom: '16px', marginTop: 0 }}>
              <button 
                className={`preset-btn ${activeTab === 'lab' ? 'active' : ''}`}
                onClick={() => setActiveTab('lab')}
              >
                Calibration
              </button>
              <button 
                className={`preset-btn ${activeTab === 'peers' ? 'active' : ''}`}
                onClick={() => setActiveTab('peers')}
              >
                Connected ({peers.length})
              </button>
              <button 
                className={`preset-btn ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Sync Feed
              </button>
            </div>

            {activeTab === 'lab' && (
              <div className="tuning-panel" style={{ border: 'none', padding: 0, marginTop: 0 }}>
                <div className="control-item" style={{ marginBottom: '16px' }}>
                  <div className="control-label">
                    <span>Simulated Stream Jitter Delay</span>
                    <span className="control-value">{latency} ms</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="120" 
                    value={latency} 
                    onChange={(e) => handleLatencyChange(parseInt(e.target.value))}
                  />
                </div>

                <div className="control-item" style={{ marginBottom: '18px' }}>
                  <label className="control-label" style={{ marginBottom: '6px' }}>Buffer Blocks Allocation</label>
                  <select 
                    value={bufferSize} 
                    onChange={(e) => {
                      setBufferSize(parseInt(e.target.value))
                      triggerNotification('Buffer Resized', `Internal buffer blocks allocated: ${e.target.value} samples.`)
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--border-radius-sm)',
                      color: 'var(--text-primary)',
                      padding: '8px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="128">128 Samples (Ultra low-latency)</option>
                    <option value="256">256 Samples (Pro studio alignment)</option>
                    <option value="512">512 Samples (Standard broadcast)</option>
                    <option value="1024">1024 Samples (Stable buffer protection)</option>
                  </select>
                </div>

                <div className="control-item" style={{ marginBottom: '20px' }}>
                  <label className="control-label" style={{ marginBottom: '6px' }}>Correction Protocol</label>
                  <select 
                    value={syncCorrectionMode} 
                    onChange={(e) => {
                      setSyncCorrectionMode(e.target.value as any)
                      triggerNotification('Protocol Swapped', `Correction shifted to ${e.target.value.toUpperCase()} alignment.`)
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--border-radius-sm)',
                      color: 'var(--text-primary)',
                      padding: '8px',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pll">Phase Locked Loop (PLL Clock Adjust)</option>
                    <option value="dts">Dynamic Time Stretching (Pitch Preserving)</option>
                    <option value="hard">Hard Alignment Frame Reset</option>
                  </select>
                </div>

                <button 
                  className={`btn-primary btn-glow-cyan`} 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={toggleSynchronize}
                >
                  <RotateCcw size={16} />
                  <span>{isSyncing ? 'Release Room Phase Lock' : 'Align Room Channels (PLL)'}</span>
                </button>
              </div>
            )}

            {activeTab === 'peers' && (
              <div>
                <div className="peer-list">
                  {peers.map((p) => (
                    <div key={p.id} className="peer-item">
                      <div className="peer-info">
                        <div className="peer-avatar">{p.avatar}</div>
                        <div>
                          <div className="peer-name">{p.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.location}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="peer-ping">{p.ping}ms</span>
                        <div className="sync-status-indicator">
                          <div className="sync-bar-wrap">
                            <div 
                              className={`sync-bar-fill ${
                                p.status === 'drifted' || !isSyncing ? 'warning' : ''
                              }`} 
                              style={{ width: !isSyncing && p.id !== '1' ? '60%' : '100%' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                  onClick={() => triggerNotification('Session Invitation Link', 'Copied simulated session credentials to clipboard!')}
                >
                  <Share2 size={14} />
                  <span>Copy Session Sync Invite Link</span>
                </button>
              </div>
            )}

            {activeTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '275px' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', paddingRight: '4px' }}>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-light)', borderRadius: 'var(--border-radius-md)', padding: '8px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{msg.sender}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.time}</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendChatMessage} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text"
                    placeholder="Type wave calibration log..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--border-radius-sm)',
                      color: 'var(--text-primary)',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="features-section">
          <div className="section-header">
            <span className="hero-subtitle" style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.15)', color: 'var(--accent-purple)' }}>
              CORE INFRASTRUCTURE
            </span>
            <h2 className="section-title">Zero Infrastructure Overhead</h2>
            <p className="section-subtitle">Fully synthesized dynamic sound waves matching local client buffers programmatically.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <Zap size={22} />
              </div>
              <h3 className="feature-title">Phase-Locked Clock Sync</h3>
              <p className="feature-desc">
                Maintains millisecond-level audio coherence across multiple remote channels using highly precise local window buffers and drift calibration matrices.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <Sliders size={22} />
              </div>
              <h3 className="feature-title">Dynamic Time Stretching</h3>
              <p className="feature-desc">
                Adapts sample stream playback pitch dynamically without audio artifacts to align delayed packet blocks instantly back into phase consistency.
              </p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-box">
                <Sparkles size={22} />
              </div>
              <h3 className="feature-title">Web Audio API Synthesis</h3>
              <p className="feature-desc">
                Generates pure harmonics client-side with no network bandwidth consumption or audio static lags. Responsive to micro-changes in synth parameters.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Notification */}
      {notification && (
        <div className="notif-banner">
          <Info size={16} className="notif-icon" />
          <div className="notif-body">
            <span className="notif-title">{notification.title}</span>
            <span className="notif-text">{notification.text}</span>
          </div>
          <button className="notif-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* App Footer */}
      <footer className="app-footer">
        <div className="container footer-container">
          <div className="logo-wrap" style={{ cursor: 'default' }}>
            <div className="logo-icon-pulse" style={{ width: '24px', height: '24px', borderRadius: '4px', boxShadow: 'none' }}>
              <Radio size={12} className="text-white" />
            </div>
            <span className="logo-text" style={{ fontSize: '1rem' }}>WAVE SYNC</span>
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} Wave Sync Studio. All rights reserved. Made for premium browser experiences.
          </div>
          <div className="footer-socials">
            <span className="footer-social-link" style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => triggerNotification('API Documentation', 'Active endpoint client: local-host')}>V1.4.0 Static</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
