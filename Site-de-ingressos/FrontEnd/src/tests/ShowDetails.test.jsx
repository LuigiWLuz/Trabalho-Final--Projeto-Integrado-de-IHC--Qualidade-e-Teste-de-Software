import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ShowDetails from '../pages/ShowDetails'; 

// --- 1. Mocks de Dados e Funções ---

// Dados de Show bem-sucedido
const mockShowData = {
    band: 'HEAVY METAL BAND',
    bandSlug: 'heavy-metal-band',
    venue: 'Arena Show',
    city: 'Sao Paulo',
    date: '2025-12-31T23:00:00.000Z',
    rating: 16,
    image: '/imgs/mock-band.jpg',
    description: 'Um show de metal pesado.',
    tickets: [
        { name: 'Pista', price: 150.00, id: 1 },
        { name: 'Camarote', price: 300.00, id: 2 },
    ],
};

// Dados de Show Esgotado
const mockSoldOutData = {
    ...mockShowData,
    tickets: [], // Sem ingressos = Esgotado
};


// Mock para simular o fetch da API
const mockFetchSuccess = (data) => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
    });
};

// Mock para simular o fetch da API com falha
const mockFetchFailure = () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
    });
};


// MOCK DO REACT-ROUTER-DOM
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useParams: () => ({ showSlug: 'heavy-metal-band' }), 
        useNavigate: () => mockNavigate,
        Link: actual.Link, 
    };
});


// --- 2. Configuração do Teste ---

