'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  UserCheck,
  QrCode,
  ScanLine,
  IdCard,
  ClipboardList,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Instituições', href: '/instituicoes', icon: Building2 },
  { name: 'Alunos', href: '/alunos', icon: GraduationCap },
  { name: 'Funcionários', href: '/funcionarios', icon: Users },
  { name: 'Visitantes', href: '/visitantes', icon: UserCheck },
  { name: 'Crachás Visitantes', href: '/crachas-visitantes', icon: IdCard },
  { name: 'Gerar Crachás', href: '/gerar-crachas', icon: QrCode },
  { name: 'Leitura QR Code', href: '/leitura-qr', icon: ScanLine },
  { name: 'Registros de Acesso', href: '/registros', icon: ClipboardList },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <ScanLine className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          Progressoid
        </span>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
