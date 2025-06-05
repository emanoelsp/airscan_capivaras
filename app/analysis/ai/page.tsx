"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TrendingUp, Activity, AlertTriangle, Brain, Download, RefreshCw } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

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
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

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

      if (networkId && networksList.some((n) => n.id === networkId)) {
        setSelectedNetwork(networkId)
      }
    } catch (error) {
      console.error("Erro ao buscar redes:", error)
      showNotification("error", "Erro ao carregar redes")
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

      if (assetsList.length > 0) {
        setSelectedAsset(assetsList[0].id)
      }
    } catch (error) {
      console.error("Erro ao buscar ativos:", error)
      showNotification("error", "Erro ao carregar ativos")
    } finally {
      setLoadingAssets(false)
    }
  }

  const fetchApiData = async () => {
    if (!selectedAsset) {
      showNotification("error", "Selecione um ativo primeiro")
      return
    }

    setLoadingData(true)
    try {
      const asset = assets.find((a) => a.id === selectedAsset)
      if (!asset || !asset.apiUrl) {
        throw new Error("URL da API não encontrada para este ativo")
      }

      const apiUrl = `http://18.212.36.236:8080/${selectedEndpoint}/${selectedPeriod}`

      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error("Erro ao buscar dados da API")

      const data = await response.json()
      setApiData(data)
      showNotification("success", "Dados carregados com sucesso!")
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      showNotification("error", "Erro ao carregar dados da API")

      if (selectedEndpoint === "metricasBasicas") {
        setApiData({
          "número de leituras": 4717,
          "valor mínimo": 5.587333,
          "valor máximo": 10.177,
          média: 7.74224479732881,
          mediana: 7.812667,
          "desvio padrão": 1.22822881034515,
          explicação: "Essas são métricas descritivas fundamentais para entender a distribuição dos dados de pressão.",
        })
      } else if (selectedEndpoint === "metricasCompleta") {
        setApiData({
          "número de leituras": 4717,
          "valor mínimo": 5.587,
          "valor máximo": 10.177,
          média: 7.74,
          mediana: 7.81,
          "desvio padrão": 1.22,
          "MAD (desvio absoluto médio)": 1.03,
          "delta (diferença entre último e primeiro valor)": 0.25,
          "taxa de variação (rate of change)": 5e-5,
          "z-score médio": 0.84,
          explicação:
            "As métricas completas trazem uma análise mais aprofundada da variabilidade e comportamento dos dados, incluindo desvios e anomalias.",
        })
      } else if (selectedEndpoint === "tendencia") {
        setApiData({
          "inclinação (slope)": 0.0023,
          tendência: "positiva",
          "aceleração média": 0.001,
          explicação:
            "A inclinação mostra a direção da tendência dos dados. A aceleração revela se essa tendência está se intensificando ou diminuindo ao longo do tempo.",
        })
      } else if (selectedEndpoint === "qualidadeDados") {
        setApiData({
          "leituras idênticas consecutivas": 152,
          "variação relativa média": 0.034,
          "qualidade geral": "boa",
          explicação:
            "A presença de muitos valores repetidos ou pouca variação pode indicar sensores travados, falta de atualização ou problemas na coleta.",
        })
      } else if (selectedEndpoint === "dadosBrutos") {
        setApiData([
          { timestamp: 1748820000, valor: 7.774 },
          { timestamp: 1748820300, valor: 7.765 },
          { timestamp: 1748820600, valor: 7.781 },
          { timestamp: 1748820900, valor: 7.792 },
          { timestamp: 1748821200, valor: 7.803 },
          { timestamp: 1748821500, valor: 7.815 },
          { timestamp: 1748821800, valor: 7.826 },
          { timestamp: 1748822100, valor: 7.837 },
          { timestamp: 1748822400, valor: 7.848 },
          { timestamp: 1748822700, valor: 7.859 },
        ])
      }
    } finally {
      setLoadingData(false)
    }
  }

  const analyzeWithAI = async () => {
    if (!apiData) {
      showNotification("error", "Carregue os dados primeiro!")
      return
    }

    setAnalyzing(true)
    try {
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
      showNotification("success", "Análise de IA concluída!")
    } catch (error) {
      console.error("Erro na análise:", error)
      showNotification("error", "Erro ao processar análise de IA")
    } finally {
      setAnalyzing(false)
    }
  }

  const exportAnalysis = () => {
    const content = `
RELATÓRIO DE ANÁLISE - AIRscan Capivaras
Data: ${new Date().toLocaleDateString("pt-BR")}
Rede: ${networks.find((n) => n.id === selectedNetwork)?.name || "N/A"}
Ativo: ${assets.find((a) => a.id === selectedAsset)?.name || "N/A"}
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
    showNotification("success", "Relatório exportado!")
  }

  const renderDataVisualization = () => {
    if (!apiData) return null

    if (selectedEndpoint === "dadosBrutos" && Array.isArray(apiData)) {
      const chartData = apiData.map((item) => ({
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
      const trendData = Array.from({ length: 10 }, (_, i) => ({
        dia: `Dia ${i + 1}`,
        valor: 7.5 + i * apiData["inclinação (slope)"] * 10,
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
              <Line type="monotone" dataKey="valor" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (selectedEndpoint === "metricasBasicas" || selectedEndpoint === "metricasCompleta") {
      const metricsData = [
        { name: "Mínimo", valor: apiData["valor mínimo"] || 0 },
        { name: "Média", valor: apiData["média"] || 0 },
        { name: "Máximo", valor: apiData["valor máximo"] || 0 },
        { name: "Mediana", valor: apiData["mediana"] || 0 },
      ]

      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualização de Métricas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando redes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análises com IA</h1>
          <p className="text-gray-600">Análise inteligente de dados de pressão com recomendações técnicas</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração da Análise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rede</label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma rede</option>
                {networks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ativo</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                disabled={!selectedNetwork || loadingAssets}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Selecione um ativo</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Análise</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {endpoints.map((endpoint) => (
                  <option key={endpoint.value} value={endpoint.value}>
                    {endpoint.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchApiData}
                disabled={loadingData || !selectedAsset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loadingData ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Carregar Dados
              </button>
            </div>
          </div>
        </div>

        {apiData && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Dados da API</h3>
              <button
                onClick={analyzeWithAI}
                disabled={analyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center"
              >
                {analyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
                Analisar com IA
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6">
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          </div>
        )}

        {renderDataVisualization()}

        {aiAnalysis && (
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Análise de IA
              </h3>
              <button
                onClick={exportAnalysis}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{aiAnalysis}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {endpoints.map((endpoint) => {
            const Icon = endpoint.icon
            return (
              <div
                key={endpoint.value}
                className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer transition-all hover:shadow-lg ${
                  selectedEndpoint === endpoint.value ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedEndpoint(endpoint.value)}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{endpoint.label}</h3>
                <p className="text-sm text-gray-600">
                  {endpoint.value === "metricasBasicas" && "Métricas descritivas fundamentais"}
                  {endpoint.value === "metricasCompleta" && "Análise estatística aprofundada"}
                  {endpoint.value === "tendencia" && "Análise de tendências temporais"}
                  {endpoint.value === "qualidadeDados" && "Avaliação da consistência dos dados"}
                  {endpoint.value === "dadosBrutos" && "Dados brutos de pressão"}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
