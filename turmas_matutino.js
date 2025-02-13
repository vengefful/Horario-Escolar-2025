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

function extrairDadosMatutino(doc) {
  const tabelas = doc.querySelectorAll('table');
  const dadosExtraidos = [];

  console.log(`🔍 Número de tabelas encontradas: ${tabelas.length}`);

  tabelas.forEach(tabela => {
    const linhas = tabela.querySelectorAll('tr');
    let turmaHeader = tabela.previousElementSibling;

    // Verificar se o elemento anterior é um cabeçalho de turma
    while (turmaHeader && turmaHeader.tagName !== 'H1') {
      turmaHeader = turmaHeader.previousElementSibling;
    }

    const turma = turmaHeader ? turmaHeader.textContent.trim() : '';

    console.log(`🔍 Verificando turma: ${turma}`);

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

document.addEventListener('DOMContentLoaded', () => {
  carregarHTML('Classes.html', doc => {
    const dadosMatutino = extrairDadosMatutino(doc);
    console.log('Dados Matutino:', dadosMatutino);
    preencherTabela(dadosMatutino);
  });
});