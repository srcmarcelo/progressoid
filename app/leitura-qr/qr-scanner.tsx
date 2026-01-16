'use client'

import { useState, useCallback } from 'react'
import { useZxing } from 'react-zxing'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSupabase } from '@/hooks/use-supabase'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Camera,
  CameraOff,
} from 'lucide-react'
import type { QRCodePayload, MovementType } from '@/types'

type ScanResult = {
  success: boolean
  message: string
  person?: {
    name: string
    type: string
  }
  direction?: MovementType
}

// Função para tocar som de feedback
function playSound(type: 'entry' | 'exit' | 'error') {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Volume máximo
  gainNode.gain.value = 1

  if (type === 'entry') {
    // Som de entrada: dois tons ascendentes (positivo)
    oscillator.frequency.value = 880 // Nota A5
    oscillator.type = 'sine'
    oscillator.start()
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(1108, audioContext.currentTime + 0.15) // Nota C#6
    gainNode.gain.setValueAtTime(1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    oscillator.stop(audioContext.currentTime + 0.4)
  } else if (type === 'exit') {
    // Som de saída: dois tons descendentes
    oscillator.frequency.value = 659 // Nota E5
    oscillator.type = 'sine'
    oscillator.start()
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.15) // Nota A4
    gainNode.gain.setValueAtTime(1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    oscillator.stop(audioContext.currentTime + 0.4)
  } else {
    // Som de erro: tom grave e curto
    oscillator.frequency.value = 200
    oscillator.type = 'square'
    oscillator.start()
    gainNode.gain.setValueAtTime(1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    oscillator.stop(audioContext.currentTime + 0.3)
  }
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [lastResult, setLastResult] = useState<ScanResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = useSupabase()

  const handleScan = useCallback(
    async (result: string) => {
      if (isProcessing) return

      setIsProcessing(true)

      try {
        const payload: QRCodePayload = JSON.parse(result)

        if (!payload.type || !payload.id || !payload.name) {
          throw new Error('QR Code inválido')
        }

        // Check last access to determine direction
        let lastDirection: MovementType | null = null

        if (payload.type === 'student') {
          const { data: lastLog } = await supabase
            .from('access_logs')
            .select('direction')
            .eq('student_id', payload.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

          lastDirection = lastLog?.direction || null
        } else if (payload.type === 'staff') {
          const { data: lastLog } = await supabase
            .from('access_logs')
            .select('direction')
            .eq('staff_id', payload.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

          lastDirection = lastLog?.direction || null
        }

        // Determine new direction (toggle or default to entry)
        const newDirection: MovementType =
          lastDirection === 'entry' ? 'exit' : 'entry'

        // Register access
        if (payload.type === 'student') {
          const { error } = await supabase.from('access_logs').insert({
            student_id: payload.id,
            direction: newDirection,
          })
          if (error) throw error
        } else if (payload.type === 'staff') {
          const { error } = await supabase.from('access_logs').insert({
            staff_id: payload.id,
            direction: newDirection,
          })
          if (error) throw error
        }

        // Tocar som de feedback
        playSound(newDirection)

        setLastResult({
          success: true,
          message: `${newDirection === 'entry' ? 'Entrada' : 'Saída'} registrada com sucesso!`,
          person: {
            name: payload.name,
            type: payload.type === 'student' ? 'Aluno' : 'Funcionário',
          },
          direction: newDirection,
        })

        // Auto-clear result after 5 seconds
        setTimeout(() => {
          setLastResult(null)
        }, 5000)
      } catch (error) {
        console.error('Error processing QR code:', error)
        // Tocar som de erro
        playSound('error')
        setLastResult({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Erro ao processar QR Code',
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [isProcessing, supabase]
  )

  const { ref } = useZxing({
    onDecodeResult(result) {
      handleScan(result.getText())
    },
    paused: !isScanning,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={() => setIsScanning(!isScanning)}
          variant={isScanning ? 'destructive' : 'default'}
        >
          {isScanning ? (
            <>
              <CameraOff className="mr-2 h-5 w-5" />
              Parar Scanner
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Iniciar Scanner
            </>
          )}
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md aspect-square bg-muted rounded-lg overflow-hidden">
          {isScanning ? (
            <>
              <video ref={ref} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Clique em &quot;Iniciar Scanner&quot; para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Display */}
      {lastResult && (
        <Card
          className={`p-6 ${
            lastResult.success
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
              : 'border-red-500 bg-red-50 dark:bg-red-950/20'
          }`}
        >
          <div className="flex items-center gap-4">
            {lastResult.success ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
            <div className="flex-1">
              <div className="text-lg font-semibold">{lastResult.message}</div>
              {lastResult.person && (
                <div className="text-muted-foreground">
                  {lastResult.person.name} ({lastResult.person.type})
                </div>
              )}
            </div>
            {lastResult.direction && (
              <Badge
                variant={lastResult.direction === 'entry' ? 'success' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {lastResult.direction === 'entry' ? (
                  <>
                    <ArrowDownLeft className="mr-2 h-5 w-5" />
                    ENTRADA
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="mr-2 h-5 w-5" />
                    SAÍDA
                  </>
                )}
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Posicione o QR Code do crachá dentro da área de leitura.</p>
        <p>O sistema irá registrar automaticamente entrada ou saída.</p>
      </div>
    </div>
  )
}
