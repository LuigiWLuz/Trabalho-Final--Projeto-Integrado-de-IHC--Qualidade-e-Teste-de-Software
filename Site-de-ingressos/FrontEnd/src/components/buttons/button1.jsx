export default function Button1({ text, funcao }) {
  return (
    <button
      type="submit"
      className="text-center py-2 px-5 bg-zinc-900 border border-white hover:bg-red-800 transition-colors cursor-pointer"
      onClick={funcao}
    >
      {text}
    </button>
  );
}
