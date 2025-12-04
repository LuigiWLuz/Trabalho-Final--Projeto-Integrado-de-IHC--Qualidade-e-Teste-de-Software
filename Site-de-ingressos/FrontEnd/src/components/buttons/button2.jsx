export default function Button2({ text }) {
  return (
    <button
      type="submit"
      className="text-center py-2 px-5 bg-white text-black border border-black hover:bg-red-800 hover:text-white transition-colors cursor-pointer"
    >
      {text}
    </button>
  );
}
