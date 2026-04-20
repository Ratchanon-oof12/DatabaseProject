import { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Placeholder Data ---
const trendingPosts = [
  {
    id: 1, category: 'Tech', title: 'The Minimalist Workspace: A 2024 Review',
    excerpt: 'Exploring the essential tools for a clutter-free desk setup that actually boosts productivity without breaking the bank.',
    author: 'Alex River', likes: '1.2k',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=11',
  },
  {
    id: 2, category: 'Lifestyle', title: 'Finding the Perfect Morning Ritual',
    excerpt: 'Why the slow pour-over method might be the exact mindfulness practice your chaotic mornings are missing.',
    author: 'Emma Hayes', likes: '856',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
  {
    id: 3, category: 'Design', title: 'The Evolution of Sneaker Silhouettes',
    excerpt: 'How industrial design principles are reshaping the footwear industry, one chunky sole at a time.',
    author: 'David Chen', likes: '742',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=8',
  },
];

const feedPosts = [
  {
    id: 4, category: 'Architecture', categoryColor: 'text-tertiary', time: '2 hours ago',
    title: 'Brutalism is Making a Soft Return',
    excerpt: 'An architectural review of how harsh concrete structures are being softened by modern interior design trends and lush indoor landscaping.',
    author: 'Emma Hayes', role: 'Architecture Critic',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
];

// --- NavItem Component ---
function NavItem({ icon, label, active, collapsed, to }) {
  return (
    <Link
      to={to || '#'}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all duration-300
        ${active
          ? 'neo-pressed text-primary scale-[0.98]'
          : 'text-secondary hover:text-on-surface hover:neo-raised'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <span className="material-symbols-outlined flex-shrink-0" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </Link>
  );
}

export default function Feed() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="font-body text-on-surface antialiased bg-background min-h-screen flex">

      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-50 bg-surface transition-all duration-300 ease-in-out
          rounded-r-3xl neo-raised overflow-hidden
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo / Brand */}
        <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
          <span className="material-symbols-outlined text-primary text-3xl flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-primary leading-none">Silk Reader</h1>
              <p className="text-xs text-secondary mt-0.5">Neomorphic Blog</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className={`px-3 mb-4 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-xl neo-raised flex items-center justify-center text-secondary hover:text-primary transition-all duration-200 hover:neo-pressed"
          >
            <span className="material-symbols-outlined text-xl">
              {collapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 py-2">
          <NavItem icon="home" label="Feed" active to="/feed" collapsed={collapsed} />
          <NavItem icon="person" label="Profile" to="/profile" collapsed={collapsed} />
        </nav>

        {/* Bottom: Logout */}
        <div className="pb-6 space-y-1">
          <NavItem icon="logout" label="Logout" to="/login" collapsed={collapsed} />
        </div>
      </aside>

      {/* ── Mobile Top Nav ── */}
      <nav className="md:hidden fixed top-0 left-0 w-full h-16 flex items-center justify-between px-6 z-40 bg-surface neo-raised">
        <span className="text-lg font-bold text-primary">Silk Reader</span>
        <div className="flex items-center gap-4">
          <Link to="/feed"><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">home</span></Link>
          <Link to="/profile"><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">person</span></Link>
          <Link to="/login"><span className="material-symbols-outlined text-secondary hover:text-primary transition-colors">logout</span></Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className={`flex-1 transition-all duration-300 pt-20 md:pt-10 pb-10 px-6 overflow-y-auto ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-6xl mx-auto page-enter">

          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-10">
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-surface border-none rounded-xl neo-pressed focus:ring-0 focus:outline-none text-sm font-medium placeholder:text-secondary text-on-surface"
                placeholder="Search blogs, authors..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full neo-raised flex items-center justify-center text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <Link to="/profile" className="flex items-center gap-3 bg-surface neo-raised px-4 py-2 rounded-xl cursor-pointer hover:neo-pressed transition-all">
                <img src="https://i.pravatar.cc/40?img=47" alt="User" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-semibold">Sarah Jenkins</span>
                <span className="material-symbols-outlined text-secondary text-sm">expand_more</span>
              </Link>
            </div>
          </div>

          {/* Trending Section */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">Trending Reviews</h2>
              <p className="text-on-surface-variant text-sm mt-1">What the community is reading right now</p>
            </div>
            <button className="text-primary text-sm font-semibold hover:text-tertiary transition-colors">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {trendingPosts.map(post => (
              <article key={post.id} className="bg-surface rounded-xl p-5 neo-raised flex flex-col group cursor-pointer">
                <div className="h-48 rounded-lg overflow-hidden mb-4 relative neo-pressed p-1">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full neo-raised text-xs font-bold text-primary">{post.category}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-lg leading-tight mb-2 text-on-surface group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-secondary line-clamp-2 mb-4">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <img src={post.avatar} alt={post.author} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-medium text-on-surface">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary text-xs">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span>{post.likes}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Recent Updates Section */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">Recent Updates</h2>
              <p className="text-secondary text-sm mt-1">The latest thoughts from creators you follow</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="bg-surface neo-pressed text-primary px-4 py-1.5 rounded-full text-sm font-semibold">For You</button>
              <button className="bg-surface neo-raised text-secondary px-4 py-1.5 rounded-full text-sm font-medium hover:text-primary transition-colors">Following</button>
              <button className="bg-surface neo-raised text-secondary px-4 py-1.5 rounded-full text-sm font-medium hover:text-primary transition-colors">Saved</button>
            </div>
          </div>

          {/* Feed Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {feedPosts.map(post => (
                <article key={post.id} className="bg-surface rounded-xl p-5 neo-raised flex flex-col md:flex-row gap-5 group cursor-pointer">
                  <div className="w-full md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden relative neo-pressed p-1 shrink-0">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`bg-surface px-3 py-1 rounded-full neo-raised text-xs font-bold ${post.categoryColor}`}>{post.category}</div>
                      <span className="text-xs text-secondary">{post.time}</span>
                    </div>
                    <h3 className="font-headline font-bold text-xl leading-tight mb-2 text-on-surface group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-secondary mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover neo-raised" />
                        <div>
                          <div className="text-sm font-semibold text-on-surface">{post.author}</div>
                          <div className="text-xs text-secondary">{post.role}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="w-8 h-8 rounded-full neo-raised flex items-center justify-center text-secondary hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                        </button>
                        <button className="w-8 h-8 rounded-full neo-raised flex items-center justify-center text-secondary hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Sidebar Widget */}
            <div className="space-y-6">
              <div className="bg-surface rounded-xl p-6 neo-raised text-center">
                <div className="w-20 h-20 mx-auto rounded-full neo-pressed p-1 mb-4">
                  <img src="https://i.pravatar.cc/80?img=47" alt="User" className="w-full h-full rounded-full object-cover" />
                </div>
                <h4 className="font-headline font-bold text-lg text-on-surface mb-1">Sarah Jenkins</h4>
                <p className="text-xs text-secondary mb-5">Premium Member</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface rounded-lg p-3 neo-pressed">
                    <div className="text-xl font-bold text-primary mb-1">12</div>
                    <div className="text-xs text-secondary">Articles Read</div>
                  </div>
                  <div className="bg-surface rounded-lg p-3 neo-pressed">
                    <div className="text-xl font-bold text-tertiary mb-1">5</div>
                    <div className="text-xs text-secondary">Saved Items</div>
                  </div>
                </div>
                <Link to="/profile" className="block w-full py-2.5 bg-surface rounded-lg neo-raised text-primary font-semibold text-sm hover:neo-pressed transition-all">
                  View Full Profile
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
