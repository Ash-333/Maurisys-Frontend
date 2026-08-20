import Hero from '../components/Hero';
import Features from '../components/Features';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import Stats from '../components/Stats';
// import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <AboutSection />
      <Stats />
      <ServicesSection limit={6} />
      <PortfolioSection limit={6} showFilters={false} />
      {/* <Pricing /> */}
      <Testimonials hideIfEmpty />
      <BlogSection limit={3} />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
