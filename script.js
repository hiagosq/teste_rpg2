// =========================
// HELPERS: localStorage simples (compatível com seus usos anteriores)
// =========================
const getLocal = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    // já gravamos objetos como JSON em algumas rotas; tenta parse
    try {
        return JSON.parse(value);
    } catch {
        // fallback para valores primitivos
        if (defaultValue === true || defaultValue === false) return value === 'true';
        if (!isNaN(defaultValue) && !isNaN(value)) return Number(value);
        return value;
    }
};

const setLocal = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        localStorage.setItem(key, String(value));
    }
};

// =========================
// Estado global (inicializa a partir do localStorage)
// =========================
let screen = getLocal('screen', 'name_input');
let userName = getLocal('userName', '');
let selectedChoice = getLocal('selectedChoice', null); // ex: 'img_1'
let status = getLocal('status', 'NONE');
let confirmedAccess = getLocal('confirmedAccess', false);
let isMasked = getLocal('isMasked', false);

// Áudio (mantive sua URL)
const audioTense = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

// =========================
// IMAGENS DO SISTEMA (agora cada entrada tem pvTotal e pdTotal específicos)
// =========================
const IMAGES = [
    {
        id: 'img_1',
        selectionUrl: 'img/img1.jpg',
        normalUrl: 'img/foto1.jpg',
        maskedUrl: 'img/masc1.jpg',
        pvTotal: 55,
        pdTotal: 77,
        details: [
            { title: "Origem", 
                info: "Você recebe +2 na Defesa e seu deslocamento aumenta em +3m.", 
                maskInfo: "ORIGEM SECRETA: ..." },
            { title: "Trilha Graduado", 
                info: "NEX 10%- Você aprende um ritual de 1º círculo. Toda vez que ganha acesso a um novo círculo, aprende um ritual adicional daquele círculo. Esses rituais não contam no seu limite de rituais. <br><br> NEX 40%- Você cria um grimório especial, que armazena rituais que sua mente não seria capaz de guardar. Para conjurar um ritual armazenado em seu grimório, você precisa antes gastar uma ação completa folheando o grimório e relembrando o ritual. Se perdê-lo, você pode replicá-lo com duas ações de interlúdio.", 
                maskInfo: "PODER OCULTO..." },
            { title: "Poderes de Classe", 
                info: "Improvisar Componentes- Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual. <br><br> Ritual Predileto- Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes. <br><br> Mestre em Elemento- Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE.", 
                maskInfo: "Conselho Sombra." },
            { title: "Inventário", 
                info: "CARGA MÁXIMA: 5 <br><br> Balas Curtas (1)<br> Balas Curtas (1)<br> Balas Curtas (1) <br> Kit de Primeiros Socorros (1)<br> Componentes Ritualísticos (1) <br> Componente Ritualístico (1) <br> Pistola [dano: 1d12/18]", 
                maskInfo: "PROTOCOLO VERMELHO." },
        ]
    },
    {
        id: 'img_2',
        selectionUrl: 'img/img2.jpg',
        normalUrl: 'img/foto2.jpg',
        maskedUrl: 'img/masc2.jpg',
        pvTotal: 80,
        pdTotal: 48,
        details: [
            { title: "Origem", 
                info: "Aula de Campo- Você sabe extrair o melhor das pessoas. Uma vez por cena, pode gastar uma ação padrão e 2 PE para fornecer +1 em um atributo de outro personagem em alcance curto até o fim da cena.", 
                maskInfo: "[DADOS SIGILOSOS]." },
            { title: "Trilha Tropa de Choque", 
                info: "NEX 10%- Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado. <br><br> NEX 40%- Você pode direcionar aliados em alcance curto. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.", 
                maskInfo: "Visão Zero." },
            { title: "Poderes de Classe", 
                info: "Golpe Pesado- O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo. <br><br> Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. <br><br> Você pode gastar uma ação de movimento e 2 PE para produzir garras, chifres ou uma lâmina de sangue cristalizado que brota de seu antebraço. A arma causa 1d6 pontos de dano de Sangue. Uma vez por turno, quando você usa a ação agredir, pode gastar 1 PE para fazer um ataque adicional com essa arma.", 
                maskInfo: "Conselho Sombra." },
            { title: "Inventário", 
                info: "CARGA MÁXIMA: 15 <br><br> Balas Curtas (1)<br> Balas Curtas (1)<br> Cicatrizante [2d8+2] (1) <br> Cicatrizante [2d8+2] (1)<br> Montante Anti-Sangue [2d6+3/4d8(contra sangue)] (1)<br>SubMetralhadora [2d6/ Crítico: 19/3x] (1) <br> Proteção Leve [+5 Defesa] (2) ",
                 maskInfo: "Alerta Máximo." },
            { title: "Habilidade Extra", 
                info: "Apego Angustiante— Não importa o quão profundos sejam seus ferimentos, você escolhe a agonia enlouquecedora da dor a perder diante da própria morte. Você não fica inconsciente por estar morrendo, mas sempre que terminar uma rodada nesta condição e consciente, perde 2 PD.", 
                maskInfo: "Darknet." }
        ]
    },
    {
        id: 'img_3',
        selectionUrl: 'img/img3.jpg',
        normalUrl: 'img/foto3.jpg',
        maskedUrl: 'img/masc3.jpg',
        pvTotal: 37,
        pdTotal: 77,
        details: [
            { title: "Origem", 
                info: "Técnica Medicinal- Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.", 
                maskInfo: "[SIGILO]." },
            { title: "Trilha Flagelado", 
                info: "NEX 10%- Ao conjurar um ritual, você pode gastar seus próprios pontos de vida para pagar o custo em pontos de esforço, à taxa de 2 PV por PE pago. Pontos de vida gastos dessa forma só podem ser recuperados com descanso. <br><br> NEX 40%- Sempre que sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade.<br><br> (Saber Ampliado) NEX 10%- Você sabe atingir os pontos vitais de um inimigo distraído. Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +2d6 do mesmo dano do ataque.", 
                maskInfo: "Visão Zero." },
            { title: "Poderes de Classe", 
                info: "Visão do Oculto- Você não enxerga mais pelos olhos, mas sim pela percepção do Conhecimento em sua mente. Você recebe +5 em testes de Percepção e enxerga no escuro. <br><br> Mestre em Elemento- Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE. <br><br> Casualidade Fortuina- A Energia o conduz rumo à descobertas. Em cenas de investigação, a DT para procurar pistas diminui em -5 para você até você encontrar uma pista.",
                 maskInfo: "Conselho Sombra." },
            { title: "Inventário", 
                info: "CARGA MÁXIMA: 10 <br><br> Componente Ritualístico (1)<br> Componente Ritualístico (1)<br>Componente Ritualístico (1)<br> Corrente [1d8/2x] (1) <br> Emissor de Pulso Paranormal (1): <br> Ativar a caixa gasta uma ação completa e 1 PE. A caixa emite um pulso de um elemento definido pelo ativador, que atrai criaturas do mesmo elemento e afasta criaturas do elemento oposto. As criaturas afetadas têm direito a um teste de Vontade (DT Pre) para evitar o efeito. <br> Kit de Primeiros Socorros (1) <br> Machadinha [1d6/3x] (1)", 
                maskInfo: "Vermelho." },
            { title: "Habilidade Extra", 
                info: "Arma de Sangue— A arma tem sede de sangue e persegue seus alvos, anulando penalidades por camuflagem e meia cobertura. Caso a arma seja de ataque à distância, seu alcance também aumenta em uma categoria. Além disso, a margem de ameaça da arma duplica. Custa 2 PD", 
                maskInfo: "Darknet." }
        ]
    },
    {
        id: 'img_4',
        selectionUrl: 'img/img4.jpg',
        normalUrl: 'img/foto4.jpg',
        maskedUrl: 'img/masc4.jpg',
        pvTotal: 49,
        pdTotal: 67,
        details: [
            { title: "Origem", 
                info: "Saber é Poder- Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.", 
                maskInfo: "[SIGILO]." },
            { title: "Trilha Gaturno", 
                info: "NEX 10%- Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +2d6 pontos de dano do mesmo tipo da arma. <br><br> Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade (veja a perícia Furtividade). <br><br> (Saber Ampliado) NEX 10%- Você pode usar uma ação padrão e 2 PE para curar 2d10 pontos de vida a de si mesmo ou de um aliado adjacente. Você pode curar +1d10 PV respectivamente em NEX 40%, 65% e 99%, gastando +1 PE por dado adicional de cura.", 
                maskInfo: "Visão Zero." },
            { title: "Poderes de Classe", 
                info: "Eclético- Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia. <br><br> Perito- Escolha duas perícias nas quais você é treinado. Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste. <br><br> Resistir a Morte- Você recebe resistência 10 contra o Elemento Morte. ",
                 maskInfo: "Conselho Sombra." },
            { title: "Inventário", 
                info: "CARGA MÁXIMA: 5 <br><br> Algemas (1) <br> -ara prender uma pessoa que não esteja indefesa você precisa empunhar a algema, agarrar a pessoa e então vencer um novo teste de agarrar contra ela. Você pode prender os dois pulsos da pessoa (–5 em testes que exijam o uso das mãos, impede conjuração) ou um dos pulsos dela em um objeto imóvel adjacente, caso haja, para impedir que ela se mova. Escapar das algemas exige um teste de Acrobacia contra DT 30 (1)<br> Bandoleira (1) <br> -Um cinto com bolsos e alças. Uma vez por rodada, você pode sacar ou guardar um item em seu inventário como uma ação livre.<br>Faca [1d4/19] (1)<br> Maça [2d6/2x] (1) <br> Pistola Sinalizadora (1) <br> -Pode ser usada uma vez como uma arma de disparo leve com alcance curto que causa 2d6 pontos de dano de fogo. A pistola vem com 2 cargas. Uma caixa adicional com 2 cargas é um item de categoria 0 que ocupa 1 espaço.", 
                maskInfo: "Vermelho." },
            { title: "Habilidade Extra", 
                info: "Pelos Olhos Dele— Por mais assustador que seja encarar o paranormal, fazer isso pode fornecer a chave para escapar dele com vida. Se estiver em uma cena envolvendo uma criatura paranormal, você pode gastar uma rodada e 3 PD para encarar essa criatura. Se fizer isso, você recebe +5 em testes contra a criatura até o fim da cena. <br><br> Poder Não Desejado- O limite de PP(ponto de possessão) que você pode gastar é igual a sua presença, para cada PP gasto por turno, você recupera 10 PV ou 3 PE. Você recupera 1 PP a cada ação de interlúdio (dormir).<br> - Reserva atual: 6 PP", 
                maskInfo: "Darknet." }
        ]
    },
    {
        id: 'img_5',
        selectionUrl: 'img/img5.jpg',
        normalUrl: 'img/foto5.jpg',
        maskedUrl: 'img/masc5.jpg',
        pvTotal: 70,
        pdTotal: 39,
        details: [
            { title: "Origem", 
                info: "Desbravador- Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil.", 
                maskInfo: "[SIGILO]." },
            { title: "Trilha Operaçõees Especiais", 
                info: "10%- Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada. <br><br> NEX 40%- Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional. ", 
                maskInfo: "Visão Zero." },
            { title: "Poderes de Classe", 
                info: "Ataque Especial- Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5. Você pode aplicar cada bônus de +5 em ataque ou dano. <br><br> Tiro Certeiro-Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). <br><br> Combate Defensivo- Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –1d20 em todos os testes de ataque, mas recebe +5 na Defesa. <br><br> Combater Com Duas Armas- Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –1d20 em todos os testes de ataque até o seu próximo turno.", 
                maskInfo: "Conselho Sombra." },
            { title: "Inventário", 
                info: "CARGA MÁXIMA: 10 <br><br> Arco Composto [1d10/3x] (1)<br> Cicatrizante [2d8+2] (1)<br>Flechas (1)<br> Lança [1d8/2x] (1)", 
                maskInfo: "Habilidade Extra" },
            { title: "Habilidade Extra", 
                info: "Fuga Obstinada- Seu instinto de sobrevivência lhe impulsiona para desprender as mais desesperadas fugas. Você recebe +1d20 em testes de perícia para fugir de um inimigo. Além disso, em cenas de perseguição, se você for a presa, pode acumular até 4 falhas antes de ser pego. Custa 2 PD <br><br> Remoer Memória- sua mente está constantemente revivendo memórias do passado, sejam elas boas ou ruins. Uma vez por cena, quando faz um teste de perícia baseada em Intelecto ou Presença, você pode gastar 2 PD para substituir esse teste por um teste de Intelecto com DT 15. <br><br> Lança Caçadora- Com a capacidade de gerar uma descarga momentânea de Energia, a arma ganha a capacidade de ser arremessada em alcance curto e causa mais um dado de dano. Após efetuar um ataque à distância com a arma, ela volta voando para você no mesmo turno. Custa 3 PD.", 
                maskInfo: "Darknet." }
        ]
    }
];

