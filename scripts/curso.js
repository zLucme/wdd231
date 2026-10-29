const cursos = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce the students to programming and problem solving.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web and to markup languages.',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students become more organized, efficient programmers using functions.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces object oriented programming concepts.',
    technology: ['C#'],
    completed: false
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students learn to create dynamic websites using JavaScript.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students focus on user experience and accessibility with modern web APIs.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

const containerCursos = document.getElementById('container-cursos');
const valorCreditos = document.getElementById('valor-creditos');
const btnTodos = document.getElementById('btn-todos');
const btnCse = document.getElementById('btn-cse');
const btnWdd = document.getElementById('btn-wdd');
const botoesFiltro = [btnTodos, btnCse, btnWdd];

function renderizarCursos(listaCursos) {
  containerCursos.innerHTML = '';

  listaCursos.forEach(curso => {
    const cartao = document.createElement('div');
    cartao.className = `cartao-curso ${curso.completed ? 'concluido' : ''}`;
    cartao.textContent = `${curso.subject} ${curso.number}`;
    containerCursos.appendChild(cartao);
  });

  const total = listaCursos.reduce((acumulador, curso) => acumulador + curso.credits, 0);
  valorCreditos.textContent = total;
}

function alternarBotaoAtivo(botaoAtivo) {
  botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
  botaoAtivo.classList.add('ativo');
}

btnTodos.addEventListener('click', () => {
  alternarBotaoAtivo(btnTodos);
  renderizarCursos(cursos);
});

btnCse.addEventListener('click', () => {
  alternarBotaoAtivo(btnCse);
  renderizarCursos(cursos.filter(curso => curso.subject === 'CSE'));
});

btnWdd.addEventListener('click', () => {
  alternarBotaoAtivo(btnWdd);
  renderizarCursos(cursos.filter(curso => curso.subject === 'WDD'));
});

renderizarCursos(cursos);