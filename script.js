// =========================
// LOCALSTORAGE
// =========================
const getLocal = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    if (defaultValue === true || defaultValue === false) return value === 'true';
    // try number
    if (!isNaN(defaultValue) && !isNaN(value)) return Number(value);
    return value;
};

const setLocal = (key, value) => localStorage.setItem(key, String(value));

// Estado global
let screen = getLocal('screen', 'name_input');
let userName = getLocal('userName', '');
let selectedChoice = getLocal('selectedChoice', null);
let status = getLocal('status', 'NONE');
let confirmedAccess = getLocal('confirmedAccess', false);
let isMasked = getLocal('isMasked', false);

// Áudio
const audioTense = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

// =========================
// IMAGENS DO SISTEMA
// =========================

const IMAGES = [
    {
        id: 'img_1',
        selectionUrl: 'img/img1.jpg',
        normalUrl: 'img/foto1.jpg',
        maskedUrl: 'img/masc1.jpg',
        details: [
            { title: "Origem", info: "Você recebe +2 na Defesa...", maskInfo: "ORIGEM SECRETA: ..." },
            { title: "Habilidade Primária", info: "Domínio estatístico...", maskInfo: "PODER OCULTO..." },
            { title: "Afiliação", info: "Agente Independente.", maskInfo: "Conselho Sombra." },
            { title: "Segurança", info: "Status Verde.", maskInfo: "PROTOCOLO VERMELHO." },
            { title: "Histórico", info: "Missões Alpha, Beta...", maskInfo: "Operações ocultas..." }
        ]
    },
    {
        id: 'img_2',
        selectionUrl: 'img/img2.jpg',
        normalUrl: 'img/foto2.jpg',
        maskedUrl: 'img/masc2.jpg',
        details: [
            { title: "Origem", info: "Origem pública.", maskInfo: "[DADOS SIGILOSOS]." },
            { title: "Habilidade", info: "Predição lógica.", maskInfo: "Visão Zero." },
            { title: "Afiliação", info: "Independente.", maskInfo: "Conselho Sombra." },
            { title: "Segurança", info: "Status Verde.", maskInfo: "Alerta Máximo." },
            { title: "Histórico", info: "Missões públicas.", maskInfo: "Operações ocultas." }
        ]
    },
    {
        id: 'img_3',
        selectionUrl: 'img/img3.jpg',
        normalUrl: 'img/foto3.jpg',
        maskedUrl: 'img/masc3.jpg',
        details: [
            { title: "Origem", info: "Origem pública.", maskInfo: "[SIGILO]." },
            { title: "Habilidade", info: "Predição.", maskInfo: "Visão Zero." },
            { title: "Afiliação", info: "Independente.", maskInfo: "Conselho Sombra." },
            { title: "Segurança", info: "Verde.", maskInfo: "Vermelho." },
            { title: "Histórico", info: "Alpha, Beta.", maskInfo: "Darknet." }
        ]
    },
    {
        id: 'img_4',
        selectionUrl: 'img/img4.jpg',
        normalUrl: 'img/foto4.jpg',
        maskedUrl: 'img/masc4.jpg',
        details: [
            { title: "Origem", info: "Origem pública.", maskInfo: "[SIGILO]." },
            { title: "Habilidade", info: "Predição.", maskInfo: "Visão Zero." },
            { title: "Afiliação", info: "Independente.", maskInfo: "Conselho Sombra." },
            { title: "Segurança", info: "Verde.", maskInfo: "Vermelho." },
            { title: "Histórico", info: "Beta, Gamma.", maskInfo: "Darknet." }
        ]
    },
    {
        id: 'img_5',
        selectionUrl: 'img/img5.jpg',
        normalUrl: 'img/foto5.jpg',
        maskedUrl: 'img/masc5.jpg',
        details: [
            { title: "Origem", info: "Origem pública.", maskInfo: "[SIGILO]." },
            { title: "Habilidade", info: "Predição.", maskInfo: "Visão Zero." },
            { title: "Afiliação", info: "Independente.", maskInfo: "Conselho Sombra." },
            { title: "Segurança", info: "Verde.", maskInfo: "Vermelho." },
            { title: "Histórico", info: "Alpha.", maskInfo: "Darknet." }
        ]
    }
];

