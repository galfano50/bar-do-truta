// ficha.js corrigido e completo para salvar/carregar todos os campos no Firebase
import { app, db, auth } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "index.html";
  } else {
    currentUser = user;
    const params = new URLSearchParams(window.location.search);
    const personagemId = params.get("personagemId");
    if (personagemId) {
      const inputId = document.getElementById('personagemId');
      if (inputId) inputId.value = personagemId;
      carregarFicha(`${user.uid}_${personagemId}`);
    }
  }
});

window.salvarFicha = async function () {
  const id = document.getElementById('personagemId')?.value.trim();
  if (!id || !currentUser) return alert("Informe o ID do personagem e esteja logado.");

  const docId = `${currentUser.uid}_${id}`;

  const getVal = (id) => document.getElementById(id)?.value || "";
  const getTxt = (id) => document.getElementById(id)?.textContent || "";

  const ficha = {
    uid: currentUser.uid,
    nome: getVal('nome'),
    raca: getVal('raca'),
    classe: getVal('classe'),
    individualidade: getVal('individualidade'),
    alcunha: getVal('alcunha'),
    patente: getVal('patente'),
    estilo: getVal('estilo'),
    idade: getVal('idade'),
    altura: getVal('altura'),
    nivel: getVal('nivel'),
    xp: getVal('xp'),
    vida: getVal('vida'),
    energia: getVal('energia'),
    danoSofrido: getVal('danoSofrido'),
    gasto1: getVal('gasto1'),
    pontos: getTxt('pontos'),
    pontos2: getTxt('pontos2'),
    stamina2: getVal('stamina2'),
    gasto3: getVal('gasto3'),
    forca: getVal('forca'),
    constituicao: getVal('constituicao'),
    destreza: getVal('destreza'),
    velocidade: getVal('velocidade'),
    dano: getVal('dano'),
    armadura: getVal('armadura'),
    iniciativa: getVal('iniciativa'),
    sabedoria: getVal('sabedoria'),
    percepcao: getVal('percepcao'),
    espirito: getVal('espirito'),
    concentracao: getVal('concentracao'),
    precisao: getVal('precisao'),
    recuperacao: getVal('recuperacao'),
    nado: getVal('nado'),
    voo: getVal('voo'),
    primaria: getVal('primaria'),
    secundaria: getVal('secundaria'),
    item1: getVal('item1'),
    item2: getVal('item2'),
    item3: getVal('item3'),
    item4: getVal('item4'),
    item5: getVal('item5'),
    item6: getVal('item6'),
    item7: getVal('item7'),
    golpes1: getVal('golpes1'),
    golpes2: getVal('golpes2'),
    golpes3: getVal('golpes3'),
    soma1: getTxt('soma1'), soma2: getTxt('soma2'), soma3: getTxt('soma3'),
    soma4: getTxt('soma4'), soma5: getTxt('soma5'), soma6: getTxt('soma6'),
    soma7: getTxt('soma7'), soma8: getTxt('soma8'), soma9: getTxt('soma9'),
    soma10: getTxt('soma10'), soma11: getTxt('soma11'), soma12: getTxt('soma12'),
    soma13: getTxt('soma13'), soma14: getTxt('soma14'), soma15: getTxt('soma15'),
    bonusRaca: getTxt('bonusRaca'),

    // Extras
    extra1: getVal('extra1'), extra2: getVal('extra2'), extra3: getVal('extra3'), extra4: getVal('extra4'),
    extra5: getVal('extra5'), extra6: getVal('extra6'), extra7: getVal('extra7'), extra8: getVal('extra8'),
    extra9: getVal('extra9'), extra10: getVal('extra10'), extra11: getVal('extra11'), extra12: getVal('extra12'),
    extra13: getVal('extra13'), extra14: getVal('extra14'), extra15: getVal('extra15'),

    // Fruta
    poder1: getVal('poder1'), poder2: getVal('poder2'), poder3: getVal('poder3'), poder4: getVal('poder4'),
    poder5: getVal('poder5'), poder6: getVal('poder6'), poder7: getVal('poder7'), poder8: getVal('poder8'),
    poder9: getVal('poder9'), poder10: getVal('poder10'), poder11: getVal('poder11'), poder12: getVal('poder12'),
    poder13: getVal('poder13'), poder14: getVal('poder14'), poder15: getVal('poder15'),

    // Haki detalhado
    grauPercepcao: getVal('grauPercepcao'), focoPercepcao: getVal('focoPercepcao'),
    premonicao: getVal('premonicao'), previsao: getVal('previsao'), verFuturo: getVal('verFuturo'),
    grauArmamento: getVal('grauArmamento'), focoArmamento: getVal('focoArmamento'),
    ofensivo: getVal('ofensivo'), defensivo: getVal('defensivo'), avancadoArmamento: getVal('avancadoArmamento'),
    grauRei: getVal('grauRei'), focoRei: getVal('focoRei'),
    ordem: getVal('ordem'), presenca: getVal('presenca'), avancadoRei: getVal('avancadoRei')
  };

  ficha.atributosBase = {};
  document.querySelectorAll('.atributos input[type="number"]').forEach(input => {
    ficha.atributosBase[input.id] = input.getAttribute('data-base') || '0';
  });

  ficha.hakiDetalhado = Array.from(document.querySelectorAll('.Haki input[type="number"]')).map(i => i.value);

  ficha.pericias = Array.from(document.querySelectorAll("#pericias-body tr")).map(row => {
    const inputs = row.querySelectorAll("input");
    return { nome: inputs[0]?.value || '', pontos: inputs[1]?.value || '' };
  });

  ficha.mochila = Array.from(document.querySelectorAll(".mochila-section textarea")).map(el => ({ nome: el.value }));

  ficha.akumaDetalhado = Array.from(document.querySelectorAll('.akuma-no-mi input')).map(i => i.value);
  const pontosRestantes = getTxt('pontosRestantesAkuma');
  if (pontosRestantes) ficha.akumaDetalhado.push(`__pontos__:${pontosRestantes}`);

  try {
    await setDoc(doc(db, "fichas", docId), ficha);
    alert("Ficha salva com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar:", e);
    alert("Erro ao salvar a ficha.");
  }
};

