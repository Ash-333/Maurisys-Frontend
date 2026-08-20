import { Link } from 'react-router-dom';
import { Code2, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import maurisysLogo from '../assets/maurisys_logo.bg.webp'

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-slate-400 pt-20 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* About */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-white/10 border border-white/15 rounded-md flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <img className='w-40' src={maurisysLogo} alt="Logo" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-400 max-w-sm">
              Engineered software, design and growth strategy for ambitious businesses.
              Tailored, scalable, and built for the long term.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61574015725721' },
                { Icon: Instagram, href: 'https://www.instagram.com/maurisys/' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/company/maurisys/' },
                { Icon: Twitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-white/[0.04] border border-white/10 hover:bg-white hover:text-primary-900 rounded-md flex items-center justify-center transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-[0.18em]">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-[0.18em]">Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">App Development</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">UI/UX Design</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">SEO Optimization</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Digital Marketing</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Graphic Design</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-xs font-bold mb-4 uppercase tracking-[0.18em]">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-300 mt-0.5 flex-shrink-0" />
                <span>Lalitpur-44600, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-300 flex-shrink-0" />
                <a href="tel:+9779709005491" className="hover:text-white transition-colors">
                  +977-9709005491/92
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-300 flex-shrink-0" />
                <a href="mailto:maurisyssoftware@gmail.com" className="hover:text-white transition-colors break-all">
                  maurisyssoftware@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-300 flex-shrink-0" />
                <a href="mailto:Info@maurisys.com" className="hover:text-white transition-colors">
                  Info@maurisys.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white text-xs font-bold mb-3 uppercase tracking-[0.18em]">Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-3 py-2.5 rounded-l-md bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2.5 bg-white text-primary-900 hover:bg-slate-100 rounded-r-md transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500">© {year} Maurisys Software Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5 text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
