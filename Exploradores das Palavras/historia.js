function verificar() {
  let pontos = 0;
  const respostas = {
    q1: "Leão",
    q2: "Leonardo", 
    q3: "Um bom aluno"
  };

  for (let q in respostas) {
    const marcada = document.querySelector(`input[name="${q}"]:checked`);
    if (marcada && marcada.parentNode.textContent.trim() === respostas[q]) {
      pontos++;
    }
  }

  const total = Object.keys(respostas).length;
  const resultado = document.getElementById("resultado");
  resultado.textContent = `Você acertou ${pontos} de ${total} questões! 🦁📚`;
  resultado.style.display = 'block';
}