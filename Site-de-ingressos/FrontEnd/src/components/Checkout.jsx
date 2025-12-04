// --- Arquivo: src/components/Checkout.jsx ---

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Banknote, QrCode, ChevronUp, ChevronDown } from "lucide-react"; 

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart: ticketsInCart, show: showDetails } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false); 
  
  const [isAtBottom, setIsAtBottom] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    paymentMethod: "credit_card",
  });

  // Rolar para o topo ao iniciar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Monitorar se chegou ao fundo
  useEffect(() => {
    const handleScroll = () => {
      // Margem de erro de 20px para garantir detecção em monitores diferentes
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
      setIsAtBottom(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LÓGICA DE NAVEGAÇÃO SEQUENCIAL RIGOROSA ---
  const handleFabClick = () => {
    if (isAtBottom) {
        // 4. Se está no fundo -> Sobe tudo
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    const personalSection = document.getElementById("section-personal");
    const paymentSection = document.getElementById("section-payment");
    
    // Offset para descontar o tamanho da Navbar fixa (aprox 100px) e dar um respiro
    const offset = 120; 
    const currentScroll = window.scrollY;

    // 1. Tentar ir para SEUS DADOS
    // Se a posição atual for menor que a posição da seção 'Dados' (menos o offset)
    if (personalSection && currentScroll < personalSection.offsetTop - offset - 50) {
        window.scrollTo({
            top: personalSection.offsetTop - offset,
            behavior: "smooth"
        });
        return;
    }

    // 2. Tentar ir para PAGAMENTO
    // Se já passou dos Dados, mas ainda está antes do Pagamento
    if (paymentSection && currentScroll < paymentSection.offsetTop - offset - 50) {
        window.scrollTo({
            top: paymentSection.offsetTop - offset,
            behavior: "smooth"
        });
        return;
    }

    // 3. Se já passou de tudo -> Vai para o FUNDO (Footer/Botão Confirmar)
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  let subtotal = 0;
  if (ticketsInCart) {
    subtotal = ticketsInCart.reduce((sum, ticket) => {
      return sum + parseFloat(ticket.price) * ticket.quantity;
    }, 0);
  }

  const fees = 50.0;
  const total = subtotal + fees;

  if (!ticketsInCart || ticketsInCart.length === 0 || !showDetails) {
    return (
      <div className="min-h-screen bg-black/95 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-600 mb-6 uppercase">Carrinho Vazio</h1>
        <p className="text-xl text-zinc-400 max-w-lg text-center">
          Por favor, volte e adicione ingressos ao seu carrinho para finalizar a compra.
        </p>
        <Link
          to="/"
          className="mt-10 px-8 py-4 bg-zinc-800 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-xl uppercase tracking-wider"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData = {
        customer: formData,
        items: ticketsInCart,
        total: total,
        showBand: showDetails.band
    };

    try {
        const response = await fetch('http://localhost:3001/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            navigate('/success', { state: result });
        } else {
            alert("Erro ao processar pagamento: " + (result.error || "Erro desconhecido"));
        }
    } catch (error) {
        console.error("Erro no checkout:", error);
        alert("Erro de conexão com o servidor.");
    } finally {
        setIsProcessing(false); 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="bg-black/95 text-white min-h-screen px-4 lg:px-6 py-16 relative"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* BOTÃO VOLTAR */}
        <motion.div variants={itemVariants} className="mb-10">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center space-x-3 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer group"
                aria-label="Voltar para a página anterior"
            >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                <span className="text-lg font-bold uppercase tracking-wide">Voltar</span>
            </button>
        </motion.div>

        {/* TÍTULO */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold text-red-600 mb-12 text-center uppercase tracking-wider drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]"
        >
          Finalizar Compra
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* 1. RESUMO DO PEDIDO */}
          <motion.div 
            id="section-summary" 
            variants={itemVariants} 
            className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold text-white mb-8 border-b border-zinc-700 pb-4 uppercase tracking-wide flex items-center gap-3">
               <span className="text-red-600 text-4xl">01.</span> Resumo do Pedido
            </h2>

            <div className="mb-8">
                <p className="text-2xl font-bold text-white mb-2">{showDetails.band.toUpperCase()}</p>
                <p className="text-xl text-zinc-400">
                {formatDate(showDetails.date)} <span className="text-red-600 px-2">•</span> {showDetails.venue}, {showDetails.city}
                </p>
            </div>

            <div className="space-y-4 border-b border-zinc-800 pb-6 mb-6">
              {ticketsInCart.map((ticket, index) => (
                <div key={index} className="flex justify-between items-center text-lg md:text-xl text-zinc-300">
                  <span className="flex items-center gap-3">
                    <span className="bg-zinc-800 text-white font-bold px-3 py-1 rounded text-base">{ticket.quantity}x</span> 
                    {ticket.name}
                  </span>
                  <span className="font-bold text-white">
                    R$ {(parseFloat(ticket.price) * ticket.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-lg md:text-xl">
              <p className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </p>
              <p className="flex justify-between text-zinc-400">
                <span>Taxa de Serviço</span>
                <span>R$ {fees.toFixed(2).replace(".", ",")}</span>
              </p>
            </div>
            
            <div className="flex justify-between items-center text-3xl md:text-4xl font-extrabold pt-6 mt-6 border-t border-red-900/50">
              <span className="text-white">TOTAL</span>
              <span className="text-red-500">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </motion.div>

          {/* 2. DADOS DO COMPRADOR */}
          <motion.div 
            id="section-personal" 
            variants={itemVariants} 
            className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold text-white mb-8 border-b border-zinc-700 pb-4 uppercase tracking-wide flex items-center gap-3">
               <span className="text-red-600 text-4xl">02.</span> Seus Dados
            </h2>
            
            <div className="space-y-6">
              <div>
                  <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wide ml-1">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-black border border-zinc-700 rounded-lg text-white text-xl placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                    placeholder="Digite seu nome"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wide ml-1">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-black border border-zinc-700 rounded-lg text-white text-xl placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        placeholder="seu@email.com"
                      />
                  </div>
                  <div>
                      <label className="block text-zinc-400 text-sm font-bold mb-2 uppercase tracking-wide ml-1">CPF</label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-black border border-zinc-700 rounded-lg text-white text-xl placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        placeholder="000.000.000-00"
                      />
                  </div>
              </div>
            </div>
          </motion.div>

          {/* 3. PAGAMENTO */}
          <motion.div 
            id="section-payment" 
            variants={itemVariants} 
            className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-2xl"
          >
            <h2 className="text-3xl font-extrabold text-white mb-8 border-b border-zinc-700 pb-4 uppercase tracking-wide flex items-center gap-3">
               <span className="text-red-600 text-4xl">03.</span> Forma de Pagamento
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${formData.paymentMethod === "credit_card" ? "bg-red-900/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]" : "bg-black border-zinc-800 hover:border-zinc-600"}`}>
                <input type="radio" name="paymentMethod" value="credit_card" checked={formData.paymentMethod === "credit_card"} onChange={handleChange} className="hidden" />
                <CreditCard className={`w-10 h-10 mb-3 ${formData.paymentMethod === "credit_card" ? "text-red-500" : "text-zinc-500"}`} />
                <span className={`text-lg font-bold uppercase ${formData.paymentMethod === "credit_card" ? "text-white" : "text-zinc-400"}`}>Cartão</span>
              </label>

              <label className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${formData.paymentMethod === "pix" ? "bg-red-900/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]" : "bg-black border-zinc-800 hover:border-zinc-600"}`}>
                <input type="radio" name="paymentMethod" value="pix" checked={formData.paymentMethod === "pix"} onChange={handleChange} className="hidden" />
                <QrCode className={`w-10 h-10 mb-3 ${formData.paymentMethod === "pix" ? "text-red-500" : "text-zinc-500"}`} />
                <span className={`text-lg font-bold uppercase ${formData.paymentMethod === "pix" ? "text-white" : "text-zinc-400"}`}>PIX</span>
              </label>

              <label className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${formData.paymentMethod === "bank_slip" ? "bg-red-900/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]" : "bg-black border-zinc-800 hover:border-zinc-600"}`}>
                <input type="radio" name="paymentMethod" value="bank_slip" checked={formData.paymentMethod === "bank_slip"} onChange={handleChange} className="hidden" />
                <Banknote className={`w-10 h-10 mb-3 ${formData.paymentMethod === "bank_slip" ? "text-red-500" : "text-zinc-500"}`} />
                <span className={`text-lg font-bold uppercase ${formData.paymentMethod === "bank_slip" ? "text-white" : "text-zinc-400"}`}>Boleto</span>
              </label>
            </div>
          </motion.div>

          {/* BOTÃO FINALIZAR */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={isProcessing}
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
            className={`w-full font-extrabold py-6 rounded-lg text-2xl uppercase tracking-widest shadow-2xl transition-all ${
                isProcessing 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" 
                : "bg-red-600 text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            }`}
          >
            {isProcessing ? "Processando..." : "Confirmar Pagamento"}
          </motion.button>

          <motion.div variants={itemVariants} className="text-center space-y-2 pt-4 pb-10">
            <p className="text-zinc-500 text-sm">Ao clicar em confirmar, você concorda com nossos termos de uso.</p>
          </motion.div>
          
        </form>
      </div>

      {/* FAB - BOTÃO FLUTUANTE */}
      <div className="fixed bottom-8 right-8 z-50">
          <button
              onClick={handleFabClick}
              title={isAtBottom ? "Voltar ao topo" : "Próxima etapa"}
              className="btn btn-lg btn-circle bg-zinc-900/90 text-white hover:bg-red-600 shadow-xl border border-zinc-700 transition-all duration-300 group"
          >
              {isAtBottom ? (
                  <ChevronUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
              ) : (
                  <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
              )}
          </button>
      </div>

    </motion.main>
  );
}