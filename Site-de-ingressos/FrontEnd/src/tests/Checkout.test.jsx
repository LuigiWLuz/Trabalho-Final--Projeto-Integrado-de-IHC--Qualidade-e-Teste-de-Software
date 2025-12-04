import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import Checkout from '../components/Checkout'; 

// --- 1. Mocks de Dados e Funções ---

// Dados de Show e Carrinho (Simulação do location.state vindo do ShowDetails)
const mockShowDetails = {
    band: 'HEAVY METAL BAND',
    bandSlug: 'heavy-metal-band',
    venue: 'Arena Show',
    city: 'Sao Paulo',
    date: '2025-12-31T23:00:00.000Z',
};

const mockCart = [
    { name: 'Pista', price: 150.00, quantity: 2 }, // R$ 300.00
    { name: 'Camarote', price: 300.00, quantity: 1 }, // R$ 300.00
];
// Subtotal esperado: R$ 600.00
// Taxa (fees) no componente: R$ 50.00
// Total esperado: R$ 650.00

const mockState = {
    state: {
        cart: mockCart,
        show: mockShowDetails,
    }
};

// Mock para simular o useNavigate e useLocation
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        // Mocka o useLocation para retornar o estado do carrinho/show
        useLocation: () => mockState, 
        useNavigate: () => mockNavigate,
        Link: actual.Link, 
    };
});

// Mock para a função de scroll (para evitar erros do jsdom)
window.scrollTo = vi.fn();


// --- 2. Configuração do Teste ---

describe('Checkout Component', () => {

    // Limpa os mocks antes de cada teste
    beforeEach(() => {
        vi.clearAllMocks();
        // Simula o fetch com sucesso padrão (para o teste de submissão)
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true, orderId: 'MOCK-ORDER-123' }),
        });
    });

    // Função auxiliar para renderizar o componente
    const renderCheckout = () => {
        return render(
            // Usamos MemoryRouter para simular o roteamento
            <MemoryRouter initialEntries={['/checkout/heavy-metal-band']}>
                <Routes>
                    <Route path="/checkout/:showSlug" element={<Checkout />} />
                    {/* Mocka a página de sucesso */}
                    <Route path="/success" element={<div data-testid="success-page">Order Success</div>} />
                </Routes>
            </MemoryRouter>
        );
    };

    // --- 3. Casos de Teste ---

    test('deve exibir a mensagem de carrinho vazio se não houver dados no estado', () => {
        // Altera o mock para simular um estado vazio
        mockState.state = { cart: [], show: mockShowDetails };

        renderCheckout();

        expect(screen.getByText(/Carrinho Vazio/i)).toBeInTheDocument();
        expect(screen.getByText(/Voltar para Home/i)).toBeInTheDocument();
        
        // Reverte o mock para os outros testes
        mockState.state = { cart: mockCart, show: mockShowDetails };
    });

    test('deve exibir os detalhes do pedido e calcular o total corretamente', () => {
        renderCheckout();

        // 1. Verificar Título
        expect(screen.getByText(/Finalizar Compra/i)).toBeInTheDocument();

        // 2. Verificar Itens
        expect(screen.getByText(/Pista/i)).toBeInTheDocument();
        expect(screen.getByText(/Camarote/i)).toBeInTheDocument();

        // 3. Verificar Cálculos (Subtotal: 600.00, Taxa: 50.00, Total: 650.00)
        expect(screen.getByText('R$ 600,00')).toBeInTheDocument(); // Subtotal
        expect(screen.getByText('R$ 50,00')).toBeInTheDocument(); // Taxa de Serviço
        expect(screen.getByText('R$ 650,00')).toBeInTheDocument(); // TOTAL
    });

    test('deve atualizar o estado do formulário ao digitar nos campos', () => {
        renderCheckout();

        const nameInput = screen.getByPlaceholderText(/Digite seu nome/i);
        const emailInput = screen.getByPlaceholderText(/seu@email.com/i);

        // Dispara eventos de mudança
        fireEvent.change(nameInput, { target: { value: 'Luke Sky' } });
        fireEvent.change(emailInput, { target: { value: 'luke@jedi.com' } });

        // Verifica se os valores dos inputs foram atualizados
        expect(nameInput).toHaveValue('Luke Sky');
        expect(emailInput).toHaveValue('luke@jedi.com');
    });

    test('deve selecionar o método de pagamento PIX ao clicar no rádio', () => {
        renderCheckout();

        const pixLabel = screen.getByLabelText(/PIX/i);
        
        // Simula o clique no rádio PIX (o input é hidden, então clicamos no label)
        fireEvent.click(pixLabel);
        
        // Deve encontrar o input radio e verificar se está checado
        const pixInput = screen.getByRole('radio', { name: /PIX/i });
        expect(pixInput).toBeChecked();
    });

    test('deve submeter o formulário com sucesso e navegar para /success', async () => {
        renderCheckout();

        // 1. Preenche os campos obrigatórios (simulação do ST-002)
        fireEvent.change(screen.getByPlaceholderText(/Digite seu nome/i), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), { target: { value: 'joao@teste.com' } });
        fireEvent.change(screen.getByPlaceholderText(/000.000.000-00/i), { target: { value: '123.456.789-00' } });

        const submitButton = screen.getByRole('button', { name: /Confirmar Pagamento/i });

        // 2. Clica no botão de submissão
        fireEvent.click(submitButton);

        // 3. Verifica o estado de processamento
        expect(submitButton).toHaveTextContent(/Processando.../i);

        // 4. Espera a submissão do fetch e o redirecionamento
        await waitFor(() => {
             // Garante que o fetch foi chamado (pode ser verificado via vi.spyOn(global, 'fetch'))
             expect(global.fetch).toHaveBeenCalledTimes(1);
             // Verifica o redirecionamento correto
             expect(mockNavigate).toHaveBeenCalledWith('/success', { state: expect.any(Object) });
        });
    });
});