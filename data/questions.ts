
import { Question, TageMageSection } from '@/types/tageMage';

export const sampleQuestions: { [key in TageMageSection]: Question[] } = {
  comprehension: [
    {
      id: 'comp_1',
      section: 'comprehension',
      question: 'Dans le texte suivant: "La révolution industrielle a transformé les sociétés européennes au XIXe siècle." Quel est le sujet principal?',
      options: [
        'Les sociétés européennes',
        'La révolution industrielle',
        'Le XIXe siècle',
        'La transformation'
      ],
      correctAnswer: 1,
      explanation: 'Le sujet principal est la révolution industrielle, qui est l\'agent de la transformation.'
    },
    {
      id: 'comp_2',
      section: 'comprehension',
      question: 'Quel mot est synonyme de "perspicace"?',
      options: [
        'Confus',
        'Clairvoyant',
        'Hésitant',
        'Négligent'
      ],
      correctAnswer: 1,
      explanation: 'Perspicace signifie avoir une grande finesse d\'esprit, tout comme clairvoyant.'
    },
    {
      id: 'comp_3',
      section: 'comprehension',
      question: 'Complétez: "Bien que le projet soit ambitieux, il reste _____ réalisable."',
      options: [
        'néanmoins',
        'cependant',
        'toutefois',
        'pourtant'
      ],
      correctAnswer: 0,
      explanation: 'Néanmoins est le connecteur logique approprié pour exprimer une concession.'
    }
  ],
  calcul: [
    {
      id: 'calc_1',
      section: 'calcul',
      question: 'Si 3x + 5 = 20, quelle est la valeur de x?',
      options: ['3', '5', '7', '15'],
      correctAnswer: 1,
      explanation: '3x = 20 - 5 = 15, donc x = 15/3 = 5'
    },
    {
      id: 'calc_2',
      section: 'calcul',
      question: 'Quel est le résultat de 15% de 200?',
      options: ['20', '25', '30', '35'],
      correctAnswer: 2,
      explanation: '15% de 200 = 0.15 × 200 = 30'
    },
    {
      id: 'calc_3',
      section: 'calcul',
      question: 'Si un article coûte 80€ après une réduction de 20%, quel était son prix initial?',
      options: ['96€', '100€', '104€', '110€'],
      correctAnswer: 1,
      explanation: 'Si 80€ représente 80% du prix initial, alors le prix initial = 80/0.8 = 100€'
    }
  ],
  raisonnement: [
    {
      id: 'rais_1',
      section: 'raisonnement',
      question: 'Tous les chats sont des mammifères. Certains mammifères volent. Donc:',
      options: [
        'Tous les chats volent',
        'Certains chats volent',
        'Aucun chat ne vole',
        'On ne peut pas conclure'
      ],
      correctAnswer: 3,
      explanation: 'Les prémisses ne permettent pas de conclure sur la capacité des chats à voler.'
    },
    {
      id: 'rais_2',
      section: 'raisonnement',
      question: 'Si A > B et B > C, alors:',
      options: [
        'A = C',
        'A < C',
        'A > C',
        'On ne peut pas savoir'
      ],
      correctAnswer: 2,
      explanation: 'Par transitivité, si A > B et B > C, alors A > C.'
    },
    {
      id: 'rais_3',
      section: 'raisonnement',
      question: 'Quelle est la prochaine lettre dans la séquence: A, C, F, J, ?',
      options: ['M', 'N', 'O', 'P'],
      correctAnswer: 2,
      explanation: 'La différence augmente de 1 à chaque fois: +2, +3, +4, donc +5 = O'
    }
  ],
  logique: [
    {
      id: 'log_1',
      section: 'logique',
      question: 'Quel nombre complète la suite: 2, 6, 12, 20, ?',
      options: ['28', '30', '32', '36'],
      correctAnswer: 1,
      explanation: 'La suite suit le pattern n×(n+1): 1×2, 2×3, 3×4, 4×5, 5×6 = 30'
    },
    {
      id: 'log_2',
      section: 'logique',
      question: 'Si CHAT = 3815, quel est le code pour TACHE?',
      options: ['81353', '51383', '38153', '15383'],
      correctAnswer: 0,
      explanation: 'C=3, H=8, A=1, T=5, donc TACHE = 81353'
    },
    {
      id: 'log_3',
      section: 'logique',
      question: 'Quelle figure complète la série: ○, △, □, ○, △, ?',
      options: ['○', '△', '□', '◇'],
      correctAnswer: 2,
      explanation: 'La séquence se répète: cercle, triangle, carré.'
    }
  ]
};

export const getSectionQuestions = (section: TageMageSection, count: number = 5): Question[] => {
  const questions = sampleQuestions[section];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};