// =========================
// UTIL: dados por personagem (salva e carrega objeto JSON) - agora usa pvTotal/pdTotal do IMAGES
// =========================
function getCharacterData(id) {
    const key = "charData_" + id;
    const raw = localStorage.getItem(key);
    if (!raw) {
        // busca os valores padrão da imagem correspondente
        const img = IMAGES.find(i => i.id === id);
        const defaultData = {
            name: "",
            origin: "",
            class: "",
            pvCurrent: img ? img.pvTotal : 70,
            pvTotal: img ? img.pvTotal : 70,
            pdCurrent: img ? img.pdTotal : 50,
            pdTotal: img ? img.pdTotal : 50
        };
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }
    try {
        const parsed = JSON.parse(raw);
        // se o char foi salvo antes de termos pvTotal/pdTotal fixos, normalize para os valores atuais
        const img = IMAGES.find(i => i.id === id);
        if (img) {
            if (typeof parsed.pvTotal === 'undefined') parsed.pvTotal = img.pvTotal;
            if (typeof parsed.pdTotal === 'undefined') parsed.pdTotal = img.pdTotal;
            // garante limites
            parsed.pvCurrent = Math.max(0, Math.min(parsed.pvTotal, parsed.pvCurrent ?? parsed.pvTotal));
            parsed.pdCurrent = Math.max(0, Math.min(parsed.pdTotal, parsed.pdCurrent ?? parsed.pdTotal));
        }
        return parsed;
    } catch {
        const img = IMAGES.find(i => i.id === id);
        return {
            name: "",
            origin: "",
            class: "",
            pvCurrent: img ? img.pvTotal : 70,
            pvTotal: img ? img.pvTotal : 70,
            pdCurrent: img ? img.pdTotal : 50,
            pdTotal: img ? img.pdTotal : 50
        };
    }
}