describe('ShowDetails Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // 🎯 IMPORTANTE: Mockar window.scrollTo para evitar o erro "Not implemented"
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

        // 🎯 Mockar getBoundingClientRect para evitar erros de animação e scroll
        if (typeof window.HTMLElement.prototype.getBoundingClientRect === 'undefined') {
             window.HTMLElement.prototype.getBoundingClientRect = () => ({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            });
        }
    });

    // Função auxiliar para renderizar o componente dentro do contexto de roteamento
    const renderWithRouter = (initialRoute = '/shows/heavy-metal-band') => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/shows/:showSlug" element={<ShowDetails />} />
                    {/* Mocka a página de checkout para verificar o redirecionamento */}
                    <Route path="/checkout/:showSlug" element={<div data-testid="checkout-page">Checkout</div>} />
                </Routes>
            </MemoryRouter>
        );
    };


    // --- 3. Casos de Teste de Carregamento e Erro ---

    test('deve renderizar a tela de carregamento (loading) inicialmente', () => {
        vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
        
        renderWithRouter();
        expect(screen.getByText(/Carregando show.../i)).toBeInTheDocument();
    });

    test('deve renderizar os detalhes do show após o carregamento da API', async () => {
        mockFetchSuccess(mockShowData);
        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/HEAVY METAL BAND/i)).toBeInTheDocument();
            // 🎯 CORREÇÃO: Usar getByRole para o H2 principal e evitar o erro de múltiplos elementos
            expect(screen.getByRole('heading', { name: /Arena Show, Sao Paulo/i })).toBeInTheDocument();
            expect(screen.getByText(/Detalhes do Evento/i)).toBeInTheDocument();
        });
    });

    test('deve exibir a mensagem de erro 404 se o show não for encontrado', async () => {
        mockFetchFailure();
        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('404')).toBeInTheDocument();
            expect(screen.getByText(/Show não encontrado ou dados indisponíveis/i)).toBeInTheDocument();
        });
    });

    // --- 4. Testes de Funcionalidade de Compra e Validação ---

    test('deve incrementar e decrementar a quantidade de ingressos', async () => {
        mockFetchSuccess(mockShowData);
        renderWithRouter();

        await waitFor(() => expect(screen.getByText('Pista')).toBeInTheDocument());

        // 🎯 1. ENCONTRA O CONTÊINER DO INGRESSO "PISTA" (Deve ser o primeiro elemento que contém "Pista")
        // Usamos queryAllByText e closest para garantir que pegamos o contêiner correto.
        const pistaTicketItem = screen.queryAllByText('Pista')[0].closest('.flex.flex-col');
        
        // 🎯 2. CORREÇÃO CRÍTICA: USAR QUERY SELECTOR DENTRO DO CONTÊINER ISOLADO
        // Buscamos os botões pelos seus textos, mas restringimos o escopo com .querySelector(s)
        const incrementPista = pistaTicketItem.querySelector('button:last-child'); // Último botão do grupo (o '+')
        const decrementPista = pistaTicketItem.querySelector('button:first-child'); // Primeiro botão do grupo (o '—')

        // Encontra o span de quantidade (o único span com este estilo dentro do item)
        const quantitySpan = pistaTicketItem.querySelector('span.w-10');


        // Verifica o estado inicial (Deve ser 0)
        expect(quantitySpan).toHaveTextContent('0');
        expect(decrementPista).toBeDisabled();


        // 1. Incrementa (0 -> 1)
        fireEvent.click(incrementPista);
        await waitFor(() => {
            // Verifica se a quantidade no DOM mudou
            expect(quantitySpan).toHaveTextContent('1'); 
        });
        
        // 2. Incrementa novamente (1 -> 2)
        fireEvent.click(incrementPista);
        expect(quantitySpan).toHaveTextContent('2');
        expect(screen.getByText(/Itens: 2/i)).toBeInTheDocument(); 

        // 3. Decrementa (2 -> 1)
        fireEvent.click(decrementPista);
        expect(quantitySpan).toHaveTextContent('1');
        
        // 4. Volta a zero (1 -> 0)
        fireEvent.click(decrementPista);
        expect(quantitySpan).toHaveTextContent('0');
        expect(screen.getByText(/Itens: 0/i)).toBeInTheDocument();
        expect(decrementPista).toBeDisabled();
    });

    test('deve exibir aviso e não navegar se tentar finalizar a compra com 0 itens', async () => {
        mockFetchSuccess(mockShowData);
        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/ESCOLHA SEU INGRESSO/i)).toBeInTheDocument();
        });

        // O botão começa como "SELECIONE"
        const checkoutButton = screen.getByRole('button', { name: /SELECIONE/i });
        
        // Clica sem selecionar nada
        fireEvent.click(checkoutButton);

        // Verifica o aviso
        const warningAlert = screen.getByRole('alert');
        expect(warningAlert).toBeInTheDocument();
        expect(screen.getByText('Selecione ao menos 1 ingresso')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled(); 
    });

    test('deve navegar para a página de Checkout quando itens são selecionados', async () => {
        mockFetchSuccess(mockShowData);
        renderWithRouter();

        await waitFor(() => expect(screen.getByText('Pista')).toBeInTheDocument());

        // Incrementa o item (Pista)
        const incrementPista = screen.getAllByRole('button', { name: '+' })[0];
        fireEvent.click(incrementPista); // Quantidade = 1
        
        // O botão deve mudar para "FINALIZAR"
        const checkoutButton = screen.getByRole('button', { name: /FINALIZAR/i });
        
        fireEvent.click(checkoutButton);

        // Verifica se a navegação ocorreu para a rota correta
        expect(mockNavigate).toHaveBeenCalledWith(
            '/checkout/heavy-metal-band',
            expect.objectContaining({ state: expect.any(Object) })
        );
    });

    test('deve exibir mensagem e tag ESGOTADO quando o show não tem ingressos', async () => {
        mockFetchSuccess(mockSoldOutData);
        renderWithRouter();

        await waitFor(() => {
            // 🎯 CORREÇÃO: Busca o H2 do título e o Span da tag no Hero separadamente para evitar erro de múltipla busca
            expect(screen.getByRole('heading', { name: /INGRESSOS ESGOTADOS!/i })).toBeInTheDocument();
            expect(screen.getByText('INGRESSOS ESGOTADOS', { selector: 'span.text-2xl.font-extrabold' })).toBeInTheDocument();
        });

        // Verifica se o botão de checkout está desabilitado e com o texto correto
        const checkoutButton = screen.getByRole('button', { name: /ESGOTADO/i });
        expect(checkoutButton).toBeInTheDocument();
        expect(checkoutButton).toBeDisabled();
        
        // Tenta clicar e verifica se o aviso de validação não aparece (a validação correta de esgotado ocorre)
        fireEvent.click(checkoutButton);
        expect(screen.queryByText('Selecione ao menos 1 ingresso')).not.toBeInTheDocument();
    });
});