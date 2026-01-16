'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QRCode from 'react-qr-code'
import { usePDF } from 'react-to-pdf'
import { Download, Printer } from 'lucide-react'
import type { StudentWithInstitution, StaffWithInstitution, Institution } from '@/types'
import { STAFF_ROLE_LABELS } from '@/types'

interface BadgeGeneratorProps {
  students: StudentWithInstitution[]
  staff: StaffWithInstitution[]
  institutions: Institution[]
  initialPerson?: StudentWithInstitution | StaffWithInstitution | null
  initialType?: 'student' | 'staff'
}

export function BadgeGenerator({
  students,
  staff,
  initialPerson,
  initialType,
}: BadgeGeneratorProps) {
  const [personType, setPersonType] = useState<'student' | 'staff'>(
    initialType || 'student'
  )
  const [selectedId, setSelectedId] = useState<string>(
    initialPerson?.id || ''
  )
  const badgeRef = useRef<HTMLDivElement>(null)
  const { toPDF, targetRef } = usePDF({ filename: 'cracha.pdf' })

  const selectedPerson =
    personType === 'student'
      ? students.find((s) => s.id === selectedId)
      : staff.find((s) => s.id === selectedId)

  const qrData = selectedPerson
    ? JSON.stringify({
        type: personType,
        id: selectedPerson.id,
        name: selectedPerson.full_name,
      })
    : ''

  const handlePrint = () => {
    const printContent = badgeRef.current
    if (!printContent) return

    const printWindow = window.open('', '', 'width=400,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Crachá</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .badge { width: 85.6mm; height: 54mm; }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={personType}
        onValueChange={(v: string) => {
          setPersonType(v as 'student' | 'staff')
          setSelectedId('')
        }}
      >
        <TabsList>
          <TabsTrigger value="student">Alunos</TabsTrigger>
          <TabsTrigger value="staff">Funcionários</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-4">
          <div className="space-y-2">
            <Label>Selecione o Aluno</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.full_name}
                    {student.institutions?.name && ` - ${student.institutions.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <div className="space-y-2">
            <Label>Selecione o Funcionário</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name} - {STAFF_ROLE_LABELS[member.role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {selectedPerson && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => toPDF()}>
              <Download className="mr-2 h-4 w-4" />
              Baixar PDF
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>

          {/* Badge Preview */}
          <div className="flex justify-center">
            <div ref={targetRef}>
              <Card
                ref={badgeRef}
                className="w-[340px] h-[215px] p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-2"
                style={{
                  borderColor:
                    selectedPerson.institutions?.primary_color || '#3b82f6',
                }}
              >
                <div className="flex h-full gap-4">
                  {/* Left side - Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div
                        className="text-xs font-semibold uppercase tracking-wider mb-1"
                        style={{
                          color:
                            selectedPerson.institutions?.primary_color ||
                            '#3b82f6',
                        }}
                      >
                        {selectedPerson.institutions?.name || 'Instituição'}
                      </div>
                      <div className="text-lg font-bold leading-tight">
                        {selectedPerson.full_name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {personType === 'student'
                          ? 'Aluno(a)'
                          : STAFF_ROLE_LABELS[
                              (selectedPerson as StaffWithInstitution).role
                            ]}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {personType === 'student' && (selectedPerson as StudentWithInstitution).student_id_card && (
                        <div>
                          Matrícula: {(selectedPerson as StudentWithInstitution).student_id_card}
                        </div>
                      )}
                      {selectedPerson.document_id && (
                        <div>Doc: {selectedPerson.document_id}</div>
                      )}
                    </div>
                  </div>

                  {/* Right side - QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <QRCode value={qrData} size={100} level="M" />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 text-center">
                      Escaneie para registro
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {!selectedPerson && selectedId === '' && (
        <div className="text-center py-12 text-muted-foreground">
          Selecione uma pessoa para gerar o crachá
        </div>
      )}
    </div>
  )
}
