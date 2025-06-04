"use client"

import { useState } from "react"
import { ArrowLeft, Search, Filter, Cpu, Activity, Zap, Gauge, Thermometer } from "lucide-react"
import Link from "next/link"

export default function SearchAssetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  // Dados simulados de ativos
  const allAssets = [
    {
      id: "comp-1",
      name: "Compressor A1",
      type: "compressor",
      description: "Compressor principal da linha de produção A",
      network: "Fábrica Principal",
      status: "online",
      location: "Setor A - Linha 1",
    },
    {
      id: "comp-2",
      name: "Compressor B1",
      type: "compressor",
      description: "Compressor secundário para backup",
      network: "Unidade Norte",
      status: "warning",
      location: "Setor B - Linha 2",
    },
    {
      id: "sensor-1",
      name: "Sensor Pressão A1",
      type: "sensor",
      description: "Sensor de pressão do compressor A1",
      network: "Fábrica Principal",
      status: "online",
      location: "Compressor A1",
    },
    {
      id: "sensor-2",
      name: "Sensor Temperatura A1",
      type: "sensor",
      description: "Sensor de temperatura do compressor A1",
      network: "Fábrica Principal",
      status: "online",
      location: "Compressor A1",
    },
    {
      id: "dist-1",
      name: "Distribuidor Principal",
      type: "distributor",
      description: "Distribuidor de ar comprimido principal",
      network: "Fábrica Principal",
      status: "online",
      location: "Central de Distribuição",
    },
    {
      id: "sensor-3",
      name: "Sensor Vibração B1",
      type: "sensor",
      description: "Sensor de vibração do compressor B1",
      network: "Unidade Norte",
      status: "offline",
      location: "Compressor B1",
    },
  ]

  // Filtrar ativos
  const filteredAssets = allAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.network.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || asset.type === selectedType
    return matchesSearch && matchesType
  })

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "compressor":
        return Cpu
      case "sensor":
        return Activity
      case "distributor":
        return Zap
      default:
        return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "offline":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return "status-online"
      case "warning":
        return "status-warning"
      case "offline":
        return "status-offline"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Dados simulados em tempo real para o ativo selecionado
  const getRealTimeData = (assetId: string) => {
    if (assetId.includes("comp")) {
      return {
        pressure: 7.2 + Math.random() * 0.6,
        temperature: 45 + Math.random() * 5,
        power: 85 + Math.random() * 10,
        vibration: 2.1 + Math.random() * 0.4,
        efficiency: 90 + Math.random() * 8,
      }
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/network" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Rede de Monitoramento
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Procurar Ativos</h1>
          <p className="text-gray-600">Encontre e monitore ativos específicos em tempo real</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, descrição ou rede..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="compressor">Compressores</option>
                    <option value="sensor">Sensores</option>
                    <option value="distributor">Distribuidores</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Resultados ({filteredAssets.length})</h2>
              </div>

              <div className="space-y-4">
                {filteredAssets.map((asset) => {
                  const Icon = getAssetIcon(asset.type)
                  return (
                    <div
                      key={asset.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedAsset?.id === asset.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className={`w-6 h-6 ${getStatusColor(asset.status)}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                            <p className="text-sm text-gray-600">{asset.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">{asset.network}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{asset.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(asset.status)}`}
                          >
                            {asset.status === "online" ? "Online" : asset.status === "warning" ? "Atenção" : "Offline"}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{asset.type}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredAssets.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum ativo encontrado com os critérios de busca</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Asset Details */}
          <div className="space-y-6">
            {selectedAsset ? (
              <>
                {/* Asset Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes do Ativo</h2>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedAsset.status === "online"
                            ? "bg-green-500"
                            : selectedAsset.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedAsset.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{selectedAsset.type}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rede:</span>
                        <span className="font-medium">{selectedAsset.network}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Localização:</span>
                        <span className="font-medium">{selectedAsset.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Descrição:</span>
                        <span className="font-medium text-right max-w-40">{selectedAsset.description}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Data */}
                {selectedAsset.type === "compressor" && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Dados em Tempo Real</h2>

                    {(() => {
                      const data = getRealTimeData(selectedAsset.id)
                      return data ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Gauge className="w-5 h-5 text-blue-500" />
                                <span className="text-gray-700">Pressão</span>
                              </div>
                              <span className="font-semibold">{data.pressure.toFixed(1)} bar</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Thermometer className="w-5 h-5 text-red-500" />
                                <span className="text-gray-700">Temperatura</span>
                              </div>
                              <span className="font-semibold">{data.temperature.toFixed(0)}°C</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-700">Potência</span>
                              </div>
                              <span className="font-semibold">{data.power.toFixed(0)} kW</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Activity className="w-5 h-5 text-purple-500" />
                                <span className="text-gray-700">Vibração</span>
                              </div>
                              <span className="font-semibold">{data.vibration.toFixed(1)} mm/s</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-700">Eficiência</span>
                              <span className="font-semibold">{data.efficiency.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${data.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          Dados em tempo real não disponíveis para este tipo de ativo
                        </p>
                      )
                    })()}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Selecione um Ativo</h2>
                <p className="text-gray-500 text-center py-8">
                  Clique em um ativo da lista para ver os detalhes e dados em tempo real
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
