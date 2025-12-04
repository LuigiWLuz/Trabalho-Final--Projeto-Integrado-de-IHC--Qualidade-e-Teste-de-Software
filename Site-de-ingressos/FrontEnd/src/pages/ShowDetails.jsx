// --- Arquivo: src/pages/ShowDetails.jsx ---

import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, ShoppingCart, ChevronUp, ChevronDown, Ban } from "lucide-react"; 
import { useState, useEffect } from "react";

export default function ShowDetails() {
  const { showSlug } = useParams();
  const navigate = useNavigate();
  
  // 🎯 NOVO: Efeito para rolar para o topo sempre que a página abrir (ou mudar de show)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showSlug]);

  // ESTADOS API
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [warning, setWarning] = useState("");
  const [selectedTickets, setSelectedTickets] = useState({});

  // ESTADO PARA O BOTÃO FLUTUANTE (FAB)
  const [isAtBottom, setIsAtBottom] = useState(false);

  // SEÇÕES PARA O SCROLL
  const sections = ["Hero", "MainContent", "TicketSection"];

  // Efeito para detectar o Scroll (Botão Flutuante)
  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setIsAtBottom(isBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Função de Clique do Botão Flutuante
  const handleFabClick = () => {
    const scrollPosition = window.scrollY + 100; 
    
    const sectionPositions = sections.map(id => {
        const element = document.getElementById(id);
        return { id, offsetTop: element ? element.offsetTop : 0 };
    });

    if (isAtBottom) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        const nextSection = sectionPositions.find(section => section.offsetTop > scrollPosition);
        
        if (nextSection) {
            document.getElementById(nextSection.id)?.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
    }
  };

  // BUSCA O SHOW NO BANCO
  useEffect(() => {
    fetch(`http://localhost:3001/api/shows/${showSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Show não encontrado");
        return res.json();
      })
      .then((data) => {
        setShowDetails(data);
        if (data.tickets) {
            const initialMap = data.tickets.reduce((acc, ticket) => {
                acc[ticket.name] = 0; 
                return acc;
            }, {});
            setSelectedTickets(initialMap);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [showSlug]);

  const totalItems = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const isSoldOut = showDetails && (!showDetails.tickets || showDetails.tickets.length === 0);

  const handleQuantityChange = (ticketName, action) => {
    setSelectedTickets((prev) => {
      const currentQty = prev[ticketName];
      let newQty = currentQty;

      if (action === "increment") {
        newQty = currentQty + 1;
      } else if (action === "decrement" && currentQty > 0) {
        newQty = currentQty - 1;
      }

      return {
        ...prev,
        [ticketName]: newQty,
      };
    });
  };

  useEffect(() => {
    if (warning && totalItems > 0) {
      setWarning("");
    }
  }, [totalItems, warning]);

  const handleCheckout = () => {
    if (isSoldOut) {
        setWarning("Ingressos esgotados para este evento.");
        return;
    }

    if (totalItems === 0) {
      setWarning("Selecione ao menos 1 ingresso");
      return; 
    }
    setWarning(""); 
    handleCheckoutNormal(); 
  };

  const handleCheckoutNormal = () => {
    const ticketsInCart = showDetails.tickets
      .map((ticket) => ({
        ...ticket,
        quantity: selectedTickets[ticket.name],
      }))
      .filter((ticket) => selectedTickets[ticket.name] > 0);

    navigate(`/checkout/${showSlug}`, {
      state: {
        cart: ticketsInCart,
        show: showDetails,
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">Carregando show...</div>;

  if (error || !showDetails) {
    return (
      <div className="min-h-screen bg-black/95 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-extrabold text-red-600">404</h1>
        <p className="text-2xl mt-4">
          Show não encontrado ou dados indisponíveis.
        </p>
        <Link to="/" className="mt-8 text-red-500 hover:text-red-400 underline text-xl">
          Voltar para Home
        </Link>
      </div>
    );
  }

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
    <main className="bg-black/95 text-white min-h-screen pb-20 relative">
      
      {/* 1. SEÇÃO DESTAQUE (HERÓI) */}
      <motion.section 
        id="Hero" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[65vh] md:h-[80vh] overflow-hidden"
      >
        <img
          src={showDetails.image}
          alt={showDetails.band}
          className={`w-full h-full object-cover object-center absolute inset-0 filter ${isSoldOut ? 'grayscale brightness-25' : 'brightness-50'} transition-all duration-700`}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-6 text-zinc-300">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-white hover:text-red-600 transition-colors cursor-pointer mx-auto"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-base uppercase font-bold">Voltar</span>
                </button>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-9xl font-extrabold text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] tracking-widest leading-none mb-6"
            >
              {showDetails.band.toUpperCase()}
            </motion.h1>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white tracking-wider"
            >
              {showDetails.venue}, {showDetails.city}
            </motion.h2>

            {/* TAG DE ESGOTADO NO HEADER */}
            {isSoldOut && (
                <motion.div 
                    variants={itemVariants}
                    className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-red-600/90 border border-red-500 rounded-lg shadow-2xl"
                >
                    <Ban className="w-8 h-8 text-white" />
                    <span className="text-2xl font-extrabold text-white tracking-widest">INGRESSOS ESGOTADOS</span>
                </motion.div>
            )}

          </motion.div>
        </div>
      </motion.section>

      {/* 2. CONTEÚDO PRINCIPAL E SIDEBAR */}
      <motion.div
        id="MainContent" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 lg:px-6 py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* INFORMAÇÕES DO EVENTO (Texto Aumentado conforme padrão IHC) */}
            <motion.div
                variants={itemVariants}
                className="bg-zinc-900 rounded-xl p-10 border border-zinc-800 shadow-xl"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-red-600 tracking-wide uppercase">
                    Detalhes do Evento
                </h2>
                
                <p className="text-white text-2xl mb-10 leading-relaxed">
                    <span className="font-bold text-red-500">DATA:</span>{" "}
                    {formatDate(showDetails.date)} <br/>
                    <span className="font-bold text-red-500">LOCAL:</span>{" "}
                    {showDetails.venue}, {showDetails.city}
                </p>
                
                <h3 className="text-3xl font-bold mb-6 text-red-500 tracking-wide uppercase">Sobre o Show</h3>
                <p className="text-zinc-300 leading-relaxed text-xl md:text-2xl text-justify">
                    {showDetails.description}
                </p>
            </motion.div>

            {/* SELEÇÃO DE INGRESSOS */}
            <motion.div
                id="TicketSection" 
                variants={itemVariants}
                className={`bg-zinc-900 rounded-xl p-10 border shadow-xl transition-colors ${isSoldOut ? 'border-zinc-700 opacity-80' : 'border-red-500'}`}
            >
                {isSoldOut ? (
                    <div className="text-center py-12 flex flex-col items-center">
                        <h2 className="text-5xl font-extrabold text-red-600 mb-6 uppercase tracking-widest drop-shadow-md">
                            INGRESSOS ESGOTADOS!
                        </h2>
                        <p className="text-2xl text-white font-medium max-w-lg">
                            A galera foi mais rápida que você...
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold mb-8 text-red-600 border-b border-zinc-700 pb-4 tracking-wide uppercase">
                            ESCOLHA SEU INGRESSO
                        </h2>
                        <div className="space-y-6">
                            {showDetails.tickets.map((ticket, index) => {
                                const currentQty = selectedTickets[ticket.name] || 0;
                                const isSelected = currentQty > 0;
                                const ticketPrice = parseFloat(ticket.price).toFixed(2).replace('.', ',');

                                return (
                                    <div
                                        key={index}
                                        className={`
                                            flex flex-col md:flex-row justify-between items-center p-6 rounded-lg transition duration-300
                                            ${isSelected ? 'bg-red-900/40 border border-red-600' : 'bg-black/50 border border-zinc-800 hover:border-red-500'}
                                        `}
                                    >
                                        <div className="text-left w-full md:w-auto mb-4 md:mb-0">
                                            <span className="font-bold text-3xl block text-white mb-2">
                                                {ticket.name}
                                            </span>
                                            <span className="text-2xl font-extrabold text-red-500">
                                                R$ {ticketPrice}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(ticket.name, "decrement")}
                                                    disabled={currentQty === 0}
                                                    className="bg-zinc-700 hover:bg-red-600 focus:ring focus:ring-red-400 text-white p-3 rounded-full h-12 w-12 flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
                                                >
                                                    <span className="text-3xl font-bold leading-none mb-2">—</span>
                                                </button>
                                                
                                                <span className="w-10 text-center text-3xl font-bold text-white">
                                                    {currentQty}
                                                </span>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityChange(ticket.name, "increment")}
                                                    className="bg-red-600 text-white hover:bg-white hover:text-black focus:ring focus:ring-red-400 p-3 rounded-full h-12 w-12 flex items-center justify-center transition cursor-pointer"
                                                >
                                                    <span className="text-3xl font-bold leading-none mb-1">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </motion.div>
          </div>

          {/* SIDEBAR (Resumo) */}
          <motion.aside variants={itemVariants} className="lg:col-span-1 space-y-10">
            
            <div className="p-8 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl space-y-8">
              <h3 className="text-2xl font-bold text-red-600 border-b border-zinc-700 pb-4 tracking-wide uppercase">
                  INFO RÁPIDA
              </h3>
              
              <div className="flex items-start space-x-4">
                <Calendar className="w-8 h-8 text-red-500 mt-1" />
                <div>
                  <p className="text-lg font-bold text-red-500 uppercase tracking-wider">DATA</p>
                  <p className="text-xl text-white">{formatDate(showDetails.date)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-8 h-8 text-red-500 mt-1" />
                <div>
                  <p className="text-lg font-bold text-red-500 uppercase tracking-wider">LOCAL</p>
                  <p className="text-xl text-white">{showDetails.venue}, {showDetails.city}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="w-8 h-8 text-red-500 mt-1" />
                <div>
                  <p className="text-lg font-bold text-red-500 uppercase tracking-wider">CLASSIFICAÇÃO</p>
                  <p className="text-xl text-white">+{showDetails.rating} ANOS</p>
                </div>
              </div>
            </div>

            <div className="sticky top-28">
                <div className={`p-8 rounded-xl shadow-2xl border transition-colors ${isSoldOut ? 'bg-zinc-800 border-zinc-600' : 'bg-red-900/20 border-red-600'}`}>
                    <h3 className={`text-2xl font-bold mb-6 flex items-center space-x-3 ${isSoldOut ? 'text-zinc-400' : 'text-white'}`}>
                        <ShoppingCart className={`w-8 h-8 ${isSoldOut ? 'text-zinc-500' : 'text-red-500'}`} />
                        <span className="uppercase">Seu Pedido</span>
                    </h3>
                    
                    <p className={`text-3xl font-extrabold mb-6 border-t border-zinc-700 pt-6 ${isSoldOut ? 'text-zinc-500' : 'text-white'}`}>
                        Itens: {totalItems}
                    </p>
                    
                    <motion.button
                        onClick={handleCheckout}
                        disabled={isSoldOut} 
                        className={`font-extrabold py-5 px-8 rounded-lg transition-colors text-2xl w-full flex items-center justify-center space-x-2 uppercase tracking-wide
                            ${isSoldOut 
                                ? "bg-zinc-600 text-zinc-400 cursor-not-allowed border border-zinc-500" 
                                : (totalItems === 0 
                                    ? "bg-zinc-700 text-white opacity-80" 
                                    : "bg-red-600 text-white hover:bg-white hover:text-black cursor-pointer")
                            }`}
                    >
                        {isSoldOut ? "ESGOTADO" : (totalItems === 0 ? "SELECIONE" : "FINALIZAR")}
                    </motion.button>

                    {warning && (
                    <div
                        role="alert"
                        className="mt-6 w-full bg-red-900/80 text-white text-lg px-4 py-3 rounded-md shadow-lg flex items-center justify-center font-semibold animate-pulse"
                    >
                        <span>{warning}</span>
                    </div>
                    )}
                </div>
            </div>

          </motion.aside>

        </div>
      </motion.div>

      {/* BOTÃO FLUTUANTE */}
      <div className="fab fixed bottom-8 right-8 z-50">
        <button
          className="btn btn-lg btn-circle bg-zinc-900/90 text-white hover:bg-red-600 shadow-xl border border-zinc-700 transition-all duration-300 group"
          onClick={handleFabClick}
          title={isAtBottom ? "Voltar ao topo" : "Ir para o rodapé"}
        >
          {isAtBottom ? (
            <ChevronUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

    </main>
  );
}