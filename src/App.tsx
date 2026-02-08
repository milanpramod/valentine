import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

const QUESTION_GIFS = ['/1.gif', '/2.gif', '/3.gif']
const ACCEPTED_GIFS = ['/c1.gif', '/c2.gif', '/c3.gif', '/c4.gif']

type Pos = { x: number; y: number }

const MARGIN = 20

const App = () => {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const noRef = useRef<HTMLButtonElement | null>(null)
    const yesRef = useRef<HTMLButtonElement | null>(null)
    const [noPos, setNoPos] = useState<Pos>({ x: MARGIN, y: MARGIN })
    const [accepted, setAccepted] = useState(false)
    const [gifLoaded, setGifLoaded] = useState(false)
    const [initialPlaced, setInitialPlaced] = useState(false)
    const [currentGifIndex, setCurrentGifIndex] = useState(0)

    // Preload all gifs
    useEffect(() => {
        const allGifs = [...QUESTION_GIFS, ...ACCEPTED_GIFS]
        let loadedCount = 0
        allGifs.forEach(url => {
            const img = new Image()
            img.src = url
            img.onload = () => {
                loadedCount++
                if (loadedCount === allGifs.length) {
                    setGifLoaded(true)
                }
            }
        })
    }, [])

    // Cycle through gifs every 3 seconds
    useEffect(() => {
        if (!gifLoaded) return

        const currentGifs = accepted ? ACCEPTED_GIFS : QUESTION_GIFS
        
        const interval = setInterval(() => {
            setCurrentGifIndex(prev => (prev + 1) % currentGifs.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [gifLoaded, accepted])

    // Reset gif index when accepted state changes
    useEffect(() => {
        setCurrentGifIndex(0)
    }, [accepted])

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

    const getRects = () => {
        const wrap = wrapRef.current!
        const yes = yesRef.current!
        const no = noRef.current!
        return {
            wrapRect: wrap.getBoundingClientRect(),
            yesRect: yes.getBoundingClientRect(),
            noRect: no.getBoundingClientRect(),
        }
    }

    const boundsForNo = (wrapRect: DOMRect, noRect: DOMRect) => {
        const maxX = wrapRect.width - noRect.width - MARGIN
        const maxY = wrapRect.height - noRect.height - MARGIN
        return { maxX, maxY }
    }

    const placeNoNextToYes = () => {
        if (!wrapRef.current || !yesRef.current || !noRef.current) return

        const { wrapRect, yesRect, noRect } = getRects()
        const { maxX, maxY } = boundsForNo(wrapRect, noRect)
        const gap = 12

        const x = clamp(yesRect.right - wrapRect.left + gap, MARGIN, maxX)
        const y = clamp(yesRect.top - wrapRect.top, MARGIN, maxY)

        setNoPos({ x, y })
    }

    const randomNoPos = (current?: Pos) => {
        const { wrapRect, noRect } = getRects()
        const { maxX, maxY } = boundsForNo(wrapRect, noRect)

        let x = MARGIN + Math.random() * (maxX - MARGIN)
        let y = MARGIN + Math.random() * (maxY - MARGIN)

        if (current) {
            const d = Math.hypot(x - current.x, y - current.y)
            if (d < 100) {
                x = clamp(x + 140, MARGIN, maxX)
                y = clamp(y + 100, MARGIN, maxY)
            }
        }

        return { x: clamp(x, MARGIN, maxX), y: clamp(y, MARGIN, maxY) }
    }

    useLayoutEffect(() => {
        if (wrapRef.current && yesRef.current && noRef.current && !initialPlaced) {
            placeNoNextToYes()
            setInitialPlaced(true)
        }
    }, [gifLoaded, initialPlaced]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const ensureVisible = () => {
            if (!noRef.current || !wrapRef.current || !noPos) return
            const { wrapRect, noRect } = getRects()
            const { maxX, maxY } = boundsForNo(wrapRect, noRect)
            setNoPos({
                x: clamp(noPos.x, MARGIN, maxX),
                y: clamp(noPos.y, MARGIN, maxY),
            })
        }

        window.addEventListener('resize', ensureVisible)
        window.addEventListener('orientationchange', ensureVisible)
        return () => {
            window.removeEventListener('resize', ensureVisible)
            window.removeEventListener('orientationchange', ensureVisible)
        }
    }, [noPos]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleNoPointerDown = () => {
        setNoPos(p => randomNoPos(p))
    }

    function handleYesClick() {
        setAccepted(true)
        celebrate()
    }

    function celebrate() {
        confetti({
            particleCount: 140,
            spread: 70,
            origin: { y: 0.7 },
            scalar: 0.9,
            drift: 0.4,
        })
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.8 },
                scalar: 0.8,
            })
        }, 300)
    }

    const hearts = [
        { x: '6%', y: '14%', size: 26, d: '0s', rotate: 0 },
        { x: '85%', y: '18%', size: 20, d: '0.6s', rotate: 15 },
        { x: '12%', y: '80%', size: 24, d: '0.9s', rotate: -10 },
        { x: '70%', y: '75%', size: 24, d: '0.3s', rotate: 20 },
        { x: '40%', y: '12%', size: 18, d: '1.0s', rotate: -15 },
        { x: '92%', y: '60%', size: 26, d: '0.2s', rotate: 5 },
        { x: '30%', y: '88%', size: 20, d: '0.8s', rotate: -20 },
        { x: '55%', y: '20%', size: 22, d: '0.4s', rotate: 10 },
        { x: '15%', y: '45%', size: 24, d: '0.5s', rotate: -5 },
        { x: '80%', y: '50%', size: 21, d: '0.7s', rotate: 15 },
        { x: '50%', y: '85%', size: 23, d: '1.1s', rotate: 0 },
        { x: '95%', y: '30%', size: 19, d: '0.4s', rotate: -12 },
        { x: '3%', y: '55%', size: 20, d: '0.3s', rotate: 8 },
        { x: '48%', y: '5%', size: 24, d: '0.9s', rotate: -8 },
        { x: '72%', y: '40%', size: 16, d: '0.6s', rotate: 18 },
        { x: '22%', y: '28%', size: 19, d: '1.2s', rotate: -14 },
        { x: '62%', y: '92%', size: 23, d: '0.1s', rotate: 6 },
        { x: '88%', y: '8%', size: 17, d: '0.8s', rotate: -18 },
    ]

    const sparkles = [
        { x: '10%', y: '25%', size: 12, d: '0s' },
        { x: '75%', y: '15%', size: 10, d: '0.3s' },
        { x: '20%', y: '70%', size: 14, d: '0.6s' },
        { x: '88%', y: '65%', size: 11, d: '0.9s' },
        { x: '45%', y: '10%', size: 13, d: '0.2s' },
        { x: '65%', y: '80%', size: 12, d: '0.5s' },
        { x: '35%', y: '35%', size: 10, d: '0.8s' },
        { x: '90%', y: '45%', size: 14, d: '0.4s' },
        { x: '25%', y: '60%', size: 11, d: '0.7s' },
        { x: '60%', y: '25%', size: 13, d: '1.0s' },
        { x: '5%', y: '90%', size: 12, d: '0.5s' },
        { x: '82%', y: '35%', size: 11, d: '0.9s' },
        { x: '38%', y: '50%', size: 13, d: '0.2s' },
        { x: '68%', y: '68%', size: 10, d: '0.7s' },
        { x: '15%', y: '8%', size: 14, d: '0.4s' },
    ]

    const stars = [
        { x: '8%', y: '22%', size: 16, d: '0s' },
        { x: '78%', y: '12%', size: 14, d: '0.4s' },
        { x: '28%', y: '65%', size: 18, d: '0.8s' },
        { x: '92%', y: '72%', size: 15, d: '0.3s' },
        { x: '52%', y: '8%', size: 17, d: '0.6s' },
        { x: '18%', y: '92%', size: 14, d: '1.0s' },
        { x: '85%', y: '88%', size: 16, d: '0.2s' },
        { x: '42%', y: '78%', size: 15, d: '0.7s' },
    ]

    const flowers = [
        { x: '12%', y: '18%', size: 24, d: '0s', rotate: 0 },
        { x: '82%', y: '25%', size: 21, d: '0.5s', rotate: 45 },
        { x: '25%', y: '75%', size: 23, d: '0.9s', rotate: -30 },
        { x: '75%', y: '82%', size: 24, d: '0.3s', rotate: 60 },
        { x: '35%', y: '15%', size: 25, d: '0.6s', rotate: -20 },
        { x: '60%', y: '60%', size: 21, d: '1.0s', rotate: 25 },
        { x: '5%', y: '65%', size: 17, d: '0.7s', rotate: -45 },
        { x: '90%', y: '55%', size: 21, d: '0.2s', rotate: 30 },
    ]

    const clouds = [
        { x: '10%', y: '10%', size: 40, d: '0s' },
        { x: '70%', y: '8%', size: 35, d: '0.5s' },
        { x: '85%', y: '90%', size: 38, d: '0.8s' },
    ]

    return (
        <div
            ref={wrapRef}
            className="bg-valentine relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center px-5 py-6"
            style={{
                paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
            }}
        >
            <div className="pointer-events-none absolute inset-0">
                {hearts.map((h, i) => (
                    <svg
                        key={`heart-${i}`}
                        className="heart"
                        style={{
                            left: h.x,
                            top: h.y,
                            width: h.size,
                            height: h.size,
                            animationDelay: h.d,
                            transform: `rotate(${h.rotate}deg)`,
                        }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 21s-6.2-4.85-9.1-7.74C.9 11.26.6 8.5 2.3 6.8 4.1 5 6.9 5.3 8.6 7.1L12 10.6l3.4-3.5c1.7-1.8 4.5-2.1 6.3-.3 1.7 1.7 1.4 4.4-.6 6.5C18.2 16.15 12 21 12 21z" />
                    </svg>
                ))}
                {sparkles.map((s, i) => (
                    <svg
                        key={`sparkle-${i}`}
                        className="sparkle"
                        style={{
                            left: s.x,
                            top: s.y,
                            width: s.size,
                            height: s.size,
                            animationDelay: s.d,
                        }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0l2.4 8.4L24 12l-9.6 3.6L12 24l-2.4-8.4L0 12l9.6-3.6L12 0z" />
                    </svg>
                ))}
                {stars.map((s, i) => (
                    <svg
                        key={`star-${i}`}
                        className="star"
                        style={{
                            left: s.x,
                            top: s.y,
                            width: s.size,
                            height: s.size,
                            animationDelay: s.d,
                        }}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
                {flowers.map((f, i) => (
                    <svg
                        key={`flower-${i}`}
                        className="flower"
                        style={{
                            left: f.x,
                            top: f.y,
                            width: f.size,
                            height: f.size,
                            animationDelay: f.d,
                            transform: `rotate(${f.rotate}deg)`,
                        }}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="2.5" fill="#ff69b4" />
                        <circle cx="12" cy="6" r="3" fill="#ffb6d9" opacity="0.9" />
                        <circle cx="18" cy="12" r="3" fill="#ffb6d9" opacity="0.9" />
                        <circle cx="12" cy="18" r="3" fill="#ffb6d9" opacity="0.9" />
                        <circle cx="6" cy="12" r="3" fill="#ffb6d9" opacity="0.9" />
                        <circle cx="16" cy="8" r="2.5" fill="#ffc8e3" opacity="0.8" />
                        <circle cx="16" cy="16" r="2.5" fill="#ffc8e3" opacity="0.8" />
                        <circle cx="8" cy="16" r="2.5" fill="#ffc8e3" opacity="0.8" />
                        <circle cx="8" cy="8" r="2.5" fill="#ffc8e3" opacity="0.8" />
                    </svg>
                ))}
                {clouds.map((c, i) => (
                    <svg
                        key={`cloud-${i}`}
                        className="cloud"
                        style={{
                            left: c.x,
                            top: c.y,
                            width: c.size,
                            height: c.size * 0.6,
                            animationDelay: c.d,
                        }}
                        viewBox="0 0 100 60"
                    >
                        <ellipse cx="25" cy="40" rx="20" ry="18" fill="#ffe5f0" opacity="0.4" />
                        <ellipse cx="50" cy="35" rx="25" ry="22" fill="#ffebf5" opacity="0.5" />
                        <ellipse cx="75" cy="40" rx="20" ry="18" fill="#ffe5f0" opacity="0.4" />
                    </svg>
                ))}
            </div>

            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="relative">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="animate-bounce-slow">
                        <path d="M20 35s-10-8-15-13c-3-3-3-8 0-11 3-3 8-3 11 0l4 4 4-4c3-3 8-3 11 0 3 3 3 8 0 11-5 5-15 13-15 13z" fill="#ff69b4" opacity="0.5" />
                    </svg>
                </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none">
                <div className="relative">
                    <svg width="40" height="40" viewBox="0 0 40 40" className="animate-spin-slow">
                        <circle cx="20" cy="20" r="15" fill="none" stroke="#ffb6d9" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
                        <path d="M20 8l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" fill="#ff8fa3" opacity="0.5" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="relative">
                    <svg width="35" height="35" viewBox="0 0 35 35" className="animate-wiggle">
                        <circle cx="17.5" cy="17.5" r="4" fill="#ff69b4" />
                        <circle cx="17.5" cy="9" r="5" fill="#ffb6d9" opacity="0.8" />
                        <circle cx="26" cy="17.5" r="5" fill="#ffb6d9" opacity="0.8" />
                        <circle cx="17.5" cy="26" r="5" fill="#ffb6d9" opacity="0.8" />
                        <circle cx="9" cy="17.5" r="5" fill="#ffb6d9" opacity="0.8" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 pointer-events-none">
                <div className="relative">
                    <svg width="38" height="38" viewBox="0 0 38 38" className="animate-pulse-soft">
                        <path d="M19 5l2.5 7L29 14l-5.5 4 1.5 7-6-4-6 4 1.5-7L9 14l7.5-2z" fill="#ffc0d4" opacity="0.5" />
                        <circle cx="19" cy="19" r="3" fill="#ff8fa3" opacity="0.6" />
                    </svg>
                </div>
            </div>

            <img
                src={(accepted ? ACCEPTED_GIFS : QUESTION_GIFS)[currentGifIndex]}
                alt="Cute hugging bears with hearts"
                className="w-44 h-44 object-cover rounded-2xl shadow-md mb-5"
                loading="eager"
            />

            {!accepted ? (
                <>
                    <h1 className="text-2xl font-extrabold text-rose-700 text-center mb-5 tracking-tight">
                        Will you be my Valentine?
                    </h1>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            ref={yesRef}
                            onClick={handleYesClick}
                            className="z-20 rounded-full bg-rose-600 text-white py-3 px-8 text-lg font-semibold shadow-lg active:scale-95 transition touch-manipulation"
                        >
                            Yes
                        </button>
                    </div>

                    <button
                        ref={noRef}
                        onPointerDown={handleNoPointerDown}
                        className="absolute z-30 rounded-full bg-white text-rose-600 border-2 border-rose-400 py-3 px-7 text-lg font-semibold shadow-lg active:scale-95 touch-manipulation"
                        style={{
                            left: `${noPos.x}px`,
                            top: `${noPos.y}px`,
                            transition: 'left 0.3s ease-out, top 0.3s ease-out, transform 0.1s ease',
                        }}
                    >
                        No
                    </button>
                </>
            ) : (
                <div className="text-center mt-2">
                    <h2 className="text-2xl font-extrabold text-rose-700 mb-2">Yayyyyy!</h2>
                    <p className="text-rose-700/80 text-base">I lubb youhh Maluu 💖😁</p>
                </div>
            )}
        </div>
    )
}

export default App
