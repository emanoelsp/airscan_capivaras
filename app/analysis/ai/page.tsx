"use client"

import { useState } from "react"
import { Brain, TrendingUp, Activity, AlertTriangle, Download, RefreshCw } from "lucide-react"

interface ApiData {
  [key: string]: any
}

export default function AIAnalysisPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("metricasBasicas")
  const [selectedPeriod, setSelectedPeriod] = useState("dia")
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
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
  ]

  const periods = [
    { value: "dia", label: "Hoje" },
    { value: "semana", label: "Última Semana" },
    { value: "mes", label: "Mês Atual" },
    { value: "mespassado", label: "Mês Passado" },
    { value: "tudo", label: "Todos os Dados" },
  ]

  const fetchApiData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://18.212.36.236:8080/${selectedEndpoint}/${selectedPeriod}`)
      if (!response.ok) throw new Error("Erro ao buscar dados da API")

      const data = await response.json()
      setApiData(data)
      showNotification("success", "Dados carregados com sucesso!")
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      showNotification("error", "Erro ao carregar dados da API")
      // Dados simulados para demonstração
      setApiData({
        "número de leituras": 4717,
        "valor mínimo": 5.587333,
        "valor máximo": 10.177,
        média: 7.74224479732881,
        mediana: 7.812667,
        "desvio padrão": 1.22822881034515,
        explicação: "Dados simulados para demonstração - API indisponível",
      })
    } finally {
      setLoading(false)
    }
  }

  const analyzeWithAI = async () => {
    if (!apiData) {
      showNotification("error", "Carregue os dados primeiro!")
      return
    }

    setAnalyzing(true)
    try {
      // Simulação da análise de IA (em produção, seria uma chamada para OpenAI)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const analysis = `
## 📊 Análise Técnica dos Dados de Pressão

### Comportamento Geral do Sistema
Com base nos dados coletados (${apiData["número de leituras"]} leituras), o sistema apresenta:

**Faixa Operacional:** ${apiData["valor mínimo"]?.toFixed(2)} - ${apiData["valor máximo"]?.toFixed(2)} bar
**Pressão Média:** ${apiData["média"]?.toFixed(2)} bar
**Desvio Padrão:** ${apiData["desvio padrão"]?.toFixed(2)} bar

### 🔍 Diagnóstico
O desvio padrão de ${apiData["desvio padrão"]?.toFixed(2)} bar indica uma **variabilidade moderada** no sistema. Esta oscilação pode estar relacionada a:

- Ciclos normais de carga/descarga do compressor
- Variações na demanda de ar comprimido
- Possível necessidade de ajuste fino no controlador

### ⚠️ Pontos de Atenção
1. **Amplitude de Variação:** A diferença entre máximo e mínimo (${(apiData["valor máximo"] - apiData["valor mínimo"])?.toFixed(2)} bar) sugere ciclos de trabalho normais
2. **Estabilidade:** Monitorar se a variação está dentro dos parâmetros aceitáveis para o tipo de aplicação

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análises com IA</h1>
          <p className="text-gray-600">Análise inteligente de dados de pressão com recomendações técnicas</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração da Análise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Carregar Dados
              </button>
            </div>
          </div>
        </div>

        {/* API Data Display */}
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

            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* AI Analysis Results */}
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

        {/* Info Cards */}
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
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
