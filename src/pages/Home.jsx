import Hero from '../components/Hero';
import Features from '../components/Features';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import PortfolioSection from '../components/PortfolioSection';
import TechStack from '../components/TechStack';
import Stats from '../components/Stats';
import PartnersMarquee from '../components/PartnersMarquee';
// import Pricing from '../components/Pricing';
import ProductsSection from '../components/ProductsSection';
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
      <PartnersMarquee />
      <ServicesSection limit={6} />
      <TechStack />
      <ProductsSection limit={3} showFilters={false} hideIfEmpty />
      <PortfolioSection limit={6} showFilters={false} hideIfEmpty />
      {/* <Pricing /> */}
      <Testimonials hideIfEmpty />
      <BlogSection limit={3} />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
