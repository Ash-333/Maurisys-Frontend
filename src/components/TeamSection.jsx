import { useEffect, useState, useMemo, useRef } from 'react';
import { Linkedin, Twitter, Github, Mail, ArrowUpRight } from 'lucide-react';
import { fetchTeam } from '../services/api';

const categoryLabels = {
    leadership: 'Leadership',
    development: 'Development',
    design: 'Design',
    marketing: 'Marketing',
    sales: 'Sales',
    support: 'Support',
};

const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    email: Mail,
};

// Reveal a node once it scrolls into view (matches the pattern in Stats.jsx)
const useReveal = () => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, inView];
};

const SocialPills = ({ socials, reverse = false }) => {
    const entries = Object.entries(socials || {}).filter(([key, url]) => url && socialIcons[key]);
    if (entries.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 mt-5 ${reverse ? 'lg:justify-end' : ''}`}>
            {entries.map(([key, url]) => {
                const Icon = socialIcons[key];
                const href = key === 'email' ? `mailto:${url}` : url;
                return (
                    <a
                        key={key}
                        href={href}
                        target={key === 'email' ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-600 hover:border-primary-600 hover:text-primary-700 transition-colors"
                    >
                        <Icon size={13} />
                        {key}
                        <ArrowUpRight size={12} />
                    </a>
                );
            })}
        </div>
    );
};

const MemberRow = ({ member, reverse = false }) => {
    const [ref, inView] = useReveal();
    const paragraphs = (member.bio || '')
        .split(/\n\s*\n|\n/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className={`lg:col-span-3 team-reveal ${reverse ? 'lg:order-2 team-from-right' : 'team-from-left'} ${inView ? 'is-in' : ''}`}>
                <div className={`aspect-[4/5] max-w-[240px] rounded-2xl overflow-hidden bg-slate-100 ${reverse ? 'lg:ml-auto' : ''}`}>
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>
                <SocialPills socials={member.socials} reverse={reverse} />
            </div>

            <div
                className={`lg:col-span-9 lg:border-slate-200 team-reveal team-delay ${
                    reverse ? 'lg:order-1 lg:border-r lg:pr-14 team-from-left' : 'lg:border-l lg:pl-14 team-from-right'
                } ${inView ? 'is-in' : ''}`}
            >
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{member.name}</h3>
                <p className="mt-2 text-sm font-semibold text-primary-700">{member.role}</p>
                {paragraphs.length > 0 && (
                    <div className="mt-8 space-y-5">
                        {paragraphs.map((text, i) => (
                            <p key={i} className="text-[15px] md:text-base text-slate-600 leading-[1.85]">
                                {text}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const isTopLevel = (role) => /ceo|founder/i.test(role || '');

const TeamSection = ({ hideIfEmpty = false }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const { data } = await fetchTeam();
                let list = data.data;
                if (!list || list.length === 0) {
                    const cats = ['leadership', 'development', 'design', 'marketing', 'sales', 'support'];
                    const results = await Promise.all(cats.map((c) => fetchTeam({ category: c }).then((r) => r.data.data)));
                    list = results.flat();
                }
                const sorted = [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
                setMembers(sorted);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const { topLevel, grouped } = useMemo(() => {
        const top = [];
        const map = {};
        members.forEach((m) => {
            if (isTopLevel(m.role)) {
                top.push(m);
            } else {
                const cat = m.category || 'support';
                if (!map[cat]) map[cat] = [];
                map[cat].push(m);
            }
        });
        const order = ['leadership', 'development', 'design', 'marketing', 'sales', 'support'];
        const sorted = {};
        order.forEach((k) => { if (map[k]) sorted[k] = map[k]; });
        Object.keys(map).forEach((k) => { if (!sorted[k]) sorted[k] = map[k]; });
        return { topLevel: top, grouped: sorted };
    }, [members]);

    const categoryKeys = Object.keys(grouped);

    if (hideIfEmpty && (loading || members.length === 0)) return null;

    return (
        <section className="py-24 bg-white" id="team">
            <div className="container-custom max-w-6xl">
                <style>{`
                    .team-reveal {
                        opacity: 0;
                        transform: translateY(24px);
                        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .team-from-left { transform: translate3d(-28px, 18px, 0); }
                    .team-from-right { transform: translate3d(28px, 18px, 0); }
                    .team-delay { transition-delay: 140ms; }
                    .team-reveal.is-in { opacity: 1; transform: translate3d(0, 0, 0); }
                    @media (prefers-reduced-motion: reduce) {
                        .team-reveal, .team-reveal.is-in {
                            opacity: 1;
                            transform: none;
                            transition: none;
                        }
                    }
                `}</style>

                {/* Category index — slash separated, jumps to each group */}
                {categoryKeys.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-700 mb-6">
                        {categoryKeys.map((cat, i) => (
                            <span key={cat} className="flex items-center gap-2">
                                {i > 0 && <span className="text-slate-300">/</span>}
                                <a href={`#team-${cat}`} className="hover:text-primary-900 transition-colors">
                                    {categoryLabels[cat] || cat}
                                </a>
                            </span>
                        ))}
                    </div>
                )}

                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Meet the team</h2>
                <p className="mt-4 text-lg text-slate-500 max-w-2xl leading-relaxed">
                    The people who build our software and stand behind every project we ship.
                </p>

                <div className="mt-16">
                    {loading ? (
                        <div className="space-y-20 animate-pulse">
                            {[1, 2].map((i) => (
                                <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-14">
                                    <div className="lg:col-span-3 aspect-[4/5] max-w-[240px] rounded-2xl bg-slate-200" />
                                    <div className="lg:col-span-9 space-y-4 pt-2">
                                        <div className="h-9 bg-slate-200 rounded w-1/2" />
                                        <div className="h-3 bg-slate-200 rounded w-24" />
                                        <div className="h-3 bg-slate-200 rounded w-full mt-8" />
                                        <div className="h-3 bg-slate-200 rounded w-full" />
                                        <div className="h-3 bg-slate-200 rounded w-4/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : members.length === 0 ? (
                        <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-12 text-center text-slate-500">
                            No team members yet.
                        </div>
                    ) : (
                        <div className="space-y-20">
                            {topLevel.map((member, i) => (
                                <MemberRow key={member._id} member={member} reverse={i % 2 === 1} />
                            ))}

                            {categoryKeys.map((cat) => (
                                <div key={cat} id={`team-${cat}`} className="space-y-20 scroll-mt-28">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 pt-4 border-t border-slate-200">
                                        {categoryLabels[cat] || cat}
                                    </p>
                                    {grouped[cat].map((member, i) => (
                                        <MemberRow key={member._id} member={member} reverse={i % 2 === 1} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
