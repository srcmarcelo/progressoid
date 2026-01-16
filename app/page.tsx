import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  UserCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
} from 'lucide-react'

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalStaff },
    { count: totalVisitors },
    { count: totalInstitutions },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('staff').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('visitors').select('*', { count: 'exact', head: true }),
    supabase.from('institutions').select('*', { count: 'exact', head: true }),
  ])

  // Get today's access logs
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const [
    { count: todayEntries },
    { count: todayExits },
    { count: todayVisitorEntries },
    { count: todayVisitorExits },
  ] = await Promise.all([
    supabase
      .from('access_logs')
      .select('*', { count: 'exact', head: true })
      .eq('direction', 'entry')
      .gte('timestamp', todayISO),
    supabase
      .from('access_logs')
      .select('*', { count: 'exact', head: true })
      .eq('direction', 'exit')
      .gte('timestamp', todayISO),
    supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('direction', 'entry')
      .gte('timestamp', todayISO),
    supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('direction', 'exit')
      .gte('timestamp', todayISO),
  ])

  const totalTodayEntries = (todayEntries || 0) + (todayVisitorEntries || 0)
  const totalTodayExits = (todayExits || 0) + (todayVisitorExits || 0)
  const currentlyInside = totalTodayEntries - totalTodayExits

  return {
    totalStudents: totalStudents || 0,
    totalStaff: totalStaff || 0,
    totalVisitors: totalVisitors || 0,
    totalInstitutions: totalInstitutions || 0,
    todayEntries: totalTodayEntries,
    todayExits: totalTodayExits,
    currentlyInside: currentlyInside > 0 ? currentlyInside : 0,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: 'Instituições',
      value: stats.totalInstitutions,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Alunos Ativos',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Funcionários Ativos',
      value: stats.totalStaff,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Visitantes Cadastrados',
      value: stats.totalVisitors,
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Entradas Hoje',
      value: stats.todayEntries,
      icon: ArrowDownLeft,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Saídas Hoje',
      value: stats.todayExits,
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de controle de acesso
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pessoas no Prédio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">
                {stats.currentlyInside}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Pessoas atualmente dentro do prédio
              </p>
              <p className="text-xs text-muted-foreground">
                Baseado nos registros de entrada e saída de hoje
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
