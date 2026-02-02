export interface Booking {
  type: 'train' | 'hotel' | 'car' | 'restaurant';
  name: string;
  code?: string;
  phone?: string;
  address?: string;
  time?: string;
  price?: string;
  notes?: string;
  link?: string;
  status: 'confirmed' | 'pending' | 'todo';
  // Train specific
  carriage?: string;
  seat?: string;
  class?: string;
  ticketPdf?: string;
}

export interface Activity {
  name: string;
  description: string;
  duration?: string;
  type: 'must-see' | 'food' | 'culture' | 'nature' | 'leisure';
  mapLink?: string;
  tips?: string;
  image?: string;
}

export interface DayPlan {
  date: string;
  isoDate: string; // YYYY-MM-DD for comparison
  dayOfWeek: string;
  title: string;
  subtitle: string;
  emoji: string;
  location: string;
  bookings: Booking[];
  freeTime?: {
    available: boolean;
    hours?: string;
    suggestions: Activity[];
  };
  roadTrip?: {
    from: string;
    to: string;
    duration: string;
    stops: {
      name: string;
      description: string;
      stayTime: string;
      highlights: string[];
      mapLink?: string;
    }[];
  };
}

export const tripData: DayPlan[] = [
  {
    date: "1 Febbraio",
    isoDate: "2026-02-01",
    dayOfWeek: "Domenica",
    title: "Roma → Torino",
    subtitle: "Partenza e cena stellata",
    emoji: "🚄",
    location: "Roma / Torino",
    bookings: [
      {
        type: 'train',
        name: "Frecciarossa 9588",
        code: "L8DZY5",
        time: "16:10 → 21:00",
        address: "Roma Termini → Torino Porta Nuova",
        carriage: "2",
        seat: "8D",
        class: "Business",
        price: "€115.90",
        status: 'confirmed',
        ticketPdf: "/tickets/Virgilio-Maretto-2737474616.pdf",
        link: "https://www.trenitalia.com/it/informazioni/ricerca_biglietti.html"
      },
      {
        type: 'hotel',
        name: "NH Torino Centro",
        code: "0166478335",
        phone: "+39 011 57521",
        address: "Corso Vittorio Emanuele II, 104",
        time: "Check-in 15:00 • Check-out 12:00",
        price: "€73.90",
        status: 'confirmed'
      },
      {
        type: 'restaurant',
        name: "Cena Stellata",
        notes: "Da prenotare! Arrivo ~21:30, cena ~22:00",
        status: 'todo'
      }
    ],
    freeTime: {
      available: true,
      hours: "Sera (dopo cena)",
      suggestions: [
        {
          name: "Passeggiata Via Roma",
          description: "I portici illuminati di notte sono magici",
          duration: "30 min",
          type: 'leisure'
        }
      ]
    }
  },
  {
    date: "2 Febbraio",
    isoDate: "2026-02-02",
    dayOfWeek: "Lunedì",
    title: "Torino → San Sebastián",
    subtitle: "Road trip epico attraverso Francia e Paesi Baschi",
    emoji: "🚗",
    location: "In viaggio",
    bookings: [
      {
        type: 'train',
        name: "TGV INOUI 9242",
        code: "5WQWQ6",
        time: "07:19 → 13:19",
        address: "Torino Porta Susa → Paris Gare de Lyon",
        carriage: "12",
        seat: "219",
        class: "1ª Classe - Club Quattro",
        price: "€134.00",
        status: 'confirmed',
        ticketPdf: "/tickets/tgv-milano-parigi-5WQWQ6.pdf",
        link: "https://www.sncf-connect.com/app/trips"
      },
      {
        type: 'train',
        name: "TGV INOUI 12265",
        code: "47ZU26",
        time: "14:05 → 16:30",
        address: "Paris Montparnasse → Bordeaux Saint-Jean",
        carriage: "3",
        seat: "350",
        class: "Alto",
        notes: "⚠️ Cambio stazione a Parigi (metro/taxi)",
        price: "€110.00",
        status: 'confirmed',
        ticketPdf: "/tickets/tgv-parigi-bordeaux-47ZU26.pdf",
        link: "https://www.sncf-connect.com/app/trips"
      },
      {
        type: 'car',
        name: "RentScape - Renault Clio",
        code: "D012917993",
        phone: "+33 0 556 925 970",
        address: "195 Cours de la Marne, Bordeaux Train Station Saint-Jean",
        time: "Ritiro 16:00 • Riconsegna 5 feb 22:00",
        price: "€232.33 (€156.58 al ritiro)",
        notes: "⚠️ Deposito €1300 su carta CREDITO (no debito!) • 1000 km inclusi • Pieno→Pieno",
        status: 'confirmed'
      },
      {
        type: 'hotel',
        name: "Hotel Villa Soro",
        code: "6899069207",
        phone: "+34 943 29 79 70",
        address: "Av. de Ategorrieta, 61, San Sebastián",
        time: "Check-in 15:00",
        price: "€647.10 (3 notti, 2 camere)",
        notes: "PIN: 0915",
        status: 'confirmed'
      }
    ],
    roadTrip: {
      from: "Bordeaux",
      to: "San Sebastián",
      duration: "~3-4 ore con tappe",
      stops: [
        {
          name: "Dune du Pilat",
          description: "La duna di sabbia più alta d'Europa. Vista mozzafiato sull'oceano e la foresta.",
          stayTime: "45 min - 1h",
          highlights: ["Salita sulla duna (20 min)", "Tramonto spettacolare", "Foto iconiche"],
          mapLink: "https://maps.google.com/?q=Dune+du+Pilat"
        },
        {
          name: "Biarritz",
          description: "Elegante città balneare, capitale del surf europeo. Belle Époque meets onde atlantiche.",
          stayTime: "1h",
          highlights: ["Grande Plage", "Rocher de la Vierge", "Casino storico"],
          mapLink: "https://maps.google.com/?q=Biarritz+France"
        },
        {
          name: "Saint-Jean-de-Luz",
          description: "Pittoresco villaggio di pescatori basco-francese. Porto colorato e architettura tradizionale.",
          stayTime: "30-45 min",
          highlights: ["Porto", "Chiesa Saint-Jean-Baptiste", "Macarons Adam"],
          mapLink: "https://maps.google.com/?q=Saint-Jean-de-Luz"
        },
        {
          name: "Hondarribia",
          description: "Primo gioiello basco spagnolo. Città murata medievale con vista sulla Francia.",
          stayTime: "30 min",
          highlights: ["Casco storico", "Mura medievali", "Vista sul Bidasoa"],
          mapLink: "https://maps.google.com/?q=Hondarribia+Spain"
        }
      ]
    },
    freeTime: {
      available: false,
      suggestions: []
    }
  },
  {
    date: "2 Febbraio",
    isoDate: "2026-02-02",
    dayOfWeek: "Lunedì sera",
    title: "Cena SWITCH",
    subtitle: "Benvenuto con il team",
    emoji: "🍷",
    location: "San Sebastián",
    bookings: [
      {
        type: 'restaurant',
        name: "Baga Biga",
        address: "Paseo Ramón María Lili, 8",
        time: "dalle 19:00",
        notes: "Cena sociale SWITCH - ognuno paga il suo",
        status: 'confirmed'
      }
    ],
    freeTime: {
      available: false,
      suggestions: []
    }
  },
  {
    date: "3 Febbraio",
    isoDate: "2026-02-03",
    dayOfWeek: "Martedì",
    title: "SWITCH Day 1",
    subtitle: "Consortium Meeting",
    emoji: "💼",
    location: "San Sebastián",
    bookings: [
      {
        type: 'hotel',
        name: "Goe Tech Center",
        address: "Avenida Navarra, 9, 20013 Donostia",
        time: "Giornata di lavoro",
        notes: "Zoom: 61818883935",
        status: 'confirmed'
      }
    ],
    freeTime: {
      available: true,
      hours: "Sera (dalle 19:00)",
      suggestions: [
        {
          name: "Pintxos nella Parte Vieja",
          description: "Il tour dei bar è un must! Ogni bar ha la sua specialità.",
          duration: "2-3 ore",
          type: 'food',
          tips: "Bar consigliati: La Cuchara de San Telmo, Gandarias, Bar Nestor"
        },
        {
          name: "Passeggiata La Concha",
          description: "La spiaggia più bella della Spagna, spettacolare al tramonto",
          duration: "1 ora",
          type: 'leisure'
        }
      ]
    }
  },
  {
    date: "4 Febbraio",
    isoDate: "2026-02-04",
    dayOfWeek: "Mercoledì",
    title: "SWITCH Day 2",
    subtitle: "Consortium Meeting + Gita Bilbao?",
    emoji: "💼",
    location: "San Sebastián / Bilbao",
    bookings: [
      {
        type: 'hotel',
        name: "Goe Tech Center",
        address: "Avenida Navarra, 9",
        time: "Meeting",
        status: 'confirmed'
      }
    ],
    freeTime: {
      available: true,
      hours: "Mezza giornata o sera",
      suggestions: [
        {
          name: "🏛️ Gita a Bilbao",
          description: "A soli 1h15 di auto. Il Guggenheim da solo vale il viaggio!",
          duration: "Mezza giornata o giornata",
          type: 'culture',
          tips: "Partenza mattina presto o pomeriggio dopo meeting"
        },
        {
          name: "Guggenheim Museum",
          description: "Capolavoro di Frank Gehry. Arte contemporanea in architettura mozzafiato.",
          duration: "2-3 ore",
          type: 'culture',
          mapLink: "https://maps.google.com/?q=Guggenheim+Bilbao"
        },
        {
          name: "Casco Viejo Bilbao",
          description: "7 strade storiche con bar, negozi e atmosfera autentica",
          duration: "1-2 ore",
          type: 'culture'
        },
        {
          name: "Monte Urgull",
          description: "Salita panoramica con vista su tutta San Sebastián",
          duration: "1.5 ore",
          type: 'nature'
        }
      ]
    }
  },
  {
    date: "5 Febbraio",
    isoDate: "2026-02-05",
    dayOfWeek: "Giovedì",
    title: "SWITCH Day 3 → Bordeaux",
    subtitle: "Ultimo giorno meeting e ritorno",
    emoji: "🚗",
    location: "San Sebastián → Bordeaux",
    bookings: [
      {
        type: 'hotel',
        name: "Meeting mattina",
        address: "Goe Tech Center",
        time: "Mattina",
        status: 'confirmed'
      },
      {
        type: 'car',
        name: "Guida San Sebastián → Bordeaux",
        time: "Pomeriggio",
        notes: "Percorso alternativo possibile",
        status: 'confirmed'
      },
      {
        type: 'hotel',
        name: "Seeko'o Hotel",
        address: "54 Quai de Bacalan, Bordeaux",
        time: "Sera",
        price: "~€222 (2 camere)",
        notes: "Hotel design sui Bassins à Flot",
        link: "https://www.booking.com/hotel/fr/seeko-o.it.html",
        status: 'pending'
      }
    ],
    roadTrip: {
      from: "San Sebastián",
      to: "Bordeaux",
      duration: "~3 ore con tappe",
      stops: [
        {
          name: "Getaria",
          description: "Villaggio di pescatori, patria del txakoli (vino basco)",
          stayTime: "30 min",
          highlights: ["Porto pittoresco", "Degustazione txakoli", "Vista costa"],
          mapLink: "https://maps.google.com/?q=Getaria+Spain"
        },
        {
          name: "Bayonne",
          description: "Capitale del Paese Basco francese. Famosa per cioccolato e prosciutto.",
          stayTime: "45 min",
          highlights: ["Cattedrale", "Petit Bayonne", "Cioccolaterie"],
          mapLink: "https://maps.google.com/?q=Bayonne+France"
        },
        {
          name: "Cité du Vin (Bordeaux)",
          description: "Se arrivi prima delle 18, museo del vino spettacolare",
          stayTime: "1.5 ore",
          highlights: ["Architettura", "Degustazione panoramica", "Vicino al Seeko'o"],
          mapLink: "https://maps.google.com/?q=Cite+du+Vin+Bordeaux"
        }
      ]
    },
    freeTime: {
      available: true,
      hours: "Sera a Bordeaux",
      suggestions: [
        {
          name: "Cena a Bordeaux",
          description: "Zona Saint-Pierre per ristoranti tipici",
          duration: "2 ore",
          type: 'food'
        },
        {
          name: "Miroir d'Eau",
          description: "La piazza d'acqua più grande del mondo, spettacolare di sera",
          duration: "30 min",
          type: 'leisure'
        }
      ]
    }
  },
  {
    date: "6 Febbraio",
    isoDate: "2026-02-06",
    dayOfWeek: "Venerdì",
    title: "Bordeaux → Roma",
    subtitle: "Rientro",
    emoji: "🏠",
    location: "In viaggio",
    bookings: [
      {
        type: 'train',
        name: "TGV Parigi → Zurigo",
        code: "VKWQDB",
        time: "10:22 → 14:26",
        address: "Paris Gare de Lyon → Zurich Hb",
        carriage: "11",
        seat: "119",
        class: "1ª Classe",
        status: 'confirmed',
        ticketPdf: "/tickets/tgv-parigi-zurigo-VKWQDB.pdf",
        link: "https://www.sncf-connect.com/app/trips",
        notes: "⚠️ Devi arrivare a Parigi da Bordeaux (treno mattina presto?)"
      },
      {
        type: 'train',
        name: "EuroCity Zurigo → Milano",
        code: "RNAPU5",
        time: "15:33 → 18:50",
        address: "Zuerich Hb → Milano Centrale",
        carriage: "9",
        seat: "22",
        class: "1ª Classe",
        status: 'confirmed',
        ticketPdf: "/tickets/Virgilio-Maretto-1856610016Trenitalia.pdf",
        link: "https://www.trenitalia.com/it/informazioni/ricerca_biglietti.html"
      },
      {
        type: 'train',
        name: "Frecciarossa 9663 Milano → Roma",
        code: "RNAPU5",
        time: "19:35 → 22:39",
        address: "Milano Centrale → Roma Termini",
        carriage: "2",
        seat: "14D",
        class: "1° Business",
        price: "€235.90 (totale Zurigo-Roma)",
        status: 'confirmed',
        ticketPdf: "/tickets/Virgilio-Maretto-1856610016Trenitalia.pdf",
        link: "https://www.trenitalia.com/it/informazioni/ricerca_biglietti.html"
      }
    ],
    freeTime: {
      available: false,
      suggestions: []
    }
  }
];