// =========================
// UTIL: dados por personagem (salva e carrega objeto JSON)
// =========================

function getCharacterData(id) {
    const key = "charData_" + id;
    const raw = localStorage.getItem(key);
    if (!raw) {
        // valores iniciais padrão (você pode ajustar por personagem se quiser)
        const defaultData = {
            name: "",
            origin: "",
            class: "",
            pvCurrent: 70,
            pvTotal: 70,
            pdCurrent: 50,
            pdTotal: 50
        };
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }
    try {
        return JSON.parse(raw);
    } catch {
        return {
            name: "",
            origin: "",
            class: "",
            pvCurrent: 70,
            pvTotal: 70,
            pdCurrent: 50,
            pdTotal: 50
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
                <button onclick="document.getElementById('alert').remove()"
                    class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                    OK
                </button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
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
// ACORDEÃO
// =================================================

function toggleAccordion(id) {
    const el = document.getElementById("acc_" + id);
    const icon = document.getElementById("ico_" + id);

    const isOpen = el.classList.contains("active");

    document.querySelectorAll(".accordion-content").forEach(e => e.classList.remove("active"));
    document.querySelectorAll(".accordion-icon").forEach(i => i.classList.remove("rotate-90"));

    if (!isOpen) {
        el.classList.add("active");
        icon.classList.add("rotate-90");
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

            <input id="name" class="w-full p-3 bg-gray-700 rounded mb-4" placeholder="Seu nome" value="${userName}">
            
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
            
            ${isSelected ? `<p class="mt-2 text-red-400 font-semibold">${userName}</p>` : ""}
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

            <p class="text-gray-500 mt-6 text-sm">Usuário: ${userName}</p>
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
    const data = getCharacterData(selectedChoice);
    data.pvCurrent = Math.max(0, Math.min(data.pvTotal, data.pvCurrent + amount));
    saveCharacterData(selectedChoice, data);
    updateBarsForData(data);
}

function modifyPD(amount) {
    const data = getCharacterData(selectedChoice);
    data.pdCurrent = Math.max(0, Math.min(data.pdTotal, data.pdCurrent + amount));
    saveCharacterData(selectedChoice, data);
    updateBarsForData(data);
}

function renderPersonalPage() {
    const img = IMAGES.find(i => i.id === selectedChoice);
    if (!img) return clearStorage();

    const data = getCharacterData(selectedChoice);
    const imageUrl = isMasked ? img.maskedUrl : img.normalUrl;

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
                                <div id="lifeBar" class="bar-life"></div>
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
                                <div id="pdBar" class="bar-pd"></div>
                                <div id="pdText" class="bar-text"></div>
                            </div>

                            <span class="btn-counter" onclick="modifyPD(1)">+</span>
                        </div>
                    </div>

                </div>

                <div class="flex justify-end">
                    <img src="img/simbolo.png" class="symbol-image opacity-90">
                </div>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
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

    nameInput.addEventListener("input", (e) => {
        const d = getCharacterData(selectedChoice);
        d.name = e.target.value;
        saveCharacterData(selectedChoice, d);
    });
    originInput.addEventListener("input", (e) => {
        const d = getCharacterData(selectedChoice);
        d.origin = e.target.value;
        saveCharacterData(selectedChoice, d);
    });
    classInput.addEventListener("input", (e) => {
        const d = getCharacterData(selectedChoice);
        d.class = e.target.value;
        saveCharacterData(selectedChoice, d);
    });

    // inicializa barras com os valores do personagem
    setTimeout(() => updateBarsForData(data), 50);
}

// =================================================
// ESCAPAR HTML (para segurança mínima ao inserir valores em HTML)
// =================================================
function escapeHtml(str) {
    if (!str) return "";
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
    if (screen === "name_input") return renderNameInput();
    if (screen === "image_selection") return renderImageSelection();
    if (screen === "personal_page") return renderPersonalPage();

    renderNameInput();
}

document.addEventListener("DOMContentLoaded", render);
