import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import { InstitutionForm } from '../institution-form'

export default function NewInstitutionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova Instituição</h1>
        <p className="text-muted-foreground">
          Cadastre uma nova instituição no sistema
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
          <InstitutionForm />
        </CardContent>
      </Card>
    </div>
  )
}
