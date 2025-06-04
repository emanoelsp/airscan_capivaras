import Link from "next/link"
import { Activity, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AIRscan Capivaras</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Sistema SaaS líder em monitoramento inteligente de compressores de ar comprimido. Transformando a
              indústria brasileira com tecnologia IoT avançada.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <button
                  key={index}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              {["Início", "Dashboard", "Rede de Monitoramento", "Relatórios", "Alertas", "Sobre"].map((link, index) => (
                <li key={index}>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Suporte</h3>
            <ul className="space-y-2 text-sm">
              {["Central de Ajuda", "Documentação", "Tutoriais", "API", "Status do Sistema", "Contato"].map(
                (link, index) => (
                  <li key={index}>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-gray-400 text-sm">Receba atualizações sobre novos recursos e dicas de otimização.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Inscrever
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          {/* Informações de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Mail, title: "Email", info: "contato@airscan-capivaras.com.br" },
              { icon: Phone, title: "Telefone", info: "+55 (47) 9999-9999" },
              { icon: MapPin, title: "Endereço", info: "Blumenau, SC - Brasil" },
            ].map((contact, index) => (
              <div key={index} className="flex items-center space-x-3">
                <contact.icon className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium">{contact.title}</p>
                  <p className="text-sm text-gray-400">{contact.info}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Copyright e Links Legais */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400">© 2025 AIRscan Capivaras. Todos os direitos reservados.</p>
            <div className="flex space-x-6 text-sm">
              {["Política de Privacidade", "Termos de Uso", "Cookies", "Licenças"].map((link, index) => (
                <Link key={index} href="/" className="text-gray-400 hover:text-white transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
