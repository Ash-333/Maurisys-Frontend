import { useEffect, useState, useMemo } from 'react';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';
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

const socialLinks = (socials) =>
    Object.entries(socials || {}).map(([key, url]) => {
        if (!url) return null;
        const Icon = socialIcons[key];
        if (!Icon) return null;
        const href = key === 'email' ? `mailto:${url}` : url;
        return (
            <a key={key} href={href} target={key === 'email' ? undefined : '_blank'} rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-800 hover:bg-white">
                <Icon size={12} />
            </a>
        );
    });

const LeaderCard = ({ member }) => (
    <div className="group text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 mx-auto mb-4 ring-4 ring-primary-100 shadow-lg">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 gap-2">
                {socialLinks(member.socials)}
            </div>
        </div>
        <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
        <p className="text-sm text-primary-700 font-medium">{member.role}</p>
    </div>
);

const MemberCard = ({ member }) => (
    <div className="group text-center shrink-0 w-40">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-3">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1.5">
                {socialLinks(member.socials)}
            </div>
        </div>
        <h4 className="font-semibold text-slate-900 text-sm tracking-tight truncate">{member.name}</h4>
        <p className="text-xs text-slate-500 truncate">{member.role}</p>
    </div>
);

const centeredCategories = ['leadership', 'development'];

const isTopLevel = (role) => /ceo|founder/i.test(role || '');

const CategorySection = ({ category, members }) => {
    const isCentered = centeredCategories.includes(category);

    return (
        <div className="py-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-700 mb-6 text-center">{categoryLabels[category] || category}</p>
            <div className={`flex gap-12 flex-wrap ${isCentered ? 'justify-center' : 'justify-start'}`}>
                {members.map((member) =>
                    isCentered ? (
                        <LeaderCard key={member._id} member={member} />
                    ) : (
                        <MemberCard key={member._id} member={member} />
                    )
                )}
            </div>
        </div>
    );
};

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
            <div className="container-custom">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="section-eyebrow justify-center">Our People</p>
                    <h2 className="section-title">Meet the Team</h2>
                    <p className="section-lede">
                        The people behind the work — organized by function.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-8">
                        <div className="flex justify-center animate-pulse">
                            <div className="w-32 h-32 rounded-full bg-slate-200" />
                        </div>
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-5 justify-center animate-pulse">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="w-40 shrink-0">
                                        <div className="aspect-square bg-slate-200 rounded-2xl mb-3" />
                                        <div className="h-3 bg-slate-200 rounded w-24 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-12 text-center text-slate-500">
                        No team members yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {topLevel.length > 0 && (
                            <div className="py-8 flex justify-center gap-12 flex-wrap">
                                {topLevel.map((member) => (
                                    <LeaderCard key={member._id} member={member} />
                                ))}
                            </div>
                        )}
                        {categoryKeys.map((cat) => (
                            <CategorySection key={cat} category={cat} members={grouped[cat]} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TeamSection;
