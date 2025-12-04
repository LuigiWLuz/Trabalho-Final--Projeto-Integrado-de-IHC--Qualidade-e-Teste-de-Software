// --- Arquivo: src/components/FAQ.jsx ---

import { motion } from "framer-motion";
import FaqDropDown from "./FAQDropDown";
import faqs from "../data/FAQ";
import { Search, CreditCard, Ticket } from "lucide-react"; 
import Button1 from "./buttons/button1"; 

// 1. COMO COMPRAR
export function HowToBuy() {
    
    const handleScrollToShows = () => {
        const showsSection = document.getElementById('Shows');
        if (showsSection) {
            showsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-full bg-black py-16">
            {/* REMOVIDO: motion.div wrapper geral que animava tudo de baixo para cima */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Cabeçalho */}
                <div className="mb-16 border-b border-zinc-900 pb-10 text-center">
                    {/* ADICIONADO: Animação motion.h2 idêntica ao FAQ (Vindo de cima y: -30) */}
                    <motion.h2
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-6xl font-extrabold text-red-600 tracking-wider leading-tight drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                    >
                        COMO COMPRAR SEU INGRESSO EM 3 PASSOS
                    </motion.h2>
                </div>
                
                {/* ADICIONADO: Motion para os passos aparecerem suavemente depois do título */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
                >

                    {/* Passo 1 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Search className="w-12 h-12 text-white stroke-[1.5]" />
                        <h3 className="text-2xl font-bold text-red-600 tracking-wide drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]">
                            SELECIONE O SHOW
                        </h3>
                        <p className="text-white text-lg max-w-sm">
                            Navegue pelo nosso catálogo e utilize os filtros para encontrar sua banda favorita.
                        </p>
                    </div>

                    {/* Passo 2 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <CreditCard className="w-12 h-12 text-white stroke-[1.5]" />
                        <h3 className="text-2xl font-bold text-red-600 tracking-wide drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]">
                            ESCOLHA E COMPRE SEU INGRESSO
                        </h3>
                        <p className="text-white text-lg max-w-sm">
                            Finalize a compra de forma rápida e segura.
                        </p>
                    </div>

                    {/* Passo 3 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Ticket className="w-12 h-12 text-white stroke-[1.5]" />
                        <h3 className="text-2xl font-bold text-red-600 tracking-wide drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]">
                            RECEBA SEU INGRESSO DIGITAL
                        </h3>
                        <p className="text-white text-lg max-w-sm">
                            Acesse seu ingresso pelo e-mail recebido e apresente o QR Code na entrada do show.
                        </p>
                    </div>
                </motion.div>

                <div className="mt-8 border-t border-zinc-900 pt-10 text-center">
                    <span onClick={handleScrollToShows} className="inline-block cursor-pointer">
                        <Button1 text="Comprar agora" />
                    </span>
                </div>
            </div>
        </div>
    );
}

// 2. PERGUNTAS FREQUENTES
export default function FAQ() {
  return (
    <div className="w-full bg-black py-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl font-extrabold tracking-wider text-red-600 mb-6 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
            >
              PERGUNTAS FREQUENTES
            </motion.h1>
            {/* MUDANÇA: text-xl */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
            >
              Tire suas dúvidas sobre o processo de compra e acesso aos eventos.
            </motion.p>
          </div>

          <div className="mx-auto max-w-5xl px-4">
            {faqs.map((faq) => (
              <FaqDropDown
                key={faq.id}
                title={faq.title}
                description={faq.description}
              />
            ))}
          </div>

      </div>
    </div>
  );
}

// 3. AINDA TEM DÚVIDAS
export function StillHaveQuestions() {
    return (
        <div id="ContatoSection" className="w-full bg-black py-20 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                
                <motion.h1
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-5xl md:text-7xl font-extrabold tracking-wider text-red-600 mb-8 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                >
                  AINDA TEM DÚVIDAS?
                </motion.h1>
                
                {/* MUDANÇA: text-xl */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto"
                >
                    Nossa equipe de suporte está pronta para ajudar você. Entre em contato.
                </motion.p>

                <div>
                    <Button1 text="Contato" />
                </div>
            </div>
        </div>
    );
}