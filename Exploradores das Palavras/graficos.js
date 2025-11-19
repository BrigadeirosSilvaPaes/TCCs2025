// Elementos DOM
const elements = {
    applyFilterBtn: document.getElementById('applyFilter'),
    selectTurma: document.getElementById('selectTurma'),
    selectAtividade: document.getElementById('selectAtividade'),
    loadingElement: document.getElementById('loading'),
    errorMessage: document.getElementById('errorMessage'),
    dashboardElement: document.getElementById('dashboard'),
    corpoTabela: document.getElementById('corpoTabela'),
    totalAlunos: document.getElementById('totalAlunos'),
    totalAtividades: document.getElementById('totalAtividades'),
    taxaAcertos: document.getElementById('taxaAcertos'),
    taxaErros: document.getElementById('taxaErros')
};

// Gráficos
let charts = {
    desempenhoAtividades: null,
    acertosErros: null,
    evolucao: null,
    ranking: null,
    distribuicao: null
};

// Configuração da API - AJUSTE AQUI SE PRECISAR
const API_CONFIG = {
    // Se sua API estiver na mesma pasta que o HTML, use:
    baseURL: window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '') + '/api',
    // Ou se estiver em outro lugar, defina manualmente:
    // baseURL: 'http://localhost/seu_projeto/api',
    endpoints: {
        estatisticas: 'estatisticas.php',
        atividades: 'atividades.php'
    }
};

console.log('API Base URL:', API_CONFIG.baseURL);

// Mapeamento de atividades para ícones e cores
const atividadesConfig = {
    1: { 
        nome: "Alfabeto", 
        cor: '#FF6B6B', 
        icone: 'alfabeto',
        descricao: 'Reconhecimento de letras e sons'
    },
    2: { 
        nome: "Assimilar Sons", 
        cor: '#4ECDC4', 
        icone: 'sons',
        descricao: 'Identificação de fonemas'
    },
    3: { 
        nome: "Caça Palavras", 
        cor: '#45B7D1', 
        icone: 'caca-palavras',
        descricao: 'Encontrar palavras no diagrama'
    },
    4: { 
        nome: "Família Simbólica", 
        cor: '#96CEB4', 
        icone: 'familia',
        descricao: 'Reconhecimento de símbolos familiares'
    },
    5: { 
        nome: "Histórias", 
        cor: '#FFEAA7', 
        icone: 'historias',
        descricao: 'Compreensão de narrativas'
    },
    6: { 
        nome: "Ligar Imagem", 
        cor: '#DDA0DD', 
        icone: 'ligar-imagem',
        descricao: 'Associação de imagens e conceitos'
    }
};

// SVG Icons para cada atividade
const activityIcons = {
    'alfabeto': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,3A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,3M11,7A2,2 0 0,0 9,9V17H11V13H13V17H15V9A2,2 0 0,0 13,7H11M11,9H13V11H11V9Z"/></svg>',
    'sons': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,3V15A5,5 0 0,1 7,20A5,5 0 0,1 2,15A5,5 0 0,1 7,10C7.65,10 8.28,10.14 8.86,10.41L10.5,7.5L17,5.5V10.5C18.85,11.58 20,13.53 20,15.5C20,18 18,20 15.5,20C13.79,20 12.3,19.18 11.42,17.91L10,16.5V3H12Z"/></svg>',
    'caca-palavras': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M10,4A4,4 0 0,1 14,8C14,8.91 13.69,9.75 13.18,10.43C12.32,10.75 11.55,11.26 10.91,11.9L10,12A4,4 0 0,1 6,8A4,4 0 0,1 10,4M2,20V18C2,15.88 5.31,14.14 9.5,14C9.18,14.78 9,15.62 9,16.5C9,17.79 9.38,19 10,20H2Z"/></svg>',
    'familia': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M12,9C13.63,9 15.12,9.35 16.5,10.05C17.84,10.76 18.5,11.61 18.5,12.61V18.38C18.5,19.5 17.64,20.44 15.33,21.19C14.28,21.53 13.17,21.75 12,21.75C10.83,21.75 9.72,21.53 8.67,21.19C6.36,20.44 5.5,19.5 5.5,18.38V12.61C5.5,11.61 6.16,10.76 7.5,10.05C8.88,9.35 10.38,9 12,9M12,11A2,2 0 0,0 10,13A2,2 0 0,0 12,15A2,2 0 0,0 14,13A2,2 0 0,0 12,11Z"/></svg>',
    'historias': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
    'ligar-imagem': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M21,3H3C1.9,3 1,3.9 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5C23,3.9 22.1,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z"/></svg>',
    'default': '<svg class="activity-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/></svg>'
};

