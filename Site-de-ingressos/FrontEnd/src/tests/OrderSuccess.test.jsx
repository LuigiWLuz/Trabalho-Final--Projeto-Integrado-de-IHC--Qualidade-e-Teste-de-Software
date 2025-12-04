// --- MOCK DO REACT-ROUTER-DOM ANTES DE TUDO ---
import { vi } from "vitest";

let mockLocationState = {};
const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await import("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockUseNavigate,
        useLocation: () => mockLocationState,
        Link: actual.Link,
    };
});

// --- IMPORTS (APÓS MOCK) ---
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import OrderSuccess from "../components/OrderSuccess";

window.scrollTo = vi.fn();

// --- MOCK DE DADOS ---
const mockPurchaseDetails = {
    orderId: "MOCK-12345",
    totalPaid: "650,00",
    email: "joao@teste.com",
    band: "HEAVY METAL BAND",
    success: true,
};

// --- SUITE DE TESTES COMPLETA ---
describe("OrderSuccess Component", () => {

    beforeEach(() => {
        mockLocationState = { state: mockPurchaseDetails };
        vi.clearAllMocks();
    });

    const renderSuccessPage = () => {
        return render(
            <MemoryRouter initialEntries={["/success"]}>
                <Routes>
                    <Route path="/success" element={<OrderSuccess />} />
                    <Route path="/" element={<div data-testid="home-page">Home</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    // --------------------------
    // TESTES ORIGINAIS
    // --------------------------

    test("renderiza título e mensagem de sucesso", () => {
        renderSuccessPage();

        expect(screen.getByText(/Sucesso!/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Seu pedido foi processado e você já está pronto para o show!/i)
        ).toBeInTheDocument();
    });

    test("exibe os detalhes corretamente", () => {
        renderSuccessPage();

        expect(screen.getByText(mockPurchaseDetails.band)).toBeInTheDocument();
        expect(screen.getByText(mockPurchaseDetails.orderId)).toBeInTheDocument();
        expect(screen.getByText(/R\$ 650,00/i)).toBeInTheDocument();
        expect(screen.getByText(mockPurchaseDetails.email)).toBeInTheDocument();
    });

    test("exibe mensagem de erro quando não há state", () => {
        mockLocationState = { state: null };

        renderSuccessPage();

        expect(screen.getByText("Erro")).toBeInTheDocument();
        expect(
            screen.getByText(/Não foi possível carregar os detalhes do pedido/i)
        ).toBeInTheDocument();
    });

    test("navega para Home ao clicar no botão", () => {
        renderSuccessPage();

        const btn = screen.getByRole("link", { name: /VOLTAR PARA A HOME/i });
        fireEvent.click(btn);

        expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    // --------------------------
    // TESTES ADICIONAIS (COBERTURA EXTRA)
    // --------------------------

    test("chama scrollTo ao montar a página", () => {
        renderSuccessPage();
        expect(window.scrollTo).toHaveBeenCalled();
    });

    test("renderiza o ícone de sucesso", () => {
        renderSuccessPage();
        expect(screen.getByText("✅")).toBeInTheDocument();
    });

    test("renderiza um heading acessível", () => {
        renderSuccessPage();
        const heading = screen.getByRole("heading", { name: /Sucesso!/i });
        expect(heading).toBeInTheDocument();
    });

    test("botão possui o href correto", () => {
        renderSuccessPage();
        const button = screen.getByRole("link", { name: /VOLTAR PARA A HOME/i });
        expect(button).toHaveAttribute("href", "/");
    });

    test("o container principal existe e possui classes essenciais", () => {
        renderSuccessPage();
        const main = screen.getByRole("main", { hidden: true });
        expect(main.className).toContain("min-h-screen");
    });

    test("a banda aparece em caixa alta", () => {
        renderSuccessPage();
        expect(screen.getByText(mockPurchaseDetails.band)).toHaveClass("uppercase");
    });

    test("verifica estrutura dos detalhes da compra", () => {
        renderSuccessPage();

        expect(screen.getByText("Banda:", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("Pedido ID:", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("Total Pago:", { exact: false })).toBeInTheDocument();
    });

    test("texto informando envio do ingresso está presente", () => {
        renderSuccessPage();
        expect(
            screen.getByText(/Os ingressos foram enviados para:/i)
        ).toBeInTheDocument();
    });
});
