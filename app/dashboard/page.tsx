"use client"

import { useState, useEffect } from "react"
import { Activity, Network, Cpu, Database, TrendingUp, CheckCircle, Wifi } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    networks: 12,
    equipment: 45,
    sensors: 180,
    dataPoints: 2847392,
    onlineDevices: 42,
    alerts: 3,
    efficiency: 94.2,
    energySaved: 15.7,
  })

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 100),
        efficiency: 90 + Math.random() * 8,
        energySaved: 10 + Math.random() * 10,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: "Redes Monitoradas",
      value: stats.networks,
      icon: Network,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+2 esta semana",
    },
    {
      title: "Equipamentos",
      value: stats.equipment,
      icon: Cpu,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5 este mês",
    },
    {
      title: "Sensores Ativos",
      value: stats.sensors,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: `${stats.onlineDevices}/${stats.equipment} online`,
    },
    {
      title: "Dados Coletados",
      value: stats.dataPoints.toLocaleString(),
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+1.2M hoje",
    },
    {
      title: "Eficiência Média",
      value: `${stats.efficiency.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      change: "+2.3% vs mês passado",
    },
    {
      title: "Economia Energética",
      value: `${stats.energySaved.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      change: "R$ 45.2k economizados",
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Pressão elevada detectada - Compressor A3",
      time: "5 min atrás",
      network: "Fábrica Principal",
    },
    {
      id: 2,
      type: "error",
      message: "Sensor de temperatura offline - Linha B",
      time: "15 min atrás",
      network: "Unidade Norte",
    },
    {
      id: 3,
      type: "success",
      message: "Manutenção preventiva concluída",
      time: "1 hora atrás",
      network: "Fábrica Principal",
    },
  ]

  const topNetworks = [
    { name: "Fábrica Principal", devices: 15, efficiency: 96.2, status: "online" },
    { name: "Unidade Norte", devices: 12, efficiency: 94.8, status: "online" },
    { name: "Linha de Produção B", devices: 8, efficiency: 92.1, status: "warning" },
    { name: "Setor Industrial C", devices: 10, efficiency: 95.5, status: "online" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Monitoramento</h1>
          <p className="text-gray-600">Visão geral do sistema de monitoramento de ar comprimido</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Alerts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Alertas Recentes</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">{stats.alerts} ativos</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "error"
                        ? "bg-red-500"
                        : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{alert.network}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Networks */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Redes Principais</h2>
            <div className="space-y-4">
              {topNetworks.map((network, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        network.status === "online"
                          ? "bg-green-500"
                          : network.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{network.name}</p>
                      <p className="text-sm text-gray-500">{network.devices} dispositivos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{network.efficiency}%</p>
                    <p className="text-sm text-gray-500">eficiência</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Atividade em Tempo Real</h2>
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Conectado</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.dataPoints.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Pontos de dados coletados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.onlineDevices}</div>
              <p className="text-sm text-gray-600">Dispositivos online</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.efficiency.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Eficiência atual</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.energySaved.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Economia energética</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
