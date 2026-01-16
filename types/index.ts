import type { Database } from '@/lib/supabase/database.types'

// Table types
export type Institution = Database['public']['Tables']['institutions']['Row']
export type InstitutionInsert = Database['public']['Tables']['institutions']['Insert']
export type InstitutionUpdate = Database['public']['Tables']['institutions']['Update']

export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type Staff = Database['public']['Tables']['staff']['Row']
export type StaffInsert = Database['public']['Tables']['staff']['Insert']
export type StaffUpdate = Database['public']['Tables']['staff']['Update']

export type Visitor = Database['public']['Tables']['visitors']['Row']
export type VisitorInsert = Database['public']['Tables']['visitors']['Insert']
export type VisitorUpdate = Database['public']['Tables']['visitors']['Update']

export type VisitorBadge = Database['public']['Tables']['visitor_badges']['Row']
export type VisitorBadgeInsert = Database['public']['Tables']['visitor_badges']['Insert']
export type VisitorBadgeUpdate = Database['public']['Tables']['visitor_badges']['Update']

export type Visit = Database['public']['Tables']['visits']['Row']
export type VisitInsert = Database['public']['Tables']['visits']['Insert']
export type VisitUpdate = Database['public']['Tables']['visits']['Update']

export type AccessLog = Database['public']['Tables']['access_logs']['Row']
export type AccessLogInsert = Database['public']['Tables']['access_logs']['Insert']
export type AccessLogUpdate = Database['public']['Tables']['access_logs']['Update']

// Enum types
export type BadgeStatus = Database['public']['Enums']['badge_status']
export type InstitutionType = Database['public']['Enums']['institution_type']
export type MovementType = Database['public']['Enums']['movement_type']
export type StaffRole = Database['public']['Enums']['staff_role']

// Extended types with relations
export type StudentWithInstitution = Student & {
  institutions: Institution | null
}

export type StaffWithInstitution = Staff & {
  institutions: Institution | null
}

export type VisitWithDetails = Visit & {
  visitors: Visitor | null
  visitor_badges: VisitorBadge | null
}

export type AccessLogWithDetails = AccessLog & {
  students: Student | null
  staff: Staff | null
}

// QR Code payload types
export type QRCodePayload = {
  type: 'student' | 'staff' | 'visitor'
  id: string
  name: string
}

// Badge generation types
export type BadgeData = {
  id: string
  name: string
  type: 'student' | 'staff' | 'visitor'
  role?: string
  institution?: string
  photoUrl?: string
  documentId?: string
  badgeNumber?: string
}

// Dashboard stats
export type DashboardStats = {
  totalStudents: number
  totalStaff: number
  totalVisitors: number
  todayEntries: number
  todayExits: number
  currentlyInside: number
}

// Labels for enums (Portuguese)
export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  teacher: 'Professor(a) - Escola',
  professor: 'Professor(a) - Faculdade',
  administrator: 'Administrador(a)',
  janitor: 'Zelador(a)',
  security: 'Segurança',
  coordinator: 'Coordenador(a)',
  librarian: 'Bibliotecário(a)',
  receptionist: 'Recepcionista',
}

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  college: 'Faculdade',
  school: 'Escola',
}

export const BADGE_STATUS_LABELS: Record<BadgeStatus, string> = {
  available: 'Disponível',
  in_use: 'Em Uso',
  lost: 'Perdido',
}

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  entry: 'Entrada',
  exit: 'Saída',
}
