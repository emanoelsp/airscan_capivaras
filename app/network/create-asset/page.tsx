"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Check, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"

interface Network {
  id: string
  name: string
  description: string
  location: string
}

export default function CreateAssetPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [networks, setNetworks] = useState<Network[]>([])
  const [loading, setLoading] = useState(true)
  const [assetData, setAssetData] = useState({
    networkId: "",
    name: "",
    description: "",
    type: "",
    model: "",
    maxPressure: "",
    powerRating: "",
    location: "",
    apiUrl: "",
    apiKey: "",
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const steps = [
    { number: 1, title: "Escolher Rede", description: "Selecione a rede de monitoramento" },
    { number: 2, title: "Detalhes do Ativo", description: "Informações do compressor" },
    { number: 3, title: "Conexão API", description: "Configurar fonte de dados" },
  ]

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
    } catch (error) {
      console.error("Erro ao buscar redes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setAssetData((prev) => ({ ...prev, [field]: value }))
  }

  const testApiConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")

    // Simular teste de conexão
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% chance de sucesso
      setConnectionStatus(success ? "success" : "error")
      setIsTestingConnection(false)
    }, 2000)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "assets"), {
        ...assetData,
        createdAt: new Date(),
        status: "online",
      })
      alert("Ativo criado com sucesso!")
    } catch (error) {
      console.error("Erro ao criar ativo:", error)
      alert("Erro ao criar ativo. Tente novamente.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando redes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/network" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Rede de Monitoramento
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Ativo</h1>
          <p className="text-gray-600">Adicione um novo ativo de ar comprimido à sua rede de monitoramento</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-300"}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Escolher Rede</h2>

              {networks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nenhuma rede encontrada.</p>
                  <Link href="/network/create" className="btn-primary">
                    Criar Nova Rede
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {networks.map((network) => (
                    <div
                      key={network.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        assetData.networkId === network.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleInputChange("networkId", network.id)}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{network.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{network.description}</p>
                      <p className="text-xs text-gray-500">{network.location}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Ativo</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Ativo *</label>
                  <input
                    type="text"
                    value={assetData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Compressor A1"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo do Compressor *</label>
                  <select
                    value={assetData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="parafuso">Parafuso</option>
                    <option value="pistao">Pistão</option>
                    <option value="centrifugo">Centrífugo</option>
                    <option value="scroll">Scroll</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo/Marca</label>
                  <input
                    type="text"
                    value={assetData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Ex: Atlas Copco GA30"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                  <input
                    type="text"
                    value={assetData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ex: Setor A - Linha 1"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pressão Máxima (bar) *</label>
                  <input
                    type="number"
                    value={assetData.maxPressure}
                    onChange={(e) => handleInputChange("maxPressure", e.target.value)}
                    placeholder="Ex: 8"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Potência (kW) *</label>
                  <input
                    type="number"
                    value={assetData.powerRating}
                    onChange={(e) => handleInputChange("powerRating", e.target.value)}
                    placeholder="Ex: 30"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição do Ativo</label>
                <textarea
                  value={assetData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva as características e função deste ativo"
                  rows={4}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Conexão com API</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL da API *</label>
                  <input
                    type="url"
                    value={assetData.apiUrl}
                    onChange={(e) => handleInputChange("apiUrl", e.target.value)}
                    placeholder="https://api.exemplo.com/sensor-data"
                    className="input-field"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL do endpoint que fornece os dados do sensor em tempo real
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chave da API (opcional)</label>
                  <input
                    type="password"
                    value={assetData.apiKey}
                    onChange={(e) => handleInputChange("apiKey", e.target.value)}
                    placeholder="Chave de autenticação da API"
                    className="input-field"
                  />
                </div>

                {/* Test Connection */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Testar Conexão</h3>
                    <button
                      onClick={testApiConnection}
                      disabled={!assetData.apiUrl || isTestingConnection}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !assetData.apiUrl || isTestingConnection
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {isTestingConnection ? "Testando..." : "Testar Conexão"}
                    </button>
                  </div>

                  {connectionStatus !== "idle" && (
                    <div
                      className={`flex items-center space-x-2 p-3 rounded-lg ${
                        connectionStatus === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {connectionStatus === "success" ? (
                        <>
                          <Wifi className="w-5 h-5" />
                          <span>Conexão estabelecida com sucesso!</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-5 h-5" />
                          <span>Falha na conexão. Verifique a URL e tente novamente.</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !assetData.networkId}
                className={`btn-primary flex items-center ${
                  currentStep === 1 && !assetData.networkId ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={connectionStatus !== "success"}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  connectionStatus !== "success"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Check className="w-4 h-4 mr-2" />
                Criar Ativo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
