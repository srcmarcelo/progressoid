import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IdCard } from 'lucide-react'
import { VisitorBadgeForm } from '../visitor-badge-form'

export default function NewVisitorBadgePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Crachá de Visitante</h1>
        <p className="text-muted-foreground">
          Cadastre um novo crachá para visitantes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            Dados do Crachá
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VisitorBadgeForm />
        </CardContent>
      </Card>
    </div>
  )
}