export const sanSebastianGuide = {
  pintxosBars: [
    { name: "La Cuchara de San Telmo", specialty: "Carrillera de ternera", area: "Parte Vieja" },
    { name: "Gandarias", specialty: "Solomillo", area: "Parte Vieja" },
    { name: "Bar Nestor", specialty: "Tortilla (solo 2 al giorno!)", area: "Parte Vieja" },
    { name: "A Fuego Negro", specialty: "Pintxos creativi", area: "Parte Vieja" },
    { name: "Borda Berri", specialty: "Risotto ai funghi", area: "Parte Vieja" },
    { name: "Bar Txepetxa", specialty: "Anchoas", area: "Parte Vieja" }
  ],
  restaurants: [
    { name: "Arzak", stars: 3, type: "Alta cucina basca", price: "€€€€" },
    { name: "Kokotxa", stars: 1, type: "Cucina basca moderna", price: "€€€" },
    { name: "Rekondo", stars: 0, type: "Tradizionale, cantina leggendaria", price: "€€€" }
  ],
  mustSee: [
    { name: "La Concha", description: "Spiaggia iconica", time: "Sempre" },
    { name: "Parte Vieja", description: "Centro storico, pintxos", time: "Sera" },
    { name: "Monte Urgull", description: "Vista panoramica", time: "2h" },
    { name: "Monte Igueldo", description: "Funicolare + luna park vintage", time: "2h" },
    { name: "Peine del Viento", description: "Sculture di Chillida", time: "30min" }
  ]
};

