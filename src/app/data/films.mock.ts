import { Film } from '../models/film.model';

/** Verified TMDB CDN paths (size w342). Paths rotate over time; card img uses error fallback. */
const T = 'https://image.tmdb.org/t/p/w342';

/** Stable decorative image when TMDB asset id is unreliable in this environment. */
const P = (seed: string): string => `https://picsum.photos/seed/${seed}/300/450`;

export const FILMS_MOCK: Film[] = [
  {
    id: 1,
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-Fi',
    rating: 8.6,
    duration: 169,
    description:
      'When drought, dust storms, and the extinction of crops lead humanity to a food crisis, a team of explorers and scientists travels through a wormhole in search of a new home for mankind.',
    posterUrl: `${T}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Inception',
    year: 2010,
    genre: 'Sci-Fi',
    rating: 8.8,
    duration: 148,
    description:
      'Cobb is a skilled thief, the best of the best in the dangerous art of extraction: he steals valuable secrets from deep within the subconscious during sleep.',
    posterUrl: `${T}/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg`,
    isFavorite: false,
  },
  {
    id: 3,
    title: 'The Shawshank Redemption',
    year: 1994,
    genre: 'Drama',
    rating: 9.3,
    duration: 142,
    description:
      'Banker Andy Dufresne is convicted of murdering his wife and her lover. Finding himself in a prison called Shawshank, he faces the cruelty and lawlessness that reign on both sides of the bars.',
    posterUrl: `${T}/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg`,
    isFavorite: false,
  },
  {
    id: 4,
    title: 'The Dark Knight',
    year: 2008,
    genre: 'Action',
    rating: 9.0,
    duration: 152,
    description:
      'Batman raises the stakes in his war on crime. With the help of Lieutenant Jim Gordon and District Attorney Harvey Dent, he seeks to rid Gotham\'s streets of crime.',
    posterUrl: `${T}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    isFavorite: false,
  },
  {
    id: 5,
    title: 'Forrest Gump',
    year: 1994,
    genre: 'Drama',
    rating: 8.8,
    duration: 142,
    description:
      'A simple-minded man from Alabama named Forrest Gump inadvertently finds himself at the center of key events in American history during the second half of the 20th century.',
    posterUrl: `${T}/saHP97rTPS5eLmrLQEcANmKrsFl.jpg`,
    isFavorite: false,
  },
  {
    id: 6,
    title: 'The Matrix',
    year: 1999,
    genre: 'Sci-Fi',
    rating: 8.7,
    duration: 136,
    description:
      'Hacker Neo discovers that the reality he lives in is merely a simulation created by machines. He must make a choice that will change the fate of humanity.',
    posterUrl: P('film-matrix-1999'),
    isFavorite: false,
  },
  {
    id: 7,
    title: 'Fight Club',
    year: 1999,
    genre: 'Thriller',
    rating: 8.8,
    duration: 139,
    description:
      'An insomniac office worker and a charismatic soap salesman form an underground fight club that quickly evolves into something much greater.',
    posterUrl: `${T}/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg`,
    isFavorite: false,
  },
  {
    id: 8,
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
    genre: 'Fantasy',
    rating: 9.0,
    duration: 201,
    description:
      'The final battle for Middle-earth begins. Frodo and Sam approach Mount Doom, while Aragorn must embrace his destiny and lead the armies of the free peoples into battle.',
    posterUrl: P('film-lotr-rotk-2003'),
    isFavorite: false,
  },
  {
    id: 9,
    title: 'Schindler\'s List',
    year: 1993,
    genre: 'Drama',
    rating: 9.0,
    duration: 195,
    description:
      'The story of German industrialist Oskar Schindler, who saved more than a thousand Polish Jews during the Holocaust by employing them in his factories.',
    posterUrl: `${T}/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg`,
    isFavorite: false,
  },
  {
    id: 10,
    title: 'Pulp Fiction',
    year: 1994,
    genre: 'Crime',
    rating: 8.9,
    duration: 154,
    description:
      'Several intertwining stories from the Los Angeles criminal underworld: two hitmen, a gangster\'s wife, a boxer, and a pair of diner robbers.',
    posterUrl: `${T}/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg`,
    isFavorite: false,
  },
  {
    id: 11,
    title: 'The Green Mile',
    year: 1999,
    genre: 'Drama',
    rating: 8.6,
    duration: 189,
    description:
      'A death row corrections officer at a Louisiana penitentiary discovers that one of the inmates possesses a supernatural gift of healing.',
    posterUrl: `${T}/velWPhVMQeQKcxggNEU8YmIo52R.jpg`,
    isFavorite: false,
  },
  {
    id: 12,
    title: 'Gladiator',
    year: 2000,
    genre: 'Action',
    rating: 8.5,
    duration: 155,
    description:
      'Roman general Maximus is betrayed by the emperor and sold into slavery. Becoming a gladiator, he fights in the Colosseum arena to avenge his family.',
    posterUrl: P('film-gladiator-2000'),
    isFavorite: false,
  },
];
