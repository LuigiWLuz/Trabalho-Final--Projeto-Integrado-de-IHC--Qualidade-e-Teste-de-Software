import React from "react";
import CustomCheckbox from "./CustomCheckbox"; 
import { Trash2, ArrowRight, FilterX } from "lucide-react"; 

export default function FilterSidebars({ onFilterChange, currentFilters, onClose }) {
  const cities = ["São Paulo", "Curitiba", "Rio de Janeiro", "Porto Alegre"];
  const ratings = [16, 18];

  // 1. Arrays atuais vindos do App
  const selectedCities = currentFilters.city || [];
  const selectedRatings = currentFilters.rating || [];

  // Verifica se tem algo selecionado para mostrar o botão de limpar
  const hasActiveFilters = selectedCities.length > 0 || selectedRatings.length > 0;

  // Lógica para alternar Cidades (Multi-select)
  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
        // Se já tem, remove
        onFilterChange("city", selectedCities.filter(c => c !== city));
    } else {
        // Se não tem, adiciona
        onFilterChange("city", [...selectedCities, city]);
    }
  };

  // Lógica para alternar Ratings (Multi-select)
  const toggleRating = (rating) => {
    if (selectedRatings.includes(rating)) {
        onFilterChange("rating", selectedRatings.filter(r => r !== rating));
    } else {
        onFilterChange("rating", [...selectedRatings, rating]);
    }
  };

  const handleClearAll = () => {
    onFilterChange("city", []);
    onFilterChange("rating", []);
  };

  return (
    <div className="bg-zinc-900 h-full flex flex-col border-l border-zinc-800 shadow-2xl">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between p-5 border-b border-zinc-700 bg-zinc-950">
        <h3 className="text-2xl font-bold text-red-600 tracking-wide">
            Filtros
        </h3>

        {/* SETA PARA DIREITA PARA FECHAR (Solicitação) */}
        <button 
            onClick={onClose}
            aria-label="Fechar filtros"
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-600 hover:border-white cursor-pointer"
        >
            <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto flex-grow">
          
          {/* CIDADES */}
          <div className="mb-10">
            <h4 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2 uppercase tracking-wide">
              Cidade
            </h4>
            <div className="space-y-4">
              {cities.map((city) => (
                <CustomCheckbox
                  key={city}
                  id={`city-${city}`}
                  label={city}
                  // Verifica se está no array
                  checked={selectedCities.includes(city)}
                  // Chama a função de toggle
                  onChange={() => toggleCity(city)}
                />
              ))}
              
              {selectedCities.length > 0 && (
                <button
                  onClick={() => onFilterChange("city", [])}
                  className="mt-4 w-full py-3 px-4 bg-zinc-800 hover:bg-red-900/30 text-zinc-300 hover:text-red-500 rounded-lg flex items-center justify-center transition-all border border-zinc-700 hover:border-red-500 group cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  <span className="font-semibold text-sm">Limpar Cidades</span>
                </button>
              )}
            </div>
          </div>

          {/* FAIXA ETÁRIA */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2 uppercase tracking-wide">
              Faixa Etária
            </h4>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <CustomCheckbox
                  key={rating}
                  id={`rating-${rating}`}
                  label={`${rating} Anos`}
                  // Verifica se está no array
                  checked={selectedRatings.includes(rating)}
                  onChange={() => toggleRating(rating)}
                />
              ))}
              
              {selectedRatings.length > 0 && (
                <button
                  onClick={() => onFilterChange("rating", [])}
                  className="mt-4 w-full py-3 px-4 bg-zinc-800 hover:bg-red-900/30 text-zinc-300 hover:text-red-500 rounded-lg flex items-center justify-center transition-all border border-zinc-700 hover:border-red-500 group cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  <span className="font-semibold text-sm">Limpar Idades</span>
                </button>
              )}
            </div>
          </div>
      </div>
      
      {/* BOTÃO LIMPAR TUDO NO RODAPÉ */}
      {hasActiveFilters && (
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <button 
                onClick={handleClearAll}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            >
                <FilterX className="w-5 h-5" />
                LIMPAR TODOS OS FILTROS
            </button>
        </div>
      )}
    </div>
  );
}