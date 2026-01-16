import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode } from 'lucide-react'
import { BadgeGenerator } from './badge-generator'

interface GerarCrachasPageProps {
  searchParams: Promise<{ type?: string; id?: string }>
}

async function getData(type?: string, id?: string) {
  const supabase = await createClient()

  const [{ data: students }, { data: staff }, { data: institutions }] =
    await Promise.all([
      supabase.from('students').select('*, institutions(*)').eq('active', true).order('full_name'),
      supabase.from('staff').select('*, institutions(*)').eq('active', true).order('full_name'),
      supabase.from('institutions').select('*').order('name'),
    ])

  let selectedPerson = null
  if (type && id) {
    if (type === 'student') {
      selectedPerson = students?.find((s) => s.id === id) || null
    } else if (type === 'staff') {
      selectedPerson = staff?.find((s) => s.id === id) || null
    }
  }

  return {
    students: students || [],
    staff: staff || [],
    institutions: institutions || [],
    selectedPerson,
    selectedType: type as 'student' | 'staff' | undefined,
  }
}

export default async function GerarCrachasPage({
  searchParams,
}: GerarCrachasPageProps) {
  const { type, id } = await searchParams
  const data = await getData(type, id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerar Crachás</h1>
        <p className="text-muted-foreground">
          Gere crachás com QR Code para alunos e funcionários
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Gerador de Crachás
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeGenerator
            students={data.students}
            staff={data.staff}
            institutions={data.institutions}
            initialPerson={data.selectedPerson}
            initialType={data.selectedType}
          />
        </CardContent>
      </Card>
    </div>
  )
}
