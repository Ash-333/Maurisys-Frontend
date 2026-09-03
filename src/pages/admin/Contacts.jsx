import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Phone, Calendar, Trash2, Eye, X, Reply, Archive, Bot} from 'lucide-react';
import API from '../../services/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/contact');
      setContacts(data.data);
    } catch (e) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/contact/${id}`, { status });
      toast.success('Status updated');
      loadContacts();
      if (selectedContact?._id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    if (contact.status === 'new') {
      updateStatus(contact._id, 'read');
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const filtered = filter === 'all' ? contacts : contacts.filter((c) => c.status === filter);

  const counts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === 'new').length,
    read: contacts.filter((c) => c.status === 'read').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
    archived: contacts.filter((c) => c.status === 'archived').length,
  };

  return (
    <div>
      <Toaster position="top-right" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Contact Messages</h1>
        <p className="text-slate-600 text-sm">Manage incoming inquiries from your website</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors flex items-center gap-2 ${
              filter === key ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {key}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              filter === key ? 'bg-white/20' : 'bg-slate-200'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Messages table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            No messages in this folder
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((contact) => (
              <div
                key={contact._id}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                  contact.status === 'new' ? 'bg-blue-50/40' : ''
                }`}
                onClick={() => handleView(contact)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-slate-900">{contact.name}</p>
                      <span className="text-xs text-slate-500">{contact.email}</span>
                      {contact.status === 'new' && (
                        <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          NEW
                        </span>
                      )}
                      {contact.status === 'replied' && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          REPLIED
                        </span>
                      )}
                      {contact.status === 'archived' && (
                        <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          ARCHIVED
                        </span>
                      )}
                      {contact.source === 'chatbot' && (
                        <span className="bg-primary-100 text-primary-700 text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                          <Bot size={10} /> CHATBOT
                        </span>
                      )}
                    </div>
                    {contact.subject && (
                      <p className="font-medium text-sm text-slate-800 mb-1 truncate">
                        {contact.subject}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 line-clamp-1">{contact.message}</p>
                    {contact.quoteSnapshot?.formatted && (
                      <p className="text-xs font-semibold text-primary-700 mt-1">
                        Quoted {contact.quoteSnapshot.formatted}
                        {contact.quoteSnapshot.timeline
                          ? ` · ${contact.quoteSnapshot.timeline}`
                          : ''}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(contact.createdAt)}
                    </p>
                  </div>
                  <Eye className="text-slate-400 flex-shrink-0" size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
              <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedContact.name}</h3>
                  <p className="text-sm text-slate-500">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Mail className="text-primary-600" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Email</p>
                    <a href={`mailto:${selectedContact.email}`} className="text-sm font-medium text-slate-900 hover:text-primary-600 truncate block">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Phone className="text-primary-600" size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <a href={`tel:${selectedContact.phone}`} className="text-sm font-medium text-slate-900 hover:text-primary-600">
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {selectedContact.subject && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1">Subject</p>
                  <p className="font-semibold text-slate-900">{selectedContact.subject}</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs text-slate-500 mb-2">Message</p>
                <div className="bg-slate-50 rounded-xl p-4 text-slate-700 whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your inquiry'}`}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  <Reply size={16} className="mr-2" /> Reply via Email
                </a>
                {selectedContact.status !== 'replied' && (
                  <button
                    onClick={() => updateStatus(selectedContact._id, 'replied')}
                    className="px-4 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium text-sm"
                  >
                    Mark as Replied
                  </button>
                )}
                {selectedContact.status !== 'archived' && (
                  <button
                    onClick={() => updateStatus(selectedContact._id, 'archived')}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium text-sm flex items-center gap-2"
                  >
                    <Archive size={14} /> Archive
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
