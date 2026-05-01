import { Link } from 'react-router-dom';

export default function NavItem({ icon, label, active, collapsed, to, onClick }) {
  const cls = `flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all duration-300
    ${active ? 'neo-pressed text-primary scale-[0.98]' : 'text-secondary hover:text-on-surface hover:neo-raised'}
    ${collapsed ? 'justify-center' : ''}
  `;

  const inner = (
    <>
      <span className="material-symbols-outlined flex-shrink-0" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </>
  );

  if (onClick) {
    return <button onClick={onClick} className={`w-full text-left ${cls}`}>{inner}</button>;
  }
  return <Link to={to || '#'} className={cls}>{inner}</Link>;
}
