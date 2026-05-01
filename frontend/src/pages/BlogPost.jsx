import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NavItem from '../components/NavItem';
import { getUser, clearUser, authHeaders } from '../utils/auth';

const API = 'http://localhost:3000/api';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [collapsed, setCollapsed]   = useState(false);
  const [blog, setBlog]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [liked, setLiked]           = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const handleLogout = () => { clearUser(); navigate('/login'); };
  const isOwner = blog && currentUser && blog.authorId === currentUser._id;

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`${API}/blogs/${id}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Post not found' : 'Failed to load post');
        setBlog(await res.json());
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await fetch(`${API}/blogs/${id}/like`, { method: 'PATCH', headers: authHeaders() });
      if (!res.ok) throw new Error('Like failed');
      setBlog(await res.json()); setLiked(true);
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/blogs/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.status === 403) throw new Error('You do not own this post');
      if (!res.ok) throw new Error('Delete failed');
      navigate('/feed');
    } catch (err) { alert(err.message); setDeleting(false); }
  };

  return (
    <div className="font-body text-on-surface antialiased bg-background min-h-screen flex">

      {/* Sidebar */}
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
        {!collapsed && currentUser && (
          <div className="mx-4 mb-4 px-4 py-3 rounded-xl neo-pressed">
            <p className="text-sm font-semibold text-on-surface truncate">{currentUser.name}</p>
            <p className="text-xs text-secondary truncate">{currentUser.email}</p>
          </div>
        )}
        <nav className="flex-1 space-y-1 py-2">
          <NavItem icon="home"        label="Feed"       to="/feed"   collapsed={collapsed} />
          <NavItem icon="edit_square" label="Write Blog" to="/create" collapsed={collapsed} />
        </nav>
        <div className="pb-6">
          <NavItem icon="logout" label="Logout" onClick={handleLogout} collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-40 bg-surface neo-raised">
        <span className="text-lg font-bold text-primary">Silk Reader</span>
        <div className="flex items-center gap-4">
          <Link to="/feed"><span className="material-symbols-outlined text-secondary hover:text-primary">home</span></Link>
          <Link to="/create"><span className="material-symbols-outlined text-secondary hover:text-primary">edit_square</span></Link>
          <button onClick={handleLogout}><span className="material-symbols-outlined text-secondary hover:text-primary">logout</span></button>
        </div>
      </nav>

      <main className={`flex-1 transition-all duration-300 pt-20 md:pt-10 pb-10 px-4 sm:px-8 overflow-y-auto ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-4xl mx-auto">

          {loading && (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
              <p className="text-secondary text-sm">Loading post...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <span className="material-symbols-outlined text-error text-4xl">error</span>
              <p className="text-on-surface font-semibold">{error}</p>
              <button onClick={() => navigate('/feed')} className="px-5 py-2.5 neo-raised text-primary font-semibold rounded-xl hover:neo-pressed text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">arrow_back</span>Back to Feed
              </button>
            </div>
          )}

          {!loading && !error && blog && (
            <div className="page-enter">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary px-4 py-2 rounded-xl neo-raised font-medium text-sm">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>Back
                </button>
                <div className="flex gap-2">
                  {isOwner ? (
                    <>
                      <button onClick={() => navigate(`/edit/${blog._id}`)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl neo-raised text-secondary hover:text-primary text-sm font-medium">
                        <span className="material-symbols-outlined text-sm">edit</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1.5 px-4 py-2 rounded-xl neo-raised text-secondary hover:text-error text-sm font-medium disabled:opacity-50">
                        <span className="material-symbols-outlined text-sm">{deleting ? 'progress_activity' : 'delete'}</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl neo-pressed text-secondary text-sm">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span className="hidden sm:inline">Read only</span>
                    </div>
                  )}
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center neo-raised transition-all ${bookmarked ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                  </button>
                </div>
              </div>

              {/* Authorization notice for visitors */}
              {!isOwner && (
                <div className="mb-6 px-4 py-3 rounded-xl neo-pressed border-l-4 border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">info</span>
                  <p className="text-sm text-secondary">
                    Written by <strong className="text-on-surface">{blog.author}</strong> — only the author can edit or delete this post.
                  </p>
                </div>
              )}

              <article className="bg-surface rounded-3xl neo-raised p-6 sm:p-10">
                <header className="mb-10 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="px-4 py-1.5 rounded-full neo-pressed text-xs font-semibold text-primary uppercase tracking-wider">{blog.category}</span>
                    {blog.status === 'draft' && <span className="px-3 py-1 rounded-full neo-raised text-xs font-semibold text-secondary uppercase">Draft</span>}
                    {isOwner && <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary">Your post</span>}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-on-surface leading-tight mb-4">{blog.title}</h1>
                  <p className="text-lg text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">{blog.excerpt}</p>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl neo-raised text-sm font-medium text-on-surface-variant flex-wrap justify-center">
                      <span className="font-semibold text-on-surface">{blog.author}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </header>

                {blog.coverImage && (
                  <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 neo-pressed p-2">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" onError={e => e.target.parentElement.parentElement.style.display='none'} />
                    </div>
                  </div>
                )}

                <div className="max-w-3xl mx-auto">
                  {blog.content.split('\n\n').map((para, i) => (
                    <p key={i} className="text-base text-secondary leading-loose mb-6">{para}</p>
                  ))}
                </div>

                <footer className="mt-16 pt-8 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full neo-raised font-medium transition-all ${liked ? 'text-red-500 neo-pressed' : 'text-primary hover:neo-pressed'}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    <span>{blog.likes} Like{blog.likes !== 1 ? 's' : ''}</span>
                  </button>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <span className="material-symbols-outlined text-sm">database</span>
                    <code className="font-mono opacity-60">{blog._id}</code>
                  </div>
                </footer>
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
