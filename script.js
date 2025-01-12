document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
      const connections = lines.map(line => line.split('---').map(name => name.trim().toLowerCase()));
      drawGraph(connections);
      drawColumnChart(connections);
    };
    reader.readAsText(file);
  }
});

function drawGraph(connections) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const radius = 20;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const names = [...new Set(connections.flat())];
  const angleStep = (2 * Math.PI) / names.length;
  const positions = {};

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  names.forEach((name, index) => {
    const angle = index * angleStep;
    const x = centerX + 200 * Math.cos(angle);
    const y = centerY + 200 * Math.sin(angle);
    positions[name] = { x, y };

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#67b4bf';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y);
  });

  connections.forEach(([name1, name2]) => {
    const { x: x1, y: y1 } = positions[name1];
    const { x: x2, y: y2 } = positions[name2];

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const x1Edge = x1 + radius * Math.cos(angle);
    const y1Edge = y1 + radius * Math.sin(angle);
    const x2Edge = x2 - radius * Math.cos(angle);
    const y2Edge = y2 - radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1Edge, y1Edge);
    ctx.lineTo(x2Edge, y2Edge);
    ctx.strokeStyle = '#000000'; // Cor das linhas
    ctx.stroke();
  });
}


function drawColumnChart(connections) {  // Função para o gráfico de colunas
  const degreeCount = {};
  connections.flat().forEach(name => {
    degreeCount[name] = (degreeCount[name] || 0) + 1;
  });

  const data = [['Pessoa', 'Grau']];
  for (const [name, degree] of Object.entries(degreeCount)) {
    data.push([name, Math.floor(degree)]); // Garantindo que o grau seja um número inteiro
  }

  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => {
    const dataTable = google.visualization.arrayToDataTable(data);
    const options = {
      title: 'Grau de Conexoes por Pessoa',
      chartArea: { width: '50%' },
      hAxis: {
        title: '',
        minValue: 0,
        format: '0' // Formato para exibir números inteiros
      },
      vAxis: {
        title: 'Pessoas'
      },
      colors: ['#7bd6e4'] 
    };
    const chart = new google.visualization.ColumnChart(document.getElementById('columnchart_values'));
    chart.draw(dataTable, options);
  });
}