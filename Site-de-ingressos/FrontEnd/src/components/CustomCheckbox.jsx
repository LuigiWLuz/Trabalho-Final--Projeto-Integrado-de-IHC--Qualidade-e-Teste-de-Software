import React from 'react';
import { Check } from 'lucide-react'; // Ícone para o checkmark

/**
 * Componente de Checkbox Estilizada para manter a estética do tema.
 * Esconde o input nativo e usa um elemento span para renderizar um visual customizado.
 *
 * @param {object} props - Propriedades do componente.
 * @param {boolean} props.checked - Estado atual da checkbox.
 * @param {function} props.onChange - Handler de mudança.
 * @param {string} props.label - Texto de rótulo para a checkbox.
 * @param {string} props.id - ID único para o input.
 */
export default function CustomCheckbox({ checked, onChange, label, id }) {
  return (
    // O elemento label é usado para aumentar a área clicável e associar o texto ao input.
    <label htmlFor={id} className="relative flex items-center cursor-pointer text-sm text-zinc-300 hover:text-white transition-colors">
      
      {/* 1. Input Nativo: Escondido, mas funcional para acessibilidade e eventos. */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer" // 'sr-only' esconde visualmente, 'peer' permite referenciá-lo com o seletor ~
      />

      {/* 2. Checkmark Customizado: Este é o quadrado visível. */}
      <div className="
        w-5 h-5 
        mr-3 
        flex-shrink-0
        flex items-center justify-center 
        rounded-sm 
        border-2 border-red-700 
        bg-zinc-900 
        transition-all duration-200
        
        peer-checked:bg-red-700
        peer-checked:border-red-600
        
        peer-hover:border-red-500
      ">
        {/* 3. Ícone de Check: Visível apenas quando o input está checado. */}
        <Check 
          className={`
            w-4 h-4 
            text-white 
            transition-opacity duration-200
            ${checked ? 'opacity-100' : 'opacity-0'}
          `} 
        />
      </div>
      
      {/* Rótulo da checkbox */}
      <span className="truncate">{label}</span>
      
    </label>
  );
}
