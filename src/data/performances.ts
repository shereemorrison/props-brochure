export interface Stage {
  id: string;
  stageNumber: string; // "Stage One", "Stage Two", "Stage Three"
  title: string;
  summary: string;
  cast: Array<{ name: string; role: string }>;
  awards: Array<{ icon: string; name: string; recipient: string }>;
  images?: string[]; // Array of image paths
}

export interface Day {
  id: string;
  day: string; // "Monday 24th", "Tuesday 25th", etc.
  year: number; // 2025
  stages: Stage[];
  hasThankYou?: boolean; // For Thursday which has Thank You section
}

export const days: Day[] = [
  {
    id: 'monday-24th',
    day: 'Monday 24th',
    year: 2025,
    stages: [
      {
        id: 'stage-one-monday',
        stageNumber: 'Stage One',
        title: 'FIVE MINUTES',
        summary: 'Summary of FIVE MINUTES play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-two-monday',
        stageNumber: 'Stage Two',
        title: 'THE BAD SIDE',
        summary: 'Summary of THE BAD SIDE play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-three-monday',
        stageNumber: 'Stage Three',
        title: 'FERRIER\'S SHOES',
        summary: 'Summary of FERRIER\'S SHOES play will go here',
        cast: [],
        awards: []
      }
    ]
  },
  {
    id: 'tuesday-25th',
    day: 'Tuesday 25th',
    year: 2025,
    stages: [
      {
        id: 'stage-one-tuesday',
        stageNumber: 'Stage One',
        title: 'FIVE MINUTES',
        summary: 'Summary of FIVE MINUTES play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-two-tuesday',
        stageNumber: 'Stage Two',
        title: 'THE BAD SIDE',
        summary: 'Summary of THE BAD SIDE play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-three-tuesday',
        stageNumber: 'Stage Three',
        title: 'FERRIER\'S SHOES',
        summary: 'Summary of FERRIER\'S SHOES play will go here',
        cast: [],
        awards: []
      }
    ]
  },
  {
    id: 'wednesday-26th',
    day: 'Wednesday 26th',
    year: 2025,
    stages: [
      {
        id: 'stage-one-wednesday',
        stageNumber: 'Stage One',
        title: 'FIVE MINUTES',
        summary: 'Summary of FIVE MINUTES play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-two-wednesday',
        stageNumber: 'Stage Two',
        title: 'THE BAD SIDE',
        summary: 'Summary of THE BAD SIDE play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-three-wednesday',
        stageNumber: 'Stage Three',
        title: 'FERRIER\'S SHOES',
        summary: 'Summary of FERRIER\'S SHOES play will go here',
        cast: [],
        awards: []
      }
    ]
  },
  {
    id: 'thursday-27th',
    day: 'Thursday 27th',
    year: 2025,
    hasThankYou: true,
    stages: [
      {
        id: 'stage-one-thursday',
        stageNumber: 'Stage One',
        title: 'FIVE MINUTES',
        summary: 'Summary of FIVE MINUTES play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-two-thursday-our-space',
        stageNumber: 'Stage Two',
        title: 'OUR SPACE',
        summary: 'Summary of OUR SPACE play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-two-thursday-bad-side',
        stageNumber: 'Stage Two',
        title: 'THE BAD SIDE',
        summary: 'Summary of THE BAD SIDE play will go here',
        cast: [],
        awards: []
      },
      {
        id: 'stage-two-thursday-pirated',
        stageNumber: 'Stage Two',
        title: 'PIRATED',
        summary: 'Summary of PIRATED play will go here',
        cast: [],
        awards: []
      }
    ]
  }
];

// Legacy interface for backwards compatibility
export interface Performance {
  id: string;
  day: string;
  title: string;
  time: string;
  blurb: string;
  cast: Array<{ name: string; role: string }>;
  awards: Array<{ icon: string; name: string; recipient: string }>;
}

// Legacy performances array (kept for existing pages)
export const performances: Performance[] = [
  {
    id: 'act1',
    day: 'Act One',
    title: '',
    time: 'Monday 24 November | 7:00 PM',
    blurb: 'Two storytellers find themselves stuck in the middle of their own story, unable to move forward. They turn to their players for help, and through the collaborative power of saying "YES, " they discover a way out of their creative block. This simple yet profound act of acceptance and agreement propels the story forward, allowing for change and new possibilities',
    cast: ['Test', 'Actor 2', 'Actor 3'].map(name => ({ name, role: 'Performer' })),
    awards: []
  },
  {
    id: 'act2',
    day: 'Act Two',
    title: 'ActTwo',
    time: 'Tuesday 25 November | 7:00 PM',
    blurb: 'This play revisits the traditional tale of Arthur and The Sword in the Stone, set in a town eagerly searching for a new king —someone pure of heart. As knights and squires vie for the coveted title their aspirations are thwarted by the mysterious sword stuck in the stone, an obstacle that only the true king can overcome.',
    cast: [],
    awards: []
  },
  {
    id: 'act3',
    day: 'Act Three',
    title: 'ActThree',
    time: 'Wednesday 26 November | 7:00 PM',
    blurb: 'Act Three content will go here',
    cast: [],
    awards: []
  },
  {
    id: 'act4',
    day: 'Act Four',
    title: 'ActFour',
    time: 'Thursday 27 November | 7:00 PM',
    blurb: 'Act Four content will go here',
    cast: [],
    awards: []
  },
  {
    id: 'acknowledgements',
    day: 'Acknowledgements',
    title: 'Acknowledgements',
    time: '',
    blurb: 'Acknowledgements content will go here',
    cast: [],
    awards: []
  },
  {
    id: 'contact',
    day: 'Contact',
    title: 'Contact',
    time: '',
    blurb: 'Contact content will go here',
    cast: [],
    awards: []
  }
];
