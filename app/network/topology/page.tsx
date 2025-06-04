"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Cpu, Activity, Thermometer, Gauge, Zap, Wifi } from "lucide-react"
import Link from "next/link"

export default function TopologyPage() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [realTimeData, setRealTimeData] = useState<any>({})

  // Dados simulados da topologia
  const networks = [
    {
      id: 1,
      name: "Fábrica Principal",
      assets: [
        { id: "comp-1", name: "Compressor A1", type: "compressor", status: "online", x: 100, y: 100 },
        { id: "sensor-1", name: "Sensor Pressão A1", type: "sensor", status: "online", x: 200, y: 80 },
        { id: "sensor-2", name: "Sensor Temp A1", type: "sensor", status: "online", x: 200, y: 120 },
        { id: "dist-1", name: "Distribuidor Principal", type: "distributor", status: "online", x: 300, y: 100 },
      ],
    },
    {
      id: 2,
      name: "Unidade Norte",
      assets: [
        { id: "comp-2", name: "Compressor B1", type: "compressor", status: "warning", x: 100, y: 300 },
        { id: "sensor-3", name: "Sensor Pressão B1", type: "sensor", status: "online", x: 200, y: 280 },
        { id: "sensor-4", name: "Sensor Vibração B1", type: "sensor", status: "offline", x: 200, y: 320 },
      ],
    },
  ]

  // Simular dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        "comp-1": {
          pressure: 7.2 + Math.random() * 0.6,
          temperature: 45 + Math.random() * 5,
          power: 85 + Math.random() * 10,
          vibration: 2.1 + Math.random() * 0.4,
        },
        "comp-2": {
          pressure: 6.8 + Math.random() * 0.8,
          temperature: 52 + Math.random() * 8,
          power: 78 + Math.random() * 12,
          vibration: 3.2 + Math.random() * 0.6,
        },
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/network" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Rede de Monitoramento
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Topologia de Ativos</h1>
          <p className="text-gray-600">Visualize e monitore todos os ativos da sua rede em tempo real</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topology View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Mapa da Topologia</h2>

              {networks.map((network) => (
                <div key={network.id} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">{network.name}</h3>
                  <div className="relative bg-gray-50 rounded-lg p-6 min-h-[300px]">
                    <svg className="w-full h-full absolute inset-0" style={{ minHeight: "300px" }}>
                      {/* Connections */}
                      {network.assets.map((asset, index) => {
                        if (index < network.assets.length - 1) {
                          const nextAsset = network.assets[index + 1]
                          return (
                            <line
                              key={`line-${asset.id}`}
                              x1={asset.x + 20}
                              y1={asset.y + 20}
                              x2={nextAsset.x + 20}
                              y2={nextAsset.y + 20}
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                          )
                        }
                        return null
                      })}
                    </svg>

                    {/* Assets */}
                    {network.assets.map((asset) => {
                      const Icon = getAssetIcon(asset.type)
                      return (
                        <div
                          key={asset.id}
                          className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                            selectedAsset?.id === asset.id ? "scale-110" : ""
                          }`}
                          style={{ left: asset.x, top: asset.y }}
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <div
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white shadow-lg ${
                              asset.status === "online"
                                ? "border-green-500"
                                : asset.status === "warning"
                                  ? "border-yellow-500"
                                  : "border-red-500"
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${getStatusColor(asset.status)}`} />
                          </div>
                          <div className="text-xs text-center mt-1 font-medium text-gray-700 max-w-20 truncate">
                            {asset.name}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Details */}
          <div className="space-y-6">
            {/* Asset Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes do Ativo</h2>

              {selectedAsset ? (
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

                  {selectedAsset.type === "compressor" && realTimeData[selectedAsset.id] && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-medium text-gray-900">Dados em Tempo Real</h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Gauge className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-600">Pressão</p>
                            <p className="font-semibold">{realTimeData[selectedAsset.id].pressure.toFixed(1)} bar</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-600">Temperatura</p>
                            <p className="font-semibold">{realTimeData[selectedAsset.id].temperature.toFixed(0)}°C</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <div>
                            <p className="text-xs text-gray-600">Potência</p>
                            <p className="font-semibold">{realTimeData[selectedAsset.id].power.toFixed(0)} kW</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-xs text-gray-600">Vibração</p>
                            <p className="font-semibold">{realTimeData[selectedAsset.id].vibration.toFixed(1)} mm/s</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Clique em um ativo no mapa para ver os detalhes</p>
              )}
            </div>

            {/* Network Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status da Rede</h2>

              <div className="space-y-4">
                {networks.map((network) => {
                  const onlineAssets = network.assets.filter((a) => a.status === "online").length
                  const totalAssets = network.assets.length

                  return (
                    <div key={network.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{network.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            {onlineAssets}/{totalAssets}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(onlineAssets / totalAssets) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
