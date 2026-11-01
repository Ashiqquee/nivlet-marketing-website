'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { AppIcon } from './tool-icon';
import styles from './native-demo.module.css';

const shots = [
  { id: 'prompts', label: 'Prompts', title: 'Copy the prompt you need.', body: 'Saved prompts and writing rules, a click away from the app you’re working in.', alt: 'Nivlet’s native Prompts panel with saved writing rules, project context and fill-in templates.' },
  { id: 'fill-in-prompt', label: 'Fill-in blanks', title: 'Fill in the blanks.', body: 'Name the blanks once. Fill them in, check the complete text, then copy it.', alt: 'The native Explain a concept template with Topic and Audience filled and the complete text ready to review.' },
  { id: 'references', label: 'References', title: 'Keep the originals close.', body: 'Original files with labels and notes, ready to drag into your chat.', alt: 'Nivlet’s native References shelf showing a layout image and a page brief.' },
  { id: 'scratchpad', label: 'Scratchpad', title: 'Note the next question.', body: 'A note and checklist for each pocket. Changes save on your Mac.', alt: 'Nivlet’s native Scratchpad with next questions and clickable checklist rows.' },
] as const;

export function NativeDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const shot = shots[active];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { element.dataset.visible = String(entry.isIntersecting); }, { threshold: .35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={root} className={styles.tour} data-playing={playing}>
    <div className={styles.frame}>
      <div className={styles.screen}>
        <div className={styles.menuBar} aria-hidden="true"><span className={styles.menuDot} /><span>File</span><span>Edit</span><span>View</span><span>Window</span><em>Sat 31 Oct&nbsp;&nbsp;9:41</em></div>
        <div className={styles.chat} aria-hidden="true">
          <div className={styles.chatBar}><i /><i /><i /></div>
          <div className={styles.chatBody}><span className={styles.bubbleIn} /><span className={styles.bubbleInShort} /><span className={styles.bubbleOut} /><span className={styles.bubbleIn} /></div>
          <div className={styles.composer}><span>Message</span><i /></div>
        </div>
        <div className={styles.panelWrap}>
          {shots.map((item, index) => <Image key={item.id} className={styles.panel} data-active={index === active} src={`/assets/${item.id}.png`} width={840} height={1280} alt={index === active ? item.alt : ''} aria-hidden={index !== active} />)}
        </div>
        <div className={styles.dock} role="group" aria-label="Choose a tool to preview">
          {shots.map((item, index) => <button key={item.id} className={styles.dockButton} aria-pressed={index === active} onClick={() => setActive(index)}>
            <AppIcon tool={item.id} />
            <span>{item.label}</span>
            {index === active && <span key={active} className={styles.progress} aria-hidden="true" onAnimationEnd={() => setActive((active + 1) % shots.length)} />}
          </button>)}
        </div>
      </div>
    </div>
    <div className={styles.captionRow}>
      <p key={shot.id} className={styles.caption}><strong>{shot.title}</strong> {shot.body}</p>
      <button className={styles.toggle} onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pause the tour' : 'Play the tour'}>{playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} fill="currentColor" aria-hidden="true" />}</button>
    </div>
  </div>;
}
