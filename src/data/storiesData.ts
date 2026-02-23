
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
          'Lions live in family groups called prides, where each member has a role that helps the whole group survive. You might imagine lions hunting all day, but most of their time is actually spent resting in the shade, saving energy for the moments that matter.\n\nIn many prides, lionesses do much of the hunting. They work together, using teamwork and patience to get close to prey on the savannah. The adult males often focus on guarding territory and keeping the pride safe from rivals. Their loud roars can travel long distances, warning other lions to stay away.\n\nEven when the pride is resting, lions are not “doing nothing.” They watch the land, listen for danger, and stay close to one another. Young cubs learn by playing—chasing, pouncing, and practicing the skills they will need later.\n\nA pride is not just a group of hunters. It is a small community built on cooperation, communication, and calm strength.',
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
      {
        id: 'lion_s2',
        title: 'Voices of the Night',
        text:
          'As the sun goes down, the savannah changes. The air cools, shadows grow longer, and many animals become more active. Lions often take advantage of this time because moving and hunting is easier when the heat is not so strong.\n\nOne of the most famous lion sounds is the roar. A roar is not only a “scary noise”—it is a message. It can help lions find each other, protect the pride’s area, and warn rivals that this land is already taken.\n\nLions also communicate with softer sounds. They may grunt to greet each other, purr when relaxed, and use body language—like tail movements and head rubs—to show friendship and trust.\n\nListening carefully is part of survival. At night, lions use their sharp senses to notice movement, smell the wind, and react quickly. In a pride, teamwork and communication help everyone stay safe.',
        questions: [
          {
            question: 'Why do lions often become more active in the evening?',
            options: ['Because it is cooler', 'Because the sun is brighter', 'Because they can fly', 'Because they live underwater'],
            correctIndex: 0,
          },
          {
            question: 'A lion roar can help with…',
            options: ['Sending messages and defending territory', 'Growing stripes', 'Building nests', 'Changing seasons'],
            correctIndex: 0,
          },
          {
            question: 'Besides roaring, lions may communicate by…',
            options: ['Soft sounds and body language', 'Only blinking rapidly', 'Only changing color', 'Only digging tunnels'],
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
          'Elephants are known for their intelligence, strong family bonds, and their amazing trunk. The trunk is like a built-in tool that can do many jobs at once. Elephants use it to smell, touch, pick up food, and handle water.\n\nWhen an elephant drinks, it does not sip through the trunk like a straw all the way to the stomach. Instead, it sucks water into the trunk and then pours it into its mouth. On hot days, elephants may spray water over their bodies to cool down.\n\nWater is also important for social care. Older elephants may guide calves toward water sources, and family members often stay close together for protection. Elephants show care in many ways—standing near a tired calf, helping it climb, or gently touching it with the trunk.\n\nIn dry areas, elephants can even dig for water using their feet and trunk. This can help other animals too, because the dug-out water may become available to the whole ecosystem.',
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
      {
        id: 'ele_s2',
        title: 'Family Paths',
        text:
          'Elephant families are usually led by an older female called a matriarch. She remembers where to find water during dry seasons and where the safest routes are. That memory can help the whole group survive.\n\nElephants communicate using sounds we can hear and also very low sounds that travel far through the ground and air. This helps families stay connected even when they are spread out. They can also use touch—like trunk taps and gentle pushes—to guide and comfort each other.\n\nCalves learn by copying adults. They watch how grown elephants use the trunk, how they move together, and how they react to danger. If a calf gets scared, the family may form a protective circle.\n\nElephants do not just “live near each other.” They cooperate, protect one another, and move as a team, like a traveling community.',
        questions: [
          {
            question: 'Who often leads an elephant family group?',
            options: ['A matriarch (older female)', 'A baby calf', 'A random bird', 'A fish'],
            correctIndex: 0,
          },
          {
            question: 'How do elephants stay connected over long distances?',
            options: ['Low sounds and communication', 'By glowing', 'By changing stripes', 'By living in caves'],
            correctIndex: 0,
          },
          {
            question: 'How do calves learn many skills?',
            options: ['By copying adults', 'By flying alone', 'By building nests', 'By living underwater'],
            correctIndex: 0,
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
          'Giraffes are the tallest land animals, famous for their long necks and calm movements. Their necks help them reach leaves that many other animals cannot, especially high up in tall trees.\n\nA giraffe’s height does more than help with food. From high above the grass, giraffes can spot movement across open land. This can be useful for noticing danger early. In areas where predators live, being able to see far away can give the herd extra time to react.\n\nGiraffes often spend time eating leaves, using their long tongues to grab food. They can move slowly and carefully as they browse. Their patterned coats also help them blend into the light and shadow of trees.\n\nEven though they look quiet and gentle, giraffes are strong. Their legs can deliver powerful kicks if they need to defend themselves.',
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
      {
        id: 'gir_s2',
        title: 'Patterns Like Fingerprints',
        text:
          'A giraffe’s coat is covered in patches, and those patterns are not all the same. In fact, each giraffe has a unique pattern, like a fingerprint. These patches can help giraffes recognize each other and may also help with camouflage.\n\nGiraffes live in loose groups, and members may come and go. When conditions change—like when food is scarce—giraffes may spread out. When food is plentiful, you might see more giraffes close together.\n\nDrinking water can be tricky for giraffes because their long legs and neck make it hard to reach the ground. To drink, a giraffe spreads its front legs wide and lowers its head carefully. During this moment, it is more vulnerable, so it often chooses safe places and stays alert.\n\nBeing tall is helpful, but giraffes still rely on awareness, movement, and group behavior to stay safe.',
        questions: [
          {
            question: 'Giraffe coat patterns are…',
            options: ['All identical', 'Unique for each giraffe', 'Only black and white stripes', 'Invisible at night'],
            correctIndex: 1,
          },
          {
            question: 'Why can drinking be risky for giraffes?',
            options: ['They must lower down and are more vulnerable', 'They can only drink saltwater', 'They forget how to walk', 'They fly away'],
            correctIndex: 0,
          },
          {
            question: 'Giraffes often live in…',
            options: ['Loose groups', 'Underground tunnels', 'Beehives', 'Coral reefs'],
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
          'Antelopes are built for speed, quick turns, and fast reactions. In open landscapes, they use their agility to avoid danger and keep up with the herd.\n\nMany antelope species live in grasslands where there are fewer places to hide. That is why being able to sprint quickly can be the difference between escaping and getting caught. But speed alone is not enough—antelope also rely on sharp senses and teamwork.\n\nIn a herd, antelopes watch each other. If one animal notices danger, others may react immediately. They may run together, changing direction suddenly to make it harder for a predator to focus on a single target.\n\nAntelopes also spend a lot of time eating plants. Between feeding times, they remain alert, lifting their heads to scan the horizon. Their lifestyle is a balance between finding food and staying safe.',
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
      {
        id: 'ant_s2',
        title: 'Eyes on the Horizon',
        text:
          'Open land can feel peaceful, but it also means danger can arrive quickly. Antelopes often rely on their wide field of vision to spot movement early. Many have eyes placed on the sides of the head, helping them see a lot of the world around them.\n\nWhen a herd grazes, not everyone eats at the same time. Some animals lift their heads to watch while others feed. This shared awareness makes the group safer.\n\nIf danger appears, antelopes may “scatter” and then regroup. Sudden changes in direction can confuse a predator. Staying with the herd can also lower risk, because it is harder to single out one animal in a moving group.\n\nAntelopes remind us that survival is not only about strength. It is also about attention, speed, and smart movement.',
        questions: [
          {
            question: 'Why are antelopes often good at spotting danger?',
            options: ['Wide field of vision', 'They glow in the dark', 'They have wings', 'They live underwater'],
            correctIndex: 0,
          },
          {
            question: 'In a herd, some antelopes may…',
            options: ['Watch while others graze', 'Sleep all day without moving', 'Build nests in trees', 'Dive into the ocean'],
            correctIndex: 0,
          },
          {
            question: 'Why can sudden direction changes help?',
            options: ['They can confuse a predator', 'They make plants grow', 'They change the weather', 'They create stripes'],
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
          'Zebras are famous for their black-and-white stripes, and those stripes are more than just decoration. Each zebra has a pattern that is a little different, which can help individuals recognize each other.\n\nIn a moving herd, stripes can also make it harder to focus on a single zebra. When many striped bodies run together, the patterns blend and shift. This can create a confusing visual effect, which may help protect the herd.\n\nZebras often live in groups on open plains. They travel together to find fresh grass and water. Staying in a herd offers protection because many eyes can look out for danger.\n\nZebras communicate with sounds and body movements. They can also form strong bonds, especially between mothers and foals, who learn to recognize each other quickly.',
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
      {
        id: 'zeb_s2',
        title: 'Together on the Plains',
        text:
          'Life on the plains means following food and water. Zebras may walk long distances to reach better grazing areas. During travel, the herd stays close, and members respond quickly if something feels wrong.\n\nA zebra’s stripes can also help it stand out to its family—foals learn their mother’s pattern soon after birth. This is useful in a busy group.\n\nWhen danger approaches, zebras often run together. The herd movement can make it harder for a predator to choose one target. At the same time, zebras are strong animals that can defend themselves with kicks if needed.\n\nZebras show how safety can come from community. By moving together, watching each other, and staying connected, they increase their chances of survival.',
        questions: [
          {
            question: 'Why do zebras often travel in groups?',
            options: ['For safety and shared awareness', 'To live underwater', 'To build nests', 'To fly together'],
            correctIndex: 0,
          },
          {
            question: 'Foals learn their mother by…',
            options: ['Her unique stripe pattern', 'A glowing horn', 'A feather color', 'A shell shape'],
            correctIndex: 0,
          },
          {
            question: 'Zebras can defend themselves using…',
            options: ['Strong kicks', 'Fire', 'Wings', 'Gills'],
            correctIndex: 0,
          },
        ],
      },
    ],
  },
];