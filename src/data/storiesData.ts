// src/data/storiesData.ts

export type StoryQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type AnimalStory = {
  id: string;
  title: string;
  text: string;
  questions: StoryQuestion[];
};

export type AnimalStories = {
  animalId: 'lion' | 'elephant' | 'giraffe' | 'antelope' | 'zebra';
  name: string;
  stories: AnimalStory[];
};

export const STORIES_DATA: AnimalStories[] = [
  {
    animalId: 'lion',
    name: 'Lion',
    stories: [
      {
        id: 'lion_s1',
        title: 'The Quiet Leader',
        text:
          'Lions live in groups called prides. While they can be powerful hunters, much of their day is spent resting and watching the savannah...',
        questions: [
          {
            question: 'What is a lion group called?',
            options: ['A pack', 'A pride', 'A flock', 'A herd'],
            correctIndex: 1,
          },
          {
            question: 'Where do lions usually live?',
            options: ['Deep ocean', 'Savannah', 'Arctic ice', 'Rainforest canopy'],
            correctIndex: 1,
          },
          {
            question: 'What do lions do for a large part of the day?',
            options: ['Sleep/rest', 'Swim', 'Dig tunnels', 'Fly'],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    animalId: 'elephant',
    name: 'Elephant',
    stories: [
      {
        id: 'ele_s1',
        title: 'The Water Helper',
        text:
          'Elephants use their trunk to drink, spray water for cooling, and even help family members by sharing food and guiding calves...',
        questions: [
          {
            question: 'What special body part helps elephants handle water?',
            options: ['Tail', 'Trunk', 'Ears', 'Horns'],
            correctIndex: 1,
          },
          {
            question: 'Why might an elephant spray water on itself?',
            options: ['To fly', 'To cool down', 'To change color', 'To sing'],
            correctIndex: 1,
          },
          {
            question: 'Elephants are known for being…',
            options: ['Solitary always', 'Social and caring', 'Only nocturnal', 'Only living on mountains'],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    animalId: 'giraffe',
    name: 'Giraffe',
    stories: [
      {
        id: 'gir_s1',
        title: 'The Tall Watcher',
        text:
          'Giraffes have long necks that help them reach leaves high in trees. Their height also helps them spot movement across open land...',
        questions: [
          {
            question: 'What do giraffes use their long necks for?',
            options: ['Digging', 'Reaching leaves', 'Swimming', 'Climbing rocks'],
            correctIndex: 1,
          },
          {
            question: 'Their height helps them…',
            options: ['See far away', 'Breathe underwater', 'Fly', 'Live in caves'],
            correctIndex: 0,
          },
          {
            question: 'Giraffes often eat from…',
            options: ['Tall trees', 'Deep sea', 'Ice fields', 'Underground roots only'],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    animalId: 'antelope',
    name: 'Antelope',
    stories: [
      {
        id: 'ant_s1',
        title: 'The Fast Runner',
        text:
          'Antelopes are built for speed and quick turns. In open areas, their agility helps them avoid danger and stay with the herd...',
        questions: [
          {
            question: 'Antelopes are especially known for…',
            options: ['Speed', 'Diving', 'Flying', 'Climbing trees'],
            correctIndex: 0,
          },
          {
            question: 'Why is agility useful in open areas?',
            options: ['To avoid danger', 'To sleep longer', 'To change weather', 'To build nests'],
            correctIndex: 0,
          },
          {
            question: 'Antelopes often live in…',
            options: ['Herds', 'Single nests', 'Beehives', 'Coral reefs'],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
  {
    animalId: 'zebra',
    name: 'Zebra',
    stories: [
      {
        id: 'zeb_s1',
        title: 'The Stripe Secret',
        text:
          'Zebra stripes help individuals recognize each other. In a moving group, stripes can also make it harder to focus on a single zebra...',
        questions: [
          {
            question: 'Zebra stripes can help with…',
            options: ['Recognizing each other', 'Flying', 'Digging', 'Breathing underwater'],
            correctIndex: 0,
          },
          {
            question: 'In a moving group, stripes may…',
            options: ['Confuse focus', 'Turn into spots', 'Glow at night', 'Freeze water'],
            correctIndex: 0,
          },
          {
            question: 'Zebras are most famous for…',
            options: ['Stripes', 'Shells', 'Wings', 'Fins'],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
];