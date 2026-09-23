'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { GiftData } from '@/lib/giftData'

interface Props {
  data: GiftData
}

type ScreenType = 'intro' | 'card' | 'birthday' | 'collage' | 'music'

export default function GiftClient({ data }: Props) {
  // ✨ المتغير الجديد لحل مشكلة الـ Hydration
  const [isMounted, setIsMounted] = useState(false)
  
  const [screen, setScreen] = useState<ScreenType>('intro')
  const [introExiting, setIntroExiting] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00")
  const [durationStr, setDurationStr] = useState("0:00")

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // التأكد من تحميل الكومبوننت على المتصفح أولاً
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (data.musicUrl) {
      const audio = new Audio(data.musicUrl)
      audio.loop = true
      audio.volume = 0.5
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDurationStr(formatTime(audio.duration))
      })

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100)
          setCurrentTimeStr(formatTime(audio.currentTime))
        }
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [data.musicUrl])

  const navigateTo = useCallback((newScreen: ScreenType) => {
    window.history.pushState({ screen: newScreen }, '')
    setScreen(newScreen)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    window.history.replaceState({ screen: 'intro' }, '')
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setScreen(event.state.screen)
      } else {
        setScreen('intro')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isMounted])

  const handleEnvelopeClick = useCallback(() => {
    if (screen !== 'intro') return
    setIntroExiting(true)
    setTimeout(() => {
      navigateTo('card') 
      setIntroExiting(false)
    }, 600)
  }, [screen, navigateTo])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setMusicPlaying(true)
    }
  }, [musicPlaying])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setProgress(val)
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (val / 100) * audioRef.current.duration
      audioRef.current.currentTime = newTime
      setCurrentTimeStr(formatTime(newTime))
    }
  }, [])

  // ✨ إيقاف الريندر حتى يتم التحميل على المتصفح لمنع خطأ Hydration
  if (!isMounted) {
    return null
  }

  return (
    <div className="gift-page">

      {/* ── SCREEN 1: INTRO (الظرف) ── */}
      <div
        className={`screen intro-screen ${
          screen === 'intro' ? (introExiting ? 'exit' : 'visible') : 'hidden'
        }`}
        onClick={handleEnvelopeClick}
      >
        <div className="intro-content">
          <p className="handwritten text-xl">hey babe!</p>
          <div className="envelope-wrapper">
            <Image src={data.envelopeImage} alt="Envelope" width={280} height={200} className="envelope-image" priority />
          </div>
          <p className="handwritten text-xl">you've got new emails</p>
          <p className="click-hint">(tap anywhere)</p>
        </div>
      </div>

      {/* ── SCREEN 2: MESSAGE CARD (الكارت الأحمر العريض) ── */}
      <div className={`screen card-screen ${screen === 'card' ? 'visible' : 'hidden'}`}>
        <div className="red-card from-to-card">
          <div className="card-header">
            <p className="handwritten">From: {data.senderName}</p>
            <p className="handwritten">To: {data.receiverName}</p>
          </div>
          <div className="card-body">
            <p className="handwritten mb-2">Message:</p>
            <p className="handwritten message-text">{data.cardMessage}</p>
          </div>
          <div className="card-footer">
            <button className="handwritten see-attachment" onClick={() => navigateTo('birthday')}>
              see attachment
            </button>
          </div>
        </div>
      </div>

      {/* ── SCREEN 3: BIRTHDAY (الصورة والرسالة) ── */}
      <div className={`screen birthday-screen ${screen === 'birthday' ? 'visible' : 'hidden'}`}>
        <div className="birthday-inner">
          <div className="birthday-image-wrapper">
            <Image src={data.birthdayImage} alt={`Birthday Pic`} width={400} height={400} className="birthday-image" priority />
          </div>
          <div className="birthday-text-container">
            <h2 className="handwritten title">{data.birthdayTitle}</h2>
            <p className="handwritten paragraph">{data.birthdayText}</p>
          </div>
          <button className="next-arrow" onClick={() => navigateTo('collage')}>
            →
          </button>
        </div>
      </div>

      {/* ── SCREEN 4: COLLAGE (الـ 4 صور) ── */}
      <div className={`screen collage-screen ${screen === 'collage' ? 'visible' : 'hidden'}`}>
        <div className="collage-container">
          <h2 className="handwritten title-dark">pics of us</h2>
          <div className="pics-grid">
            {data.collageImages && data.collageImages.map((img, idx) => (
              <div key={idx} className="pic-frame">
                <Image src={img} alt={`Memory ${idx + 1}`} fill className="collage-img-inner" />
              </div>
            ))}
          </div>
          <button className="next-button" onClick={() => navigateTo('music')}>
            one more thing...
          </button>
        </div>
      </div>

      {/* ── SCREEN 5: MUSIC PLAYER (مشغل الأغنية) ── */}
      <div className={`screen music-screen ${screen === 'music' ? 'visible' : 'hidden'}`}>
        <div className="music-player-card">
          <h2 className="handwritten text-center mb-4 text-white text-2xl">Our Track</h2>
          <div className="album-art">
            <Image src={data.musicCoverImage} alt="Song Cover" fill className="album-img" />
          </div>
          <h3 className="handwritten song-title">{data.songTitle}</h3>
          
          <div className="slider-container">
            <span className="time-text">{currentTimeStr}</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress} 
              onChange={handleSeek}
              className="progress-slider"
              style={{ backgroundSize: `${progress}% 100%` }}
            />
            <span className="time-text">{durationStr}</span>
          </div>

          <div className="controls">
            <button className="play-btn" onClick={toggleMusic}>
              {musicPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}