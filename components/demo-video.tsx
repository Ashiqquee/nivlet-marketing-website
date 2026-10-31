'use client';

import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './demo-video.module.css';

const chapters = [
  { title: 'Prompts', time: 0, label: '0:00' },
  { title: 'Fill-in blanks', time: 2.6, label: '0:03' },
  { title: 'References', time: 9, label: '0:09' },
  { title: 'Scratchpad', time: 11.7, label: '0:12' },
];

export function DemoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const player = video.current;
    if (player && window.matchMedia('(max-width: 700px)').matches) {
      player.poster = '/assets/native-demo-guided-mobile-v2.jpg';
    }
    return () => { player?.pause(); };
  }, []);

  function playFrom(time?: number) {
    const player = video.current;
    if (!player) return;
    if (time !== undefined) player.currentTime = time;
    setEnded(false);
    void player.play().catch(() => setPlaying(false));
  }

  return <div className={styles.inline}>
    <div className={styles.videoFrame}>
      <video ref={video} className={styles.video} controls playsInline preload="metadata" poster="/assets/native-demo-guided-v2.jpg" aria-label="Nivlet walkthrough: prompts, named blanks, references and scratchpad" onTimeUpdate={() => {
        const time = video.current?.currentTime ?? 0;
        setChapter(chapters.reduce((active, item, index) => time >= item.time ? index : active, 0));
      }} onEnded={() => { setEnded(true); setPlaying(false); }} onPlay={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)} onCanPlay={() => setFailed(false)} onError={() => setFailed(Boolean(video.current?.error))}>
        <source src="/assets/native-demo-guided-mobile-v2.mp4" media="(max-width: 700px)" type="video/mp4" />
        <source src="/assets/native-demo-guided-v2.mp4" type="video/mp4" />
        <track kind="captions" srcLang="en" label="English descriptions" src="/assets/native-demo-guided-v2.vtt" />
      </video>
    </div>
    <div className={styles.toolbar}>
      <button className={styles.play} onClick={() => playing ? video.current?.pause() : playFrom(ended ? 0 : undefined)}>{ended ? <RotateCcw size={15} aria-hidden="true" /> : playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}<span>{ended ? 'Replay' : playing ? 'Pause' : 'Play'}</span><span className={styles.duration}>0:15</span></button>
      <div className={styles.chapters} role="group" aria-label="Jump to a walkthrough chapter">{chapters.map((item, index) => <button key={item.title} aria-current={chapter === index ? 'step' : undefined} onClick={() => playFrom(item.time)}>{item.title}</button>)}</div>
    </div>
    {failed && <p className={styles.notice} role="alert">The video couldn’t load. <a href="/assets/native-demo-guided-v2.mp4" download>Download the video</a> instead.</p>}
  </div>;
}