function saveCharacterData(id, data) {
    localStorage.setItem("charData_" + id, JSON.stringify(data));
}

// =========================
// FUNÇÕES DE ALERTA
// =========================
function showMessage(title, message, type = 'error') {
    const color = type === 'error'
        ? 'bg-red-800 border-red-500'
        : 'bg-green-800 border-green-500';

    const html = `
        <div id="alert" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div class="${color} p-6 rounded-lg shadow-xl border-l-4 max-w-sm w-full">
                <h3 class="text-xl font-bold mb-3">${title}</h3>
                <p class="text-gray-200 mb-4">${message}</p>
                <button id="alertOk"
                    class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                    OK
                </button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('alertOk').onclick = () => {
        const el = document.getElementById('alert');
        if (el) el.remove();
    };
}

// =================================================
// AÇÕES DE ENTRADA / SELEÇÃO
// =================================================
function handleNameSubmit(name) {
    if (name.trim() === "") {
        showMessage("Aviso", "Digite seu nome.");
        return;
    }

    userName = name.trim();
    setLocal("userName", userName);

    screen = "image_selection";
    setLocal("screen", screen);

    render();
}

function handleImageSelect(id) {
    if (confirmedAccess || status === "CONFIRMED") return;

    selectedChoice = id;
    status = "PENDING";

    setLocal("selectedChoice", id);
    setLocal("status", status);

    render();
}

function simulateMasterConfirm() {
    if (!selectedChoice) return showMessage("Erro", "Nada para aprovar.");

    status = "CONFIRMED";
    setLocal("status", status);

    render();
}

function simulateMasterReject() {
    if (!selectedChoice) return showMessage("Erro", "Nada para rejeitar.");

    status = "REJECTED";
    confirmedAccess = false;

    setLocal("status", status);
    setLocal("confirmedAccess", false);

    render();
}

function handleConfirmAccess() {
    if (status !== "CONFIRMED") return;

    confirmedAccess = true;
    setLocal("confirmedAccess", true);

    screen = "personal_page";
    setLocal("screen", screen);

    render();
}

// =================================================
// MÁSCARA
// =================================================
function handleMaskOn() {
    audioTense.loop = true;
    audioTense.volume = 0.5;
    audioTense.play();

    document.body.classList.add("flashing");

    setTimeout(() => {
        document.body.classList.remove("flashing");
        isMasked = true;
        setLocal("isMasked", true);
        render();
    }, 2000);
}

function handleMaskOff() {
    audioTense.pause();
    audioTense.currentTime = 0;

    isMasked = false;
    setLocal("isMasked", false);

    render();
}

// =================================================
// ACORDEÃO (utilitário — reutilizável em todas as telas)
function toggleAccordion(id, prefix = '') {
    const el = document.getElementById(prefix + "acc_" + id);
    const icon = document.getElementById(prefix + "ico_" + id);
    if (!el) return;

    const isOpen = el.classList.contains("active");

    document.querySelectorAll((prefix ? `#${prefix}acc_container .accordion-content` : ".accordion-content")).forEach(e => e.classList.remove("active"));
    document.querySelectorAll((prefix ? `#${prefix}acc_container .accordion-icon` : ".accordion-icon")).forEach(i => i.classList.remove("rotate-90"));

    if (!isOpen) {
        el.classList.add("active");
        if (icon) icon.classList.add("rotate-90");
    }
}

