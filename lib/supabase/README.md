# Supabase Type Generation

## Gerando Tipos TypeScript

Para gerar automaticamente os tipos TypeScript baseados no schema do seu banco de dados Supabase, execute:

```bash
npm run supabase:gen
```

Este comando irá:
1. Conectar ao seu projeto Supabase usando a variável `SUPABASE_PROJECT_ID`
2. Extrair o schema do banco de dados
3. Gerar tipos TypeScript em `lib/supabase/database.types.ts`

## Pré-requisitos

Certifique-se de que a variável de ambiente `SUPABASE_PROJECT_ID` está definida no seu `.env.local`:

```env
SUPABASE_PROJECT_ID=seu-project-id-aqui
```

## Como Usar os Tipos

Os tipos são automaticamente aplicados aos clientes Supabase:

### Client Component
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  // TypeScript agora conhece a estrutura das suas tabelas
  const { data } = await supabase
    .from('your_table') // autocomplete disponível
    .select('*')
  
  // 'data' tem o tipo correto baseado no schema
}
```

### Server Component
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('your_table')
    .select('*')
  
  // Tipos completamente inferidos
}
```

### Usando Tipos Específicos

Você também pode importar tipos específicos:

```typescript
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/database.types'

// Tipo de uma linha da tabela
type User = Tables<'users'>

// Tipo para inserção
type NewUser = TablesInsert<'users'>

// Tipo para atualização
type UserUpdate = TablesUpdate<'users'>
```

## Quando Regenerar os Tipos

Execute `npm run supabase:gen` sempre que:
- Criar novas tabelas no Supabase
- Modificar colunas existentes
- Adicionar ou remover constraints
- Alterar tipos de dados
- Criar novos enums ou tipos compostos

## Troubleshooting

### Erro: "Failed to get project"
- Verifique se `SUPABASE_PROJECT_ID` está corretamente configurado
- Certifique-se de que você tem acesso ao projeto

### Erro: "Authentication failed"
- Você pode precisar fazer login no Supabase CLI: `npx supabase login`
- Ou use um access token: `SUPABASE_ACCESS_TOKEN=seu-token npm run supabase:gen`

### Tipos não estão sendo reconhecidos
- Certifique-se de que o arquivo `database.types.ts` foi gerado
- Reinicie o TypeScript server no VS Code (Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server")
