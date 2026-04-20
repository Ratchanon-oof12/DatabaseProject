import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <main className="page-enter w-full max-w-[900px] bg-surface rounded-[2.5rem] neo-raised p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">
      
      {/* Left Column: Branding */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left p-4 md:pl-8">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface neo-pressed">
          <span className="material-symbols-outlined text-5xl text-primary" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-4">
          Silk Reader
        </h1>
        <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
          Create an account to start writing and sharing your neomorphic stories with the world.
        </p>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full md:w-1/2 bg-surface rounded-3xl p-8 md:p-10 neo-pressed">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {/* Inactive Tab */}
          <Link to="/login" className="flex-1 py-4 px-2 rounded-xl bg-surface text-secondary font-medium flex items-center justify-center gap-2 neo-raised neo-interactive transition-all duration-300 text-base md:text-lg hover:text-primary hover:bg-surface-variant/30">
            <span className="material-symbols-outlined text-sm">login</span>
            Login
          </Link>
          {/* Active Tab */}
          <Link to="/register" className="flex-1 py-4 px-2 rounded-xl bg-surface text-primary font-semibold flex items-center justify-center gap-2 neo-pressed transition-all duration-300 text-base md:text-lg hover:text-tertiary">
            <span className="material-symbols-outlined text-sm">person_add</span>
            Register
          </Link>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Name Field */}
          <div>
            <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="name">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary text-lg">person</span>
              </div>
              <input 
                className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base" 
                id="name" name="name" placeholder="John Doe" required type="text"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="email">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary text-lg">mail</span>
              </div>
              <input 
                className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base" 
                id="email" name="email" placeholder="you@example.com" required type="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-base font-medium text-on-surface-variant mb-2 ml-2" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary text-lg">lock</span>
              </div>
              <input 
                className="block w-full pl-12 pr-4 py-4 bg-surface border-transparent rounded-xl text-on-surface placeholder-secondary focus:border-transparent focus:ring-0 neo-pressed transition-shadow text-base" 
                id="password" name="password" placeholder="••••••••" required type="password"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-surface text-primary font-bold rounded-xl neo-raised neo-interactive transition-all duration-300 text-lg hover:text-tertiary hover:scale-[1.02] hover:bg-surface-variant/30 active:scale-95" type="submit">
              Create Account
              <span className="material-symbols-outlined text-xl">person_add</span>
            </button>
          </div>
        </form>
      </div>

    </main>
  );
}
