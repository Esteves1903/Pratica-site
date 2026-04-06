// Efeito de scroll suave na navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Função para abrir o calendário em modo Popup (janela flutuante)
function abrirCalendario() {
    Calendly.initPopupWidget({
        url: 'https://calendly.com/pratica-mais-26'
    });
    return false;
}

// Manter o efeito de scroll suave que já tinhas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

console.log("Sistema de Explicações Pro carregado!");