window.toggleAccordion = toggleAccordion;

// =================================================
// TELA 1 — ENTRADA DO NOME
// =================================================
function renderNameInput() {
    app.innerHTML = `
        <div class="max-w-sm mx-auto mt-24 bg-gray-800 p-8 rounded-xl border border-red-600">
            <h1 class="text-3xl font-bold text-red-400 mb-6 text-center">Entrar na Sala</h1>

            <input id="name" class="w-full p-3 bg-gray-700 rounded mb-4" placeholder="Seu nome" value="${escapeHtml(userName)}">
            
            <button id="start" class="w-full bg-red-600 hover:bg-red-700 p-3 rounded">
                Entrar
            </button>

            <button onclick="clearStorage()" class="text-gray-500 text-sm mt-4">Limpar Dados</button>
        </div>
    `;

    document.getElementById("start").onclick = () =>
        handleNameSubmit(document.getElementById("name").value);
}

// =================================================
// TELA 2 — SELEÇÃO DAS IMAGENS
// =================================================
function renderImageSelection() {
    const grid = IMAGES.map(img => {
        const isSelected = selectedChoice === img.id;
        const isConfirmed = status === "CONFIRMED" && isSelected;

        return `
        <div class="flex flex-col items-center w-full md:w-1/5 p-2 ${status === "CONFIRMED" ? "cursor-default" : "cursor-pointer"}">
            
            <img src="${img.selectionUrl}" ${status === "CONFIRMED" ? "" : `onclick="handleImageSelect('${img.id}')"`}
                 class="rounded-lg w-full border-4 object-cover
                 ${isSelected && !isConfirmed ? "border-red-500 glow-red" : ""}
                 ${isConfirmed ? "border-green-500 glow-green" : ""}
                 ${status === "CONFIRMED" && !isSelected ? "opacity-40" : ""}">
            
            ${isSelected ? `<p class="mt-2 text-red-400 font-semibold">${escapeHtml(userName)}</p>` : ""}
        </div>`; 
    }).join("");

    let statusText = "";
    if (!selectedChoice) statusText = "Escolha um avatar.";
    else if (status === "PENDING") statusText = "Aguardando Mestre...";
    else if (status === "REJECTED") statusText = "Rejeitado. Escolha outro.";
    else if (status === "CONFIRMED") statusText = "Aprovado! Confirme o acesso.";

    app.innerHTML = `
        <div class="max-w-6xl mx-auto mt-10 bg-gray-800 p-8 rounded-xl border border-red-600 text-center">
            
            <h1 class="text-3xl text-red-400 font-bold mb-8">Escolha seu Avatar</h1>

            <div class="flex flex-wrap justify-center gap-4 mb-6">
                ${grid}
            </div>

            <p class="text-xl mb-4">${statusText}</p>

            ${status === "CONFIRMED" && !confirmedAccess ? `
                <button onclick="handleConfirmAccess()"
                        class="bg-indigo-600 hover:bg-indigo-700 py-3 px-12 rounded-lg font-semibold mb-6">
                    Confirmar Acesso
                </button>
            ` : ""}

            ${selectedChoice ? `
            <div class="bg-gray-900 p-4 border-l-4 border-yellow-500 rounded-lg max-w-lg mx-auto mt-6">
                <p class="text-yellow-400 font-bold mb-2">Painel do Mestre</p>

                <button onclick="simulateMasterConfirm()" 
                        class="bg-green-600 p-2 rounded mr-3">Aprovar</button>
                <button onclick="simulateMasterReject()" 
                        class="bg-red-600 p-2 rounded">Rejeitar</button>
            </div>` : ""}

            <p class="text-gray-500 mt-6 text-sm">Usuário: ${escapeHtml(userName)}</p>
        </div>
    `;
}

