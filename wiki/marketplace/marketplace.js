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

            window._vantaEffect = VANTA.NET({
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
                spacing: 22.00,
                speed: 0.7
            });
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

    // Função para carregar o JSON
    function carregarJSON() {
        // buscar o arquivo marketplace.json que está na mesma pasta deste HTML
        fetch('./marketplace.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar JSON: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Limpar o container
                container.innerHTML = '';

                // Verificar se há produtos
                if (!data.produtos || data.produtos.length === 0) {
                    container.innerHTML = '<div class="error">Nenhum produto encontrado.</div>';
                    return;
                }

                // Criar um card para cada produto
                data.produtos.forEach(produto => {
                    const card = criarCardProduto(produto);
                    container.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
                container.innerHTML = `
                    <div class="error">
                        Erro ao carregar produtos. Verifique se o arquivo "marketplace.json" existe na mesma pasta e está no formato correto.
                        <br><br>
                        <small>Erro: ${error.message}</small>
                    </div>
                `;
            });
    }

    // Carregar os produtos quando o DOM estiver pronto
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        carregarJSON();
    } else {
        document.addEventListener('DOMContentLoaded', carregarJSON);
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