export const entertainment = {
  films: [
    {
      title: "El Hoyo (The Platform)",
      year: 2019,
      type: "Film",
      genre: "Thriller/Sci-Fi",
      duration: "1h 34min",
      description: "Thriller spagnolo distopico sul cibo e la società. Perfetto pre-Paesi Baschi.",
      streaming: "Netflix",
      rating: "7.0"
    },
    {
      title: "Ocho apellidos vascos",
      year: 2014,
      type: "Film",
      genre: "Commedia",
      duration: "1h 38min",
      description: "Commedia spagnola cult sull'identità basca. Imparerai gli stereotipi prima di arrivare!",
      streaming: "Prime Video",
      rating: "6.5"
    },
    {
      title: "Handia",
      year: 2017,
      type: "Film",
      genre: "Drama storico",
      duration: "1h 54min",
      description: "Film basco sulla storia vera del 'Gigante di Altzo'. Paesaggi mozzafiato.",
      streaming: "Filmin",
      rating: "7.1"
    },
    {
      title: "Ex Machina",
      year: 2015,
      type: "Film",
      genre: "Sci-Fi",
      duration: "1h 48min",
      description: "AI e coscienza. Perfetto dopo l'articolo di Amodei.",
      streaming: "Prime Video",
      rating: "7.7"
    },
    {
      title: "Her",
      year: 2013,
      type: "Film",
      genre: "Drama/Sci-Fi",
      duration: "2h 6min",
      description: "Relazione uomo-AI. Poetico e riflessivo.",
      streaming: "Netflix",
      rating: "8.0"
    }
  ],
  series: [
    {
      title: "Chef's Table",
      seasons: "7",
      type: "Docuserie",
      genre: "Food/Documentary",
      episodeDuration: "50 min",
      description: "S4E2 è dedicato ad Asador Etxebarri nei Paesi Baschi. Imperdibile!",
      streaming: "Netflix",
      rating: "8.6",
      recommended: "S4E2 (Asador Etxebarri)"
    },
    {
      title: "Somebody Feed Phil",
      seasons: "7",
      type: "Docuserie",
      genre: "Food/Travel",
      episodeDuration: "55 min",
      description: "L'episodio su San Sebastián è una guida gastronomica perfetta.",
      streaming: "Netflix",
      rating: "8.2",
      recommended: "S3E1 (San Sebastián)"
    },
    {
      title: "La Casa de Papel",
      seasons: "5",
      type: "Serie",
      genre: "Thriller",
      episodeDuration: "45-70 min",
      description: "Se non l'hai ancora vista, 8h di treno sono perfette per iniziare.",
      streaming: "Netflix",
      rating: "8.2"
    },
    {
      title: "Black Mirror",
      seasons: "7",
      type: "Serie",
      genre: "Sci-Fi/Anthology",
      episodeDuration: "45-90 min",
      description: "Episodi standalone su tecnologia e società. Perfetti per treni.",
      streaming: "Netflix",
      rating: "8.7",
      recommended: "S2E1, S3E1, S4E4"
    }
  ],
  podcasts: [
    {
      title: "Lex Fridman Podcast",
      episode: "#452 - Dario Amodei",
      duration: "3h 30min",
      description: "Intervista approfondita al CEO di Anthropic. Complemento perfetto all'articolo.",
      platform: "YouTube/Spotify"
    }
  ]
};

export const readingList = [
  {
    title: "The Adolescence of Technology",
    author: "Dario Amodei (CEO Anthropic)",
    description: "Confrontare e superare i rischi dell'AI potente. Una riflessione su come l'umanità sta entrando in un 'rito di passaggio' tecnologico.",
    url: "https://darioamodei.com/essay/the-adolescence-of-technology",
    readTime: "~30 min",
    topics: ["AI Safety", "Rischi tecnologici", "Futuro dell'AI"]
  }
];

export const torinoRestaurants = [
  { name: "Del Cambio", stars: 1, description: "Storico (1757), piemontese raffinato", phone: "+39 011 546690" },
  { name: "Piano35", stars: 1, description: "35° piano, vista spettacolare", phone: "+39 011 1976 7035" },
  { name: "Cannavacciuolo Bistrot", stars: 1, description: "Moderno, ottimo rapporto q/p", phone: "+39 011 839 3395" },
  { name: "Carignano", stars: 1, description: "Grand Hotel Sitea, classico", phone: "+39 011 517 0171" },
  { name: "Condividere", stars: 1, description: "Concept Ferran Adrià", phone: "+39 011 195 62800" }
];