// =================================================
// TELA 3 — PÁGINA PESSOAL (FINAL)
// =================================================
function updateBarsForData(data) {
    const lifeElem = document.getElementById("lifeBar");
    const lifeText = document.getElementById("lifeText");
    const pdElem = document.getElementById("pdBar");
    const pdText = document.getElementById("pdText");

    if (!lifeElem || !pdElem || !lifeText || !pdText) return;

    const lifePercent = (data.pvCurrent / data.pvTotal) * 100;
    lifeElem.style.width = lifePercent + "%";
    lifeText.innerText = `${data.pvCurrent}/${data.pvTotal}`;

    const pdPercent = (data.pdCurrent / data.pdTotal) * 100;
    pdElem.style.width = pdPercent + "%";
    pdText.innerText = `${data.pdCurrent}/${data.pdTotal}`;
}

function modifyPV(amount) {
    if (!selectedChoice) return;
    const data = getCharacterData(selectedChoice);
    data.pvCurrent = Math.max(0, Math.min(data.pvTotal, (data.pvCurrent || data.pvTotal) + amount));
    saveCharacterData(selectedChoice, data);
    updateBarsForData(data);
}

function modifyPD(amount) {
    if (!selectedChoice) return;
    const data = getCharacterData(selectedChoice);
    data.pdCurrent = Math.max(0, Math.min(data.pdTotal, (data.pdCurrent || data.pdTotal) + amount));
    saveCharacterData(selectedChoice, data);
    updateBarsForData(data);
}

