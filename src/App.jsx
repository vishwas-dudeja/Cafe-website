import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Story from './components/Story';
import Categories from './components/Categories';
import CoffeeJourney from './components/CoffeeJourney';
import Menu from './components/Menu';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import useCursorTrail from './hooks/useCursorTrail';

export default function App() {
  // Initialize the cursor trail effect (desktop only)
  useCursorTrail();

  return (
    <>
      <Preloader />
      <Navbar />
      <Hero />
      <Marquee />
      <Story />
      <Categories />
      <CoffeeJourney />
      <Menu />
      <Experience />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
