import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Briefcase, Wrench, Mail, Eye, ArrowRight,
  Star, Edit2, Plus, ShoppingBag, Users,
} from 'lucide-react';
import API from '../../services/api';
import KnowledgeIndexCard from '../../components/admin/KnowledgeIndexCard';

// Safely unwrap a Promise.allSettled result, falling back to an empty
// shape if that particular request failed — so one broken/unavailable
// endpoint never blanks out the rest of the dashboard.
const settledData = (result, fallback = { data: [], count: 0 }) =>
  result.status === 'fulfilled' ? result.value.data : fallback;

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: 0,
    portfolio: 0,
    blogs: 0,
    contacts: 0,
    products: 0,
    teamMembers: 0,
    pendingReviews: 0,
    totalReviews: 0,
    totalViews: 0,
    newMessages: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [projectsByCategory, setProjectsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const results = await Promise.allSettled([
          API.get('/services'),
          API.get('/portfolio'),
          API.get('/blogs?limit=100'),
          API.get('/contact'),
          API.get('/reviews?all=true'),
          API.get('/products?active=all'),
          API.get('/team?active=all'),
        ]);

        const [
          services,
          portfolio,
          blogs,
          contacts,
          reviews,
          products,
          team,
        ] = results.map((r) => settledData(r));

        const totalViews = (blogs.data || []).reduce((sum, b) => sum + (b.views || 0), 0);
        const newMessages = (contacts.data || []).filter((c) => c.status === 'new').length;
        const pendingReviews = (reviews.data || []).filter((r) => !r.isApproved).length;
        const totalReviews = reviews.count || 0;

        // Tally projects by category
        const byCategory = {};
        (portfolio.data || []).forEach((p) => {
          byCategory[p.category] = (byCategory[p.category] || 0) + 1;
        });

        setStats({
          services: services.count || 0,
          portfolio: portfolio.count || 0,
          blogs: blogs.total || blogs.count || 0,
          contacts: contacts.count || 0,
          products: products.count || 0,
          teamMembers: team.count || 0,
          pendingReviews,
          totalReviews,
          totalViews,
          newMessages,
        });

        setRecentBlogs((blogs.data || []).slice(0, 4));
        setRecentContacts((contacts.data || []).slice(0, 4));
        setRecentProjects((portfolio.data || []).slice(0, 5));
        setProjectsByCategory(byCategory);

        // Surface any individual failures in the console without blocking the UI
        results.forEach((r, idx) => {
          if (r.status === 'rejected') {
            console.warn(`Dashboard: request ${idx} failed:`, r.reason?.message);
          }
        });
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const cards = [
    {
      label: 'Total Projects',
      value: stats.portfolio,
      icon: Briefcase,
      tone: 'primary',
      link: '/admin/portfolio',
      hint: 'Manage portfolio',
    },
    {
      label: 'Products',
      value: stats.products,
      icon: ShoppingBag,
      tone: 'accent',
      link: '/admin/products',
      hint: 'Manage products',
    },
    {
      label: 'Services',
      value: stats.services,
      icon: Wrench,
      tone: 'slate',
      link: '/admin/services',
      hint: 'Manage services',
    },
    {
      label: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      tone: 'slate',
      link: '/admin/team',
      hint: 'Manage team',
    },
    {
      label: 'Blog Posts',
      value: stats.blogs,
      icon: FileText,
      tone: 'slate',
      link: '/admin/blogs',
      hint: `${stats.totalViews.toLocaleString()} total views`,
    },
    {
      label: 'New Messages',
      value: stats.newMessages,
      icon: Mail,
      tone: stats.newMessages > 0 ? 'red' : 'slate',
      link: '/admin/contacts',
      hint: `${stats.contacts} total messages`,
    },
    {
      label: stats.pendingReviews > 0 ? 'Pending Reviews' : 'Reviews',
      value: stats.pendingReviews > 0 ? stats.pendingReviews : stats.totalReviews,
      icon: Star,
      tone: stats.pendingReviews > 0 ? 'accent' : 'slate',
      link: '/admin/reviews',
      hint:
        stats.pendingReviews > 0
          ? `Awaiting approval · ${stats.totalReviews} total`
          : `${stats.totalReviews} approved`,
    },
  ];

  const toneClasses = {
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    accent: 'bg-accent-50 text-accent-700 border-accent-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  if (loading) {
    return (
      <div>
        <div className="h-9 w-56 bg-slate-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-72 bg-slate-200 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-200 h-32 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-600 text-sm">
            Welcome back. Here&apos;s an overview of what&apos;s happening on your site.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white rounded-xl p-5 border border-slate-200/70 hover:border-primary-300 hover:shadow-card transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${toneClasses[card.tone]}`}>
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <ArrowRight
                  className="text-slate-300 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all"
                  size={16}
                />
              </div>
              <p className="stat-number text-2xl text-slate-900 mb-0.5">
                {card.value.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-slate-700">{card.label}</p>
              {card.hint && (
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                  {card.hint}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Recent Projects + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-slate-200/70 lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Recent Projects
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest items added to your portfolio
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Link
                to="/admin/portfolio"
                className="text-[10px] font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900 hidden sm:inline"
              >
                View All
              </Link>
              <Link
                to="/admin/portfolio"
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
                title="Add new project"
              >
                <Plus size={15} />
              </Link>
            </div>
          </div>

          {recentProjects.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No projects yet.{' '}
              <Link to="/admin/portfolio" className="text-primary-700 font-semibold hover:underline">
                Add your first project
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProjects.map((p) => (
                <li
                  key={p._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors group"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {p.title}
                      </p>
                      {p.isFeatured && (
                        <Star size={11} className="text-accent-500 fill-accent-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                        {p.category}
                      </span>
                      <span>•</span>
                      <span className="truncate">
                        {p.client || 'No client'}
                      </span>
                    </p>
                  </div>
                  <Link
                    to="/admin/portfolio"
                    className="p-1.5 text-slate-400 hover:text-primary-700 hover:bg-primary-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Manage"
                  >
                    <Edit2 size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Project Breakdown by Category */}
        <div className="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Projects by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Total breakdown</p>
          </div>
          {Object.keys(projectsByCategory).length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No data yet.</div>
          ) : (
            <ul className="p-5 space-y-3">
              {Object.entries(projectsByCategory).map(([cat, count]) => {
                const pct = stats.portfolio ? (count / stats.portfolio) * 100 : 0;
                return (
                  <li key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-700 capitalize">
                        {cat}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-700 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Blogs + Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Blogs */}
        <div className="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Recent Blog Posts
            </h2>
            <Link
              to="/admin/blogs"
              className="text-[10px] font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900"
            >
              View All
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentBlogs.length === 0 ? (
              <li className="p-8 text-sm text-slate-500 text-center">No blogs yet</li>
            ) : (
              recentBlogs.map((blog) => (
                <li
                  key={blog._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors"
                >
                  <img
                    src={blog.coverImage || 'https://via.placeholder.com/60'}
                    alt={blog.title}
                    className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {blog.title}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <Eye size={11} /> {blog.views} views • {blog.category}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl border border-slate-200/70 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              Recent Messages
            </h2>
            <Link
              to="/admin/contacts"
              className="text-[10px] font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900"
            >
              View All
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentContacts.length === 0 ? (
              <li className="p-8 text-sm text-slate-500 text-center">No messages yet</li>
            ) : (
              recentContacts.map((contact) => (
                <li
                  key={contact._id}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {contact.name}
                      </p>
                      {contact.status === 'new' && (
                        <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {contact.subject || contact.message}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <KnowledgeIndexCard />
      </div>
    </div>
  );
};

export default Dashboard;