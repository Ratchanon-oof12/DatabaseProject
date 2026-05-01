import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavItem from '../components/NavItem';
import { getUser, clearUser, authHeaders } from '../utils/auth';

const API = 'http://localhost:3000/api';
const CATEGORIES = ['Tech', 'Lifestyle', 'Design', 'Architecture', 'Food', 'Travel', 'Other'];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const EMPTY_FORM = {
  title: '', slug: '', author: '', category: 'Tech',
  content: '', excerpt: '', coverImage: '', status: 'published',
};


export default function CreateBlog() {
  const { id } = useParams();
  const currentUser = getUser();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [collapsed, setCollapsed] = useState(false);
  const [form, setForm]           = useState({ ...EMPTY_FORM, author: currentUser?.name || '' });
  const [loading, setLoading]     = useState(isEditing);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);
  const [slugManual, setSlugManual] = useState(false);
  const handleLogout = () => { clearUser(); navigate('/login'); };

  // Load existing post when editing
  useEffect(() => {
    if (!isEditing) return;
    const load = async () => {
      try {
        const res = await fetch(`${API}/blogs/${id}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setForm({
          title:      data.title,
          slug:       data.slug,
          author:     data.author,
          category:   data.category,
          content:    data.content,
          excerpt:    data.excerpt,
          coverImage: data.coverImage || '',
          status:     data.status,
        });
        setSlugManual(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from title unless user manually changed it
      if (name === 'title' && !slugManual) {
        updated.slug = slugify(value);
      }
      if (name === 'slug') setSlugManual(true);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url    = isEditing ? `${API}/blogs/${id}` : `${API}/blogs`;
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing ? form : { ...form, authorId: currentUser?._id };
      const res    = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      navigate(`/blog/${data._id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const fieldClass = "block w-full px-4 py-3.5 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-sm";
  const labelClass = "block text-sm font-semibold text-on-surface-variant mb-2 ml-1";

  return (
    <div className="font-body text-on-surface antialiased bg-background min-h-screen flex">

      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-50 bg-surface transition-all duration-300 ease-in-out rounded-r-3xl neo-raised overflow-hidden ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
          <span className="material-symbols-outlined text-primary text-3xl flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          {!collapsed && (
            <div>
              <p className="text-lg font-bold text-primary leading-none">Silk Reader</p>
              <p className="text-xs text-secondary mt-0.5">Blog CRUD Demo</p>
            </div>
          )}
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
          <NavItem icon="edit_square" label="Write Blog" active to="/create" collapsed={collapsed} />
        </nav>
        <div className="pb-6 space-y-1">
          <NavItem icon="logout" label="Logout" onClick={handleLogout} collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile nav */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-40 bg-surface neo-raised">
        <span className="text-lg font-bold text-primary">Silk Reader</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/feed')}><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">home</span></button>
          <button onClick={handleLogout}><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">logout</span></button>
        </div>
      </nav>

      <main className={`flex-1 transition-all duration-300 pt-20 md:pt-10 pb-10 px-4 sm:px-8 overflow-y-auto ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-3xl mx-auto">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="w-12 h-12 rounded-full neo-raised flex items-center justify-center">
                <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
              </div>
              <p className="text-secondary text-sm">Loading post...</p>
            </div>
          )}

          {!loading && (
            <div className="page-enter">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-headline font-bold text-on-surface">
                    {isEditing ? 'Edit Post' : 'New Post'}
                  </h1>
                  <p className="text-secondary text-sm mt-1">
                    {isEditing ? `Editing — update fields and save` : 'Fill in the details and publish'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl neo-raised text-secondary hover:text-primary transition-all text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span className="hidden sm:inline">Back</span>
                </button>
              </div>

              {/* Error banner */}
              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl neo-pressed border-l-4 border-error flex items-center gap-3">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="text-sm text-on-surface font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-surface rounded-2xl neo-raised p-6 sm:p-8 space-y-6">
                  <h2 className="text-sm font-bold text-secondary uppercase tracking-widest">Post Details</h2>

                  {/* Title */}
                  <div>
                    <label className={labelClass} htmlFor="title">Title *</label>
                    <input id="title" name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Enter your blog title..." className={fieldClass} />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className={labelClass} htmlFor="slug">
                      Slug *
                      <span className="ml-2 text-xs font-normal text-secondary/60">(auto-generated from title)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-xs font-mono">/blog/</span>
                      <input id="slug" name="slug" type="text" required value={form.slug} onChange={handleChange} placeholder="my-blog-post" className={`${fieldClass} pl-14`} />
                    </div>
                  </div>

                  {/* Author + Category (2 col) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass} htmlFor="author">Author *</label>
                      <input id="author" name="author" type="text" required value={form.author} onChange={handleChange} placeholder="Your name" className={fieldClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="category">Category *</label>
                      <select id="category" name="category" required value={form.category} onChange={handleChange} className={fieldClass}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className={labelClass}>Status *</label>
                    <div className="flex gap-3">
                      {['published', 'draft'].map(s => (
                        <button
                          key={s} type="button"
                          onClick={() => setForm(p => ({ ...p, status: s }))}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                            form.status === s
                              ? 'neo-pressed text-primary'
                              : 'neo-raised text-secondary hover:text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm mr-1.5 align-text-bottom">
                            {s === 'published' ? 'public' : 'draft'}
                          </span>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="bg-surface rounded-2xl neo-raised p-6 sm:p-8 space-y-6">
                  <h2 className="text-sm font-bold text-secondary uppercase tracking-widest">Content</h2>

                  {/* Excerpt */}
                  <div>
                    <label className={labelClass} htmlFor="excerpt">Excerpt / Summary *</label>
                    <textarea id="excerpt" name="excerpt" required rows={2} value={form.excerpt} onChange={handleChange} placeholder="A short description shown in cards and feeds..." className={`${fieldClass} resize-none`} />
                  </div>

                  {/* Body */}
                  <div>
                    <label className={labelClass} htmlFor="content">Content *</label>
                    <textarea id="content" name="content" required rows={10} value={form.content} onChange={handleChange} placeholder="Write your full blog post here...&#10;&#10;Use blank lines to separate paragraphs." className={`${fieldClass} resize-y min-h-[200px] leading-relaxed`} />
                    <p className="mt-1.5 ml-1 text-xs text-secondary/60">Separate paragraphs with a blank line.</p>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className={labelClass} htmlFor="coverImage">Cover Image URL <span className="font-normal text-secondary/60">(optional)</span></label>
                    <input id="coverImage" name="coverImage" type="url" value={form.coverImage} onChange={handleChange} placeholder="https://..." className={fieldClass} />
                    {form.coverImage && (
                      <div className="mt-3 h-32 rounded-xl overflow-hidden neo-pressed p-1">
                        <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover rounded-lg" onError={e => e.target.style.opacity = '0.3'} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 py-4 rounded-xl neo-raised text-secondary font-semibold hover:text-on-surface transition-all hover:neo-pressed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-2 flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl neo-raised text-primary font-bold text-lg hover:neo-pressed transition-all disabled:opacity-60 active:scale-[0.98]"
                  >
                    {saving
                      ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      : <span className="material-symbols-outlined">{isEditing ? 'save' : 'publish'}</span>
                    }
                    {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
