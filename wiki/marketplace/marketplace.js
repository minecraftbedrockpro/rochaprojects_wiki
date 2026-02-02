// Inicialização resiliente do Vanta.js (re-tenta até a lib carregar)
(function initVanta() {
    function start() {
        if (window.VANTA && typeof VANTA.NET === 'function') {
            try {
                if (window._vantaEffect) {
                    window._vantaEffect.destroy();
                    window._vantaEffect = null;
                }
            } catch (e) { /* ignore */ }

            // adjust spacing based on devicePixelRatio to keep visual density consistent
            const dpr = (window.devicePixelRatio && Number(window.devicePixelRatio)) || 1;
            const baseOptions = {
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x7C3AED,
                backgroundColor: 0x0d021a,
                points: 10.00,
                maxDistance: 28.00,
                spacing: Math.round(22.00 * dpr),
                speed: 0.7
            };

            window._vantaEffect = VANTA.NET(baseOptions);
        } else {
            setTimeout(start, 250);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') start();
    else document.addEventListener('DOMContentLoaded', start);
})();

// Carregar e renderizar produtos do JSON
(function carregarProdutos() {
    const container = document.getElementById('produtos-container');

    // Função para criar um card de produto
    function criarCardProduto(produto) {
        const statusClass = produto.status === 'Entregue' ? 'entregue' : 'processo';
        const statusTexto = produto.status;

        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Indisponível'">
            <div class="produto-conteudo">
                <h3 class="produto-nome">${produto.nome}</h3>
                <span class="status-badge ${statusClass}">${statusTexto}</span>
                <div class="pedido-row">
                    <img src="${produto.usuario && produto.usuario.avatar ? produto.usuario.avatar : 'https://via.placeholder.com/60'}" alt="Avatar ${produto.usuario ? produto.usuario.nome : 'Usuário'}" class="pedido-avatar" onerror="this.src='https://via.placeholder.com/60?text=Usu'">
                    <div class="pedido-text">Pedido de: <strong>${produto.usuario ? produto.usuario.nome : 'Anônimo'}</strong></div>
                </div>
                <div class="produto-links">
                    <a href="${produto.linkOficial}" target="_blank" rel="noopener noreferrer" class="link-btn oficial">
                        <span>🔗</span>
                        <span>Oficial</span>
                    </a>
                    <a href="${produto.linkDownload}" target="_blank" rel="noopener noreferrer" class="link-btn download">
                        <span>⬇️</span>
                        <span>Download</span>
                    </a>
                </div>
            </div>
        `;

        return card;
    }

    // Renderiza uma lista de produtos (array)
    function renderProductsArray(produtos) {
        container.innerHTML = '';
        if (!produtos || produtos.length === 0) {
            container.innerHTML = '<div class="error">Nenhum produto encontrado.</div>';
            return;
        }
        produtos.forEach(produto => {
            const card = criarCardProduto(produto);
            container.appendChild(card);
        });
    }

    // Expor uma função global para receber dados (usada pelo módulo Firebase)
    window.loadProductsFromObject = function(obj) {
        // obj pode ser { produtos: [...] } ou já um array
        if (!obj) return;
        if (Array.isArray(obj)) return renderProductsArray(obj);
        if (obj.produtos && Array.isArray(obj.produtos)) return renderProductsArray(obj.produtos);
        // se for um objeto com chaves numeradas
        if (typeof obj === 'object') {
            const arr = Object.values(obj);
            return renderProductsArray(arr);
        }
    };

    // Função para carregar o JSON local (fallback)
    function carregarJSON() {
        return fetch('./marketplace.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar JSON: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && (data.produtos || Array.isArray(data))) {
                    window.loadProductsFromObject(data);
                    return true;
                }
                return false;
            })
            .catch(error => {
                console.error('Erro ao carregar produtos (fallback):', error);
                // não mostrar mensagem de erro ao usuário — manter loader até dados chegarem
                return false;
            });
    }

    // Expor carregarJSON como fallback global
    window.carregarJSONFallback = carregarJSON;

    // Mostrar loader (texto + spinner) — permanece até que loadProductsFromObject seja chamado
    function showLoader() {
        container.innerHTML = `<div class="loading"><div class="spinner" aria-hidden="true"></div><div class="loading-text">Carregando produtos...</div></div>`;
    }

    // Quando Firebase ou fallback chamam loadProductsFromObject, eles devem limpar esta flag
    const fallbackDelay = 1800; // ms — esperar o Firebase antes de usar arquivo local
    let fallbackTimer = null;

    // sobrescrever loadProductsFromObject para limpar timer e renderizar
    const originalLoad = window.loadProductsFromObject;
    window.loadProductsFromObject = function(obj){
        if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
        // se original existe (por algum motivo), preferir chamar a nossa render
        if (originalLoad) originalLoad(obj);
        else {
            // fallback render if needed
            if (Array.isArray(obj)) renderProductsArray(obj);
            else if (obj && obj.produtos) renderProductsArray(obj.produtos);
        }
    };

    // iniciar loader e agendar fallback local
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        showLoader();
        fallbackTimer = setTimeout(()=>{ carregarJSON(); fallbackTimer = null; }, fallbackDelay);
    } else {
        document.addEventListener('DOMContentLoaded', ()=>{
            showLoader();
            fallbackTimer = setTimeout(()=>{ carregarJSON(); fallbackTimer = null; }, fallbackDelay);
        });
    }
})();

    // Navbar toggle for mobile (local to this page)
    (function(){
        const toggle = document.querySelector('.nav-toggle');
        const navbar = document.querySelector('.navbar');
        if (!toggle || !navbar) return;
        toggle.addEventListener('click', (e)=>{
            const open = navbar.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        document.addEventListener('click', (e)=>{
            if (!navbar.classList.contains('open')) return;
            if (!navbar.contains(e.target)) {
                navbar.classList.remove('open');
                toggle.setAttribute('aria-expanded','false');
            }
        });
    })();
