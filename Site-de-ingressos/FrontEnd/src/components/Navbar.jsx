import { Link } from "react-router-dom";
import { useState } from "react"; 
import Button2 from "./buttons/button2"; 
import { Menu, X, SlidersHorizontal, Contrast } from "lucide-react"; 
import FilterSidebar from "./FilterSidebars"; 
import AppLogo from '../imgs/logo.png'; 
import SearchBar from "./SearchBar"; 

export default function Navbar({ 
  filterCity, 
  filterRating, 
  onFilterChange, 
  onToggleDrawer, 
  onToggleContrast, 
  isContrastMode,
  searchTerm,
  onSearchChange,
  onClearSearch
}) { 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleNavClick = (targetId) => {
      setIsMenuOpen(false);
      if (targetId === "Home") {
         window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
         document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }
  };

  const handleMobileFilterClick = () => {
      setIsMenuOpen(false); // Fecha o menu hambúrguer
      onToggleDrawer();     // Abre a sidebar de filtros
  };

  return (
    <>
      {/* HEADER: Z-50 para ficar acima de tudo */}
      <header className="bg-black/95 backdrop-blur-md text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-red-500 h-24">
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          
          {/* BOTÃO HAMBÚRGUER: Z-60 para ficar acima do próprio menu aberto */}
          <button
            onClick={toggleMenu} 
            className="p-2 md:hidden text-red-600 hover:text-white transition-colors z-[60] cursor-pointer"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
          
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity flex-shrink-0" 
            id="siteName"
          >
            <img src={AppLogo} alt="Metal Tickets Logo" className="h-20 w-auto" />
          </Link>

          <div className="hidden md:block w-72 lg:w-96">
            <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                onClearSearch={onClearSearch}
                className="mb-0" 
            />
          </div>
        </div>
        
        {/* NAVEGAÇÃO DESKTOP */}
        <div className="flex items-center space-x-6">

          <nav className="space-x-8 hidden md:block">
              <button className="text-xl hover:text-red-500 transition-colors cursor-pointer font-bold uppercase tracking-wide" onClick={() => handleNavClick("Home")}>Home</button>
              <button className="text-xl hover:text-red-500 transition-colors cursor-pointer font-bold uppercase tracking-wide" onClick={() => handleNavClick("Shows")}>Shows</button>
              <button className="text-xl hover:text-red-500 transition-colors cursor-pointer font-bold uppercase tracking-wide" onClick={() => handleNavClick("Faq")}>FAQ</button>
          </nav>

          <div className="space-x-4 hidden md:flex items-center">
              <Button2 text="ENTRAR" /> 

              <button
                  onClick={onToggleDrawer} 
                  aria-label="Abrir filtros laterais"
                  className="btn btn-ghost bg-zinc-900 border border-white hover:bg-red-600 hidden md:inline-flex cursor-pointer text-white px-6"
              >
                  <SlidersHorizontal className="w-6 h-6" />
                  <span className="ml-2 hidden lg:inline text-lg font-bold">FILTROS</span> 
              </button>

              <button
                  onClick={onToggleContrast}
                  aria-label="Alternar Alto Contraste"
                  className={`border transition-colors p-3 rounded-full flex items-center justify-center cursor-pointer
                    ${isContrastMode 
                        ? "bg-yellow-400 border-yellow-400 text-black hover:bg-white hover:border-white" 
                        : "bg-zinc-900 border-white text-white hover:bg-red-600 hover:border-red-600"
                    }`}
              >
                  <Contrast className="w-6 h-6" />
              </button>
          </div>
        </div>
      </header>

      {/* MENU MOBILE EXPANDIDO */}
      {isMenuOpen && (
        // 🎯 MUDANÇA: 'fixed' garante que cubra a tela corretamente
        // top-24 (96px) faz começar logo abaixo do header
        <div className="md:hidden fixed top-24 left-0 w-full h-[calc(100vh-6rem)] bg-zinc-950 border-b border-red-500 shadow-2xl z-40 overflow-y-auto pb-10">
          <ul className="flex flex-col p-6 space-y-4">
             
             <div className="mb-6">
                <SearchBar 
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    onClearSearch={onClearSearch}
                />
             </div>

            <li className="p-3 hover:bg-zinc-900 rounded-lg border-b border-zinc-800">
                <button onClick={() => handleNavClick("Home")} className="text-white text-2xl font-bold uppercase block w-full text-left cursor-pointer">Home</button>
            </li>
            <li className="p-3 hover:bg-zinc-900 rounded-lg border-b border-zinc-800">
                <button onClick={() => handleNavClick("Shows")} className="text-white text-2xl font-bold uppercase block w-full text-left cursor-pointer">Shows</button>
            </li>
            <li className="p-3 hover:bg-zinc-900 rounded-lg border-b border-zinc-800">
                <button onClick={() => handleNavClick("Faq")} className="text-white text-2xl font-bold uppercase block w-full text-left cursor-pointer">FAQ</button>
            </li>
            
            <div className="pt-6 space-y-4 mt-4">
                <div className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button2 text="ENTRAR" />
                </div>

                <button
                    onClick={handleMobileFilterClick} 
                    className="flex items-center justify-center w-full p-4 bg-zinc-900 border-2 border-white hover:bg-red-600 text-white rounded-none transition-colors group cursor-pointer"
                >
                    <SlidersHorizontal className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold uppercase tracking-wider">FILTROS</span> 
                </button>

                <button
                    onClick={onToggleContrast}
                    className={`flex items-center justify-center w-full p-4 border-2 rounded-none transition-colors gap-3 cursor-pointer
                        ${isContrastMode 
                            ? "bg-yellow-400 text-black border-yellow-400 font-extrabold" 
                            : "bg-zinc-800 text-white border-zinc-600 hover:border-white"}`
                    }
                >
                    <Contrast className="w-6 h-6" />
                    <span className="text-xl font-bold uppercase">
                        {isContrastMode ? "" : ""}
                    </span>
                </button>
            </div>

          </ul>
        </div>
      )}
    </>
  );
}