async function carregarFicha(docId) {
  try {
    const docRef = doc(db, "fichas", docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;
    const dados = snap.data();

    for (const key in dados) {
      const el = document.getElementById(key);
      if (el && dados[key] !== undefined) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
          el.value = dados[key];
        } else {
          el.textContent = dados[key];
        }
      }
    }

    if (dados.atributosBase) {
      for (const id in dados.atributosBase) {
        const el = document.getElementById(id);
        if (el) el.setAttribute("data-base", dados.atributosBase[id]);
      }
    }

    if (dados.pericias) {
      const tbody = document.getElementById("pericias-body");
      tbody.innerHTML = "";
      dados.pericias.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td><input value="${p.nome}"/></td><td><input value="${p.pontos}"/></td>`;
        tbody.appendChild(tr);
      });
    }

    if (dados.mochila) {
      const mochilas = document.querySelectorAll(".mochila-section textarea");
      dados.mochila.forEach((m, i) => {
        if (mochilas[i]) mochilas[i].value = m.nome;
      });
    }

    if (dados.akumaDetalhado) {
      const inputs = document.querySelectorAll('.akuma-no-mi input');
      dados.akumaDetalhado.forEach((v, i) => {
        if (inputs[i]) inputs[i].value = v.startsWith('__pontos__') ? '' : v;
      });
      const pontosAkuma = dados.akumaDetalhado.find(x => x.startsWith('__pontos__'));
      if (pontosAkuma) {
        const el = document.getElementById("pontosRestantesAkuma");
        if (el) el.textContent = pontosAkuma.split(':')[1];
      }
    }

  } catch (e) {
    console.error("Erro ao carregar ficha:", e);
    alert("Erro ao carregar a ficha.");
  }
}

window.carregarFicha = carregarFicha;