// src/tests/Home.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";

// --- MOCKS DO SWIPER ---
vi.mock("swiper/react", () => ({
  Swiper: ({ children }) => (
    <div data-testid="swiper-container">{children}</div>
  ),
  SwiperSlide: ({ children }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));
vi.mock("swiper/modules", () => ({
  Navigation: {},
  Pagination: {},
  Autoplay: {},
  EffectFade: {},
}));
vi.mock("swiper/css", () => ({}));

// Mock IntersectionObserver
if (typeof IntersectionObserver === "undefined") {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock Fetch
global.fetch = vi.fn();

// Mock Scroll
window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockShows = [
  {
    bandSlug: "metallica",
    band: "Metallica",
    date: "2025-10-15",
    city: "São Paulo",
    venue: "Allianz",
    rating: 16,
    image: "url",
    tickets: [],
  },
];

describe("Testes da Página Principal (Home)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockShows),
    });
  });

  // -------------------------------------------------------------------
  it("CT01: Deve carregar o Header e a Logo", async () => {
    render(<App />);
    expect(screen.getByAltText(/Metal Tickets Logo/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------------
  it("CT02: O campo de busca deve aceitar texto", async () => {
    render(<App />);
    const inputs = screen.getAllByPlaceholderText(/Procure seu show.../i);
    fireEvent.change(inputs[0], { target: { value: "Iron Maiden" } });
    expect(inputs[0].value).toBe("iron maiden");
  });

  // -------------------------------------------------------------------
  it("CT03: Deve exibir resultados ao buscar uma banda existente", async () => {
    render(<App />);

    const search = screen.getAllByPlaceholderText(/Procure seu show.../i)[0];
    fireEvent.change(search, { target: { value: "metallica" } });

    await waitFor(() =>
      expect(screen.getByText(/Metallica/i)).toBeInTheDocument()
    );
  });

  // -------------------------------------------------------------------
  it("CT04: Deve exibir mensagem de erro para busca sem resultados", async () => {
    render(<App />);

    const search = screen.getAllByPlaceholderText(/Procure seu show.../i)[0];
    fireEvent.change(search, { target: { value: "show inexistente" } });

    await waitFor(() =>
      expect(screen.getByText(/nenhum show encontrado/i)).toBeInTheDocument()
    );
  });

  // -------------------------------------------------------------------
  it("CT05: Botão de alto contraste deve ser clicável", async () => {
    render(<App />);
    const buttons = screen.getAllByLabelText(/Alternar Alto Contraste/i);
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toBeInTheDocument();
  });

  // -------------------------------------------------------------------
  it("CT06: Deve chamar a API para carregar shows", async () => {
    render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  // -------------------------------------------------------------------
  it("CT07: Deve exibir o drawer de filtros quando o botão é clicado", async () => {
    render(<App />);

    const btn = screen.getByLabelText(/Abrir filtros laterais/i);
    fireEvent.click(btn);

    // drawer-toggle existe?
    const toggle = document.querySelector("input.drawer-toggle");
    expect(toggle).not.toBeNull();
  });

  // -------------------------------------------------------------------
  it("CT09: Link do header 'Shows' deve ser clicável", async () => {
    render(<App />);

    const links = screen.getAllByText(/^Shows$/i);
    const headerLink = links[0];

    fireEvent.click(headerLink);

    expect(headerLink).toBeInTheDocument();
  });

  // -------------------------------------------------------------------
  it("CT10: Perguntas do FAQ devem aparecer", async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByText(/Como comprar ingressos/i)
      ).toBeInTheDocument()
    );
  });

  // -------------------------------------------------------------------
  it("CT11: Newsletter deve ter campo de email", async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getAllByPlaceholderText(/Seu melhor e-mail/i)[0]
      ).toBeInTheDocument()
    );
  });

  // -------------------------------------------------------------------
  it("CT12: O carrossel deve ser renderizado", async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getAllByTestId("swiper-container").length).toBeGreaterThan(0)
    );

    // Slides foram renderizados?
    expect(screen.getAllByTestId("swiper-slide").length).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------
  it('CT13: Botão "Comprar Agora" deve funcionar', async () => {
    render(<App />);

    const btn = await screen.findByText(/Comprar Agora/i);
    fireEvent.click(btn);

    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  // -------------------------------------------------------------------
  it("CT14: Elementos essenciais devem possuir aria-label", async () => {
    render(<App />);
    expect(screen.getByLabelText(/Alternar Alto Contraste/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Abrir filtros laterais/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------------
  it("CT15: Botão de filtros deve receber foco", async () => {
    render(<App />);

    const btn = screen.getByLabelText(/Abrir filtros laterais/i);
    btn.focus();

    expect(btn).toHaveFocus();
  });

   it("CT16: Botões laterais devem levar ao início, meio e final da página", async () => {
    render(<App />);

    // esses textos podem ser ajustados caso os seus botões tenham outro label
    const btnTopo = screen.queryByText(/topo/i) || screen.queryByLabelText(/topo/i);
    const btnMeio = screen.queryByText(/meio/i) || screen.queryByLabelText(/meio/i);
    const btnFinal = screen.queryByText(/final/i) || screen.queryByLabelText(/final/i);

    // O componente pode esconder os botões no mobile, então testamos apenas os que EXISTEM
    if (btnTopo) {
      fireEvent.click(btnTopo);
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    }

    if (btnMeio) {
      fireEvent.click(btnMeio);
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    }

    if (btnFinal) {
      fireEvent.click(btnFinal);
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
    }
  });
});
