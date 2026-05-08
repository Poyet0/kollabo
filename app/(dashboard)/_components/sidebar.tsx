'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  Wallet,
  User,
  Settings,
  Megaphone,
  Users,
  Receipt,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { KollaboAvatar } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SidebarProps {
  profile: {
    id: string
    full_name: string
    user_type: string
    avatar_url?: string | null
  }
}

const creatorNavItems = [
  { href: '/dashboard', label: 'Aperçu', icon: LayoutDashboard, exact: true },
  { href: '/discover', label: 'Découvrir', icon: Search },
  { href: '/applications', label: 'Candidatures', icon: FileText },
  { href: '/contracts', label: 'Contrats actifs', icon: FileText },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/wallet', label: 'Portefeuille', icon: Wallet },
  { href: '/profile', label: 'Mon profil public', icon: User },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

const brandNavItems = [
  { href: '/dashboard', label: 'Aperçu', icon: LayoutDashboard, exact: true },
  { href: '/campaigns', label: 'Mes campagnes', icon: Megaphone },
  { href: '/discover', label: 'Découvrir créateurs', icon: Users },
  { href: '/contracts', label: 'Contrats', icon: FileText },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/billing', label: 'Facturation', icon: Receipt },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const navItems = profile.user_type === 'creator' ? creatorNavItems : brandNavItems

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-[#1A1A1A] bg-[#0A0A0A] transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#1A1A1A]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[8px] shrink-0"
              style={{ background: 'linear-gradient(135deg, #8C7330, #C9A84C, #E8C977)' }}
            >
              <span className="text-sm font-bold text-[#0A0A0A] font-[family-name:var(--font-display)]">K</span>
            </div>
            <span className="text-base font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
              KOLLABO
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-[6px] text-[#6B6B6B]',
            'hover:bg-[#1A1A1A] hover:text-[#F5F2EA] transition-colors',
            collapsed && 'mx-auto',
          )}
          aria-label={collapsed ? 'Déplier' : 'Réduire'}
        >
          <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm transition-colors group',
                isActive
                  ? 'bg-[rgba(201,168,76,0.1)] text-[#C9A84C] font-medium'
                  : 'text-[#6B6B6B] hover:bg-[#1A1A1A] hover:text-[#F5F2EA]',
                collapsed && 'justify-center px-0',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn('size-4 shrink-0', isActive ? 'text-[#C9A84C]' : '')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Profil + déconnexion */}
      <div className="border-t border-[#1A1A1A] p-3 space-y-1">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm text-[#6B6B6B]',
            'hover:bg-[#1A1A1A] hover:text-[#F5F2EA] transition-colors',
            collapsed && 'justify-center px-0',
          )}
          title={collapsed ? profile.full_name : undefined}
        >
          <KollaboAvatar
            src={profile.avatar_url}
            name={profile.full_name}
            size="sm"
            className="shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#F5F2EA] truncate">{profile.full_name}</span>
              <span className="text-xs text-[#6B6B6B] capitalize">{profile.user_type}</span>
            </div>
          )}
        </Link>

        <button
          onClick={handleSignOut}
          className={cn(
            'flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-[#6B6B6B]',
            'hover:bg-[#1A1A1A] hover:text-[#B84545] transition-colors',
            collapsed && 'justify-center px-0',
          )}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  )
}
