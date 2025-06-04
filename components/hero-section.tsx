import { Activity, Gauge, Shield, Zap, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="gradient-bg text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Monitoramento Inteligente de
            <span className="block text-yellow-300">Ar Comprimido</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Transforme sua operação com o AIRscan Capivaras - Sistema SaaS completo para monitoramento em tempo real de
            compressores de ar comprimido
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
              Começar Monitoramento
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Ver Demonstração
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Activity, title: "Tempo Real", desc: "Dados atualizados instantaneamente" },
            { icon: Gauge, title: "Eficiência", desc: "Otimize o consumo energético" },
            { icon: Shield, title: "Prevenção", desc: "Manutenção preditiva avançada" },
            { icon: Zap, title: "IoT Integrado", desc: "Sensores inteligentes conectados" },
          ].map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <item.icon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
