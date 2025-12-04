// setupTests.js

import '@testing-library/jest-dom';

window.scrollTo = vi.fn();

// Mock para outras funções de janela que podem ser chamadas (como getBoundingClientRect para o FAB)
if (typeof window !== 'undefined') {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });
}