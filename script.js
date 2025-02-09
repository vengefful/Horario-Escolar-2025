document.addEventListener("DOMContentLoaded", () => {
    console.log("⏳ Carregando horários...");
  });
  
  const horariosMatutino = {
    1: "07:00 - 08:00",
    2: "08:00 - 09:00",
    3: "09:10 - 10:10",
    4: "10:10 - 11:00",
    5: "11:00 - 12:00"
  };
  
  const horariosIntegral = {
    1: "12:30 - 13:30",
    2: "13:30 - 14:30",
    3: "14:30 - 15:30",
    4: "15:40 - 16:40",
    5: "16:40 - 17:40",
    6: "17:50 - 18:50",
    7: "18:50 - 19:50"
  };
  
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  
  function carregarHorario(csvUrl, tabelaId, horarios, totalAulas) {
    console.log(`🔄 Tentando carregar ${csvUrl}...`);
    fetch(csvUrl)
      .then(response => response.text())
      .then(csvText => {
        console.log(`✅ ${csvUrl} carregado com sucesso!`);
        console.log("🔍 Linhas do CSV processadas:", csvText.trim().split('\n').slice(1));
  
        const rows = csvText.trim().split('\n').slice(1);
        const tableBody = document.querySelector(`#${tabelaId} tbody`);
  
        // **NÃO LIMPAR TODA A TABELA!** (Isso evita apagar o matutino quando o integral carrega)
        if (tabelaId === 'horarioMatutino') {
          tableBody.innerHTML = '';
        }
  
        const horarioData = {};
  
        diasSemana.forEach(dia => {
          horarioData[dia] = {};
          for (let aula = 1; aula <= totalAulas; aula++) {
            horarioData[dia][aula] = {
              horario: horarios[aula],
              turmas: {}
            };
          }
        });
  
        rows.forEach(row => {
          const valores = row.split(',');
          if (valores.length === 5) {  // Evita erro de formatação
            const [professor, dia, aula, turma, disciplina] = valores;
  
            if (horarioData[dia] && horarioData[dia][aula]) {
              horarioData[dia][aula].turmas[turma] = `${disciplina}<br><small>${professor}</small>`;
            }
          } else {
            console.warn("⚠️ Linha inválida no CSV:", row);
          }
        });
  
        diasSemana.forEach(dia => {
          let primeiroTr = true;
          for (let aula = 1; aula <= totalAulas; aula++) {
            const data = horarioData[dia][aula];
            const tr = document.createElement('tr');
  
            if (primeiroTr) {
              const tdDia = document.createElement('td');
              tdDia.rowSpan = totalAulas;
              tdDia.classList.add('diaSemana');
              tdDia.innerText = dia;
              tr.appendChild(tdDia);
              primeiroTr = false;
            }
  
            // **Ajusta as colunas corretas para matutino e integral**
            if (tabelaId === 'horarioMatutino') {
              tr.innerHTML += `
                <td>${aula}</td>
                <td>${data.horario}</td>
                <td>${data.turmas['M1A'] || '-'}</td>
                <td>${data.turmas['M1B'] || '-'}</td>
                <td>${data.turmas['M1C'] || '-'}</td>
                <td>${data.turmas['M2A'] || '-'}</td>
                <td>${data.turmas['M2B'] || '-'}</td>
                <td>${data.turmas['M2C'] || '-'}</td>
                <td>${data.turmas['M2D'] || '-'}</td>
                <td>${data.turmas['M2E'] || '-'}</td>
                <td>${data.turmas['M3A'] || '-'}</td>
                <td>${data.turmas['M3B'] || '-'}</td>
                <td>${data.turmas['M3C'] || '-'}</td>
              `;
            } else if (tabelaId === 'horarioIntegral') {
              tr.innerHTML += `
                <td>${aula}</td>
                <td>${data.horario}</td>
                <td>${data.turmas['I1TEC'] || '-'}</td>
                <td>${data.turmas['I1A'] || '-'}</td>
                <td>${data.turmas['I1B'] || '-'}</td>
                <td>${data.turmas['I1C'] || '-'}</td>
                <td>${data.turmas['I2TEC'] || '-'}</td>
                <td>${data.turmas['I2A'] || '-'}</td>
                <td>${data.turmas['I3A'] || '-'}</td>
                <td>${data.turmas['I3B'] || '-'}</td>
              `;
            }
  
            tableBody.appendChild(tr);
          }
        });
  
        console.log(`✅ ${tabelaId} atualizado com sucesso!`);
      })
      .catch(error => console.error(`❌ Erro ao carregar ${csvUrl}:`, error));
  }

  function gerarPDF(tabelaId, titulo) {
    // Aguarda jsPDF ser carregado corretamente
    if (!window.jspdf || !window.jspdf.jsPDF) {
        console.error("❌ jsPDF não carregado! Verifique a importação do script.");
        alert("Erro: jsPDF não carregado corretamente.");
        return;
    }

    // Importando jsPDF corretamente
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape", // PDF na horizontal
        unit: "mm",
        format: "a4"
    });

    doc.setFontSize(14);
    doc.text(titulo, 14, 15); // Adiciona o título no topo

    // **Removendo qualquer duplicação antes de gerar o PDF**
    const tabela = document.getElementById(tabelaId).cloneNode(true); // Clona a tabela
    const tbody = tabela.querySelector("tbody");

    if (!tbody || tbody.children.length === 0) {
        console.error("❌ Nenhum dado na tabela para exportar.");
        alert("Erro: A tabela está vazia.");
        return;
    }

    console.log("📄 Gerando PDF para:", titulo);

    // Gera a tabela no PDF
    doc.autoTable({
        html: tabela,
        startY: 25,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 }
    });

    // Salva o arquivo
    doc.save(`${titulo}.pdf`);
}



  
  // **Garante que os dois horários são carregados separadamente**
  carregarHorario('horario.csv', 'horarioMatutino', horariosMatutino, 5);
  carregarHorario('horario_integral.csv', 'horarioIntegral', horariosIntegral, 7);
  
  