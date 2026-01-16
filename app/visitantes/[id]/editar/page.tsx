import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'
import { VisitorForm } from '../../visitor-form'
import { notFound } from 'next/navigation'

interface EditVisitorPageProps {
  params: Promise<{ id: string }>
}

async function getVisitor(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function EditVisitorPage({ params }: EditVisitorPageProps) {
  const { id } = await params
  const visitor = await getVisitor(id)

  if (!visitor) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Visitante</h1>
        <p className="text-muted-foreground">Atualize os dados do visitante</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Dados do Visitante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorForm visitor={visitor} />
        </CardContent>
      </Card>
    </div>
  )
}
