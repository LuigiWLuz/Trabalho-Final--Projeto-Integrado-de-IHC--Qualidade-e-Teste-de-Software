import { Link } from "react-router-dom";

export default function ShowCard({ show }) {
  const showSlug =
    show.bandSlug || show.band.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link to={`/shows/${showSlug}`} className="block focus:outline-none focus:ring focus:ring-red-500 rounded-xl">
      <div className="bg-zinc-900 shadow-md p-4 hover:scale-105 transition-transform">
        <img
          src={show.image}
          alt={show.band}
          className="rounded-lg mb-4 w-full h-auto object-cover"
        />
        <h3 className="text-3xl text-center font-bold text-red-500 truncate">
          {show.band}
        </h3>
        <p className="text-white/80 mt-1 text-center pt-2W">
          {new Date(show.date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-white/60 text-center pt-2">{show.city}</p>
        <p className="text-white/90 font-semibold text-x mt-3 text-center">
        <p className="text-white/90 font-semibold text-x mt-3 text-center border-zinc-700 pt-2">
            Ingressos
        </p>
         
        </p>
      </div>
    </Link>
  );
}
