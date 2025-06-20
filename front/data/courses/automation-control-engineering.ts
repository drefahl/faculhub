import type { GradeCurricular } from "@/types/grade"

export const automationControlEngineeringNewCurriculum: GradeCurricular = {
  versao: "2023",
  documentoReferencia:
    "https://saobentodosul.ifc.edu.br/wp-content/blogs.dir/19/files/sites/19/2025/03/PPC_ECA_SBS_-_Matriz_2023_-_Rev_2024-02-04.pdf",
  semestres: [
    {
      numero: 1,
      disciplinas: [
        {
          codigo: "ECB1401",
          nome: "Introdução à Engenharia de Controle e Automação",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1402",
          nome: "Algoritmos e Programação",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1403",
          nome: "Física Geral I",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1404",
          nome: "Física Experimental I",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1405",
          nome: "Cálculo I",
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "ECB1406",
          nome: "Geometria Analítica",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1407",
          nome: "Química Tecnológica Geral",
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
          codigo: "ECB1408",
          nome: "Sistemas Digitais",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1409",
          nome: "Sistemas Digitais Experimental",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1410",
          nome: "Metodologia da Pesquisa e da Extensão",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "ECB1411",
          nome: "Física Geral II",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1412",
          nome: "Física Experimental II",
          corequisitos: ["ECB1411"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1413",
          nome: "Cálculo II",
          prerequisitos: ["ECB1405"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1414",
          nome: "Álgebra Linear",
          prerequisitos: ["ECB1406"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1415",
          nome: "Probabilidade e Estatística",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "ECB1416",
          nome: "Química Tecnológica Experimental",
          prerequisitos: ["ECB1407"],
          cargaHoraria: {
            total: 30,
          },
        },
      ],
    },
    {
      numero: 3,
      disciplinas: [
        {
          codigo: "ECB1417",
          nome: "Microcontroladores",
          prerequisitos: ["ECB1402", "ECB1408"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1418",
          nome: "Microcontroladores Experimental",
          prerequisitos: ["ECB1402", "ECB1408"],
          corequisitos: ["ECB1417"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1419",
          nome: "Desenho Técnico",
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1420",
          nome: "Metrologia",
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "ECB1421",
          nome: "Mecânica dos Sólidos",
          prerequisitos: ["ECB1403"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1422",
          nome: "Física Geral III",
          prerequisitos: ["ECB1413"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1423",
          nome: "Física Experimental III",
          prerequisitos: ["ECB1413"],
          corequisitos: ["ECB1422"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1424",
          nome: "Cálculo III",
          prerequisitos: ["ECB1413"],
          cargaHoraria: {
            total: 90,
          },
        },
      ],
    },
    {
      numero: 4,
      disciplinas: [
        {
          codigo: "ECB1425",
          nome: "Sinais e Sistemas Lineares I",
          prerequisitos: ["ECB1424"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "ECB1426",
          nome: "Circuitos Elétricos",
          prerequisitos: ["ECB1422"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1427",
          nome: "Circuitos Elétricos Experimental",
          prerequisitos: ["ECB1422"],
          corequisitos: ["ECB1426"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1428",
          nome: "Cálculo Numérico",
          prerequisitos: ["ECB1402", "ECB1413", "ECB1414"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1429",
          nome: "Fenômenos de Transporte",
          prerequisitos: ["ECB1403", "ECB1411"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1430",
          nome: "Gestão de Projetos",
          prerequisitos: ["ECB1405"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1431",
          nome: "Projeto de Extensão I",
          prerequisitos: ["ECB1417"],
          corequisitos: ["ECB1430"],
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
          codigo: "ECB1432",
          nome: "Sinais e Sistemas Lineares II",
          prerequisitos: ["ECB1425"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "ECB1433",
          nome: "Controladores Lógicos Programáveis",
          prerequisitos: ["ECB1408"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1434",
          nome: "Sistemas a Eventos Discretos",
          prerequisitos: ["ECB1408"],
          cargaHoraria: {
            total: 45,
          },
        },
        {
          codigo: "ECB1435",
          nome: "Eletrônica",
          prerequisitos: ["ECB1422"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1436",
          nome: "Eletrônica Experimental",
          prerequisitos: ["ECB1422"],
          corequisitos: ["ECB1435"],
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1437",
          nome: "Conversão de Energia",
          prerequisitos: ["ECB1426"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1438",
          nome: "Conversão de Energia Experimental",
          prerequisitos: ["ECB1426"],
          corequisitos: ["ECB1437"],
          cargaHoraria: {
            total: 30,
          },
        },
      ],
    },
    {
      numero: 6,
      disciplinas: [
        {
          codigo: "ECB1439",
          nome: "Sistemas Realimentados",
          prerequisitos: ["ECB1432"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "ECB1440",
          nome: "Instalações Elétricas Industriais",
          prerequisitos: ["ECB1426"],
          cargaHoraria: {
            total: 75,
          },
        },
        {
          codigo: "ECB1441",
          nome: "Hidráulica e Pneumática",
          prerequisitos: ["ECB1408"],
          cargaHoraria: {
            total: 75,
          },
        },
        {
          codigo: "ECB1442",
          nome: "Processos de Fabricação",
          prerequisitos: ["ECB1420"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1443",
          nome: "Projeto de Extensão II",
          prerequisitos: ["ECB1431"],
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
          codigo: "ECB1444",
          nome: "Controle Multivariável",
          prerequisitos: ["ECB1439"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1445",
          nome: "Instrumentação para Controle de Processos",
          prerequisitos: ["ECB1429", "ECB1420"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1446",
          nome: "Redes Industriais e Sistemas Supervisórios",
          prerequisitos: ["ECB1433"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1447",
          nome: "Conservação de Recursos Naturais",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1448",
          nome: "Projeto Integrador I",
          prerequisitos: ["ECB1430", "ECB1433", "ECB1435"],
          cargaHoraria: {
            total: 75,
          },
        },
      ],
    },
    {
      numero: 8,
      disciplinas: [
        {
          codigo: "ECB1449",
          nome: "Controle Discreto",
          prerequisitos: ["ECB1439"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1450",
          nome: "Acionamentos Elétricos",
          prerequisitos: ["ECB1437"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1451",
          nome: "Gestão da Produção e da Qualidade",
          prerequisitos: ["ECB1430"],
          cargaHoraria: {
            total: 90,
          },
        },
        {
          codigo: "ECB1452",
          nome: "Legislação, Ética e Sociedade",
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
      numero: 9,
      disciplinas: [
        {
          codigo: "ECB1453",
          nome: "Robótica Industrial",
          prerequisitos: ["ECB1428", "ECB1433", "ECB1439"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1454",
          nome: "Segurança do Trabalho",
          cargaHoraria: {
            total: 30,
          },
        },
        {
          codigo: "ECB1455",
          nome: "Engenharia Econômica e Empreendedorismo",
          prerequisitos: ["ECB1430"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1456",
          nome: "Projeto Integrador II",
          prerequisitos: ["ECB1445", "ECB1448"],
          cargaHoraria: {
            total: 75,
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
      numero: 10,
      disciplinas: [
        {
          codigo: "ECB1457",
          nome: "Trabalho de Conclusão de Curso",
          prerequisitos: ["ECB1449", "ECB1450", "ECB1456"],
          cargaHoraria: {
            total: 60,
          },
        },
        {
          codigo: "ECB1458",
          nome: "Estágio em Controle e Automação",
          prerequisitos: ["ECB1433", "ECB1439", "ECB1450", "ECB1456"],
          cargaHoraria: {
            total: 360,
          },
        },
      ],
    },
  ],
  resumo: {
    cargaTeorica: 2095,
    cargaPratica: 660,
    complementares: 75,
    optativasMinima: 120,
    estagio: 360,
    tcc: 60,
    extensaoPesquisa: 410,
    total: 3780,
  },
}

export const automationControlEngineeringCurriculum: GradeCurricular = {
  versao: "2017",
  documentoReferencia: "https://drive.google.com/file/d/1VLrodjVh1g89R-7DclVYunnJPHkfuP1o/view",
  semestres: [
    {
      numero: 1,
      disciplinas: [
        { codigo: "ECA1401", nome: "Introdução à Engenharia de Controle e Automação", cargaHoraria: { total: 15 } },
        { codigo: "ECA1402", nome: "Metodologia Científica", cargaHoraria: { total: 30 } },
        { codigo: "ECA1403", nome: "Física Geral I", cargaHoraria: { total: 60 } },
        { codigo: "ECA1404", nome: "Física Experimental I", cargaHoraria: { total: 30 } },
        { codigo: "ECA1405", nome: "Cálculo I", cargaHoraria: { total: 90 } },
        { codigo: "ECA1406", nome: "Geometria Analítica", cargaHoraria: { total: 60 } },
        { codigo: "ECA1407", nome: "Informática para a Engenharia", cargaHoraria: { total: 60 } },
        { codigo: "ECA1408", nome: "Desenho Técnico", cargaHoraria: { total: 60 } },
      ],
    },
    {
      numero: 2,
      disciplinas: [
        { codigo: "ECA1409", nome: "Física Geral II", cargaHoraria: { total: 60 } },
        { codigo: "ECA1410", nome: "Física Experimental II", cargaHoraria: { total: 30 } },
        { codigo: "ECA1411", nome: "Cálculo II", prerequisitos: ["ECA1405"], cargaHoraria: { total: 60 } },
        { codigo: "ECA1412", nome: "Álgebra Linear", prerequisitos: ["ECA1406"], cargaHoraria: { total: 60 } },
        { codigo: "ECA1413", nome: "Química Tecnológica Geral", cargaHoraria: { total: 60 } },
        { codigo: "ECA1414", nome: "Química Tecnológica Geral Experimental", cargaHoraria: { total: 30 } },
        { codigo: "ECA1415", nome: "Sistemas Digitais", cargaHoraria: { total: 60 } },
        { codigo: "ECA1416", nome: "Sistemas Digitais Experimental", cargaHoraria: { total: 30 } },
      ],
    },
    {
      numero: 3,
      disciplinas: [
        { codigo: "ECA1417", nome: "Física Geral III", prerequisitos: ["ECA1411"], cargaHoraria: { total: 60 } },
        { codigo: "ECA1418", nome: "Física Experimental III", cargaHoraria: { total: 30 } },
        { codigo: "ECA1419", nome: "Cálculo III", prerequisitos: ["ECA1411"], cargaHoraria: { total: 90 } },
        {
          codigo: "ECA1420",
          nome: "Microcontroladores",
          prerequisitos: ["ECA1415", "ECA1407"],
          cargaHoraria: { total: 60 },
        },
        {
          codigo: "ECA1421",
          nome: "Microcontroladores Experimental",
          prerequisitos: ["ECA1415", "ECA1407"],
          cargaHoraria: { total: 30 },
        },
        { codigo: "ECA1422", nome: "Probabilidade e Estatística", cargaHoraria: { total: 45 } },
        { codigo: "ECA1423", nome: "Mecânica dos Sólidos", prerequisitos: ["ECA1403"], cargaHoraria: { total: 60 } },
      ],
    },
    {
      numero: 4,
      disciplinas: [
        { codigo: "ECA1424", nome: "Circuitos Elétricos", prerequisitos: ["ECA1417"], cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1425",
          nome: "Circuitos Elétricos Experimental",
          prerequisitos: ["ECA1417"],
          cargaHoraria: { total: 30 },
        },
        { codigo: "ECA1426", nome: "Metrologia", cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1427",
          nome: "Cálculo Numérico",
          prerequisitos: ["ECA1407", "ECA1411", "ECA1412"],
          cargaHoraria: { total: 60 },
        },
        {
          codigo: "ECA1428",
          nome: "Fenômenos de Transporte",
          prerequisitos: ["ECA1409", "ECA1417"],
          cargaHoraria: { total: 60 },
        },
        {
          codigo: "ECA1429",
          nome: "Sinais e Sistemas Lineares I",
          prerequisitos: ["ECA1419", "ECA1412"],
          cargaHoraria: { total: 90 },
        },
      ],
    },
    {
      numero: 5,
      disciplinas: [
        { codigo: "ECA1430", nome: "Eletrônica Básica", prerequisitos: ["ECA1417"], cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1431",
          nome: "Eletrônica Básica Experimental",
          prerequisitos: ["ECA1417"],
          cargaHoraria: { total: 30 },
        },
        { codigo: "ECA1432", nome: "Conversão de Energia", prerequisitos: ["ECA1424"], cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1433",
          nome: "Conversão de Energia Experimental",
          prerequisitos: ["ECA1424"],
          cargaHoraria: { total: 30 },
        },
        { codigo: "ECA1434", nome: "Gestão de Projetos", cargaHoraria: { total: 60 } },
        { codigo: "ECA1435", nome: "Modelagem e Controladores Lógicos Programáveis", cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1436",
          nome: "Sinais e Sistemas Lineares II",
          prerequisitos: ["ECA1429"],
          cargaHoraria: { total: 90 },
        },
      ],
    },
    {
      numero: 6,
      disciplinas: [
        {
          codigo: "ECA1437",
          nome: "Instalações Elétricas Industriais",
          prerequisitos: ["ECA1424"],
          cargaHoraria: { total: 75 },
        },
        { codigo: "ECA1438", nome: "Processo de Fabricação Metal-Mecânica", cargaHoraria: { total: 60 } },
        { codigo: "ECA1439", nome: "Legislação, Ética e Sociedade", cargaHoraria: { total: 60 } },
        { codigo: "ECA1440", nome: "Sistemas Realimentados", prerequisitos: ["ECA1436"], cargaHoraria: { total: 90 } },
        { codigo: "ECA1441", nome: "Hidráulica e Pneumática", cargaHoraria: { total: 75 } },
      ],
    },
    {
      numero: 7,
      disciplinas: [
        { codigo: "ECA1442", nome: "Conservação dos Recursos Naturais", cargaHoraria: { total: 30 } },
        {
          codigo: "ECA1443",
          nome: "Redes Industriais e Sistemas Supervisórios",
          prerequisitos: ["ECA1435"],
          cargaHoraria: { total: 60 },
        },
        { codigo: "OPT01", nome: "Optativa 01", cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1444",
          nome: "Projeto Integrador I",
          prerequisitos: ["ECA1430", "ECA1434", "ECA1435"],
          cargaHoraria: { total: 60 },
        },
        { codigo: "ECA1445", nome: "Controle Multivariável", prerequisitos: ["ECA1440"], cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1446",
          nome: "Instrumentação para Controle",
          prerequisitos: ["ECA1424", "ECA1428"],
          cargaHoraria: { total: 60 },
        },
      ],
    },
    {
      numero: 8,
      disciplinas: [
        { codigo: "ECA1447", nome: "Gestão da Produção e da Qualidade", cargaHoraria: { total: 90 } },
        { codigo: "ECA1448", nome: "Acionamentos Elétricos", prerequisitos: ["ECA1432"], cargaHoraria: { total: 60 } },
        { codigo: "OPT02", nome: "Optativa 02", cargaHoraria: { total: 60 } },
        { codigo: "ECA1449", nome: "Sistemas Não-Lineares", prerequisitos: ["ECA1440"], cargaHoraria: { total: 60 } },
        { codigo: "ECA1450", nome: "Controle Discreto", prerequisitos: ["ECA1440"], cargaHoraria: { total: 60 } },
      ],
    },
    {
      numero: 9,
      disciplinas: [
        {
          codigo: "ECA1451",
          nome: "Introdução à Robótica Industrial",
          prerequisitos: ["ECA1412"],
          cargaHoraria: { total: 60 },
        },
        { codigo: "OPT03", nome: "Optativa 03", cargaHoraria: { total: 30 } },
        { codigo: "ECA1452", nome: "Segurança do Trabalho", cargaHoraria: { total: 30 } },
        { codigo: "ECA1453", nome: "Engenharia Econômica e Empreendedorismo", cargaHoraria: { total: 60 } },
        {
          codigo: "ECA1454",
          nome: "Projeto Integrador II",
          prerequisitos: ["ECA1444", "ECA1446"],
          cargaHoraria: { total: 60 },
        },
      ],
    },
    {
      numero: 10,
      disciplinas: [
        {
          codigo: "ECA1455",
          nome: "Estágio em Controle e Automação",
          prerequisitos: ["ECA1448", "ECA1450", "ECA1454"],
          cargaHoraria: { total: 360 },
        },
        {
          codigo: "ECA1456",
          nome: "Trabalho de Curso em Controle e Automação",
          prerequisitos: ["ECA1448", "ECA1450", "ECA1454"],
          cargaHoraria: { total: 60 },
        },
      ],
    },
  ],
  resumo: {
    cargaTeorica: 2675,
    cargaPratica: 865,
    complementares: 40,
    optativasMinima: 150,
    estagio: 360,
    tcc: 60,
    extensaoPesquisa: 0,
    total: 3640,
  },
}
