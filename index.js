const SUPABASE_URL = 'https://hpmpkimhcsftpkgjomwm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SQtPjwkPMQUkCIhavPkkkw_8HHwuZNm';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Lista de horários padrão - Garante que o formato é exatamente "HH:MM"
const HORARIOS_PADRAO = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

// Variável para guardar a subscrição de tempo real
let realtimeSubscription = null;

async function atualizarHorarios() {
    const explicador = document.getElementById('explicador_selecionado').value;
    const data = document.getElementById('data_aula').value;
    const selectHora = document.getElementById('hora_aula');

    if (!explicador || !data) return;

    selectHora.innerHTML = '<option value="">A carregar horários livres...</option>';

    try {
        // 1. Vai buscar as horas já marcadas para este explicador e dia
        const { data: ocupados, error } = await _supabase
            .from('agendamentos')
            .select('hora')
            .eq('explicador', explicador)
            .eq('data', data);

        if (error) throw error;

        // 2. Transforma o que vem da BD numa lista simples de texto limpo
        // Se a BD devolver "09:00 ", o .trim() remove o espaço extra
        const horasOcupadas = ocupados ? ocupados.map(item => item.hora.trim()) : [];

        // 3. FILTRAGEM: Compara os horários padrão com os ocupados
        // Só deixa passar para a lista final as horas que NÃO estão na lista de ocupadas
        const horasLivres = HORARIOS_PADRAO.filter(hora => !horasOcupadas.includes(hora));

        // 4. Limpa o menu e coloca apenas as horas que sobraram
        selectHora.innerHTML = '<option value="">Seleciona a hora...</option>';
        
        if (horasLivres.length === 0) {
            selectHora.innerHTML = '<option value="">Sem horários disponíveis</option>';
        } else {
            horasLivres.forEach(hora => {
                const option = document.createElement('option');
                option.value = hora;
                option.textContent = hora;
                selectHora.appendChild(option);
            });
        }

        // 5. Configura atualização em tempo real quando os dados da BD mudam
        setupRealtimeUpdates(explicador, data);

    } catch (err) {
        console.error("Erro ao filtrar:", err);
        selectHora.innerHTML = '<option value="">Erro ao carregar disponibilidade</option>';
    }
}

// Nova função para monitorizar mudanças em tempo real
function setupRealtimeUpdates(explicador, data) {
    // Remove a subscrição anterior se existir
    if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
    }

    // Subscreve a mudanças na tabela agendamentos (qualquer INSERT/UPDATE/DELETE)
    realtimeSubscription = _supabase
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'agendamentos',
                filter: `explicador=eq.${explicador}`
            },
            (payload) => {
                console.log("Nova mudança detetada! Atualizando horários...");
                // Só atualiza se a data corresponder
                if (payload.new?.data === data || payload.old?.data === data) {
                    atualizarHorarios();
                }
            }
        )
        .subscribe();
}

// Funções Auxiliares
function preencherExplicador(nome) {
    const select = document.getElementById('explicador_selecionado');
    if (select) {
        select.value = nome;
        document.getElementById('area-agendamento').scrollIntoView({ behavior: 'smooth' });
        atualizarHorarios(); // Atualiza as horas mal mudas o explicador
    }
}

// Envio do Formulário
document.getElementById('formAgendamento').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome_aluno: document.getElementById('nome_aluno').value,
        explicador: document.getElementById('explicador_selecionado').value,
        data: document.getElementById('data_aula').value,
        hora: document.getElementById('hora_aula').value
    };

    try {
        const { error } = await _supabase.from('agendamentos').insert([dados]);

        if (error) {
            // Se o erro for de duplicado (Unique Constraint no SQL), avisa
            if (error.code === '23505') {
                alert("Este horário já não está disponível. Por favor, escolhe outro.");
                atualizarHorarios();
                return;
            }
            throw error;
        }

        // Sucesso: Redireciona para WhatsApp
        const mensagem = `Olá! Marquei uma explicação:\n Aluno: ${dados.nome_aluno}\n Explicador: ${dados.explicador}\n Data: ${dados.data}\n Hora: ${dados.hora}`;
        window.location.href = `https://wa.me/351912345678?text=${encodeURIComponent(mensagem)}`;

    } catch (err) {
        alert("Erro ao gravar. Verifica a consola.");
        console.error(err);
    }
});
