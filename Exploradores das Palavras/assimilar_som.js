// Dados dos animais com seus sons e imagens
const animals = [
    {
        name: "Cavalo",
        sound: "sons/cavalo.mp3",
        image: "imgs/cavalo.png"
    },
    {
        name: "Camelo",
        sound: "sons/camelo.mp3",
        image: "imgs/camelo.png"
    },
    {
        name: "Ovelha",
        sound: "sons/ovelha.mp3",
        image: "imgs/ovelha.png"
    },
    {
        name: "Abelha",
        sound: "sons/abelha.mp3",
        image: "imgs/abelha.png"
    },
    {
        name: "Grilo",
        sound: "sons/grilo.mp3",
        image: "imgs/grilo.png"
    },
    {
        name: "Leão",
        sound: "sons/leao.mp3",
        image: "imgs/leao.png"
    },
    {
        name: "Galo",
        sound: "sons/galo.mp3",
        image: "imgs/galo.png"
    },
    {
        name: "Vaca",
        sound: "sons/vaca.mp3",
        image: "imgs/vaca.png"
    }
];

// Elementos DOM
const playSoundButton = document.getElementById('play-sound');
const animalSound = document.getElementById('animal-sound');
const animalsContainer = document.querySelector('.animals-container');
const scoreValue = document.getElementById('score-value');
const feedbackMessage = document.getElementById('feedback-message');
const nextButton = document.getElementById('next-question');

// Variáveis do jogo
let currentAnimal = null;
let score = 0;
let options = [];
let answered = false;

// Inicializar o jogo
function initGame() {
    score = 0;
    scoreValue.textContent = score;
    nextQuestion();
    
    // Event listeners
    playSoundButton.addEventListener('click', playSound);
    nextButton.addEventListener('click', nextQuestion);
}

// Selecionar um animal aleatório e gerar opções
function nextQuestion() {
    // Resetar estado
    answered = false;
    feedbackMessage.textContent = '';
    feedbackMessage.className = '';
    nextButton.style.display = 'none';
    animalsContainer.innerHTML = '';
    
    // Selecionar animal correto aleatoriamente
    const randomIndex = Math.floor(Math.random() * animals.length);
    currentAnimal = animals[randomIndex];
    
    // Configurar o áudio
    animalSound.src = currentAnimal.sound;
    
    // Gerar opções (3 animais aleatórios, incluindo o correto)
    options = [currentAnimal];
    
    while (options.length < 3) {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        if (!options.includes(randomAnimal)) {
            options.push(randomAnimal);
        }
    }
    
    // Embaralhar as opções
    options = shuffleArray(options);
    
    // Criar elementos das imagens
    options.forEach(animal => {
        const animalOption = document.createElement('div');
        animalOption.className = 'animal-option';
        animalOption.dataset.name = animal.name;
        
        const img = document.createElement('img');
        img.src = animal.image;
        img.alt = animal.name;
        
        animalOption.appendChild(img);
        animalOption.addEventListener('click', () => checkAnswer(animalOption));
        
        animalsContainer.appendChild(animalOption);
    });
}

// Reproduzir o som do animal
function playSound() {
    if (animalSound.src) {
        animalSound.play();
    }
}

// Verificar a resposta
function checkAnswer(selectedOption) {
    if (answered) return;
    
    answered = true;
    const selectedAnimal = selectedOption.dataset.name;
    
    // Encontrar todas as opções
    const allOptions = document.querySelectorAll('.animal-option');
    
    // Marcar a opção correta
    allOptions.forEach(option => {
        if (option.dataset.name === currentAnimal.name) {
            option.classList.add('correct');
        }
    });
    
    // Verificar se a resposta está correta
    if (selectedAnimal === currentAnimal.name) {
        selectedOption.classList.add('correct');
        feedbackMessage.textContent = 'Parabéns! Resposta correta!';
        feedbackMessage.className = 'correct-feedback';
        score++;
        scoreValue.textContent = score;
    } else {
        selectedOption.classList.add('incorrect');
        feedbackMessage.textContent = `Ops! O som era do ${currentAnimal.name}.`;
        feedbackMessage.className = 'incorrect-feedback';
    }
    
    // Mostrar o botão para próxima pergunta
    nextButton.style.display = 'inline-block';
}

// Embaralhar array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Iniciar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', initGame);