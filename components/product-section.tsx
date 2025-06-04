import { CheckCircle, Cpu, Wifi, BarChart3, ArrowRight } from "lucide-react"

export function ProductSection() {
  const features = [
    "Monitoramento 24/7 em tempo real",
    "Alertas inteligentes por WhatsApp/Email",
    "Dashboard interativo e intuitivo",
    "Relatórios automáticos personalizados",
    "API REST para integrações",
    "Análise preditiva com IA",
    "Histórico completo de dados",
    "Suporte técnico especializado",
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4 text-2lg">
            Produto Principal
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AIRscan Capivaras</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo de monitoramento inteligente para compressores de ar comprimido, desenvolvido especialmente
            para a indústria brasileira
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Recursos Principais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary flex items-center">
              Solicitar Demonstração
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Cpu,
                title: "Sensores IoT",
                desc: "Sensores de pressão, temperatura, vibração e consumo energético de alta precisão",
                color: "text-blue-500",
              },
              {
                icon: Wifi,
                title: "Conectividade",
                desc: "Conexão via WiFi, 4G/5G ou Ethernet com redundância automática",
                color: "text-green-500",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                desc: "Análise avançada de dados com machine learning para otimização",
                color: "text-purple-500",
              },
              {
                icon: CheckCircle,
                title: "Certificação",
                desc: "Equipamentos certificados ANATEL e em conformidade com normas industriais",
                color: "text-orange-500",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg card-hover">
                <item.icon className={`w-8 h-8 mb-4 ${item.color}`} />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
