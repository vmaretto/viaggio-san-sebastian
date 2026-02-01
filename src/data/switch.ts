// SWITCH 4th Consortium Meeting - Agenda
export interface AgendaSession {
  time: string;
  title: string;
  description?: string;
  speakers?: string[];
  location?: string;
  type: 'session' | 'break' | 'meal' | 'visit' | 'networking' | 'workshop' | 'highlight';
  notes?: string;
  isYourSession?: boolean; // Per evidenziare le sessioni dove presenta Virgilio
}

export interface SwitchDay {
  date: string;
  dayOfWeek: string;
  title: string;
  sessions: AgendaSession[];
}

export const switchInfo = {
  title: "4th Consortium Meeting and General Assembly",
  location: "San Sebastián, Spain",
  dates: "3-5 February 2026",
  venue: {
    name: "Goe Tech Center",
    address: "Avenida Navarra, 9, 20013, Donostia-San Sebastián, Gipuzkoa",
    mapLink: "https://maps.google.com/?q=Goe+Tech+Center+San+Sebastian"
  },
  zoom: {
    link: "https://eu01web.zoom.us/j/61818883935",
    meetingId: "61818883935"
  },
  arrivalDinner: {
    date: "2 Feb (Monday)",
    place: "Baga Biga",
    address: "Paseo Ramón María Lili, 8, 20002 Donostia/San Sebastián",
    time: "dalle 19:00",
    note: "Drink and dinner - everyone covers their own expenses"
  }
};

export const switchAgenda: SwitchDay[] = [
  {
    date: "3 Febbraio",
    dayOfWeek: "Martedì",
    title: "Day 1 - WP Progress & Workshops",
    sessions: [
      { time: "08:30-09:00", title: "Arrival & Registration", type: "session" },
      { time: "09:00-09:10", title: "Welcome to San Sebastian Food Hub", speakers: ["Cinta Lomba (GOE Tech)", "Inma Batalla (BC3)", "Miren Millet (Kutxa Fundazioa)"], type: "session" },
      { time: "09:10-09:20", title: "Recap of SWITCH", speakers: ["Maria Vincenza Chiriacò (CMCC)"], type: "session" },
      { 
        time: "09:20-11:00", 
        title: "Flash presentations on WPs progress", 
        type: "session",
        description: "Completed tasks and planned activities for the final year",
        notes: "WP2 (5min), WP3 (5min), WP4 (10min), WP5 (5min), WP6 (15min), WP7 (5min), WP8 (15min), WP9 (5min)"
      },
      { time: "11:00-11:20", title: "☕ Coffee Break", type: "break" },
      { 
        time: "11:20-13:00", 
        title: "WP4 Workshop: Actor Connectivity", 
        type: "workshop",
        speakers: ["Spencer Moore (WU)", "Chiara De Tomassi", "Sara Wiertsema (WU)", "Kristel Polhuis (WU)"],
        notes: "🔵 Porta il laptop! Network mapping con Mental Modeler"
      },
      { time: "13:00-14:30", title: "🍽️ Lunch", type: "meal" },
      { 
        time: "14:30-15:30", 
        title: "WP6 Workshop: SWITCH Technologies", 
        type: "workshop",
        isYourSession: true,
        description: "Demo tecnologie SWITCH",
        notes: "⭐ TUA SESSIONE: Demo Data Lake + Smart Counter (15min) + MyFreshFood Spectrometer (15min)"
      },
      { 
        time: "15:30-16:00", 
        title: "🚌 Bus to Ekogunea", 
        type: "visit",
        location: "Departure from Goe Tech Center"
      },
      { 
        time: "16:00-17:00", 
        title: "Visit Ekogunea (Community Gardens)", 
        type: "visit",
        notes: "⚠️ Scarpe appropriate + ombrello!"
      },
      { 
        time: "17:00-17:15", 
        title: "🚌 Bus to Basque Culinary Center", 
        type: "visit"
      },
      { 
        time: "17:15-18:15", 
        title: "Visit Basque Culinary Center", 
        type: "visit",
        description: "Gastronomy University"
      },
      { time: "18:15-18:45", title: "🚌 Bus back to Goe Tech Center", type: "visit" },
      { time: "18:45-20:30", title: "Free Time", type: "break" },
      { 
        time: "20:30-21:30", 
        title: "🍷 Networking Dinner", 
        type: "networking",
        location: "Lua Bistró",
        notes: "Bermingham Street, 24, Donostia/San Sebastián"
      }
    ]
  },
  {
    date: "4 Febbraio",
    dayOfWeek: "Mercoledì",
    title: "Day 2 - Hubs & Dialogues",
    sessions: [
      { time: "08:30-09:00", title: "Starting of the meeting", type: "session" },
      { 
        time: "09:00-11:00", 
        title: "WP5 - The Voice of the Hubs", 
        type: "session",
        description: "Presentations from San Sebastian, Gothenburg, Montpellier, Berlin, Rome, Cagliari Hubs",
        notes: "10 min per Hub + Q&A"
      },
      { time: "11:00-11:20", title: "☕ Coffee Break", type: "break" },
      { 
        time: "11:20-13:20", 
        title: "SWITCH Dialogues (Morning)", 
        type: "workshop",
        description: "3 interactive sessions (40 min each)",
        notes: "11:20-12:00 / 12:00-12:40 / 12:40-13:20 → Check your slot!"
      },
      { time: "13:20-14:30", title: "🍽️ Lunch", type: "meal" },
      { 
        time: "14:30-16:30", 
        title: "SWITCH Dialogues (Afternoon)", 
        type: "workshop",
        description: "3 interactive sessions (40 min each)",
        notes: "14:30-15:10 / 15:10-15:50 / 15:50-16:30 → Check your slot!"
      },
      { 
        time: "16:30-17:00", 
        title: "Parallel Sessions", 
        type: "session",
        description: "EU Scenario discussions (WP7) + Communication DHE dissemination"
      },
      { time: "17:00-18:00", title: "Free Time", type: "break" },
      { 
        time: "18:00-20:00", 
        title: "Food Mission Presentation", 
        type: "highlight",
        location: "Tabakalera (Room Kluba, 1st Floor)",
        description: "Political agenda Gipuzkoa region + Stakeholders (Ausolan & Eroski) + Local concert"
      },
      { 
        time: "20:00", 
        title: "🍷 Dinner at Tabakalera", 
        type: "networking"
      }
    ]
  },
  {
    date: "5 Febbraio",
    dayOfWeek: "Giovedì",
    title: "Day 3 - Management & GA",
    sessions: [
      { time: "08:30-09:00", title: "Starting of the meeting", type: "session" },
      { 
        time: "09:00-11:00", 
        title: "WP1 - Management & Admin", 
        type: "session",
        speakers: ["Andrea Magnani", "Matteo Bellotta"],
        notes: "Review Report RP2 (due Feb 28), Financial Report M19-M36, Deliverables & Milestones, Publications, Future collaborations"
      },
      { time: "11:00-11:30", title: "☕ Coffee Break", type: "break" },
      { 
        time: "11:30-13:00", 
        title: "General Assembly", 
        type: "highlight",
        speakers: ["Maria Vincenza Chiriacò"],
        notes: "⚠️ At least 1 person per partner required"
      },
      { time: "13:00-14:30", title: "🍽️ Lunch", type: "meal" },
      { 
        time: "14:30-15:30", 
        title: "Consolidation of Lessons Learned", 
        type: "session",
        description: "Takeaways and key learnings"
      },
      { 
        time: "16:00", 
        title: "🏁 Closing of the Meeting", 
        type: "highlight"
      }
    ]
  }
];

