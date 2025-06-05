"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TrendingUp, Activity, AlertTriangle } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { toast } from "react-hot-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ApiData {
  [key: string]: any
}

export default function AIAnalysisPage() {
  const searchParams = useSearchParams()
  const networkId = searchParams.get("network")

  const [networks, setNetworks] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState(networkId || "")
  const [selectedAsset, setSelectedAsset] = useState("")
  const [selectedEndpoint, setSelectedEndpoint] = useState("metricasBasicas")
  const [selectedPeriod, setSelectedPeriod] = useState("dia")
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const endpoints = [
    { value: "metricasBasicas", label: "Métricas Básicas", icon: Activity },
    { value: "metricasCompleta", label: "Métricas Completas", icon: TrendingUp },
    { value: "tendencia", label: "Análise de Tendência", icon: TrendingUp },
    { value: "qualidadeDados", label: "Qualidade dos Dados", icon: AlertTriangle },
    { value: "dadosBrutos", label: "Dados Brutos", icon: Activity },
  ]

  const periods = [
    { value: "dia", label: "Hoje" },
    { value: "semana", label: "Última Semana" },
    { value: "mes", label: "Mês Atual" },
    { value: "mespassado", label: "Mês Passado" },
    { value: "tudo", label: "Todos os Dados" },
  ]

  useEffect(() => {
    fetchNetworks()
  }, [])

  useEffect(() => {
    if (selectedNetwork) {
      fetchAssets(selectedNetwork)
    }
  }, [selectedNetwork])

  const fetchNetworks = async () => {
    try {
      const networksRef = collection(db, "networks")
      const snapshot = await getDocs(networksRef)
      const networksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setNetworks(networksList)

      // Se temos um networkId da URL e ele existe na lista, selecione-o
      if (networkId && networksList.some((n) => n.id === networkId)) {
        setSelectedNetwork(networkId)
      }
    } catch (error) {
      console.error("Erro ao buscar redes:", error)
      toast.error("Erro ao carregar redes")
    } finally {
      setLoading(false)
    }
  }

  const fetchAssets = async (networkId: string) => {
    setLoadingAssets(true)
    try {
      const assetsRef = collection(db, "assets")
      const q = query(assetsRef, where("networkId", "==", networkId))
      const snapshot = await getDocs(q)
      const assetsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setAssets(assetsList)

      // Se houver ativos, selecione o primeiro por padrão
      if (assetsList.length > 0) {
        setSelectedAsset(assetsList[0].id)
      }
    } catch (error) {
      console.error("Erro ao buscar ativos:", error)
      toast.error("Erro ao carregar ativos")
    } finally {
      setLoadingAssets(false)
    }
  }

  const fetchApiData = async () => {
    if (!selectedAsset) {
      toast.error("Selecione um ativo primeiro")
      return
    }

    setLoadingData(true)
    try {
      // Buscar a URL da API do ativo selecionado
      const asset = assets.find((a) => a.id === selectedAsset)
      if (!asset || !asset.apiUrl) {
        throw new Error("URL da API não encontrada para este ativo")
      }

      // Construir a URL da API com o endpoint e período selecionados
      const apiUrl = `http://18.212.36.236:8080/${selectedEndpoint}/${selectedPeriod}`
      
      // Fazer a requisição para a API
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error("Erro ao buscar dados da API")

      const data = await response.json()
      setApiData(data)
      toast.success("Dados carregados com sucesso!")
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast.error("Erro ao carregar dados da API")
      
      // Dados simulados para demonstração
      if (selectedEndpoint === "metricasBasicas") {
        setApiData({
          "número de leituras": 4717,
          "valor mínimo": 5.587333,
          "valor máximo": 10.177,
          "média": 7.74224479732881,
          "mediana": 7.812667,
          "desvio padrão": 1.22822881034515,
          "explicação": "Essas são métricas descritivas fundamentais para entender a distribuição dos dados de pressão."
        })
      } else if (selectedEndpoint === "metricasCompleta") {
        setApiData({
          "número de leituras": 4717,
          "valor mínimo": 5.587,
          "valor máximo": 10.177,
          "média": 7.74,
          "mediana": 7.81,
          "desvio padrão": 1.22,
          "MAD (desvio absoluto médio)": 1.03,
          "delta (diferença entre último e primeiro valor)": 0.25,
          "taxa de variação (rate of change)": 5e-05,
          "z-score médio": 0.84,
          "explicação": "As métricas completas trazem uma análise mais aprofundada da variabilidade e comportamento dos dados, incluindo desvios e anomalias."
        })
      } else if (selectedEndpoint === "tendencia") {
        setApiData({
          "inclinação (slope)": 0.0023,
          "tendência": "positiva",
          "aceleração média": 0.001,
          "explicação": "A inclinação mostra a direção da tendência dos dados. A aceleração revela se essa tendência está se intensificando ou diminuindo ao longo do tempo."
        })
      } else if (selectedEndpoint === "qualidadeDados") {
        setApiData({
          "leituras idênticas consecutivas": 152,
          "variação relativa média": 0.034,
          "qualidade geral": "boa",
          "explicação": "A presença de muitos valores repetidos ou pouca variação pode indicar sensores travados, falta de atualização ou problemas na coleta."
        })
      } else if (selectedEndpoint === "dadosBrutos") {
        setApiData([
          { "timestamp": 1748820000, "valor": 7.774 },
          { "timestamp": 1748820300, "valor": 7.765 },
          { "timestamp": 1748820600, "valor": 7.781 },
          { "timestamp": 1748820900, "valor": 7.792 },
          { "timestamp": 1748821200, "valor": 7.803 },
          { "timestamp": 1748821500, "valor": 7.815 },
          { "timestamp": 1748821800, "valor": 7.826 },
          { "timestamp": 1748822100, "valor": 7.837 },
          { "timestamp": 1748822400, "valor": 7.848 },
          { "timestamp": 1748822700, "valor": 7.859 }
        ])
      }
    } finally {
      setLoadingData(false)
    }
  }

  const analyzeWithAI = async () => {
    if (!apiData) {
      toast.error("Carregue os dados primeiro!")
      return
    }

    setAnalyzing(true)
    try {
      // Simulação da análise de IA (em produção, seria uma chamada para OpenAI)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const analysis = `
## 📊 Análise Técnica dos Dados de Pressão

### Comportamento Geral do Sistema
Com base nos dados coletados (${apiData["número de leituras"] || "N/A"} leituras), o sistema apresenta:

**Faixa Operacional:** ${apiData["valor mínimo"]?.toFixed(2) || "N/A"} - ${apiData["valor máximo"]?.toFixed(2) || "N/A"} bar
**Pressão Média:** ${apiData["média"]?.toFixed(2) || "N/A"} bar
**Desvio Padrão:** ${apiData["desvio padrão"]?.toFixed(2) || "N/A"} bar

### 🔍 Diagnóstico
${apiData["desvio padrão"] ? `O desvio padrão de ${apiData["desvio padrão"]?.toFixed(2)} bar indica uma **variabilidade moderada** no sistema. Esta oscilação pode estar relacionada a:` : "A análise dos dados indica que:"}

- Ciclos normais de carga/descarga do compressor
- Variações na demanda de ar comprimido
- Possível necessidade de ajuste fino no controlador

### ⚠️ Pontos de Atenção
1. **Amplitude de Variação:** ${apiData["valor máximo"] && apiData["valor mínimo"] ? `A diferença entre máximo e mínimo (${(apiData["valor máximo"] - apiData["valor mínimo"])?.toFixed(2)} bar) sugere ciclos de trabalho normais` : "Monitorar a amplitude de variação da pressão"}
2. **Estabilidade:** Monitorar se a variação está dentro dos parâmetros aceitáveis para o tipo de aplicação
${apiData["tendência"] ? `3. **Tendência:** Os dados mostram uma tendência ${apiData["tendência"]} que deve ser monitorada` : ""}

### 🔧 Recomendações de Manutenção
1. **Verificar filtros de ar** - Filtros sujos podem causar oscilações de pressão
2. **Inspeção das válvulas** - Verificar funcionamento das válvulas de alívio e regulagem
3. **Calibração de sensores** - Validar precisão dos sensores de pressão
4. **Análise de vazamentos** - Investigar possíveis vazamentos no sistema

### 📈 Otimizações Sugeridas
- Implementar controle preditivo para reduzir oscilações
- Considerar ajuste dos setpoints de pressão
- Avaliar necessidade de reservatório adicional para estabilização

### 🎯 Próximos Passos
1. Monitorar tendência por mais 7 dias
2. Comparar com dados históricos
3. Agendar manutenção preventiva se necessário
      `

      setAiAnalysis(analysis)
      toast.success("Análise de IA concluída!")
    } catch (error) {
      console.error("Erro na análise:", error)
      toast.error("Erro ao processar análise de IA")
    } finally {
      setAnalyzing(false)
    }
  }

  const exportAnalysis = () => {
    const content = `
RELATÓRIO DE ANÁLISE - AIRscan Capivaras
Data: ${new Date().toLocaleDateString("pt-BR")}
Rede: ${networks.find(n => n.id === selectedNetwork)?.name || "N/A"}
Ativo: ${assets.find(a => a.id === selectedAsset)?.name || "N/A"}
Endpoint: ${selectedEndpoint}
Período: ${selectedPeriod}

DADOS COLETADOS:
${JSON.stringify(apiData, null, 2)}

ANÁLISE DE IA:
${aiAnalysis}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analise-ia-${selectedEndpoint}-${selectedPeriod}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Relatório exportado!")
  }

  const renderDataVisualization = () => {
    if (!apiData) return null

    if (selectedEndpoint === "dadosBrutos" && Array.isArray(apiData)) {
      // Formatar os timestamps para exibição
      const chartData = apiData.map(item => ({
        ...item,
        time: new Date(item.timestamp * 1000).toLocaleTimeString(),
      }))

      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualização de Dados Brutos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (selectedEndpoint === "tendencia" && apiData["inclinação (slope)"]) {
      // Criar dados simulados para visualizar a tendência
      const trendData = Array.from({ length: 10 }, (_, i) => ({
        dia: `Dia ${i+1}`,
        valor: 7.5 + (i * apiData["inclinação (slope)"] * 10),
      }))

      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualização de Tendência</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                \
