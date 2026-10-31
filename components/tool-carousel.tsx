'use client';

import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AppIcon, type ToolName } from './tool-icon';

const cards: { tool: ToolName; title: string; body: string }[] = [
  { tool: 'prompts', title: 'Prompts', body: 'Save writing rules and reusable prompts. Copy the exact text with one click.' },
  { tool: 'fill-in-prompt', title: 'Fill-in blanks', body: 'Add named blanks, fill them in and check the complete text before you copy.' },
  { tool: 'references', title: 'References', body: 'Keep original file copies with labels and notes. Preview them, then drag them into your app.' },
  { tool: 'pockets', title: 'Project pockets', body: 'Keep each project’s prompts, files and notes apart. Search one pocket or all of them.' },
  { tool: 'scratchpad', title: 'Scratchpad', body: 'Plain-text notes and checklists for each pocket. Changes save locally.' },
];

function Art({ tool }: { tool: ToolName }) {
  if (tool === 'prompts') return <div className="art-prompt"><div className="art-sheet"><b>Writing style</b><span className="type-line" /><span className="type-line" /><span className="type-line short" /></div><span className="art-toast"><Check size={13} aria-hidden="true" /> Copied to clipboard</span></div>;
  if (tool === 'fill-in-prompt') return <div className="art-blanks"><p>Explain <span className="blank"><i>topic</i><i>closures</i></span> to <span className="blank late"><i>audience</i><i>a new designer</i></span>.</p><p className="art-muted">Start with an everyday example, then build up the details.</p></div>;
  if (tool === 'references') return <div className="art-files"><span className="file-sheet one" /><span className="file-sheet two" /><span className="file-sheet three" /></div>;
  if (tool === 'pockets') return <div className="art-pockets">{['Website', 'Writing', 'Side project', 'Research'].map(name => <span key={name}><i />{name}</span>)}</div>;
  return <div className="art-checklist">{['Share the brief', 'Check mobile layout', 'Ask one more question'].map(item => <span key={item}><i><Check size={10} strokeWidth={3} aria-hidden="true" /></i>{item}</span>)}</div>;
}

export function ToolCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (direction: number) => {
    const list = track.current;
    if (!list) return;
    const card = list.querySelector('li');
    list.scrollBy({ left: direction * ((card?.clientWidth ?? 360) + 20), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return <div className="carousel">
    <ul ref={track} className="carousel-track">
      {cards.map(card => <li key={card.tool} className={`tool-card tool-card-${card.tool}`}>
        <div className="tool-card-head"><AppIcon tool={card.tool} /><h3>{card.title}</h3></div>
        <p>{card.body}</p>
        <div className="tool-card-art" aria-hidden="true"><Art tool={card.tool} /></div>
      </li>)}
    </ul>
    <div className="carousel-controls">
      <p>Four tools. One panel at the edge of your screen.</p>
      <div><button onClick={() => scroll(-1)} aria-label="Previous tools"><ArrowLeft size={16} aria-hidden="true" /></button><button onClick={() => scroll(1)} aria-label="Next tools"><ArrowRight size={16} aria-hidden="true" /></button></div>
    </div>
  </div>;
}