function renderPersonalPage() {
    const img = IMAGES.find(i => i.id === selectedChoice);
    if (!img) return clearStorage();

    const data = getCharacterData(selectedChoice);
    const imageUrl = isMasked ? img.maskedUrl : img.normalUrl;

    // acordeões principais (historico etc)
    const accordion = img.details
        .map((d, i) => `
            <div class="border border-gray-600/50 rounded-lg overflow-hidden">
                <button onclick="toggleAccordion('${i}')"
                    class="accordion-title w-full p-4 bg-gray-700 flex justify-between items-center font-semibold">
                    ${d.title}
                    <svg id="ico_${i}" class="accordion-icon w-4 h-4 text-yellow-400"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5l7 7-7 7"/>
                    </svg>
                </button>

                <div id="acc_${i}" class="accordion-content bg-gray-700/40 p-2 rounded-b-lg">
                    <p class="text-sm leading-relaxed">
                        ${isMasked ? d.maskInfo : d.info}
                    </p>
                </div>
            </div>
        `).join("");

    // botão extra aparece apenas para esses ids
    const showExtraButton = ['img_1','img_3','img_4'].includes(img.id);
    const extraButtonHtml = showExtraButton ? `
        <div class="mt-4 text-right">
            <button onclick="openExtraPage()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">
                Página Extra
            </button>
        </div>
    ` : '';

    app.innerHTML = `
        <div class="max-w-5xl mx-auto mt-10 bg-gray-800 p-8 rounded-xl border border-red-600">

            <h1 class="text-3xl font-bold text-red-400 text-center mb-10">
                Página do Personagem
            </h1>

            <div class="grid grid-cols-3 gap-6 items-start">

                <div class="flex justify-start">
                    <img src="${imageUrl}" 
                         class="person-image rounded-lg border-4
                         ${isMasked ? "border-black glow-red" : "border-green-500 glow-green"}">
                </div>

                <div class="info-box text-center">

                    <div class="text-left mx-auto mb-4 w-60">
                        <label class="block text-gray-300 text-sm mb-1"><strong>Nome do Personagem:</strong></label>
                        <input id="charNameInput"
                               class="w-full p-2 rounded bg-gray-700 border border-gray-600"
                               value="${escapeHtml(data.name)}"
                               placeholder="Digite o nome">
                    </div>

                    <div class="text-left mx-auto mb-4 w-60">
                        <label class="block text-gray-300 text-sm mb-1"><strong>Origem:</strong></label>
                        <input id="charOriginInput"
                               class="w-full p-2 rounded bg-gray-700 border border-gray-600"
                               value="${escapeHtml(data.origin)}"
                               placeholder="Origem">
                    </div>

                    <div class="text-left mx-auto mb-4 w-60">
                        <label class="block text-gray-300 text-sm mb-1"><strong>Classe:</strong></label>
                        <input id="charClassInput"
                               class="w-full p-2 rounded bg-gray-700 border border-gray-600"
                               value="${escapeHtml(data.class)}"
                               placeholder="Classe">
                    </div>

                    <hr class="my-4 opacity-40">

                    <div class="mb-6">
                        <p class="text-red-400 font-bold">Vida</p>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="btn-counter" onclick="modifyPV(-1)">-</span>

                            <div class="status-bar w-full">
                                <div id="lifeBar" class="bar-life" style="width:0%"></div>
                                <div id="lifeText" class="bar-text"></div>
                            </div>

                            <span class="btn-counter" onclick="modifyPV(1)">+</span>
                        </div>
                    </div>

                    <div class="mb-6">
                        <p class="text-blue-400 font-bold">Pontos de Determinação (PD)</p>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="btn-counter" onclick="modifyPD(-1)">-</span>

                            <div class="status-bar w-full">
                                <div id="pdBar" class="bar-pd" style="width:0%"></div>
                                <div id="pdText" class="bar-text"></div>
                            </div>

                            <span class="btn-counter" onclick="modifyPD(1)">+</span>
                        </div>
                    </div>

                </div>

                <div class="flex flex-col items-end">
                    <img src="img/simbolo.png" class="symbol-image opacity-90 mb-4">
                    ${extraButtonHtml}
                </div>

            </div>

            <div id="acc_container" class="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                ${accordion}
            </div>

            <button onclick="${isMasked ? "handleMaskOff()" : "handleMaskOn()"}"
                class="w-full py-3 rounded-lg font-semibold
                ${isMasked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}">
                ${isMasked ? "DESATIVAR MÁSCARA" : "ATIVAR MÁSCARA"}
            </button>

            <button onclick="clearStorage()"
                class="w-full py-3 mt-4 rounded-lg bg-gray-700 hover:bg-gray-600">
                RESETAR TUDO
            </button>

        </div>
    `;

    // listeners: salvam imediatamente no localStorage
    const nameInput = document.getElementById("charNameInput");
    const originInput = document.getElementById("charOriginInput");
    const classInput = document.getElementById("charClassInput");

    if (nameInput) nameInput.addEventListener("input", (e) => {
        const d = getCharacterData(selectedChoice);
        d.name = e.target.value;
        saveCharacterData(selectedChoice, d);
    });
    if (originInput) originInput.addEventListener("input", (e) => {
        const d = getCharacterData(selectedChoice);
        d.origin = e.target.value;
        saveCharacterData(selectedChoice, d);
    });
    if (classInput) classInput.addEventListener("input", (e) => {
        const d = getCharacterData(selectedChoice);
        d.class = e.target.value;
        saveCharacterData(selectedChoice, d);
    });

    // inicializa barras com os valores do personagem
    setTimeout(() => updateBarsForData(data), 50);
}

