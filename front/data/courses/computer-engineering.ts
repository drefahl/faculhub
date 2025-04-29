import type { GradeCurricular } from "@/types/grade"

export const computerEngineeringNewCurriculum: GradeCurricular = {
  versao: "2023",
  documentoReferencia:
    "https://saobentodosul.ifc.edu.br/wp-content/blogs.dir/19/files/sites/19/2023/03/PPC_ECO_2023_v1.pdf",
  semestres: [
    {
      numero: 1,
      disciplinas: [
        {
          codigo: "CPB1401",
          nome: "Introdução a Engenharia de Computação",
          cargaHoraria: {
            total: 15,
          },
        },
        {
          codigo: "CPB1402",
          nome: "Física Geral I",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1403",
          nome: "Física Experimental I",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1404",
          nome: "Cálculo I",
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "CPB1405",
          nome: "Geometria Analítica",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1406",
          nome: "Química Tecnológica Geral",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1407",
          nome: "Algoritmos e Programação",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 2,
      disciplinas: [
        {
          codigo: "CPB1408",
          nome: "Metodologia da Pesquisa e da Extensão",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPB1409",
          nome: "Física Geral II",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1410",
          nome: "Física Experimental II",
          corequisitos: ["CPB1409"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1411",
          nome: "Cálculo II",
          prerequisitos: ["CPB1404"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1412",
          nome: "Álgebra Linear",
          prerequisitos: ["CPB1405"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1413",
          nome: "Química Tecnológica Experimental",
          prerequisitos: ["CPB1406"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1414",
          nome: "Programação I",
          prerequisitos: ["CPB1407"],
          cargaHoraria: {
            total: 90,
          },
        },
      ],
    },
    {
      numero: 3,
      disciplinas: [
        {
          codigo: "CPB1415",
          nome: "Física Geral III",
          prerequisitos: ["CPB1411"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1416",
          nome: "Física Experimental III",
          corequisitos: ["CPB1415"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1417",
          nome: "Cálculo III",
          prerequisitos: ["CPB1411"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "CPB1418",
          nome: "Desenho Técnico",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1419",
          nome: "Estrutura de Dados",
          prerequisitos: ["CPB1414"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1420",
          nome: "Engenharia de Software",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 4,
      disciplinas: [
        {
          codigo: "CPB1421",
          nome: "Probabilidade e Estatística",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPB1422",
          nome: "Sistemas Digitais",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1423",
          nome: "Sistemas Digitais Experimentais",
          corequisitos: ["CPB1422"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1424",
          nome: "Circuitos Elétricos",
          prerequisitos: ["CPB1415"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1425",
          nome: "Circuitos Elétricos Experimental",
          prerequisitos: ["CPB1415"],
          corequisitos: ["CPB1424"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1426",
          nome: "Programação II",
          prerequisitos: ["CPB1414"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "CPB1427",
          nome: "Gestão de Projetos",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1428",
          nome: "Projeto de Extensão I",
          cargaHoraria: {
            total: 45,
          },
        },
      ],
    },
    {
      numero: 5,
      disciplinas: [
        {
          codigo: "CPB1429",
          nome: "Lógica para Computação",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1430",
          nome: "Mecânica dos Sólidos",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1431",
          nome: "Arquitetura e Organização de Computadores",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1432",
          nome: "Microcontroladores",
          prerequisitos: ["CPB1407", "CPB1422"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1433",
          nome: "Microcontroladores Experimental",
          prerequisitos: ["CPB1407", "CPB1422"],
          corequisitos: ["CPB1432"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1434",
          nome: "Banco de Dados",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1435",
          nome: "Eletrônica I",
          prerequisitos: ["CPB1415"],
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 6,
      disciplinas: [
        {
          codigo: "CPB1436",
          nome: "Fenômenos de Transporte",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1437",
          nome: "Matemática Discreta",
          prerequisitos: ["CPB1407"],
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPB1438",
          nome: "Sistemas e Sinais",
          prerequisitos: ["CPB1412", "CPB1417"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1439",
          nome: "Projeto de Extensão II",
          prerequisitos: ["CPB1428"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1440",
          nome: "Legislação, Ética e Sociedade",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1441",
          nome: "Sistemas Operacionais",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1442",
          nome: "Eletrônica II",
          prerequisitos: ["CPB1435"],
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 7,
      disciplinas: [
        {
          codigo: "CPB1443",
          nome: "Teoria da Computação",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPB1444",
          nome: "Redes de Computadores I",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1445",
          nome: "Comunicação de Dados",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1446",
          nome: "Conservação dos Recursos Naturais",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1447",
          nome: "Fundamentos de Controle",
          prerequisitos: ["CPB1438"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1448",
          nome: "Processamento Digital de Sinais",
          prerequisitos: ["CPB1438"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "Optativa 01",
          nome: "Optativa 01",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 8,
      disciplinas: [
        {
          codigo: "CPB1449",
          nome: "Cálculo Numérico",
          prerequisitos: ["CPB1407", "CPB1411", "CPB1412"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1450",
          nome: "Projeto Integrador I",
          prerequisitos: ["CPB1420", "CPB1427", "CPB1442"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1451",
          nome: "Redes de Computadores II",
          prerequisitos: ["CPB1444"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1452",
          nome: "Fundamento da Ciência dos Materiais",
          prerequisitos: ["CPB1406"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1453",
          nome: "Sistemas Embarcados",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "Optativa 02",
          nome: "Optativa 02",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 9,
      disciplinas: [
        {
          codigo: "CPB1454",
          nome: "Segurança da Informação",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPB1455",
          nome: "Segurança do Trabalho",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPB1456",
          nome: "Projeto Integrador II",
          prerequisitos: ["CPB1450"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1457",
          nome: "Engenharia Econômica e Empreendedorismo",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPB1458",
          nome: "Sistemas Distribuídos",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPB1459",
          nome: "Inteligência Artificial",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "Optativa 03",
          nome: "Optativa 03",
          cargaHoraria: {
            total: 30,
          },
        },
      ],
    },
    {
      numero: 10,
      disciplinas: [
        {
          codigo: "CPB1460",
          nome: "Estágio em Computação",
          prerequisitos: ["CPB1426", "CPB1456"],
          cargaHoraria: {
            total: 240,
          },
        },
        {
          codigo: "CPB1461",
          nome: "Trabalho de Conclusão de Curso (atividade)",
          prerequisitos: ["CPB1426", "CPB1456"],
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
  ],
  resumo: {
    cargaTeorica: 2245,
    cargaPratica: 530,
    complementares: 75,
    optativasMinima: 150,
    estagio: 240,
    tcc: 60,
    extensaoPesquisa: 435,
    total: 3735,
  },
}

export const computerEngineeringCurriculum: GradeCurricular = {
  versao: "2017",
  documentoReferencia: "https://drive.google.com/file/d/1LAwDS9yEwE-MTFXhzs-WORAGc_xNvDBC/view",
  semestres: [
    {
      numero: 1,
      disciplinas: [
        {
          codigo: "CPA1401",
          nome: "Introdução à Engenharia de Computação",
          cargaHoraria: {
            total: 15,
          },
        },
        {
          codigo: "CPA1402",
          nome: "Metodologia Cientifica",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1403",
          nome: "Física Geral I",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1404",
          nome: "Física Experimental I",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1405",
          nome: "Cálculo I",
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "CPA1406",
          nome: "Geometria Analítica",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1407",
          nome: "Algoritmos e Programação",
          cargaHoraria: {
            total: 90,
          },
        },
      ],
    },
    {
      numero: 2,
      disciplinas: [
        {
          codigo: "CPA1408",
          nome: "Física Geral II",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1409",
          nome: "Física Experimental II",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1410",
          nome: "Cálculo II",
          prerequisitos: ["CPA1405"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1411",
          nome: "Álgebra Linear",
          prerequisitos: ["CPA1406"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1412",
          nome: "Química Tecnológica Geral",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1413",
          nome: "Química Tecnológica Geral Experimental",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1414",
          nome: "Lógica para Computação",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 3,
      disciplinas: [
        {
          codigo: "CPA1415",
          nome: "Física Geral III",
          prerequisitos: ["CPA1410"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1416",
          nome: "Física Experimental III",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1417",
          nome: "Cálculo III",
          prerequisitos: ["CPA1410", "CPA1405"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "CPA1418",
          nome: "Desenho Técnico",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1419",
          nome: "Probabilidade e Estatística",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1420",
          nome: "Mecânica dos Sólidos",
          prerequisitos: ["CPA1403"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1421",
          nome: "Estrutura de Dados I",
          prerequisitos: ["CPA1407"],
          cargaHoraria: {
            total: 45,
          },
        },
      ],
    },
    {
      numero: 4,
      disciplinas: [
        {
          codigo: "CPA1422",
          nome: "Cálculo Numérico",
          prerequisitos: ["CPA1410", "CPA1414", "CPA1411"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1423",
          nome: "Fenômenos de Transporte",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1424",
          nome: "Sistemas Digitais",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1425",
          nome: "Sistemas Digitais Experimentais",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1426",
          nome: "Estrutura de Dados II",
          prerequisitos: ["CPA1421"],
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1427",
          nome: "Circuitos Elétricos",
          prerequisitos: ["CPA1415"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1428",
          nome: "Circuitos Elétricos Experimental",
          prerequisitos: ["CPA1415"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1429",
          nome: "Arquitetura e Organização de Computadores",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 5,
      disciplinas: [
        {
          codigo: "CPA1430",
          nome: "Matemática Discreta",
          prerequisitos: ["CPA1407"],
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1431",
          nome: "Microcontroladores",
          prerequisitos: ["CPA1424", "CPA1407"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1432",
          nome: "Microcontroladores Experimental",
          prerequisitos: ["CPA1424", "CPA1407"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1433",
          nome: "Banco de Dados",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1434",
          nome: "Eletrônica Básica",
          prerequisitos: ["CPA1415"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1435",
          nome: "Eletrônica Básica Experimental",
          prerequisitos: ["CPA1415"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1436",
          nome: "Programação I",
          prerequisitos: ["CPA1407"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1437",
          nome: "Sistemas e Sinais",
          prerequisitos: ["CPA1417", "CPA1411"],
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 6,
      disciplinas: [
        {
          codigo: "CPA1438",
          nome: "Programação II",
          prerequisitos: ["CPA1436"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "CPA1439",
          nome: "Legislação, Ética e Sociedade",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1440",
          nome: "Teoria da Computação",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1441",
          nome: "Gestão de Projetos",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1442",
          nome: "Sistemas Operacionais",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1443",
          nome: "Engenharia de Software",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 7,
      disciplinas: [
        {
          codigo: "CPA1444",
          nome: "Redes de Computadores I",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1445",
          nome: "Comunicação de Dados",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1446",
          nome: "Conservação dos Recursos Naturais",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1447",
          nome: "Projeto Integrador I",
          prerequisitos: ["CPA1434", "CPA1441", "CPA1443"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "Optativa 01",
          nome: "Optativa 01",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 8,
      disciplinas: [
        {
          codigo: "CPA1448",
          nome: "Redes de Computadores II",
          prerequisitos: ["CPA1444"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1449",
          nome: "Sistemas Inteligentes I",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1450",
          nome: "Segurança da Informação",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1451",
          nome: "Processamento Digital de Sinais",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "Optativa 02",
          nome: "Optativa 02",
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
    {
      numero: 9,
      disciplinas: [
        {
          codigo: "CPA1452",
          nome: "Sistemas Embarcados",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1453",
          nome: "Sistemas Inteligentes II",
          prerequisitos: ["CPA1449"],
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "CPA1454",
          nome: "Segurança do Trabalho",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "CPA1455",
          nome: "Projeto Integrador II",
          prerequisitos: ["CPA1447"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1456",
          nome: "Engenharia Econômica e Empreendedorismo",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "CPA1457",
          nome: "Sistemas Distribuídos",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "Optativa 03",
          nome: "Optativa 03",
          cargaHoraria: {
            total: 30,
          },
        },
      ],
    },
    {
      numero: 10,
      disciplinas: [
        {
          codigo: "CPA1458",
          nome: "Estágio em Computação",
          prerequisitos: ["CPA1455", "CPA1438"],
          cargaHoraria: {
            total: 360,
          },
        },
        {
          codigo: "CPA1459",
          nome: "Trabalho de Curso em Computação",
          prerequisitos: ["CPA1455", "CPA1438"],
          cargaHoraria: {
            total: 60,
          },
        },
      ],
    },
  ],
  resumo: {
    cargaTeorica: 2550,
    cargaPratica: 990,
    complementares: 40,
    optativasMinima: 150,
    estagio: 360,
    tcc: 60,
    extensaoPesquisa: 0,
    total: 3640,
  },
}
