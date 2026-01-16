import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IdCard } from 'lucide-react'
import { VisitorBadgeForm } from '../../visitor-badge-form'
import { notFound } from 'next/navigation'

interface EditVisitorBadgePageProps {
  params: Promise<{ id: string }>
}

async function getVisitorBadge(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitor_badges')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function EditVisitorBadgePage({
  params,
}: EditVisitorBadgePageProps) {
  const { id } = await params
  const badge = await getVisitorBadge(id)

  if (!badge) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Crachá</h1>
        <p className="text-muted-foreground">Atualize os dados do crachá</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            Dados do Crachá
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorBadgeForm badge={badge} />
        </CardContent>
      </Card>
    </div>
  )
}
