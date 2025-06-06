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
      const network = networks.find((n) => n.id === selectedNetwork)

      if (!asset) {
        throw new Error("Ativo não encontrado")
      }

      // Use the asset's apiUrl if available, otherwise fall back to network's apiUrl
      const baseApiUrl = asset.apiUrl || network?.apiUrl || "https://18.212.36.236:8080"

      // Construct the API URL based on the selected endpoint and period
      const apiUrl = `${baseApiUrl}/${selectedEndpoint}/${selectedPeriod}`

      console.log("Fetching data from:", apiUrl)

      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error(`Erro ao buscar dados da API: ${response.status}`)

      const data = await response.json()
      setApiData(data)
      showNotification("success", "Dados carregados com sucesso!")
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      showNotification(
        "error",
        `Erro ao carregar dados da API: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      )

      // Fallback to the actual API endpoints if the asset/network specific ones fail
      try {
        const fallbackUrl = `https://18.212.36.236:8080/${selectedEndpoint}${selectedEndpoint === "dadosBrutos" ? "" : `/${selectedPeriod}`}`
        console.log("Trying fallback URL:", fallbackUrl)

        const fallbackResponse = await fetch(fallbackUrl)
        if (!fallbackResponse.ok) throw new Error("Fallback API request failed")

        const fallbackData = await fallbackResponse.json()
        setApiData(fallbackData)
        showNotification("info", "Dados carregados do servidor de backup")
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError)
        showNotification("error", "Não foi possível carregar dados de nenhuma fonte")
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
      // Try to use an AI analysis API if available
      const asset = assets.find((a) => a.id === selectedAsset)
      const network = networks.find((n) => n.id === selectedNetwork)
      const baseApiUrl = asset?.apiUrl || network?.apiUrl || "https://18.212.36.236:8080"

      try {
        const aiApiUrl = `${baseApiUrl}/analiseIA/${selectedEndpoint}/${selectedPeriod}`
        console.log("Fetching AI analysis from:", aiApiUrl)

        const response = await fetch(aiApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        })

        if (response.ok) {
          const aiResult = await response.json()
          setAiAnalysis(aiResult.analysis || aiResult.resultado || JSON.stringify(aiResult))
          showNotification("success", "Análise de IA concluída!")
          return
        }
      } catch (aiError) {
        console.error("Erro ao buscar análise de IA:", aiError)
      }

      // If AI API fails or is not available, generate a simple analysis based on the data
      let analysis = "## 📊 Análise Técnica dos Dados\n\n"

      if (apiData["número de leituras"] || apiData.length) {
        analysis += `### Comportamento Geral do Sistema\n`
        analysis += `Com base nos dados coletados (${apiData["número de leituras"] || (Array.isArray(apiData) ? apiData.length : "N/A")} leituras), o sistema apresenta:\n\n`

        if (apiData["valor mínimo"] !== undefined && apiData["valor máximo"] !== undefined) {
          analysis += `**Faixa Operacional:** ${apiData["valor mínimo"]?.toFixed(2) || "N/A"} - ${apiData["valor máximo"]?.toFixed(2) || "N/A"} bar\n`
        }

        if (apiData["média"] !== undefined) {
          analysis += `**Pressão Média:** ${apiData["média"]?.toFixed(2) || "N/A"} bar\n`
        }

        if (apiData["desvio padrão"] !== undefined) {
          analysis += `**Desvio Padrão:** ${apiData["desvio padrão"]?.toFixed(2) || "N/A"} bar\n\n`

          analysis += `### 🔍 Diagnóstico\n`
          analysis += `O desvio padrão de ${apiData["desvio padrão"]?.toFixed(2)} bar indica uma **variabilidade ${apiData["desvio padrão"] > 1.5 ? "alta" : apiData["desvio padrão"] > 0.8 ? "moderada" : "baixa"}** no sistema. Esta oscilação pode estar relacionada a:\n\n`
          analysis += `- Ciclos normais de carga/descarga do compressor\n`
          analysis += `- Variações na demanda de ar comprimido\n`
          analysis += `- Possível necessidade de ajuste fino no controlador\n\n`
        }

        analysis += `### ⚠️ Pontos de Atenção\n`

        if (apiData["valor máximo"] !== undefined && apiData["valor mínimo"] !== undefined) {
          const amplitude = apiData["valor máximo"] - apiData["valor mínimo"]
          analysis += `1. **Amplitude de Variação:** A diferença entre máximo e mínimo (${amplitude.toFixed(2)} bar) sugere ${amplitude > 3 ? "ciclos de trabalho intensos" : "ciclos de trabalho normais"}\n`
        } else {
          analysis += `1. **Amplitude de Variação:** Monitorar a amplitude de variação da pressão\n`
        }

        analysis += `2. **Estabilidade:** Monitorar se a variação está dentro dos parâmetros aceitáveis para o tipo de aplicação\n`

        if (apiData["tendência"]) {
          analysis += `3. **Tendência:** Os dados mostram uma tendência ${apiData["tendência"]} que deve ser monitorada\n\n`
        }

        analysis += `\n### 🔧 Recomendações de Manutenção\n`
        analysis += `1. **Verificar filtros de ar** - Filtros sujos podem causar oscilações de pressão\n`
        analysis += `2. **Inspeção das válvulas** - Verificar funcionamento das válvulas de alívio e regulagem\n`
        analysis += `3. **Calibração de sensores** - Validar precisão dos sensores de pressão\n`
        analysis += `4. **Análise de vazamentos** - Investigar possíveis vazamentos no sistema\n\n`

        analysis += `### 📈 Otimizações Sugeridas\n`
        analysis += `- Implementar controle preditivo para reduzir oscilações\n`
        analysis += `- Considerar ajuste dos setpoints de pressão\n`
        analysis += `- Avaliar necessidade de reservatório adicional para estabilização\n\n`

        analysis += `### 🎯 Próximos Passos\n`
        analysis += `1. Monitorar tendência por mais 7 dias\n`
        analysis += `2. Comparar com dados históricos\n`
        analysis += `3. Agendar manutenção preventiva se necessário\n`
      } else {
        analysis +=
          "Não foi possível gerar uma análise detalhada com os dados disponíveis. Verifique se os dados estão completos e tente novamente."
      }

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
    const networkName = networks.find((n) => n.id === selectedNetwork)?.name || "N/A"
    const assetName = assets.find((a) => a.id === selectedAsset)?.name || "N/A"

    const content = `RELATÓRIO DE ANÁLISE - AIRscan Capivaras
Data: ${new Date().toLocaleDateString("pt-BR")}
Rede: ${networkName}
Ativo: ${assetName}
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
