export default function SimpleFooter() {
  return (
    <footer className="flex justify-center bg-zinc-950 text-zinc-400 py-5 border-t border-red-500 footer">
      <p className="text-center">
        © {new Date().getFullYear()} Metal Tickets. Todos os direitos
        reservados.
      </p>
    </footer>
  );
}
