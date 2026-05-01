import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../utils/auth';

const API = 'http://localhost:3000/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data);
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter w-full max-w-[900px] bg-surface rounded-[2.5rem] neo-raised p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">

      {/* Left Column: Branding */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left p-4 md:pl-8">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface neo-pressed">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-4">Silk Reader</h1>
        <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
          Create an account and start publishing your stories.
        </p>


      </div>

      {/* Right Column: Form */}
      <div className="w-full md:w-1/2 bg-surface rounded-3xl p-8 md:p-10 neo-pressed">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Link to="/login"    className="flex-1 py-4 px-2 rounded-xl bg-surface text-secondary font-medium flex items-center justify-center gap-2 neo-raised neo-interactive text-base hover:text-primary">
            <span className="material-symbols-outlined text-sm">login</span>Login
          </Link>
          <Link to="/register" className="flex-1 py-4 px-2 rounded-xl bg-surface text-primary font-semibold flex items-center justify-center gap-2 neo-pressed text-base">
            <span className="material-symbols-outlined text-sm">person_add</span>Register
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl neo-pressed border-l-4 border-error flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-sm">error</span>
            <p className="text-sm text-on-surface">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="name">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary text-lg">person</span>
              </div>
              <input
                id="name" name="name" type="text" required
                value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="email">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary text-lg">mail</span>
              </div>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary text-lg">lock</span>
              </div>
              <input
                id="password" name="password" type="password" required
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-surface text-primary font-bold rounded-xl neo-raised neo-interactive transition-all duration-300 text-lg hover:text-tertiary hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {loading
                ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
                : <><span>Create Account</span><span className="material-symbols-outlined text-xl">person_add</span></>
              }
            </button>
          </div>

          <p className="text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-tertiary transition-colors">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
