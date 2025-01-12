// script da página dos grafos

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const lines = e.target.result.split('\n').filter(line => line.trim() !== '');
      const connections = lines.map(line => line.split('---').map(name => name.trim().toLowerCase()));
      drawGraph(connections);
    };
    reader.readAsText(file);
  }
});

function drawGraph(connections) {  // desenhando o grafo
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const radius = 20;  // nó dos grafos
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

   // Desenhando o nó
    ctx.beginPath(); 
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#67b4bf';
    ctx.fill();
    ctx.stroke();

   // Desenhando o nome
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y);
  });

  // Desenhando as arestas
  connections.forEach(([name1, name2]) => {
    const { x: x1, y: y1 } = positions[name1];
    const { x: x2, y: y2 } = positions[name2];

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
}