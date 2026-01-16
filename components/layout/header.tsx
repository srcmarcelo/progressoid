'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function Header() {
  const today = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="text-sm text-muted-foreground capitalize">{today}</div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Sistema de Controle de Acesso</span>
      </div>
    </header>
  )
}
