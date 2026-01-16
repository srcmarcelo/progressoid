import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'
import { VisitorForm } from '../visitor-form'

export default function NewVisitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Visitante</h1>
        <p className="text-muted-foreground">
          Cadastre um novo visitante no sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Dados do Visitante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorForm />
        </CardContent>
      </Card>
    </div>
  )
}
