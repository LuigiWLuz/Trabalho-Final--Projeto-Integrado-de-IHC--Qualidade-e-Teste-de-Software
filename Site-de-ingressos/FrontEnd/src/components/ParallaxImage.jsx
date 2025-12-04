// --- Arquivo: src/components/ParallaxImage.jsx ---

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxImage({ imageUrl, altText, yOffset = 50 }) {
  // 1. Restauramos a lógica do Scroll para o efeito Parallax
  const { scrollY } = useScroll();
  
  // A imagem se move mais devagar que a rolagem da página
  const y = useTransform(scrollY, [0, 1000], [0, yOffset]);

  return (
    <motion.div
        className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-xl shadow-lg cursor-pointer group bg-black"
        whileHover={{ scale: 1.01 }}
    >
        {/* Camada da Imagem */}
        <motion.div
            className="banner-img absolute left-0 w-full h-[120%] top-0 object-cover transition-all duration-500 group-hover:brightness-110"
            style={{
                backgroundImage: `url(${imageUrl})`,
                
                // 🎯 VOLTAMOS AO ORIGINAL:
                // 'cover': Preenche tudo (dá zoom se precisar)
                // 'center': Centraliza
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                
                // Restauramos o movimento vertical
                y: y, 
            }}
            role="img"
            aria-label={altText}
        />
        
        {/* Gradiente para garantir leitura do texto por cima da imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}