const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Carregar o arquivo HTML
const html = fs.readFileSync('Classes.html', 'utf8');
const dom = new JSDOM(html);
const { document } = dom.window;

// Adicionar o script JavaScript
function extrairDadosMatutino() {
  const tabelas = document.querySelectorAll('table');
  const dadosExtraidos = [];

  tabelas.forEach(tabela => {
    const linhas = tabela.querySelectorAll('tr');
    const turmaHeader = tabela.previousElementSibling;
    const turma = turmaHeader ? turmaHeader.textContent.trim() : '';

    if (turma.startsWith('M')) {
      console.log(`🔍 Extraindo dados da turma: ${turma}`);

      linhas.forEach((linha, index) => {
        if (index === 0) return; // Pular cabeçalho

        const celulas = linha.querySelectorAll('td');
        const dia = celulas[0].textContent.trim();

        console.log(`📅 Dia: ${dia}`);

        celulas.forEach((celula, i) => {
          if (i === 0) return; // Pular coluna do dia

          const conteudo = celula.innerHTML.split('<br>');
          const disciplina = conteudo[0].trim();
          const nome = conteudo[1] ? conteudo[1].trim() : '';

          console.log(`📚 Aula ${i}: ${disciplina} - ${nome}`);

          if (disciplina && nome) {
            const dado = {
              nome: nome,
              dia: dia,
              aula: i,
              turma: turma,
              disciplina: disciplina
            };

            console.log(`📋 Dado extraído:`, dado);

            dadosExtraidos.push(dado);
          }
        });
      });
    }
  });

  console.log(`✅ Dados extraídos:`, dadosExtraidos);
  return dadosExtraidos;
}

// Executar o script
const dadosMatutino = extrairDadosMatutino();
console.log(dadosMatutino);