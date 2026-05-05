function toggleFAQ(button) {
    // Seleciona o painel de resposta que vem logo a seguir ao botão
    const answer = button.nextElementSibling;
    // Seleciona o ícone da seta dentro do botão
    const icon = button.querySelector('.icon');
    
    // Verifica se o item já está aberto (max-height diferente de 0)
    const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
    
    // FECHAR TODOS OS OUTROS (Efeito Acordeão)
    // Remove este bloco se quiseres permitir abrir várias perguntas ao mesmo tempo
    document.querySelectorAll('.faq-answer').forEach(el => {
        el.style.maxHeight = '0px';
    });
    document.querySelectorAll('.faq-item .icon').forEach(i => {
        i.style.transform = 'rotate(0deg)';
    });

    // SE ESTAVA FECHADO, ABRE ESTE
    if (!isOpen) {
        // scrollHeight calcula a altura real do conteúdo para uma animação suave
        answer.style.maxHeight = answer.scrollHeight + "px";
        // Roda a seta 180 graus
        icon.style.transform = 'rotate(180deg)';
    }
}
