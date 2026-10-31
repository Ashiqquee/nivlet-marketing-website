import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export function CoffeeSupport() {
  return <section className="coffee-section wrap" id="coffee" aria-labelledby="coffee-title">
    <div className="coffee-copy"><h2 id="coffee-title">Nivlet is free.<br /><span>My iced coffee isn’t.</span></h2><p>If this saves you a few clicks, you can buy me a coffee.<br className="desktop-break" /> I’ll call it “funding” and feel very official.</p></div>
    <div className="coffee-action"><a className="coffee-button" href="https://buymeacoffee.com/ashiqquee" rel="noreferrer"><Image src="/support/buy-me-a-coffee.svg" width={25} height={36} alt="" /><span>Buy me a coffee</span><ArrowUpRight size={17} aria-hidden="true" /></a><p>Entirely optional. Nivlet stays free.</p></div>
  </section>;
}
