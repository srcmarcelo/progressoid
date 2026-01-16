import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import { InstitutionForm } from '../../institution-form'
import { notFound } from 'next/navigation'

interface EditInstitutionPageProps {
  params: Promise<{ id: string }>
}

async function getInstitution(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function EditInstitutionPage({
  params,
}: EditInstitutionPageProps) {
  const { id } = await params
  const institution = await getInstitution(id)

  if (!institution) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Instituição</h1>
        <p className="text-muted-foreground">
          Atualize os dados da instituição
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da Instituição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InstitutionForm institution={institution} />
        </CardContent>
      </Card>
    </div>
  )
}
