import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:3000/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail]             = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      
      setSuccess(true);
      // Give them a moment to read the success message before redirecting
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-enter w-full max-w-[500px] mx-auto mt-10 md:mt-20 bg-surface rounded-[2.5rem] neo-raised p-8 md:p-10">
      <div className="text-center mb-8">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface neo-pressed">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight mb-2">Reset Password</h1>
        <p className="text-secondary font-medium">Enter your email and a new password.</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl neo-pressed border-l-4 border-error flex items-center gap-2">
          <span className="material-symbols-outlined text-error text-sm">error</span>
          <p className="text-sm text-on-surface">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 px-4 py-3 rounded-xl neo-pressed border-l-4 border-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
          <p className="text-sm text-on-surface">Password updated! Redirecting to login...</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="email">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-secondary text-lg">mail</span>
            </div>
            <input
              id="email" name="email" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base"
              disabled={loading || success}
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="newPassword">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-secondary text-lg">lock</span>
            </div>
            <input
              id="newPassword" name="newPassword" type="password" required
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base"
              disabled={loading || success}
            />
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            type="submit" disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-surface text-primary font-bold rounded-xl neo-raised neo-interactive transition-all duration-300 text-lg hover:text-tertiary hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {loading
              ? <span className="material-symbols-outlined animate-spin">progress_activity</span>
              : <><span>Update Password</span><span className="material-symbols-outlined text-xl">done</span></>
            }
          </button>
          
          <Link 
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-surface text-secondary font-semibold rounded-xl neo-raised neo-interactive transition-all duration-300 text-base hover:text-on-surface hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
