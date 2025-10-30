export interface Performance {
  id: string;
  day: string;
  title: string;
  time: string;
  blurb: string;
  cast: Array<{ name: string; role: string }>;
  awards: Array<{ icon: string; name: string; recipient: string }>;
}

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

