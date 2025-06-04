import { Trophy, Target, Users, ArrowRight } from "lucide-react"

export function TxmChallenge() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Desafio TXM</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participe do nosso desafio de transformação digital em parceria com o UNISenai SC para otimização de
            processos industriais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Trophy,
              title: "Competição",
              desc: "Desafie outras empresas na otimização do consumo energético e eficiência operacional",
              color: "text-yellow-500",
            },
            {
              icon: Target,
              title: "Metas",
              desc: "Estabeleça e alcance metas de redução de custos e melhoria da produtividade",
              color: "text-blue-500",
            },
            {
              icon: Users,
              title: "Comunidade",
              desc: "Conecte-se com outros profissionais e compartilhe experiências e soluções",
              color: "text-green-500",
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg card-hover text-center">
              <item.icon className={`w-16 h-16 mx-auto mb-6 ${item.color}`} />
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 mb-6">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Partnership Section */}
        <div className="bg-blue-50 rounded-xl p-8 mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Parceria UNISenai SC</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              O Desafio TXM é desenvolvido em parceria com o UNISenai SC, unindo a excelência acadêmica com a inovação
              tecnológica para transformar a indústria catarinense através da digitalização e otimização de processos de
              ar comprimido.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center mx-auto">
            Participar do Desafio TXM
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
