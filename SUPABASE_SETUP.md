# Supabase Setup - Progressoid

## Configuração Completa

O projeto está configurado para usar Supabase com Next.js 16. As seguintes bibliotecas foram instaladas:

- `@supabase/supabase-js` - Cliente JavaScript do Supabase
- `@supabase/ssr` - Utilitários para SSR (Server-Side Rendering) com Next.js

## Estrutura de Arquivos

```
lib/supabase/
├── client.ts      # Cliente Supabase para uso no navegador (Client Components)
├── server.ts      # Cliente Supabase para uso no servidor (Server Components)
└── middleware.ts  # Lógica de atualização de sessão

middleware.ts      # Middleware do Next.js para refresh automático de sessão
```

## Variáveis de Ambiente

As seguintes variáveis já estão configuradas no `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_PUBLISHABLE_KEY` - Chave pública (anon key)
- `SUPABASE_SECRET_KEY` - Chave secreta (service role key)
- `SUPABASE_PROJECT_ID` - ID do projeto

## Como Usar

### 1. Client Components (navegador)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('your_table')
        .select('*')
      
      if (data) setData(data)
    }
    
    fetchData()
  }, [])

  return <div>{/* Renderize seus dados */}</div>
}
```

### 2. Server Components (servidor)

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*')

  return <div>{/* Renderize seus dados */}</div>
}
```

### 3. Server Actions

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .insert({
      name: formData.get('name'),
      // ... outros campos
    })
  
  return { data, error }
}
```

### 4. Route Handlers (API Routes)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
```

## Autenticação

### Login com Email/Senha

```typescript
const supabase = createClient()

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Signup

```typescript
const supabase = createClient()

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

### Logout

```typescript
const supabase = createClient()

await supabase.auth.signOut()
```

### Verificar Usuário Atual

```typescript
const supabase = await createClient()

const { data: { user } } = await supabase.auth.getUser()
```

## Middleware

O middleware está configurado para:
- Atualizar automaticamente a sessão do usuário em cada requisição
- Manter os cookies de autenticação sincronizados
- Prevenir logout prematuro

O middleware é executado em todas as rotas exceto:
- Arquivos estáticos (`_next/static`)
- Otimização de imagens (`_next/image`)
- Favicon e imagens (svg, png, jpg, etc.)

## Próximos Passos

1. Configure suas tabelas no Supabase Dashboard
2. Configure Row Level Security (RLS) policies
3. Implemente suas páginas de autenticação
4. Crie seus componentes e páginas usando os clientes Supabase

## Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