// =================================================
// TELA EXTRA — com +6 acordeões (voltar para personal_page)
// =================================================
function renderExtraPage() {
    const img = IMAGES.find(i => i.id === selectedChoice);
    if (!img) return renderPersonalPage();

    // cria 6 blocos extras (poderia vir do servidor; aqui são genéricos)
    const extras = Array.from({length: 6}, (_, idx) => ({
        title: `Dado extra ${idx+1}`,
        info: `Informação detalhada do dado extra ${idx+1} para ${img.id}.`,
        maskInfo: `INFO OCULTA ${idx+1}`
    }));

    const extrasHtml = extras.map((d, i) => `
        <div class="border border-gray-600/50 rounded-lg overflow-hidden">
            <button onclick="toggleAccordion('${i}','extra_')"
                class="accordion-title w-full p-4 bg-gray-700 flex justify-between items-center font-semibold">
                ${d.title}
                <svg id="extra_ico_${i}" class="accordion-icon w-4 h-4 text-yellow-400"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5l7 7-7 7"/>
                </svg>
            </button>

            <div id="extra_acc_${i}" class="accordion-content bg-gray-700/40 p-2 rounded-b-lg">
                <p class="text-sm leading-relaxed">
                    ${isMasked ? d.maskInfo : d.info}
                </p>
            </div>
        </div>
    `).join("");

    app.innerHTML = `
        <div class="max-w-4xl mx-auto mt-10 bg-gray-800 p-8 rounded-xl border border-red-600">
            <h1 class="text-2xl font-bold text-yellow-300 mb-6">Página Extra — ${escapeHtml(img.id)}</h1>

            <div id="extra_acc_container" class="grid grid-cols-1 gap-4 mb-6">
                ${extrasHtml}
            </div>

            <div class="flex gap-3">
                <button onclick="renderPersonalPage()" class="px-4 py-2 bg-gray-700 rounded">Voltar</button>
                <button onclick="clearStorage()" class="px-4 py-2 bg-red-600 rounded">Resetar Tudo</button>
            </div>
        </div>
    `;
}

