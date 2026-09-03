import { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Briefcase, Wrench,
  Mail, LogOut, Menu, X, Code2, ExternalLink, Star, ShoppingBag,
  Users, Handshake, BadgeDollarSign,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png'
import maurisysLogo from '../../assets/maurisys_logo.bg.webp'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Portfolio', path: '/admin/portfolio', icon: Briefcase },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Team', path: '/admin/team', icon: Users },
    { name: 'Partners', path: '/admin/partners', icon: Handshake },
    { name: 'Pricing', path: '/admin/pricing', icon: BadgeDollarSign },
    { name: 'Contact Messages', path: '/admin/contacts', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-primary-950 text-slate-300 z-50 transform transition-transform lg:translate-x-0 border-r border-white/[0.06] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-5 border-b border-white/[0.06]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div>
              {/* <Code2 className="w-5 h-5 text-white" strokeWidth={2.2} /> */}
              {/* <img className='w-12' src={logo} /> */}
            </div>
            <div>
              <img className='w-40' src={maurisysLogo} alt="Logo" />
              <p className="text-[10px] uppercase tracking-[0.18em] text-primary-300 font-semibold">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-0.5">
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-primary-300/60 px-3 mb-2 mt-1">
            Manage
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-[13px] transition-colors ${isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.8} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.06]">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:bg-white/[0.04] hover:text-white text-[13px] font-medium mb-1"
          >
            <ExternalLink size={16} strokeWidth={1.8} />
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-red-300 hover:bg-red-500/10 text-[13px] font-medium"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200/70 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-md hover:bg-slate-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
