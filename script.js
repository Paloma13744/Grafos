document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
      const connections = lines.map(line => line.split('---').map(name => name.trim().toLowerCase()));
      drawGraph(connections);
      drawColumnChart(connections);
    };
    reader.readAsText(file);  // Lê o arquivo como texto
  }
});

function drawGraph(connections) {   // Função que desenha o grafo
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const radius = 28;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const names = [...new Set(connections.flat())];
  const angleStep = (2 * Math.PI) / names.length;
  const positions = {};

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  names.forEach((name, index) => { // Para cada nome, calcula sua posição ao longo do círculo
    const angle = index * angleStep;
    const x = centerX + 200 * Math.cos(angle);
    const y = centerY + 200 * Math.sin(angle);
    positions[name] = { x, y };

    // Desenha o círculo representando o nome
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#67b4bf';
    ctx.fill();
    ctx.stroke();


    // Desenha o texto (nome) no centro do círculo
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 12px "Poppins", sans-serif';
    ctx.fillText(name, x, y);
  });


    // Desenha as linhas que conectam os nós
    connections.forEach(([name1, name2]) => {
    const { x: x1, y: y1 } = positions[name1];
    const { x: x2, y: y2 } = positions[name2];

    // Calcula o ângulo entre os dois pontos para desenhar a linha de conexão
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const x1Edge = x1 + radius * Math.cos(angle);
    const y1Edge = y1 + radius * Math.sin(angle);
    const x2Edge = x2 - radius * Math.cos(angle);
    const y2Edge = y2 - radius * Math.sin(angle);


    // Desenha a linha de conexão entre os dois nós
    ctx.beginPath();
    ctx.moveTo(x1Edge, y1Edge);
    ctx.lineTo(x2Edge, y2Edge);
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  });
}

function drawColumnChart(connections) {  // Função para desenhar o gráfico de colunas
  const degreeCount = {};
  connections.flat().forEach(name => {
    degreeCount[name] = (degreeCount[name] || 0) + 1;
  });

  const data = [['Pessoa', 'Grau']];
  for (const [name, degree] of Object.entries(degreeCount)) {
    data.push([name, Math.round(degree)]); 
  }

   // Carrega a biblioteca do Google Charts
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => {
    const dataTable = google.visualization.arrayToDataTable(data);
    const options = {
      title: 'Grau de Conexoes por Pessoa',
      chartArea: {
        width: '70%',        
        top: 100,
        left: 80,
        right: 60,
        bottom: 20
      },
      hAxis: {
        title: '',
        minValue: 0,
        format: '0'
      },
      vAxis: {
        title: 'Pessoas',
        viewWindow: {
          min: 0,
          max: Math.max(...Object.values(degreeCount)) + 1
        },
        ticks: Array.from({ length: Math.max(...Object.values(degreeCount)) + 1 }, (_, i) => i)
      },
      colors: ['#7bd6e4'],
      bar: { groupWidth: '72%' },
      height: 530,
      width: '90%',
      legend: { position: 'none' },
      backgroundColor: 'transparent'
    };
    // Cria e desenha o gráfico de colunas
    const chart = new google.visualization.ColumnChart(document.getElementById('columnchart_values'));
    chart.draw(dataTable, options);
  });
}