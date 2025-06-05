"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, TriangleIcon as Topology } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { toast } from "react-hot-toast"

interface Network {
  id: string
  name: string
  description: string
  location: string
  createdAt: any
}

interface Asset {
  id: string
  name: string
  networkId: string
}

export default function NetworkPage() {
  const [networks, setNetworks] = useState<Network[]>([])
  const [networkStats, setNetworkStats] = useState<{
    [key: string]: { devices: number; efficiency: number; status: string }
  }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNetworks()
  }, [])

  const fetchNetworks = async () => {
    try {
      const networksRef = collection(db, "networks")
      const snapshot = await getDocs(networksRef)
      const networksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Network[]

      setNetworks(networksData)

      // Buscar estatísticas para cada rede
      const stats: { [key: string]: { devices: number; efficiency: number; status: string } } = {}

      for (const network of networksData) {
        const assetsRef = collection(db, "assets")
        const q = query(assetsRef, where("networkId", "==", network.id))
        const assetsSnapshot = await getDocs(q)

        const deviceCount = assetsSnapshot.size
        const efficiency = 90 + Math.random() * 10 // Simular eficiência
        const status = deviceCount > 0 ? "online" : "offline"

        stats[network.id] = {
          devices: deviceCount,
          efficiency: Math.round(efficiency * 10) / 10,
          status,
        }
      }

      setNetworkStats(stats)
    } catch (error) {
      console.error("Erro ao buscar redes:", error)
      toast.error("Erro ao carregar redes")
    } finally {
      setLoading(false)
    }
  }

  const getLastUpdate = (createdAt: any) => {
    if (!createdAt) return "Não disponível"

    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return `${diffDays} dias atrás`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rede de Monitoramento</h1>
          <p className="text-gray-600">Gerencie suas redes de monitoramento e ativos conectados</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Criar Nova Rede */}
          <Link href="/network/create" className="group">
            <div className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Criar Nova Rede</h3>
              <p className="text-gray-600 mb-4">
                Configure uma nova rede de monitoramento para seus compressores de ar comprimido
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-700">Começar configuração →</div>
            </div>
          </Link>

          {/* Criar Novo Ativo */}
          <Link href="/network/create-asset" className="group">
            <div className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                <Plus className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Criar Novo Ativo</h3>
              <p className="text-gray-600 mb-4">Adicione um novo ativo de ar comprimido a uma rede existente</p>
              <div className="text-orange-600 font-medium group-hover:text-orange-700">Adicionar ativo →</div>
            </div>
          </Link>

          {/* Topologia de Ativos */}
          <Link href="/network/topology" className="group">
            <div className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <Topology className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Topologia de Ativos</h3>
              <p className="text-gray-600 mb-4">
                Visualize a topologia completa dos seus ativos monitorados em tempo real
              </p>
              <div className="text-green-600 font-medium group-hover:text-green-700">Ver topologia →</div>
            </div>
          </Link>

          {/* Procurar Ativos */}
          <Link href="/network/search" className="group">
            <div className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-200 group-hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Procurar Ativos</h3>
              <p className="text-gray-600 mb-4">
                Encontre ativos específicos por nome, tipo ou descrição e monitore em tempo real
              </p>
              <div className="text-purple-600 font-medium group-hover:text-purple-700">Buscar ativos →</div>
            </div>
          </Link>
        </div>

        {/* Redes Existentes */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Redes Existentes</h2>
            <button onClick={fetchNetworks} className="btn-secondary flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : networks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Topology className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma rede encontrada</h3>
              <p className="text-gray-600 mb-6">Crie sua primeira rede de monitoramento para começar</p>
              <Link href="/network/create" className="btn-primary">
                Criar Primeira Rede
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {networks.map((network) => {
                const stats = networkStats[network.id] || { devices: 0, efficiency: 0, status: "offline" }
                return (
                  <div
                    key={network.id}
                    className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{network.name}</h3>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          stats.status === "online"
                            ? "status-online"
                            : stats.status === "warning"
                              ? "status-warning"
                              : "status-offline"
                        }`}
                      >
                        {stats.status === "online" ? "Online" : stats.status === "warning" ? "Atenção" : "Offline"}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">{network.description}</p>
                      <p className="text-xs text-gray-500 mt-1">📍 {network.location}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dispositivos:</span>
                        <span className="font-medium">{stats.devices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Eficiência:</span>
                        <span className="font-medium">{stats.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criada:</span>
                        <span className="text-sm text-gray-500">{getLastUpdate(network.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/network/topology?network=${network.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors text-center"
                      >
                        Ver Topologia
                      </Link>
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">⚙️</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
