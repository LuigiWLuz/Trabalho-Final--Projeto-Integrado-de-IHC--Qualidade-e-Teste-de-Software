import { motion } from "framer-motion";
import { X } from "lucide-react"; 

// Adicionada prop 'className' para flexibilidade de estilo
export default function SearchBar({ searchTerm, onSearchChange, onClearSearch, className = "" }) {
  
  const isSearchActive = searchTerm && searchTerm.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // Removemos o 'mb-10' fixo e usamos a prop className para controlar margens externamente
      className={`w-full max-w-xl mx-auto relative ${className}`} 
    >
      <input
        type="text"
        placeholder="Procure seu show..."
        value={searchTerm}
        onChange={onSearchChange}
        className={`
          w-full p-2 md:p-3 rounded-xl bg-zinc-900 text-white border border-zinc-700 focus:ring-2 focus:ring-red-600 outline-none placeholder:text-zinc-500 shadow-md
          ${isSearchActive ? 'pr-10' : ''} 
        `}
      />

      {isSearchActive && (
        <button
          type="button"
          onClick={onClearSearch} 
          aria-label="Limpar pesquisa"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-red-500 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
}