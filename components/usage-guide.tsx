import { Play, BookOpen, Users, Headphones } from "lucide-react"

export function UsageGuide() {
  const steps = [
    {
      step: "1",
      title: "Cadastro e Configuração",
      description: "Crie sua conta, configure sua empresa e defina os parâmetros dos seus compressores",
    },
    {
      step: "2",
      title: "Instalação dos Sensores",
      description: "Nossa equipe instala os sensores IoT nos seus compressores (ou você mesmo com nosso guia)",
    },
    {
      step: "3",
      title: "Conexão e Calibração",
      description: "Conecte os sensores à rede e calibre os parâmetros através do dashboard",
    },
    {
      step: "4",
      title: "Monitoramento Ativo",
      description: "Acompanhe em tempo real todos os dados e receba alertas automáticos",
    },
  ]

  const resources = [
    {
      icon: Play,
      title: "Vídeos Tutoriais",
      description: "Aprenda através de vídeos passo a passo",
      action: "Assistir Vídeos",
    },
    {
      icon: BookOpen,
      title: "Documentação",
      description: "Guias completos e manuais técnicos",
      action: "Ler Documentação",
    },
    {
      icon: Users,
      title: "Treinamento Online",
      description: "Sessões de treinamento ao vivo",
      action: "Agendar Treinamento",
    },
    {
      icon: Headphones,
      title: "Suporte Técnico",
      description: "Ajuda especializada quando precisar",
      action: "Contatar Suporte",
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Guia de Uso
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Usar o AIRscan Capivaras</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Implementação simples em 4 passos. Do cadastro ao monitoramento completo em poucos dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-6"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Recursos de Aprendizado</h3>
          <p className="text-gray-600 mb-8">Tudo que você precisa para dominar o sistema e maximizar seus resultados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg card-hover text-center">
              <resource.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h4>
              <p className="text-gray-600 mb-6">{resource.description}</p>
              <button className="btn-secondary w-full">{resource.action}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
