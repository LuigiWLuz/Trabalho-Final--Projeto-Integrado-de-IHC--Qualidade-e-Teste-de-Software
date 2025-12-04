// --- Arquivo: src/pages/Home.jsx ---

import { useState, useMemo, useEffect } from "react"; 
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade"; 
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

import ParallaxImage from "../components/ParallaxImage"; 
import ShowCard from "../components/ShowCard";
import FAQ, { HowToBuy, StillHaveQuestions } from "../components/FAQ"; 
import Button1 from "../components/buttons/button1";
import CtaBg from '../imgs/fotin.png'; 

export default function Home({ filterCities, filterRatings, onFilterChange, searchTerm }) {
  
  const [showsList, setShowsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // 🎯 LISTA CORRIGIDA COM LINKS DIRETOS E OTIMIZADOS
// 🎯 LISTA DEFINITIVA: VIBE ROCK/METAL
  const BANNER_IMAGES = [
    "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",

    "https://images.unsplash.com/photo-1549451371-64aa98a6f660?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    
    "https://chasingthelightart.s3.eu-central-1.amazonaws.com/wp-content/uploads/20220328190819/FFAK_3-26-22-23-696x492.jpg",

    "https://images.unsplash.com/photo-1506091403742-e3aa39518db5?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWV0YWwlMjBjb25jZXJ0fGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
    
    "https://www.salon.com/app/uploads/2012/10/metal-in-india.jpg",
    
  
  ];
  const sections = ["Home", "Shows", "HowToBuy", "Faq", "ContatoSection", "Newsletter"];
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      setIsAtBottom(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    fetch('http://localhost:3001/api/shows')
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao conectar com o servidor");
        return res.json();
      })
      .then((data) => {
        setShowsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar os shows. Verifique se o Backend está rodando.");
        setLoading(false);
      });
  }, []);

  const filteredShows = useMemo(() => {
    let results = showsList;
    const normalizedSearchTerm = searchTerm ? searchTerm.trim() : "";

    if (normalizedSearchTerm) {
        results = results.filter((show) => 
            show && show.band.toLowerCase().includes(normalizedSearchTerm)
        );
    }
    
    if (filterCities && filterCities.length > 0) {
      results = results.filter((show) => filterCities.includes(show.city));
    }

    if (filterRatings && filterRatings.length > 0) {
      results = results.filter((show) => filterRatings.includes(show.rating));
    }

    return results;
  }, [searchTerm, filterCities, filterRatings, showsList]); 

  const featuredShows = useMemo(() => {
    return showsList.slice(0, 5); 
  }, [showsList]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando shows do banco de dados...</div>;
  if (error) return <div className="min-h-screen bg-black text-red-600 flex items-center justify-center">{error}</div>;

  return (
    <div className="text-white min-h-screen pb-20 relative"> 
      
      {/* 1. SEÇÃO DESTAQUES */}
      <section id="Home" className="text-center">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={1500}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          className="w-full shadow-2xl border-b border-zinc-900" 
        >
          {featuredShows.map((show, index) => (
            <SwiperSlide key={show.bandSlug} className="relative">
              <ParallaxImage 
                  // Usa o % para garantir que nunca falte imagem, mesmo se tiver muitos shows
                  imageUrl={BANNER_IMAGES[index % BANNER_IMAGES.length]}
                  altText={`Destaque: Show de ${show.band}`} 
                  yOffset={80} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* BOTÃO FLUTUANTE (FAB) */}
      <div className="fab fixed bottom-8 right-8 z-50">
        <button
          className="btn btn-lg btn-circle bg-zinc-900/90 text-white hover:bg-red-600 shadow-xl border border-zinc-700 transition-all duration-300 group"
          onClick={handleFabClick}
          title={isAtBottom ? "Voltar ao topo" : "Próxima seção"}
        >
          {isAtBottom ? (
            <ChevronUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* 2. SEÇÃO SHOWS FILTRADOS */}
      <section id="Shows" className="text-center pt-20 pb-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 lg:px-6"> 
            
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl font-extrabold tracking-wider text-red-600 mb-6 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)] uppercase"
            >
              Todos os Shows
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-white mb-12 max-w-3xl mx-auto font-medium"
            >
              Use a barra de pesquisa no topo ou os filtros laterais para encontrar seu evento.
            </motion.p>
            
            <div className="relative px-12 md:px-16 mt-10">
              
              <button 
                className={`arrow-left absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-red-600 hover:scale-110 transition-all cursor-pointer ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <ChevronLeft className="w-10 h-10 md:w-12 md:h-12" strokeWidth={3} />
              </button>

              <button 
                className={`arrow-right absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-red-600 hover:scale-110 transition-all cursor-pointer ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <ChevronRight className="w-10 h-10 md:w-12 md:h-12" strokeWidth={3} />
              </button>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  nextEl: '.arrow-right',
                  prevEl: '.arrow-left',
                }}
                
                onSwiper={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}

                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 }, 
                }}
                className="custom-swiper w-full rounded-xl"
              >
                {filteredShows.length > 0 ? (
                  filteredShows.map((show) => (
                    <SwiperSlide key={show.bandSlug}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-black border border-zinc-800 hover:border-red-500 transition-colors cursor-pointer my-4 mx-2 text-left rounded-lg shadow-md"
                      >
                        <ShowCard show={show} />
                      </motion.div>
                    </SwiperSlide>
                  ))
                  ) : (
                  <SwiperSlide key={"SNF"} className="!w-full flex justify-center py-10">
                    <div className="bg-red-600 border-4 border-red-800 rounded-xl p-8 max-w-lg mx-auto shadow-[0_0_20px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center animate-in zoom-in duration-300">
                        <AlertCircle className="w-16 h-16 text-white mb-4 drop-shadow-md" strokeWidth={2.5} />
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center uppercase tracking-widest drop-shadow-md">
                            Nenhum Show Encontrado
                        </h3>
                        <p className="text-white/90 text-lg text-center mt-2 font-semibold">
                            Tente ajustar seus filtros ou termo de busca.
                        </p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
        </div> 
      </section>

      <section id="HowToBuy" className="py-20 max-w-7xl mx-auto px-4 lg:px-6 bg-black/90 my-10 rounded-xl">
        <HowToBuy />
      </section>

      <section id="Faq" className="py-20 max-w-7xl mx-auto px-4 lg:px-6 bg-black/90 my-10 rounded-xl">
        <FAQ />
      </section>

      <div id="ContatoSection" className="text-center py-20 bg-black/90">
        <StillHaveQuestions />
      </div>

      <section id="Newsletter" className="relative py-20 overflow-hidden" style={{ height: 'auto' }}>
          <div className="absolute inset-0 bg-cover bg-center filter brightness-50" style={{ backgroundImage: `url('${CtaBg}')` }}></div>
          <div className="absolute inset-0 bg-black/50"></div> 
          
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.7 }}
             className="relative z-10 max-w-4xl mx-auto text-center p-8 bg-black border border-red-600 rounded-xl shadow-2xl" 
          >
             <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]">
                FIQUE POR DENTRO
             </h2>
             <p className="text-white mb-6 text-xl">Inscreva-se em nossa newsletter.</p>
             <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                 <input type="email" placeholder="Seu melhor e-mail" className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white w-full sm:w-2/3 text-lg" />
                 <Button1 text="ASSINAR" className="w-full sm:w-1/3 text-xl" />
             </div>
          </motion.div>
      </section>
    </div>
  );
}