// função que abre a extra page (usada pelo botão)
function openExtraPage() {
    screen = "extra_page";
    setLocal("screen", screen);
    render();
}

// =================================================
// ESCAPAR HTML (para segurança mínima ao inserir valores em HTML)
// =================================================
function escapeHtml(str) {
    if (str === undefined || str === null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =================================================
// LIMPAR STORAGE
// =================================================
function clearStorage() {
    localStorage.clear();
    audioTense.pause();
    audioTense.currentTime = 0;
    document.body.classList.remove("flashing");

    screen = "name_input";
    userName = "";
    selectedChoice = null;
    status = "NONE";
    confirmedAccess = false;
    isMasked = false;

    render();
}

// =================================================
// RENDER PRINCIPAL
// =================================================
const app = document.getElementById("app");

function render() {
    if (!app) return console.error("Elemento #app não encontrado no DOM.");

    if (screen === "name_input") return renderNameInput();
    if (screen === "image_selection") return renderImageSelection();
    if (screen === "personal_page") return renderPersonalPage();
    if (screen === "extra_page") return renderExtraPage();

    // fallback
    screen = "name_input";
    setLocal("screen", screen);
    renderNameInput();
}

// inicializa a partir do DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // re-ler estados simples (em caso de parse)
    screen = getLocal('screen', 'name_input');
    userName = getLocal('userName', '');
    selectedChoice = getLocal('selectedChoice', null);
    status = getLocal('status', 'NONE');
    confirmedAccess = getLocal('confirmedAccess', false);
    isMasked = getLocal('isMasked', false);

    render();
});


document.addEventListener("DOMContentLoaded", render);
