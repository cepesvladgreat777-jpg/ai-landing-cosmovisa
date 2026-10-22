import { HeroMedia } from './components/HeroMedia';
import { HeroHeader } from './components/HeroHeader';
import { HeroCopy } from './components/HeroCopy';
import { useHeroVideo } from './hooks/useHeroVideo';

export function HeroSection() {
  const { heroRef, ...media } = useHeroVideo();
  return (
    <section
      ref={heroRef}
      id="top"
      className="relative w-full overflow-hidden h-screen h-[100dvh] bg-brand-page"
      style={{ height: '100dvh' }}
    >
      <HeroMedia {...media} />
      <HeroHeader />
      <HeroCopy />
    </section>
  );
}
