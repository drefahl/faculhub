import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryCardProps {
  resumo: {
    cargaTeorica: number
    cargaPratica: number
    complementares: number
    optativasMinima: number
    estagio: number
    tcc: number
    extensaoPesquisa: number
    total: number
  }
}

export function SummaryCard({ resumo }: SummaryCardProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Resumo da Grade Curricular</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground">Teórica</p>
            <p className="text-xl font-medium">{resumo.cargaTeorica}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prática</p>
            <p className="text-xl font-medium">{resumo.cargaPratica}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Complementares</p>
            <p className="text-xl font-medium">{resumo.complementares}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Optativas (mín)</p>
            <p className="text-xl font-medium">{resumo.optativasMinima}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Estágio</p>
            <p className="text-xl font-medium">{resumo.estagio}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">TCC</p>
            <p className="text-xl font-medium">{resumo.tcc}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Extensão/Pesquisa</p>
            <p className="text-xl font-medium">{resumo.extensaoPesquisa}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="text-xl font-medium">{resumo.total}h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