// Cache de dados
let cacheDados = {
    timestamp: null,
    dados: null,
    duracao: 2 * 60 * 1000 // 2 minutos
};

// Funções de API - VERSÃO ROBUSTA
async function fetchAPI(endpoint, params = {}) {
    const url = new URL(`${API_CONFIG.baseURL}/${endpoint}`);
    
    // Adicionar parâmetros
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    console.log(`🔍 Fazendo requisição para: ${url.toString()}`);

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        console.log(`📡 Status da resposta: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const text = await response.text();
        console.log('📦 Resposta bruta:', text);

        if (!text) {
            throw new Error('Resposta vazia da API');
        }

        const data = JSON.parse(text);
        
        if (data.error) {
            throw new Error(`Erro da API: ${data.error}`);
        }

        console.log('✅ Dados recebidos com sucesso');
        return data;

    } catch (error) {
        console.error('❌ Erro na API:', error);
        
        // Se for erro de JSON, tentar fallback
        if (error instanceof SyntaxError) {
            throw new Error('Resposta da API em formato inválido');
        }
        
        throw error;
    }
}

async function buscarEstatisticas(turma, atividadeId = '') {
    const cacheKey = `estatisticas_${turma}_${atividadeId}`;
    
    // Verificar cache
    if (cacheDados.timestamp && 
        Date.now() - cacheDados.timestamp < cacheDados.duracao &&
        cacheDados.dados && 
        cacheDados.dados.cacheKey === cacheKey) {
        console.log('♻️ Usando dados em cache');
        return cacheDados.dados;
    }
    
    const params = { turma };
    if (atividadeId) {
        params.atividade_id = atividadeId;
    }
    
    try {
        const dados = await fetchAPI(API_CONFIG.endpoints.estatisticas, params);
        
        // Armazenar em cache
        cacheDados = {
            timestamp: Date.now(),
            dados: { ...dados, cacheKey },
            duracao: cacheDados.duracao
        };
        
        return dados;
    } catch (error) {
        // Limpar cache em caso de erro
        cacheDados.timestamp = null;
        throw error;
    }
}

async function buscarAtividadesDisponiveis() {
    try {
        console.log('🔄 Buscando atividades disponíveis...');
        const atividades = await fetchAPI(API_CONFIG.endpoints.atividades);
        console.log('✅ Atividades carregadas:', atividades);
        return atividades;
    } catch (error) {
        console.error('❌ Erro ao buscar atividades, usando fallback:', error);
        // Fallback para atividades padrão
        return Object.entries(atividadesConfig).map(([id, config]) => ({
            id: parseInt(id),
            titulo: config.nome,
            descricao: config.descricao
        }));
    }
}

// Inicialização
function init() {
    console.log('🚀 Inicializando aplicação...');
    
    // Configurar event listeners
    elements.applyFilterBtn.addEventListener('click', carregarDados);
    elements.selectTurma.addEventListener('change', carregarDados);
    elements.selectAtividade.addEventListener('change', carregarDados);
    
    // Preencher seletor de atividades
    preencherSeletorAtividades();
    
    // Carregar dados iniciais após um pequeno delay
    setTimeout(() => {
        carregarDados();
    }, 500);
}

async function preencherSeletorAtividades() {
    try {
        const atividades = await buscarAtividadesDisponiveis();
        const select = elements.selectAtividade;
        select.innerHTML = '<option value="">Todas as Atividades</option>';
        
        atividades.forEach(atividade => {
            const option = document.createElement('option');
            option.value = atividade.id;
            option.textContent = atividade.titulo;
            select.appendChild(option);
        });
        
        console.log(`✅ Seletor preenchido com ${atividades.length} atividades`);
    } catch (error) {
        console.error('❌ Erro ao preencher seletor:', error);
        // Fallback básico
        const select = elements.selectAtividade;
        select.innerHTML = '<option value="">Todas as Atividades</option>';
        Object.values(atividadesConfig).forEach(atividade => {
            const option = document.createElement('option');
            option.value = Object.keys(atividadesConfig).find(key => atividadesConfig[key].nome === atividade.nome);
            option.textContent = atividade.nome;
            select.appendChild(option);
        });
    }
}

async function carregarDados() {
    mostrarLoading();
    esconderErro();
    
    try {
        const ano = elements.selectTurma.value;
        const atividadeId = elements.selectAtividade.value;
        
        if (!ano) {
            throw new Error('Por favor, selecione um ano');
        }

        console.log(`📊 Carregando dados: Ano ${ano}, Atividade ${atividadeId || 'Todas'}`);
        
        const dados = await buscarEstatisticas(ano, atividadeId);
        
        // Processar dados da API
        const dadosProcessados = processarDadosAPI(dados);
        
        // Atualizar interface
        atualizarDashboard(dadosProcessados);
        atualizarTabela(dadosProcessados);
        criarGraficos(dadosProcessados);
        
        mostrarDashboard();
        
        console.log('🎉 Dados carregados com sucesso!');
        
    } catch (error) {
        console.error('💥 Erro ao carregar dados:', error);
        mostrarErro(error.message || 'Erro ao carregar dados da API. Verifique a conexão.');
        
        // Tentar usar dados de fallback após 1 segundo
        setTimeout(() => {
            console.log('🔄 Tentando usar dados de fallback...');
            usarDadosFallback();
        }, 1000);
    }
}

function processarDadosAPI(dadosAPI) {
    console.log('🛠️ Processando dados da API:', dadosAPI);
    
    // Verificar se há dados válidos
    if (!dadosAPI) {
        throw new Error('Nenhum dado recebido da API');
    }

    if (!Array.isArray(dadosAPI.atividades)) {
        throw new Error('Formato de dados inválido da API');
    }

    const atividadesProcessadas = dadosAPI.atividades.map(atividade => {
        const atividadeId = parseInt(atividade.id);
        const config = atividadesConfig[atividadeId] || {
            nome: atividade.titulo || `Atividade ${atividadeId}`,
            cor: '#667eea',
            icone: 'default',
            descricao: atividade.descricao || 'Descrição não disponível'
        };
        
        const alunosAtivos = parseInt(atividade.alunos_ativos) || 0;
        const totalQuestoes = parseInt(atividade.total_questoes) || 10;
        const acertos = parseInt(atividade.acertos) || 0;
        const erros = parseInt(atividade.erros) || 0;
        
        return {
            id: atividadeId,
            nome: config.nome,
            descricao: config.descricao,
            cor: config.cor,
            icone: config.icone,
            alunosAtivos: alunosAtivos,
            totalQuestoes: totalQuestoes,
            acertos: acertos,
            erros: erros,
            data: new Date()
        };
    });

    const resultado = {
        totalAlunos: parseInt(dadosAPI.totalAlunos) || 0,
        atividades: atividadesProcessadas
    };
    
    console.log('✅ Dados processados:', resultado);
    return resultado;
}

function usarDadosFallback() {
    console.log('🔄 Usando dados de fallback...');
    
    const ano = elements.selectTurma.value || '1';
    const multiplicadorAno = ano === '1' ? 1 : ano === '2' ? 1.1 : 1.2;
    
    const dadosFallback = {
        totalAlunos: 25,
        atividades: Object.entries(atividadesConfig).map(([id, config], index) => {
            const baseAcertos = [75, 68, 82, 65, 78, 72][index] * multiplicadorAno;
            const alunosAtivos = Math.floor(25 * (0.85 + Math.random() * 0.15));
            const totalQuestoes = [20, 15, 25, 18, 22, 16][index];
            const acertos = Math.floor((baseAcertos / 100) * totalQuestoes * alunosAtivos);
            const erros = Math.floor(((100 - baseAcertos) / 100) * totalQuestoes * alunosAtivos);
            
            return {
                ...config,
                id: parseInt(id),
                alunosAtivos,
                totalQuestoes,
                acertos,
                erros,
                data: new Date(2024, 0, index + 1)
            };
        })
    };
    
    atualizarDashboard(dadosFallback);
    atualizarTabela(dadosFallback);
    criarGraficos(dadosFallback);
    mostrarDashboard();
    
    mostrarErro('📡 Usando dados de demonstração. A API pode estar indisponível.');
}

function atualizarDashboard(dados) {
    const totais = calcularTotais(dados);
    
    elements.totalAlunos.textContent = dados.totalAlunos.toLocaleString();
    elements.totalAtividades.textContent = dados.atividades.length.toLocaleString();
    elements.taxaAcertos.textContent = `${totais.taxaAcertos}%`;
    elements.taxaErros.textContent = `${totais.taxaErros}%`;
    
    console.log('📈 Dashboard atualizado');
}

function calcularTotais(dados) {
    let totalAcertos = 0;
    let totalErros = 0;
    let totalQuestoes = 0;
    
    dados.atividades.forEach(atividade => {
        totalAcertos += atividade.acertos;
        totalErros += atividade.erros;
        totalQuestoes += atividade.totalQuestoes * atividade.alunosAtivos;
    });
    
    const taxaAcertos = totalQuestoes > 0 ? ((totalAcertos / totalQuestoes) * 100).toFixed(1) : 0;
    const taxaErros = totalQuestoes > 0 ? ((totalErros / totalQuestoes) * 100).toFixed(1) : 0;
    
    return { 
        totalAcertos, 
        totalErros, 
        totalQuestoes, 
        taxaAcertos, 
        taxaErros 
    };
}

function atualizarTabela(dados) {
    const tbody = elements.corpoTabela;
    tbody.innerHTML = '';
    
    if (dados.atividades.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" style="text-align: center; padding: 40px; color: #666;">Nenhuma atividade encontrada para os filtros selecionados</td>`;
        tbody.appendChild(row);
        return;
    }
    
    dados.atividades.forEach(atividade => {
        const totalRespostas = atividade.acertos + atividade.erros;
        const taxaAcerto = totalRespostas > 0 ? ((atividade.acertos / totalRespostas) * 100).toFixed(1) : 0;
        const taxaErro = totalRespostas > 0 ? ((atividade.erros / totalRespostas) * 100).toFixed(1) : 0;
        const desempenho = determinarDesempenho(taxaAcerto);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: left;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${activityIcons[atividade.icone] || activityIcons.default}
                    <div>
                        <div style="font-weight: 600;">${atividade.nome}</div>
                        <div style="font-size: 0.8rem; color: #666;">${atividade.descricao}</div>
                    </div>
                </div>
            </td>
            <td>${atividade.alunosAtivos}</td>
            <td style="color: #28a745; font-weight: bold;">${atividade.acertos.toLocaleString()}</td>
            <td style="color: #dc3545; font-weight: bold;">${atividade.erros.toLocaleString()}</td>
            <td>
                <div style="font-weight: 600; margin-bottom: 5px;">${taxaAcerto}%</div>
                <div class="progress-bar">
                    <div class="progress-fill acerto-fill" style="width: ${taxaAcerto}%"></div>
                    <div class="progress-fill erro-fill" style="width: ${taxaErro}%"></div>
                </div>
            </td>
            <td>
                <span class="performance-badge performance-${desempenho.toLowerCase()}">
                    ${desempenho}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('📋 Tabela atualizada com', dados.atividades.length, 'atividades');
}

function determinarDesempenho(taxaAcerto) {
    taxaAcerto = parseFloat(taxaAcerto);
    if (taxaAcerto >= 85) return "Excelente";
    if (taxaAcerto >= 70) return "Bom";
    if (taxaAcerto >= 60) return "Regular";
    return "Baixo";
}

function criarGraficos(dados) {
    destruirGraficos();
    
    try {
        criarGraficoDesempenhoAtividades(dados);
        criarGraficoAcertosErros(dados);
        criarGraficoEvolucao(dados);
        criarGraficoRanking(dados);
        criarGraficoDistribuicao(dados);
        console.log('📊 Todos os gráficos criados com sucesso');
    } catch (error) {
        console.error('💥 Erro ao criar gráficos:', error);
    }
}

function destruirGraficos() {
    Object.values(charts).forEach((chart, index) => {
        if (chart) {
            chart.destroy();
            charts[Object.keys(charts)[index]] = null;
        }
    });
}

function criarGraficoDesempenhoAtividades(dados) {
    const ctx = document.getElementById('chartDesempenhoAtividades').getContext('2d');
    
    const labels = dados.atividades.map(a => a.nome);
    const taxasAcerto = dados.atividades.map(a => {
        const total = a.acertos + a.erros;
        return total > 0 ? (a.acertos / total * 100) : 0;
    });
    const cores = dados.atividades.map(a => a.cor);
    
    charts.desempenhoAtividades = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Taxa de Acerto (%)',
                data: taxasAcerto,
                backgroundColor: cores,
                borderColor: cores.map(cor => cor),
                borderWidth: 1,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const atividade = dados.atividades[context.dataIndex];
                            return [
                                `Taxa de Acerto: ${context.raw.toFixed(1)}%`,
                                `Acertos: ${atividade.acertos}`,
                                `Erros: ${atividade.erros}`,
                                `Alunos: ${atividade.alunosAtivos}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Taxa de Acerto (%)'
                    }
                }
            }
        }
    });
}

function criarGraficoAcertosErros(dados) {
    const ctx = document.getElementById('chartAcertosErros').getContext('2d');
    
    const totais = calcularTotais(dados);
    
    charts.acertosErros = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Acertos', 'Erros'],
            datasets: [{
                data: [totais.taxaAcertos, totais.taxaErros],
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#218838', '#c82333'],
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoEvolucao(dados) {
    const ctx = document.getElementById('chartEvolucao').getContext('2d');
    
    // Ordenar por ID (assumindo que IDs representam ordem cronológica)
    const atividadesOrdenadas = [...dados.atividades].sort((a, b) => a.id - b.id);
    const labels = atividadesOrdenadas.map(a => a.nome);
    const taxasAcerto = atividadesOrdenadas.map(a => {
        const total = a.acertos + a.erros;
        return total > 0 ? (a.acertos / total * 100) : 0;
    });
    
    charts.evolucao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Taxa de Acerto',
                data: taxasAcerto,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Taxa de Acerto (%)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const atividade = atividadesOrdenadas[context.dataIndex];
                            return [
                                `Taxa de Acerto: ${context.raw.toFixed(1)}%`,
                                `Acertos: ${atividade.acertos}`,
                                `Erros: ${atividade.erros}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoRanking(dados) {
    const ctx = document.getElementById('chartRanking').getContext('2d');
    
    const atividadesOrdenadas = [...dados.atividades].sort((a, b) => {
        const taxaA = a.acertos / (a.acertos + a.erros);
        const taxaB = b.acertos / (b.acertos + b.erros);
        return taxaB - taxaA;
    });
    
    const labels = atividadesOrdenadas.map(a => a.nome);
    const taxasAcerto = atividadesOrdenadas.map(a => {
        const total = a.acertos + a.erros;
        return total > 0 ? (a.acertos / total * 100) : 0;
    });
    const cores = atividadesOrdenadas.map(a => a.cor);
    
    charts.ranking = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: taxasAcerto,
                backgroundColor: cores,
                borderColor: cores.map(cor => cor),
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const atividade = atividadesOrdenadas[context.dataIndex];
                            return [
                                `Taxa de Acerto: ${context.raw.toFixed(1)}%`,
                                `Posição no Ranking: ${context.dataIndex + 1}°`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Taxa de Acerto (%)'
                    }
                }
            }
        }
    });
}

