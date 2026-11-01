'use client';

import { Captions, Check, Copy, Maximize, Minimize, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import prompts from '../artwork/workflow-demo/prompts.json';
import walkthrough from '../public/assets/workflow-demo-v1.json';
import styles from './demo-video.module.css';

const chapters = walkthrough.chapters;
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

export function DemoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(walkthrough.duration);
  const [descriptions, setDescriptions] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [playerStatus, setPlayerStatus] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    const player = video.current;
    setEnhanced(true);
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === frame.current);
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement === frame.current) {
        void document.exitFullscreen().catch(() => {});
      }
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    document.addEventListener('keydown', exitOnEscape);
    return () => { player?.pause(); document.removeEventListener('fullscreenchange', syncFullscreen); document.removeEventListener('keydown', exitOnEscape); };
  }, []);

  function seek(value: number) {
    const player = video.current;
    if (!player) return;
    const target = Math.max(0, Math.min(value, duration));
    if (player.readyState >= HTMLMediaElement.HAVE_METADATA) player.currentTime = target;
    else { pendingSeek.current = target; player.load(); }
    setTime(target);
    setEnded(false);
  }

  function playFrom(value?: number) {
    const player = video.current;
    if (!player) return;
    if (failed) player.load();
    if (value !== undefined) seek(value);
    setEnded(false);
    setPlayerStatus('');
    void player.play().catch(() => { setPlaying(false); setPlayerStatus('Playback couldn’t start. Try Play again.'); });
  }

  function toggleDescriptions() {
    const track = video.current?.textTracks[0];
    const next = !descriptions;
    if (track) track.mode = next ? 'showing' : 'hidden';
    setDescriptions(next);
  }

  async function toggleFullscreen() {
    const player = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    try {
      if (document.fullscreenElement === frame.current) await document.exitFullscreen();
      else if (document.fullscreenEnabled && frame.current?.requestFullscreen) await frame.current.requestFullscreen();
      else if (player?.webkitEnterFullscreen) player.webkitEnterFullscreen();
      else { if (player) player.controls = true; setPlayerStatus('Use the video’s fullscreen control.'); }
    } catch { setPlayerStatus('Fullscreen couldn’t open. You can keep watching here.'); }
  }

  async function copyPrompt(index: number) {
    try {
      await navigator.clipboard.writeText(prompts[index].text);
      setCopied(index);
      setCopyStatus(`${prompts[index].title} copied. Paste it into your chat when you’re ready.`);
    } catch {
      setCopied(null);
      setCopyStatus('Couldn’t copy. Select the prompt text below and copy it manually.');
    }
  }

  return <div className={styles.inline}>
    <div ref={frame} className={styles.videoFrame}>
      <div className={styles.picture}>
        <video ref={video} className={styles.video} controls={!enhanced} playsInline preload="none" poster="/assets/workflow-demo-v1.jpg" aria-label="Watch Nivlet beside Codex: copy a prompt, paste it and add an image" aria-describedby="workflow-description" onLoadedMetadata={() => {
          const player = video.current;
          if (!player) return;
          if (Number.isFinite(player.duration)) setDuration(player.duration);
          if (pendingSeek.current !== null) { player.currentTime = pendingSeek.current; pendingSeek.current = null; }
        }} onTimeUpdate={() => {
          const current = video.current?.currentTime ?? 0;
          setTime(current);
          setChapter(chapters.reduce((active, item, index) => current >= item.time ? index : active, 0));
        }} onEnded={() => { setEnded(true); setPlaying(false); }} onPlay={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)} onCanPlay={() => setFailed(false)} onError={() => setFailed(Boolean(video.current?.error))}>
          <source src="/assets/workflow-demo-v1.mp4" type="video/mp4" />
          <track kind="captions" srcLang="en" label="English descriptions" src="/assets/workflow-demo-v1.vtt" />
          <a href="/assets/workflow-demo-v1.mp4">Download the Nivlet video</a>.
        </video>
        {enhanced && !playing && (time < .1 || ended) && !failed && <button className={styles.start} onClick={() => playFrom(0)} aria-label={ended ? 'Replay demo' : 'Play demo'}>{ended ? <RotateCcw size={25} aria-hidden="true" /> : <Play size={25} fill="currentColor" aria-hidden="true" />}</button>}
      </div>
      {enhanced && <div className={styles.controls} role="group" aria-label="Video controls">
        <button className={styles.controlButton} onClick={() => playing ? video.current?.pause() : playFrom(ended ? 0 : undefined)} aria-label={ended ? 'Replay video' : playing ? 'Pause video' : 'Play video'}>{ended ? <RotateCcw size={18} aria-hidden="true" /> : playing ? <Pause size={18} fill="currentColor" aria-hidden="true" /> : <Play size={18} fill="currentColor" aria-hidden="true" />}</button>
        <span className={styles.time}>{formatTime(ended ? Math.ceil(duration) : time)}</span>
        <input className={styles.timeline} type="range" min="0" max={duration} step="0.01" value={Math.min(time, duration)} onChange={event => seek(Number(event.target.value))} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); seek(time + (event.key === 'ArrowRight' ? 5 : -5)); } }} aria-label="Video progress" aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`} style={{ '--progress': `${Math.min(100, time / duration * 100)}%` } as CSSProperties} />
        <span className={styles.time}>{formatTime(Math.ceil(duration))}</span>
        <button className={styles.controlButton} onClick={toggleDescriptions} aria-label={descriptions ? 'Hide video descriptions' : 'Show video descriptions'} aria-pressed={descriptions}><Captions size={19} aria-hidden="true" /></button>
        <button className={styles.controlButton} onClick={() => void toggleFullscreen()} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>{fullscreen ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}</button>
      </div>}
    </div>
    <div className={styles.chapters} role="group" aria-label="Jump to a video chapter">{chapters.map((item, index) => <button key={item.title} aria-current={chapter === index ? 'step' : undefined} onClick={() => playFrom(item.time)}><span className={styles.chapterNumber} aria-hidden="true">0{index + 1}</span>{item.title}</button>)}</div>
    <p className={styles.description} id="workflow-description">Shown with Codex. Keep Nivlet beside the chat app you already use.</p>
    <p className={styles.copyStatus} role="status">{playerStatus}</p>
    {failed && <p className={styles.notice} role="alert">The video couldn’t load. <a href="/assets/workflow-demo-v1.mp4" download>Download the video</a> or <a href="/assets/workflow-demo-v1-transcript.txt">read the walkthrough</a>.</p>}
    <details className={styles.details}>
      <summary>Read the steps</summary>
      <ol className={styles.steps}>
        <li>Save the prompts you use often in Nivlet.</li>
        <li>Pick one and click Copy prompt. Paste it into your chat with ⌘V.</li>
        <li>Need a different prompt? Pick another from the same list.</li>
        <li>Drag an image from References into your chat. Check it’s attached before you send.</li>
      </ol>
      <a className={styles.transcriptLink} href="/assets/workflow-demo-v1-transcript.txt" download>Download the walkthrough</a>
    </details>
    <details className={styles.details}>
      <summary>Copy the example prompts</summary>
      <p className={styles.promptHint}>Save these in Nivlet, or add prompts of your own.</p>
      <div className={styles.prompts}>{prompts.map((prompt, index) => <article key={prompt.title} className={styles.prompt}>
        <div className={styles.promptHeader}><h3>{prompt.title}</h3><button onClick={() => void copyPrompt(index)} aria-label={`Copy prompt: ${prompt.title}`}>{copied === index ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied === index ? 'Copied' : 'Copy prompt'}</button></div>
        <p className={styles.promptText}>{prompt.text}</p>
      </article>)}</div>
    </details>
    <p className={styles.copyStatus} role="status">{copyStatus}</p>
  </div>;
}