// Your presentation details
export const yourPresentations = [
  {
    day: "Day 1 - 3 Feb",
    time: "14:30-15:30",
    title: "WP6 Workshop - SWITCH Technologies",
    items: [
      {
        title: "Data Lake + Smart Counter",
        duration: "15 min",
        presenters: ["Virgilio Maretto", "Marco Pizzuto"],
        organization: "CMCC/POSTI",
        description: "Demonstration and usage of Data Lake, data upload exercise, communication with Smart Counter",
        apps: [
          {
            name: "Mini Orto",
            description: "Use case SCIO + webapp per monitoraggio orto",
            url: "https://mini-orto.vercel.app",
            github: "https://github.com/vmaretto/MiniOrto",
            icon: "🌱"
          }
        ]
      },
      {
        title: "MyFreshFood Spectrometer",
        duration: "15 min", 
        presenters: ["Virgilio Maretto", "Marco Pizzuto"],
        organization: "POSTI",
        description: "Demonstration of the spectrometer and its use at MakerFaire 2025",
        apps: [
          {
            name: "Sugar Detective",
            description: "App per analisi spettrometrica degli zuccheri",
            url: "https://sugar-detective.vercel.app",
            github: "https://github.com/vmaretto/sugar-detective",
            icon: "🔬"
          }
        ]
      }
    ]
  }
];

// Demo apps for presentations
export const demoApps = [
  {
    name: "Sugar Detective",
    description: "App per analisi spettrometrica degli zuccheri (SCIO)",
    url: "https://sugar-detective.vercel.app",
    github: "https://github.com/vmaretto/sugar-detective",
    icon: "🔬",
    presentation: "MyFreshFood Spectrometer"
  },
  {
    name: "Mini Orto",
    description: "Use case SCIO + webapp per monitoraggio orto",
    url: "https://mini-orto.vercel.app",
    github: "https://github.com/vmaretto/MiniOrto",
    icon: "🌱",
    presentation: "Data Lake + Smart Counter"
  }
];
