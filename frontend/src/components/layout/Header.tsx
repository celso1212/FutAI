import { NavLink, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, Home, BarChart2, Swords, User, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/analysis', label: 'Análise', icon: BarChart2 },
  { to: '/compare', label: 'Comparar', icon: Swords },
  { to: '/teams', label: 'Times', icon: Users },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { isWorldCup } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-sm ${
        isWorldCup
          ? 'bg-[#0a1628]/90 border-amber-500/30'
          : 'bg-[#0f172a]/90 border-slate-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <Trophy
            size={24}
            className={isWorldCup ? 'text-amber-400' : 'text-green-500'}
          />
          <span
            className={`text-xl font-bold tracking-tight ${
              isWorldCup ? 'text-amber-400' : 'text-green-400'
            }`}
          >
            FutAI
            {isWorldCup && (
              <span className="ml-2 text-xs font-normal bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Copa do Mundo
              </span>
            )}
          </span>
        </NavLink>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? isWorldCup
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-green-500/20 text-green-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <User size={14} />
            <span>{user?.name ?? user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
