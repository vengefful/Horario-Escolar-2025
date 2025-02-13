function carregarHTML(url, callback) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      callback(doc);
    })
    .catch(error => console.error('Erro ao carregar o HTML:', error));
}

function extrairDadosIntegral(doc) {
  const tabelas = doc.querySelectorAll('table');
  const dadosExtraidos = [];

  tabelas.forEach(tabela => {
    const linhas = tabela.querySelectorAll('tr');
    let turmaHeader = tabela.previousElementSibling;

    // Verificar se o elemento anterior é um cabeçalho de turma
    while (turmaHeader && turmaHeader.tagName !== 'H1') {
      turmaHeader = turmaHeader.previousElementSibling;
    }

    const turma = turmaHeader ? turmaHeader.textContent.trim() : '';

    if (turma.startsWith('I')) { // Verificar se a turma é do integral

      linhas.forEach((linha, index) => {
        if (index === 0) return; // Pular cabeçalho

        const celulas = linha.querySelectorAll('td');
        const dia = celulas[0].textContent.trim();


        celulas.forEach((celula, i) => {
          if (i === 0) return; // Pular coluna do dia

          const conteudo = celula.innerHTML.split('<br>');
          const disciplina = conteudo[0].trim();
          const nome = conteudo[1] ? conteudo[1].trim() : '';

          if (disciplina && nome) {
            const dado = {
              nome: nome,
              dia: dia,
              aula: i,
              turma: turma,
              disciplina: disciplina
            };


            dadosExtraidos.push(dado);
          }
        });
      });
    }
  });

  console.log(`✅ Dados extraídos:`, dadosExtraidos);
  return dadosExtraidos;
}

document.addEventListener('DOMContentLoaded', () => {
  carregarHTML('Classes.html', doc => {
    const dadosIntegral = extrairDadosIntegral(doc);
    preencherTabela(dadosIntegral);
  });
});