function criarGraficoDistribuicao(dados) {
    const ctx = document.getElementById('chartDistribuicao').getContext('2d');
    
    // Calcular distribuição baseada nas taxas de acerto
    const distribuicoes = [
        { range: '0-20%', count: 0, cor: '#FF6384' },
        { range: '21-40%', count: 0, cor: '#36A2EB' },
        { range: '41-60%', count: 0, cor: '#FFCE56' },
        { range: '61-80%', count: 0, cor: '#4BC0C0' },
        { range: '81-100%', count: 0, cor: '#9966FF' }
    ];
    
    dados.atividades.forEach(atividade => {
        const taxa = (atividade.acertos / (atividade.acertos + atividade.erros)) * 100;
        if (taxa <= 20) distribuicoes[0].count++;
        else if (taxa <= 40) distribuicoes[1].count++;
        else if (taxa <= 60) distribuicoes[2].count++;
        else if (taxa <= 80) distribuicoes[3].count++;
        else distribuicoes[4].count++;
    });
    
    charts.distribuicao = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: distribuicoes.map(d => d.range),
            datasets: [{
                data: distribuicoes.map(d => d.count),
                backgroundColor: distribuicoes.map(d => d.cor),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} atividade(s)`;
                        }
                    }
                }
            }
        }
    });
}

// Funções de UI
function mostrarLoading() {
    elements.loadingElement.style.display = 'block';
    elements.dashboardElement.style.display = 'none';
    const anoSelecionado = elements.selectTurma.options[elements.selectTurma.selectedIndex].text;
    elements.loadingElement.innerHTML = `
        <div class="spinner"></div>
        <div>Carregando dados da turma...</div>
        <div style="font-size: 0.9rem; margin-top: 10px; color: #666;">
            ${anoSelecionado}
        </div>
    `;
}

function mostrarDashboard() {
    elements.loadingElement.style.display = 'none';
    elements.dashboardElement.style.display = 'block';
}

function mostrarErro(mensagem) {
    elements.errorMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2L1,21H23M12,6L19.5,19H4.5M11,10V14H13V10M11,16V18H13V16"/>
            </svg>
            <div>${mensagem}</div>
        </div>
    `;
    elements.errorMessage.style.display = 'block';
    elements.loadingElement.style.display = 'none';
}

function esconderErro() {
    elements.errorMessage.style.display = 'none';
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 DOM Carregado - Inicializando aplicação...');
    console.log('📍 URL Base:', window.location.origin);
    console.log('📁 Caminho:', window.location.pathname);
    console.log('🔗 API Base:', API_CONFIG.baseURL);
    
    // Pequeno delay para garantir que tudo esteja carregado
    setTimeout(init, 100);
});

// Utilitários para debug (disponíveis no console)
window.appDebug = {
    recarregarDados: carregarDados,
    limparCache: () => { 
        cacheDados.timestamp = null; 
        console.log('🗑️ Cache limpo'); 
    },
    verCache: () => cacheDados,
    testarAPI: async () => {
        console.log('🧪 Testando API...');
        try {
            const resultado = await fetchAPI('estatisticas.php', { turma: '1' });
            console.log('✅ Teste da API bem-sucedido:', resultado);
            return resultado;
        } catch (error) {
            console.error('❌ Teste da API falhou:', error);
            return error;
        }
    },
    verConfig: () => API_CONFIG
};