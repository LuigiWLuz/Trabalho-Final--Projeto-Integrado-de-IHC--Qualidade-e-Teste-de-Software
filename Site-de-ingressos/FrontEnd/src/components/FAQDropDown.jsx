// --- Arquivo: src/components/FAQDropDown.jsx ---

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; 

export default function FaqDropDown({ title, description }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // AQUI ESTÁ O AJUSTE DE ESPAÇAMENTO:
    // 'my-10' (margem vertical maior) 
    // 'pb-8' (espaço interno inferior maior)
    <div className="max-w-5xl my-10 border-b border-zinc-800 pb-8"> 
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer group"
        aria-label={isOpen ? `Recolher detalhes de ${title}` : `Expandir detalhes de ${title}`}
      >
        <h4 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
            {title}
        </h4>
        {isOpen ? (
          <ChevronUp className="w-8 h-8 text-red-600" />
        ) : (
          <ChevronDown className="w-8 h-8 text-red-600" />
        )}
      </button>

      {isOpen && (
        <p className="mt-6 text-lg text-zinc-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
          {description}
        </p>
      )}
    </div>
  );
}