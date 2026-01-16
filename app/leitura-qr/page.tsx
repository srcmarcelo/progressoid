import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScanLine } from 'lucide-react'
import { QRScanner } from './qr-scanner'

export default function LeituraQRPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leitura de QR Code</h1>
        <p className="text-muted-foreground">
          Escaneie o QR Code do crachá para registrar entrada ou saída
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            Scanner de QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QRScanner />
        </CardContent>
      </Card>
    </div>
  )
}
