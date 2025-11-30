import Hero from '@/components/landingPage/Hero';
import Stats from '@/components/landingPage/Stats';
import Features from '@/components/landingPage/Features';
import WhyChoose from '@/components/landingPage/WhyChoose';
import Testimonials from '@/components/landingPage/Testimonials';
import CTA from '@/components/landingPage/CTA';
import Footer from '@/components/landingPage/Footer';
import ParallaxBackground from '@/components/ui/ParallaxBackground';
import MouseGradient from '@/components/ui/MouseGradient';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <ParallaxBackground />
      <MouseGradient />
      <div className="layout-container flex h-full grow flex-col pt-20">
        <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            <Hero />
            <Stats />
            <Features />
            <WhyChoose />
            <Testimonials />
            <CTA />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
