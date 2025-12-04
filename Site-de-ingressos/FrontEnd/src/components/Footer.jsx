// --- Arquivo: src/components/Footer.jsx ---

import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    // MUDANÇA AQUI:
    // De: border-t-8 border-red-600
    // Para: border-t border-red-500
    <footer className="bg-zinc-950 text-zinc-400 border-t border-red-500 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        
        {/* Coluna 1 */}
        <div className="col-span-2 md:col-span-2 space-y-5">
          <Link to="/" className="text-4xl font-extrabold text-red-500 tracking-widest block">
            METAL TICKETS
          </Link>
          <p className="text-base leading-relaxed text-zinc-300">
            Seu portal oficial de ingressos para os maiores eventos de rock, metal e hardcore do país.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-zinc-500 hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-2c-2.196 0-3 .54-3 2.21v2.79h5l-.711 5h-4.289v8h-5v-8h-2v-5h2v-2.138c0-2.358 1.486-3.862 4.195-3.862h3.805v3z"/></svg>
            </a>
             <a href="#" className="text-zinc-500 hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.795-1.574 2.164-2.722-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.992-14.655z"/></svg>
            </a>
          </div>
        </div>
        
        {/* Coluna 2 */}
        <div className="col-span-1 space-y-4">
          <h4 className="text-xl font-bold text-white mb-4 border-b border-red-700 pb-2">NAVEGAÇÃO</h4>
          <Link to="/" className="block text-base hover:text-red-500 transition-colors">Home</Link>
          <a href="#Shows" className="block text-base hover:text-red-500 transition-colors">Shows</a>
          <a href="#Faq" className="block text-base hover:text-red-500 transition-colors">FAQ</a>
        </div>
        
        {/* Coluna 3 */}
        <div className="col-span-1 space-y-4">
          <h4 className="text-xl font-bold text-white mb-4 border-b border-red-700 pb-2">SUPORTE</h4>
          <a href="#" className="block text-base hover:text-red-500 transition-colors">Termos de Uso</a>
          <a href="#" className="block text-base hover:text-red-500 transition-colors">Política de Privacidade</a>
          <a href="#" className="block text-base hover:text-red-500 transition-colors">Reembolso</a>
        </div>
        
        {/* Coluna 4 */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <h4 className="text-xl font-bold text-white mb-4 border-b border-red-700 pb-2">CONTATO</h4>
          <div className="flex items-center space-x-3 text-base">
            <Mail className="w-5 h-5 text-red-500" />
            <span>contato@metaltickets.com</span>
          </div>
          <div className="flex items-center space-x-3 text-base">
            <Phone className="w-5 h-5 text-red-500" />
            <span>(11) 99999-9999</span>
          </div>
          <div className="flex items-start space-x-3 text-base">
            <MapPin className="w-5 h-5 text-red-500 mt-1" />
            <span>Av. Paulista, 1000 - SP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}