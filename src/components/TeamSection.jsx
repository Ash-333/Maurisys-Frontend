import { useEffect, useState } from 'react';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';
import { fetchTeam } from '../services/api';

const categories = [
    { id: 'all', label: 'All' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'sales', label: 'Sales' },
    { id: 'support', label: 'Support' },
];

const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    email: Mail,
};

const TeamSection = ({ hideIfEmpty = false }) => {
    const [members, setMembers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const { data } = await fetchTeam({ category: filter });
                setMembers(data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [filter]);

    // Nothing from the API (and nothing loading) — skip the section entirely.
    if (hideIfEmpty && (loading || members.length === 0)) return null;

    return (
        <section className="py-24 bg-white" id="team">
            <div className="container-custom">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="section-eyebrow justify-center">Our People</p>
                    <h2 className="section-title">Meet the Team</h2>
                    <p className="section-lede">
                        The people behind the work — designers, developers, and strategists driving results for our clients.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-4 py-1.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all border ${filter === cat.id
                                    ? 'bg-primary-800 text-white border-primary-800'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-slate-200 h-72 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-12 text-center text-slate-500">
                        No team members in this category yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {members.map((member) => (
                            <div key={member._id} className="group text-center">
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                                        {Object.entries(member.socials || {}).map(([key, url]) => {
                                            if (!url) return null;
                                            const Icon = socialIcons[key];
                                            if (!Icon) return null;
                                            const href = key === 'email' ? `mailto:${url}` : url;
                                            return (
                                                <a
                                                    key={key}
                                                    href={href}
                                                    target={key === 'email' ? undefined : '_blank'}
                                                    rel="noopener noreferrer"
                                                    className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-800 hover:bg-white"
                                                >
                                                    <Icon size={13} />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-slate-900 tracking-tight">{member.name}</h3>
                                <p className="text-sm text-slate-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TeamSection;
