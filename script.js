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

// Projetos: busca simples por título/descrição
(function(){
    const input = document.getElementById('project-search');
    if (!input) return;

    const cards = Array.from(document.querySelectorAll('.projeto-card'));

    // debounce helper
    function debounce(fn, ms){
        let t;
        return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
    }

    function filterProjects(value){
        const q = value.trim().toLowerCase();
        if (!q) {
            cards.forEach(c=> c.style.display = 'block');
            return;
        }
        cards.forEach(card=>{
            const text = (card.innerText || '').toLowerCase();
            const ok = text.includes(q);
            card.style.display = ok ? 'block' : 'none';
        });
    }

    input.addEventListener('input', debounce(e=>filterProjects(e.target.value), 180));
})();

// Navbar toggle for mobile
(function(){
    const toggle = document.querySelector('.nav-toggle');
    const navbar = document.querySelector('.navbar');
    if (!toggle || !navbar) return;
    toggle.addEventListener('click', ()=>{
        const open = navbar.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when clicking outside
    document.addEventListener('click', (e)=>{
        if (!navbar.classList.contains('open')) return;
        if (!navbar.contains(e.target)) {
            navbar.classList.remove('open');
            const t = document.querySelector('.nav-toggle');
            if (t) t.setAttribute('aria-expanded','false');
        }
    });
})();
