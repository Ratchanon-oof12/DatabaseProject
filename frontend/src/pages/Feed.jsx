import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavItem from '../components/NavItem';
import { getUser, clearUser, authHeaders } from '../utils/auth';

const API = 'http://localhost:3000/api';
const CATEGORIES = ['Tech', 'Lifestyle', 'Design', 'Architecture', 'Food', 'Travel', 'Other'];

export default function Feed() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [collapsed, setCollapsed] = useState(false);
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [filter, setFilter]       = useState('All');

  const handleLogout = () => { clearUser(); navigate('/login'); };

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/blogs`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      setBlogs(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this blog post?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API}/blogs/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.status === 403) throw new Error('You do not own this post');
      if (!res.ok) throw new Error('Delete failed');
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const allCategories = ['All', ...CATEGORIES];
  const displayed  = filter === 'All' ? blogs : blogs.filter(b => b.category === filter);
  const published  = displayed.filter(b => b.status === 'published');
  const drafts     = displayed.filter(b => b.status === 'draft');

  const isOwner = (post) => currentUser && post.authorId === currentUser._id;

  const BlogCard = ({ post }) => (
    <Link to={`/blog/${post._id}`} className="group">
      <article className={`bg-surface rounded-xl p-5 neo-raised flex flex-col h-full transition-all duration-200 hover:scale-[1.01] ${post.status === 'draft' ? 'opacity-70' : ''}`}>
        {post.coverImage && (
          <div className="h-44 rounded-lg overflow-hidden mb-4 neo-pressed p-1">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500" onError={e => e.target.style.display='none'} />
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-0.5 rounded-full neo-raised text-xs font-bold text-primary">{post.category}</span>
          <div className="flex items-center gap-2">
            {post.status === 'draft' && <span className="px-2 py-0.5 rounded-full neo-pressed text-xs font-medium text-secondary">Draft</span>}
            <span className="text-xs text-secondary">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <h3 className="font-headline font-bold text-base leading-tight mb-1 text-on-surface group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-xs text-secondary line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
          <div>
            <span className="text-xs font-medium text-on-surface-variant">{post.author}</span>
            {isOwner(post) && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">You</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-secondary text-xs">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              {post.likes}
            </span>
            {/* Only owner sees Edit/Delete */}
            {isOwner(post) && (
              <>
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); navigate(`/edit/${post._id}`); }}
                  className="w-7 h-7 rounded-full neo-raised flex items-center justify-center text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
                <button
                  onClick={e => handleDelete(post._id, e)}
                  disabled={deleting === post._id}
                  className="w-7 h-7 rounded-full neo-raised flex items-center justify-center text-secondary hover:text-error transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">{deleting === post._id ? 'progress_activity' : 'delete'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );

  return (
    <div className="font-body text-on-surface antialiased bg-background min-h-screen flex">

      {/* ── Sidebar ── */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-50 bg-surface transition-all duration-300 ease-in-out rounded-r-3xl neo-raised overflow-hidden ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
          <span className="material-symbols-outlined text-primary text-3xl flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          {!collapsed && <div><p className="text-lg font-bold text-primary leading-none">Silk Reader</p><p className="text-xs text-secondary mt-0.5">Blog CRUD Demo</p></div>}
        </div>
        <div className={`px-3 mb-4 ${collapsed ? 'flex justify-center' : ''}`}>
          <button onClick={() => setCollapsed(!collapsed)} className="w-9 h-9 rounded-xl neo-raised flex items-center justify-center text-secondary hover:text-primary transition-all hover:neo-pressed">
            <span className="material-symbols-outlined text-xl">{collapsed ? 'menu_open' : 'menu'}</span>
          </button>
        </div>
        {/* User card */}
        {!collapsed && currentUser && (
          <div className="mx-4 mb-4 px-4 py-3 rounded-xl neo-pressed">
            <p className="text-sm font-semibold text-on-surface truncate">{currentUser.name}</p>
            <p className="text-xs text-secondary truncate">{currentUser.email}</p>
          </div>
        )}
        <nav className="flex-1 space-y-1 py-2">
          <NavItem icon="home"        label="Feed"       active to="/feed"   collapsed={collapsed} />
          <NavItem icon="edit_square" label="Write Blog" to="/create"        collapsed={collapsed} />
        </nav>
        <div className="pb-6 space-y-1">
          <NavItem icon="logout" label="Logout" onClick={handleLogout} collapsed={collapsed} />
        </div>
      </aside>

      {/* ── Mobile Nav ── */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-40 bg-surface neo-raised">
        <span className="text-lg font-bold text-primary">Silk Reader</span>
        <div className="flex items-center gap-4">
          <Link to="/feed"><span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>home</span></Link>
          <Link to="/create"><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">edit_square</span></Link>
          <button onClick={handleLogout}><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">logout</span></button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className={`flex-1 transition-all duration-300 pt-20 md:pt-10 pb-10 px-6 overflow-y-auto ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-6xl mx-auto page-enter">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-headline font-bold text-on-surface">Blog Feed</h2>
              <p className="text-secondary text-sm mt-1">{blogs.length} post{blogs.length !== 1 ? 's' : ''} in database</p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 px-5 py-3 bg-surface neo-raised text-primary font-semibold rounded-xl hover:neo-pressed transition-all hover:text-tertiary active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New Post
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === cat ? 'neo-pressed text-primary' : 'neo-raised text-secondary hover:text-primary'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full neo-raised flex items-center justify-center">
                <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
              </div>
              <p className="text-secondary text-sm">Loading from MongoDB...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl neo-pressed flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-3xl">wifi_off</span>
              </div>
              <p className="text-on-surface font-semibold">Can't reach the backend</p>
              <p className="text-secondary text-sm">{error}</p>
              <button onClick={fetchBlogs} className="mt-2 px-5 py-2.5 neo-raised text-primary font-semibold rounded-xl hover:neo-pressed transition-all text-sm">Retry</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-14 h-14 rounded-2xl neo-pressed flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-3xl">article</span>
              </div>
              <p className="text-on-surface font-semibold">No posts yet</p>
              <button onClick={() => navigate('/create')} className="mt-2 px-5 py-2.5 neo-raised text-primary font-semibold rounded-xl hover:neo-pressed transition-all text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">add</span>Create First Post
              </button>
            </div>
          )}

          {/* Published */}
          {!loading && !error && published.length > 0 && (
            <>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-headline font-bold text-on-surface">Published</h3>
                <span className="text-sm text-secondary">{published.length} post{published.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {published.map(post => <BlogCard key={post._id} post={post} />)}
              </div>
            </>
          )}

          {/* Drafts */}
          {!loading && !error && drafts.length > 0 && (
            <>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-headline font-bold text-on-surface">Drafts</h3>
                <span className="text-sm text-secondary">{drafts.length} draft{drafts.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map(post => <BlogCard key={post._id} post={post} />)}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
