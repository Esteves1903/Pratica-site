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
function toggleFAQ(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.icon');
    
    if (answer.style.maxHeight && answer.style.maxHeight !== "0px") {
        answer.style.maxHeight = "0px";
        icon.style.transform = "rotate(0deg)";
    } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
    }
}
window.onscroll = function() {
    const btn = document.getElementById("backToTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btn.style.display = "flex";
        btn.style.opacity = "1";
    } else {
        btn.style.opacity = "0";
        // Pequeno delay para a transição de opacidade funcionar antes de esconder
        setTimeout(() => { if(btn.style.opacity === "0") btn.style.display = "none"; }, 300);
    }
};

// Inicialmente escondido (ajusta o CSS se usares este JS)
// No CSS do #backToTop, adiciona: display: none; opacity: 0;
console.log("Sistema de Explicações Pro carregado!");
