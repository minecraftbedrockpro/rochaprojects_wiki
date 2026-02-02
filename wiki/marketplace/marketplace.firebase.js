// marketplace.firebase.js — carrega dados do Firebase Realtime Database (apenas leitura)
(async function(){
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js');
        const { getDatabase, ref, get } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js');

        const firebaseConfig = {
            apiKey: "AIzaSyCk9sI-72FCihxAfxnhnTOlHz66w97pFpI",
            authDomain: "rochawiki-4981e.firebaseapp.com",
            databaseURL: "https://rochawiki-4981e-default-rtdb.firebaseio.com",
            projectId: "rochawiki-4981e",
            storageBucket: "rochawiki-4981e.firebasestorage.app",
            messagingSenderId: "478442331346",
            appId: "1:478442331346:web:66ba6ca0b217cb18cee10b"
        };

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        // Tenta ler em /marketplace, /produtos ou raiz
        const tryPaths = ['/marketplace', '/produtos', '/'];
        for (const p of tryPaths) {
            try {
                const snapshot = await get(ref(db, p));
                if (snapshot && snapshot.exists()) {
                    const val = snapshot.val();
                    // Prefer object containing produtos, ou array diretamente
                    if (val.produtos || Array.isArray(val)) {
                        // entrega para o renderizador global
                        if (window.loadProductsFromObject) window.loadProductsFromObject(val);
                        return;
                    }
                    // Se for um objeto com lista dentro, tentar encontrar uma chave que contenha produtos
                    const keys = Object.keys(val || {});
                    for (const k of keys) {
                        if (val[k] && (Array.isArray(val[k]) || val[k].produtos)) {
                            if (window.loadProductsFromObject) window.loadProductsFromObject(val[k]);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.warn('Erro lendo Firebase em', p, e);
            }
        }

        // Se não achou nada, deixa o fallback local carregar (já está configurado)
        console.info('Firebase: nenhum dado encontrado nos paths verificados, usando fallback local.');

    } catch (err) {
        console.warn('Firebase module init failed:', err);
    }
})();
