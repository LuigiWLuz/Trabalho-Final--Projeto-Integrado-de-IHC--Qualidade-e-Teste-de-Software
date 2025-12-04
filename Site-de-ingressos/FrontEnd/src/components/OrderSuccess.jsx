// --- Arquivo: src/components/OrderSuccess.jsx ---

import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const location = useLocation();
  const purchaseDetails = location.state; 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!purchaseDetails) {
    return (
      <div className="min-h-screen bg-black/95 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-600 uppercase mb-6 tracking-wide">Erro</h1>
        <p className="text-xl mt-4 text-zinc-400">
          Não foi possível carregar os detalhes do pedido.
        </p>
        <Link to="/" className="mt-10 text-red-500 hover:text-red-400 underline uppercase tracking-wide text-xl font-bold">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="bg-black/95 text-white min-h-screen px-4 py-16 flex items-start justify-center"
    >
      <motion.div
        variants={itemVariants}
        className="max-w-2xl w-full bg-zinc-900 rounded-xl p-8 md:p-12 border-2 border-green-600 shadow-[0_0_20px_rgba(22,163,74,0.2)] text-center"
      >
        {/* Ícone de Sucesso - CORRIGIDO CENTRALIZAÇÃO */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          // ADICIONADO: 'flex justify-center' para garantir alinhamento
          // REMOVIDO: 'mx-auto' (não é mais necessário com flex)
          className="flex justify-center text-8xl mb-6 filter drop-shadow-lg"
        >
          ✅
        </motion.div>

        {/* Título */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold text-green-500 mb-4 uppercase tracking-wider drop-shadow-md leading-tight"
        >
          Sucesso!
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-white text-xl mb-10 font-medium text-zinc-300"
        >
          Seu pedido foi processado e você já está pronto para o show!
        </motion.p>

        {/* Detalhes da Transação */}
        <motion.div
          variants={itemVariants}
          className="border-t border-b border-zinc-700 py-6 mb-8 text-left space-y-4"
        >
          <p className="flex flex-col md:flex-row md:justify-between font-medium text-white text-xl">
            <span className="text-zinc-400 uppercase text-lg mb-1 md:mb-0">Banda:</span>
            <span className="text-red-500 uppercase tracking-wide font-bold">{purchaseDetails.band}</span>
          </p>
          <p className="flex flex-col md:flex-row md:justify-between font-medium text-white text-xl">
            <span className="text-zinc-400 uppercase text-lg mb-1 md:mb-0">Pedido ID:</span>
            <span className="text-white font-bold">{purchaseDetails.orderId}</span>
          </p>
          <p className="flex flex-col md:flex-row md:justify-between font-medium text-white text-xl">
            <span className="text-zinc-400 uppercase text-lg mb-1 md:mb-0">Total Pago:</span>
            <span className="text-green-500 font-bold">R$ {purchaseDetails.totalPaid}</span>
          </p>
          
          <div className="pt-4 text-center">
            <p className="text-zinc-400 text-base italic mb-2">
                Os ingressos foram enviados para:
            </p>
            <span className="text-white font-bold text-xl not-italic border-b border-zinc-600 pb-1">
              {purchaseDetails.email}
            </span>
          </div>
        </motion.div>

        {/* Botão */}
        <Link
          to="/"
          className="w-full inline-block bg-red-600 text-white hover:bg-white hover:text-black font-extrabold py-4 rounded-xl transition-all text-xl uppercase tracking-widest shadow-xl hover:scale-[1.02]"
        >
          VOLTAR PARA A HOME
        </Link>
      </motion.div>
    </motion.main>
  );
}