export interface Disciplina {
  codigo: string
  nome: string
  cargaHoraria: {
    total: number
  }
  prerequisitos?: string[]
  corequisitos?: string[]
}

export interface Semestre {
  numero: number
  disciplinas: Disciplina[]
}

export interface GradeCurricular {
  versao: string
  semestres: Semestre[]
  documentoReferencia: string
  resumo?: {
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
