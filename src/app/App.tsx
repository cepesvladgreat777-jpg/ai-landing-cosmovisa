import { LandingPage } from '../pages/landing/LandingPage';
import { useSmoothScroll } from '../shared/hooks/useSmoothScroll';

export default function App() {
  useSmoothScroll();
  return <LandingPage />;
}
