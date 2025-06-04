import { Check, Star, Zap, Shield, ArrowRight } from "lucide-react"

export function SaasCommercial() {
  const plans = [
    {
      name: "Starter",
      price: "R$ 297",
      period: "/mês",
      description: "Ideal para pequenas empresas",
      features: [
        "Até 3 compressores",
        "Dashboard básico",
        "Alertas por email",
        "Relatórios mensais",
        "Suporte por email",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "R$ 597",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Até 10 compressores",
        "Dashboard avançado",
        "Alertas WhatsApp + Email",
        "Relatórios personalizados",
        "API de integração",
        "Suporte prioritário",
        "Análise preditiva",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "",
      description: "Para grandes operações",
      features: [
        "Compressores ilimitados",
        "Dashboard personalizado",
        "Alertas multi-canal",
        "Relatórios em tempo real",
        "API completa",
        "Suporte 24/7",
        "IA avançada",
        "Integração ERP/MES",
      ],
      popular: false,
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos SaaS</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para sua empresa. Sem taxa de instalação, sem fidelidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-lg relative ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Mais Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {plan.name === "Enterprise" ? "Falar com Vendas" : "Começar Agora"}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Venda de Equipamentos e Sensores</h3>
          <p className="text-xl mb-8 opacity-90">
            Além do software, fornecemos todos os sensores IoT e equipamentos necessários para implementação completa
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Zap, text: "Instalação Profissional" },
              { icon: Shield, text: "Garantia de 2 Anos" },
              { icon: Check, text: "Suporte Técnico" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-2">
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center mx-auto">
            Solicitar Orçamento de Equipamentos
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
