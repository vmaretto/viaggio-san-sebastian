'use client';

import { useState, useEffect, useCallback } from 'react';
import { tripData as initialTripData, sanSebastianGuide, torinoRestaurants, readingList, entertainment, DayPlan, Booking, Activity } from '@/data/trip';
import { switchInfo, switchAgenda, yourPresentations, demoApps } from '@/data/switch';

// ============================================
// STORAGE HOOK - Persistenza localStorage
// ============================================
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ============================================
// TYPES
// ============================================
interface DayNote {
  dayIndex: number;
  text: string;
  createdAt: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

interface CustomBooking extends Booking {
  id: string;
  isCustom?: boolean;
}

interface CustomActivity extends Activity {
  id: string;
  isCustom?: boolean;
}

// ============================================
// COMPONENTS
// ============================================

// Countdown component
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const departure = new Date('2026-02-01T16:10:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = departure.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const isLive = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  
  if (isLive) {
    return (
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 text-center">
        <div className="text-2xl mb-1">🚀</div>
        <div className="text-green-400 font-bold">Viaggio in corso!</div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4">
      <div className="text-center text-xs text-amber-400/80 mb-2 uppercase tracking-wide">Partenza tra</div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-2xl font-bold text-amber-400">{timeLeft.days}</div>
          <div className="text-[10px] text-gray-400">giorni</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">{timeLeft.hours}</div>
          <div className="text-[10px] text-gray-400">ore</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">{timeLeft.minutes}</div>
          <div className="text-[10px] text-gray-400">min</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400">{timeLeft.seconds}</div>
          <div className="text-[10px] text-gray-400">sec</div>
        </div>
      </div>
    </div>
  );
}

// Copy button component
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all active:scale-95"
    >
      <span className="font-mono">{label || text}</span>
      <span className="text-xs">{copied ? '✓' : '📋'}</span>
    </button>
  );
}

// Maps link component
function MapsLink({ address, className = '' }: { address: string; className?: string }) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  return (
    <a 
      href={mapsUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors ${className}`}
    >
      <span>📍</span>
      <span className="underline underline-offset-2">{address}</span>
    </a>
  );
}

// Modal component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Checklist Component
function PackingChecklist({ items, setItems }: { items: ChecklistItem[]; setItems: (items: ChecklistItem[]) => void }) {
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Essenziali');
  
  const categories = ['Essenziali', 'Vestiti', 'Tech', 'Documenti', 'Altro'];
  
  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, {
      id: Date.now().toString(),
      text: newItem.trim(),
      checked: false,
      category: newCategory
    }]);
    setNewItem('');
  };
  
  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };
  
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(item => item.category === cat);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  const totalChecked = items.filter(i => i.checked).length;
  const total = items.length;
  
  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progresso</span>
          <span className="text-green-400">{totalChecked}/{total}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: total > 0 ? `${(totalChecked/total)*100}%` : '0%' }}
          />
        </div>
      </div>
      
      {/* Add new item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Aggiungi oggetto..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-sm focus:outline-none"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button
          onClick={addItem}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
        >
          +
        </button>
      </div>
      
      {/* Items by category */}
      {categories.map(cat => {
        const catItems = groupedItems[cat];
        if (catItems.length === 0) return null;
        
        return (
          <div key={cat} className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-400">{cat}</h4>
            {catItems.map(item => (
              <div 
                key={item.id}
                className={`flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2 ${item.checked ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.checked ? 'bg-green-500 border-green-500' : 'border-gray-500'
                  }`}
                >
                  {item.checked && <span className="text-xs">✓</span>}
                </button>
                <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-500' : ''}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Hero images for destinations
const heroImages: Record<string, string> = {
  'san-sebastian': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'bilbao': 'https://images.unsplash.com/photo-1558618047-3c8c76f7f8c8?w=800&q=80',
  'bordeaux': 'https://images.unsplash.com/photo-1565169007649-da8c6f0a38ba?w=800&q=80',
  'torino': 'https://images.unsplash.com/photo-1583167617321-a5bfd4c2a03e?w=800&q=80',
  'biarritz': 'https://images.unsplash.com/photo-1598977054780-2e4f0a4e6b3b?w=800&q=80',
  'dune-pilat': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
};

// Default checklist items
const defaultChecklist: ChecklistItem[] = [
  { id: '1', text: 'Passaporto/Carta d\'identità', checked: false, category: 'Documenti' },
  { id: '2', text: 'Biglietti treno (PDF)', checked: false, category: 'Documenti' },
  { id: '3', text: 'Prenotazioni hotel', checked: false, category: 'Documenti' },
  { id: '4', text: 'Patente (per noleggio auto)', checked: false, category: 'Documenti' },
  { id: '5', text: 'Caricatore telefono', checked: false, category: 'Tech' },
  { id: '6', text: 'Power bank', checked: false, category: 'Tech' },
  { id: '7', text: 'Auricolari', checked: false, category: 'Tech' },
  { id: '8', text: 'Adattatore presa (Francia)', checked: false, category: 'Tech' },
  { id: '9', text: 'Giacca impermeabile', checked: false, category: 'Vestiti' },
  { id: '10', text: 'Scarpe comode', checked: false, category: 'Vestiti' },
  { id: '11', text: 'Medicinali personali', checked: false, category: 'Essenziali' },
  { id: '12', text: 'Carta di credito', checked: false, category: 'Essenziali' },
  { id: '13', text: 'Contanti (€)', checked: false, category: 'Essenziali' },
];

export default function Home() {
  // ============================================
  // STATE
  // ============================================
  const [activeTab, setActiveTab] = useState<'itinerary' | 'switch' | 'san-sebastian' | 'bilbao' | 'bookings' | 'entertainment' | 'checklist' | 'tasks' | 'diary'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));
  
  // Persistent state (localStorage)
  const [dayNotes, setDayNotes] = useLocalStorage<Record<number, string>>('trip-notes', {});
  const [checklist, setChecklist] = useLocalStorage<ChecklistItem[]>('trip-checklist', defaultChecklist);
  const [favorites, setFavorites] = useLocalStorage<Set<string>>('trip-favorites', new Set());
  const [visited, setVisited] = useLocalStorage<Set<string>>('trip-visited', new Set());
  const [customBookings, setCustomBookings] = useLocalStorage<Record<number, CustomBooking[]>>('trip-custom-bookings', {});
  const [customActivities, setCustomActivities] = useLocalStorage<Record<number, CustomActivity[]>>('trip-custom-activities', {});
  const [editedBookings, setEditedBookings] = useLocalStorage<Record<string, Partial<Booking>>>('trip-edited-bookings', {});
  
  // Custom items for other tabs
  const [customPintxos, setCustomPintxos] = useLocalStorage<Array<{id: string; name: string; specialty: string; area: string}>>('trip-custom-pintxos', []);
  const [customMustSee, setCustomMustSee] = useLocalStorage<Array<{id: string; name: string; description: string; time: string}>>('trip-custom-mustsee', []);
  const [customBilbao, setCustomBilbao] = useLocalStorage<Array<{id: string; name: string; description: string}>>('trip-custom-bilbao', []);
  const [customFilms, setCustomFilms] = useLocalStorage<Array<{id: string; title: string; genre: string; duration: string; description: string; streaming: string}>>('trip-custom-films', []);
  const [switchNotes, setSwitchNotes] = useLocalStorage<string>('trip-switch-notes', '');
  
  // Trip Tasks (todo list) - organized by leg/tratta
  const [tripTasks, setTripTasks] = useLocalStorage<Array<{
    id: string;
    text: string;
    completed: boolean;
    leg: string; // tratta/percorso
    createdAt: string;
  }>>('trip-tasks-v2', [
    // 2 Feb - Torino → Parigi
    { id: '1', text: 'Prenotare auto Bordeaux', completed: false, leg: 'torino-parigi', createdAt: '2026-02-02' },
    { id: '2', text: 'Prenotare hotel Bordeaux (5 Feb)', completed: false, leg: 'torino-parigi', createdAt: '2026-02-02' },
    { id: '3', text: 'Check Sugar Detective', completed: false, leg: 'torino-parigi', createdAt: '2026-02-02' },
    { id: '4', text: 'Check Mini Orto', completed: false, leg: 'torino-parigi', createdAt: '2026-02-02' },
    { id: '5', text: 'Inserire Analytics nelle app', completed: false, leg: 'torino-parigi', createdAt: '2026-02-02' },
    // 2 Feb - Parigi → Bordeaux
    { id: '6', text: 'Email Luigi Saviolo', completed: false, leg: 'parigi-bordeaux', createdAt: '2026-02-02' },
    { id: '7', text: 'Email Giuseppe Peccentino', completed: false, leg: 'parigi-bordeaux', createdAt: '2026-02-02' },
    { id: '8', text: 'All-A-Fly', completed: false, leg: 'parigi-bordeaux', createdAt: '2026-02-02' },
    // 6 Feb - Ritorno
    { id: '9', text: 'Backup foto viaggio', completed: false, leg: 'ritorno', createdAt: '2026-02-02' },
  ]);
  
  // Define legs/tratte
  const tripLegs = [
    { id: 'torino-parigi', label: '🚄 Torino → Parigi', time: '2 Feb • 07:19-13:19', duration: '6h' },
    { id: 'parigi-bordeaux', label: '🚄 Parigi → Bordeaux', time: '2 Feb • 14:05-16:30', duration: '2h 25min' },
    { id: 'san-sebastian', label: '🏖️ San Sebastián', time: '2-5 Feb', duration: 'Tempo libero' },
    { id: 'ritorno', label: '🏠 Ritorno', time: '6 Feb', duration: '~12h treno' },
    { id: 'altro', label: '📝 Altro', time: '', duration: '' },
  ];
  
  // Diary entries with photos
  const [diaryEntries, setDiaryEntries] = useLocalStorage<Array<{
    id: string;
    date: string;
    title: string;
    text: string;
    photos: string[]; // base64 encoded
    location?: string;
    createdAt: string;
  }>>('trip-diary', []);
  
  // Modal state
  const [editModal, setEditModal] = useState<{ type: 'note' | 'booking' | 'activity' | 'editBooking' | 'pintxo' | 'mustSee' | 'bilbaoPlace' | 'film' | 'switchNote'; dayIndex: number; booking?: CustomBooking } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // ============================================
  // DATE HELPERS
  // ============================================
  
  const getDayStatus = (isoDate: string): 'past' | 'today' | 'future' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(isoDate);
    dayDate.setHours(0, 0, 0, 0);
    
    if (dayDate < today) return 'past';
    if (dayDate.getTime() === today.getTime()) return 'today';
    return 'future';
  };

  // Auto-expand today's day on mount
  useEffect(() => {
    const todayIndex = initialTripData.findIndex(day => getDayStatus(day.isoDate) === 'today');
    if (todayIndex !== -1) {
      setExpandedDays(new Set([todayIndex]));
    }
  }, []);

  // ============================================
  // HANDLERS
  // ============================================
  
  const toggleDay = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const toggleVisited = (id: string) => {
    const newVisited = new Set(visited);
    if (newVisited.has(id)) {
      newVisited.delete(id);
    } else {
      newVisited.add(id);
    }
    setVisited(newVisited);
  };

  const saveNote = (dayIndex: number, text: string) => {
    setDayNotes({ ...dayNotes, [dayIndex]: text });
  };

  const addCustomBooking = (dayIndex: number, booking: Omit<CustomBooking, 'id' | 'isCustom'>) => {
    const newBooking: CustomBooking = {
      ...booking,
      id: Date.now().toString(),
      isCustom: true
    };
    setCustomBookings({
      ...customBookings,
      [dayIndex]: [...(customBookings[dayIndex] || []), newBooking]
    });
  };

  const deleteCustomBooking = (dayIndex: number, bookingId: string) => {
    setCustomBookings({
      ...customBookings,
      [dayIndex]: (customBookings[dayIndex] || []).filter(b => b.id !== bookingId)
    });
  };

  const updateBookingField = (bookingKey: string, field: string, value: string) => {
    setEditedBookings({
      ...editedBookings,
      [bookingKey]: {
        ...(editedBookings[bookingKey] || {}),
        [field]: value
      }
    });
  };

  const addCustomActivity = (dayIndex: number, activity: Omit<CustomActivity, 'id' | 'isCustom'>) => {
    const newActivity: CustomActivity = {
      ...activity,
      id: Date.now().toString(),
      isCustom: true
    };
    setCustomActivities({
      ...customActivities,
      [dayIndex]: [...(customActivities[dayIndex] || []), newActivity]
    });
  };

  const deleteCustomActivity = (dayIndex: number, activityId: string) => {
    setCustomActivities({
      ...customActivities,
      [dayIndex]: (customActivities[dayIndex] || []).filter(a => a.id !== activityId)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'todo': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '✓ Confermato';
      case 'pending': return '⏳ Da confermare';
      case 'todo': return '📝 Da fare';
      default: return status;
    }
  };

  // Merge original data with edits
  const getMergedBooking = (booking: Booking, dayIndex: number, bookingIndex: number): Booking => {
    const key = `${dayIndex}-${bookingIndex}`;
    const edits = editedBookings[key] || {};
    return { ...booking, ...edits };
  };

  return (
    <main 
      className="min-h-screen text-white"
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Hero Header with Image */}
      <header className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImages['san-sebastian']})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-green-900/20" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🇪🇸</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              San Sebastián
            </h1>
            <p className="text-xl text-gray-300">SWITCH Meeting 2026</p>
            <p className="text-sm text-gray-400 mt-2">1-6 Febbraio • Roma → Torino → Francia → Paesi Baschi</p>
          </div>
          
          {/* Countdown */}
          <div className="mb-6">
            <Countdown />
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">6</div>
              <div className="text-xs text-gray-400">Giorni</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">3</div>
              <div className="text-xs text-gray-400">Paesi</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">~€1.300</div>
              <div className="text-xs text-gray-400">Budget</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
            {[
              { id: 'itinerary', label: '📅 Itinerario', icon: '📅' },
              { id: 'tasks', label: '📋 Task', icon: '📋' },
              { id: 'diary', label: '📔 Diario', icon: '📔' },
              { id: 'switch', label: '💼 SWITCH', icon: '💼' },
              { id: 'san-sebastian', label: '🍷 San Sebastián', icon: '🍷' },
              { id: 'bilbao', label: '🏛️ Bilbao', icon: '🏛️' },
              { id: 'bookings', label: '📋 Prenotazioni', icon: '📋' },
              { id: 'entertainment', label: '🎬 Entertainment', icon: '🎬' },
              { id: 'checklist', label: '✅ Bagagli', icon: '✅' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* CHECKLIST TAB */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">✅ Checklist Bagagli</h2>
            <PackingChecklist items={checklist} setItems={setChecklist} />
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">📋 Task Viaggio</h2>
              <button
                onClick={() => {
                  setFormData({ leg: 'altro' });
                  setEditModal({ type: 'task' as any, dayIndex: 0 });
                }}
                className="text-sm bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium"
              >
                + Aggiungi
              </button>
            </div>
            
            {/* Progress */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Completati</span>
                <span className="text-green-400">
                  {tripTasks.filter(t => t.completed).length}/{tripTasks.length}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: tripTasks.length > 0 ? `${(tripTasks.filter(t => t.completed).length / tripTasks.length) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Tasks by leg/tratta */}
            {tripLegs.map(leg => {
              const legTasks = tripTasks.filter(t => t.leg === leg.id);
              if (legTasks.length === 0) return null;
              
              const completedCount = legTasks.filter(t => t.completed).length;
              const allCompleted = completedCount === legTasks.length;
              
              return (
                <div key={leg.id} className={`rounded-xl overflow-hidden ${allCompleted ? 'opacity-60' : ''}`}>
                  {/* Leg header */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-3 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{leg.label}</h3>
                        {leg.time && (
                          <p className="text-xs text-gray-400">{leg.time} • {leg.duration}</p>
                        )}
                      </div>
                      <div className="text-sm">
                        <span className={completedCount === legTasks.length ? 'text-green-400' : 'text-gray-400'}>
                          {completedCount}/{legTasks.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tasks */}
                  <div className="bg-white/5">
                    {legTasks.map(task => (
                      <div 
                        key={task.id}
                        className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 ${task.completed ? 'opacity-50' : ''}`}
                      >
                        <button
                          onClick={() => {
                            setTripTasks(tripTasks.map(t => 
                              t.id === task.id ? { ...t, completed: !t.completed } : t
                            ));
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                            task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <span className="text-sm">✓</span>}
                        </button>
                        <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.text}
                        </span>
                        <button
                          onClick={() => setTripTasks(tripTasks.filter(t => t.id !== task.id))}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DIARY TAB */}
        {activeTab === 'diary' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">📔 Diario di Viaggio</h2>
              <button
                onClick={() => {
                  setFormData({ date: new Date().toISOString().split('T')[0] });
                  setEditModal({ type: 'diary' as any, dayIndex: 0 });
                }}
                className="text-sm bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-medium"
              >
                + Nuova Entry
              </button>
            </div>

            {diaryEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-4">📷</div>
                <p>Nessuna entry ancora.</p>
                <p className="text-sm">Inizia a documentare il tuo viaggio!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diaryEntries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(entry => (
                  <div key={entry.id} className="bg-white/5 rounded-2xl overflow-hidden">
                    {/* Photos carousel */}
                    {entry.photos.length > 0 && (
                      <div className="relative h-48 overflow-x-auto flex gap-1 snap-x snap-mandatory">
                        {entry.photos.map((photo, i) => (
                          <img 
                            key={i}
                            src={photo}
                            alt={`Photo ${i + 1}`}
                            className="h-full w-auto object-cover snap-center"
                          />
                        ))}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{entry.title}</h3>
                          <p className="text-xs text-gray-400">
                            {new Date(entry.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                            {entry.location && ` • 📍 ${entry.location}`}
                          </p>
                        </div>
                        <button
                          onClick={() => setDiaryEntries(diaryEntries.filter(e => e.id !== entry.id))}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SWITCH TAB */}
        {activeTab === 'switch' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🇪🇺</div>
                <div>
                  <h2 className="text-xl font-bold">{switchInfo.title}</h2>
                  <p className="text-gray-300">{switchInfo.dates}</p>
                  <p className="text-sm text-gray-400 mt-1">📍 {switchInfo.venue.name}</p>
                </div>
              </div>
            </div>

            {/* Personal Notes for SWITCH */}
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-indigo-300">📝 Note Meeting</h4>
                <button
                  onClick={() => {
                    setFormData({ note: switchNotes });
                    setEditModal({ type: 'switchNote', dayIndex: 0 });
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  ✏️ Modifica
                </button>
              </div>
              {switchNotes ? (
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{switchNotes}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Aggiungi note per il meeting (domande, cose da ricordare...)</p>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              <a 
                href={switchInfo.zoom.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center hover:bg-blue-500/30 transition-colors"
              >
                <div className="text-2xl mb-1">📹</div>
                <div className="text-sm font-medium">Zoom Meeting</div>
                <div className="text-xs text-gray-400 mt-1">ID: {switchInfo.zoom.meetingId}</div>
              </a>
              <a 
                href={switchInfo.venue.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center hover:bg-green-500/30 transition-colors"
              >
                <div className="text-2xl mb-1">📍</div>
                <div className="text-sm font-medium">Venue</div>
                <div className="text-xs text-gray-400 mt-1">Goe Tech Center</div>
              </a>
            </div>

            {/* Your Presentations Highlight */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-amber-400 mb-3">⭐ Le Tue Presentazioni</h3>
              {yourPresentations.map((pres, i) => (
                <div key={i} className="space-y-3">
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">{pres.day}</span> • {pres.time}
                  </div>
                  <div className="text-white font-semibold">{pres.title}</div>
                  {pres.items.map((item, j) => (
                    <div key={j} className="bg-white/5 rounded-xl p-3 ml-2 border-l-2 border-amber-500">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.duration} • {item.presenters.join(', ')}</div>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                      {item.apps && item.apps.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {item.apps.map((app: { icon: string; name: string; description: string; url: string; github: string }, aIndex: number) => (
                            <div key={aIndex} className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span>{app.icon}</span>
                                <span className="font-medium text-blue-300">{app.name}</span>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{app.description}</p>
                              <div className="flex gap-2">
                                <a 
                                  href={app.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full inline-flex items-center gap-1"
                                >
                                  🚀 Apri App
                                </a>
                                <a 
                                  href={app.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-full inline-flex items-center gap-1"
                                >
                                  📂 GitHub
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Demo Apps Quick Access */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold">📱 App per le Demo</h3>
              <div className="grid grid-cols-1 gap-3">
                {demoApps.map((app, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{app.icon}</div>
                        <div>
                          <div className="font-semibold">{app.name}</div>
                          <p className="text-sm text-gray-400">{app.description}</p>
                          <p className="text-xs text-amber-400 mt-1">📍 {app.presentation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a 
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        🚀 Apri App
                      </a>
                      <a 
                        href={app.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        📂
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda by Day */}
            {switchAgenda.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {day.date}
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">{day.dayOfWeek}</span>
                    <span className="text-gray-500 mx-2">•</span>
                    <span className="font-medium">{day.title}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {day.sessions.map((session, sIndex) => {
                    const getBgColor = () => {
                      if (session.isYourSession) return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50';
                      switch (session.type) {
                        case 'break': return 'bg-gray-500/10 border-gray-500/20';
                        case 'meal': return 'bg-green-500/10 border-green-500/20';
                        case 'visit': return 'bg-purple-500/10 border-purple-500/20';
                        case 'networking': return 'bg-pink-500/10 border-pink-500/20';
                        case 'workshop': return 'bg-blue-500/10 border-blue-500/20';
                        case 'highlight': return 'bg-amber-500/10 border-amber-500/20';
                        default: return 'bg-white/5 border-white/10';
                      }
                    };
                    
                    return (
                      <div 
                        key={sIndex} 
                        className={`rounded-xl p-3 border ${getBgColor()} ${session.isYourSession ? 'ring-2 ring-amber-500/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-xs text-gray-400 font-mono w-24 flex-shrink-0 pt-0.5">
                            {session.time}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {session.title}
                              {session.isYourSession && <span className="text-amber-400 text-xs">⭐ TU</span>}
                            </div>
                            {session.description && (
                              <p className="text-sm text-gray-400 mt-1">{session.description}</p>
                            )}
                            {session.speakers && session.speakers.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                👤 {session.speakers.join(', ')}
                              </p>
                            )}
                            {session.location && (
                              <p className="text-xs text-blue-400 mt-1">
                                📍 {session.location}
                              </p>
                            )}
                            {session.notes && (
                              <p className="text-xs text-amber-400/80 mt-1">
                                💡 {session.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Arrival Dinner Info */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-4">
              <h3 className="font-bold mb-2">🍷 Cena di Benvenuto (2 Feb)</h3>
              <p className="text-sm text-gray-300">{switchInfo.arrivalDinner.place}</p>
              <p className="text-xs text-gray-400">{switchInfo.arrivalDinner.address}</p>
              <p className="text-xs text-gray-400 mt-1">⏰ {switchInfo.arrivalDinner.time}</p>
              <p className="text-xs text-gray-500 mt-1 italic">{switchInfo.arrivalDinner.note}</p>
            </div>
          </div>
        )}
        
        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            {initialTripData.map((day, index) => {
              const allBookings = [
                ...day.bookings.map((b, i) => ({ ...getMergedBooking(b, index, i), id: `orig-${i}`, isCustom: false })),
                ...(customBookings[index] || [])
              ];
              const allActivities = [
                ...(day.freeTime?.suggestions || []).map((a, i) => ({ ...a, id: `orig-${i}`, isCustom: false })),
                ...(customActivities[index] || [])
              ];
              const dayStatus = getDayStatus(day.isoDate);
              
              return (
                <div 
                  key={index} 
                  className={`day-card overflow-hidden card-hover transition-all ${
                    dayStatus === 'past' ? 'opacity-50' : ''
                  } ${
                    dayStatus === 'today' ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-slate-900' : ''
                  }`}
                >
                  {/* Day Header - Clickable */}
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => toggleDay(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{day.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                            {day.dayOfWeek}
                          </span>
                          <span className="text-xs text-gray-400">{day.date}</span>
                          {dayStatus === 'past' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-500/30 text-gray-400">
                              ✓ Completato
                            </span>
                          )}
                          {dayStatus === 'today' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/30 text-green-400 font-bold animate-pulse">
                              📍 OGGI
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">{day.title}</h3>
                        <p className="text-gray-400 text-sm">{day.subtitle}</p>
                        <p className="text-xs text-gray-500 mt-1">📍 {day.location}</p>
                      </div>
                      <div className={`transition-transform ${expandedDays.has(index) ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Day Details - Expandable */}
                  {expandedDays.has(index) && (
                    <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-4">
                      
                      {/* Personal Note */}
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-semibold text-purple-300">📝 Note personali</h4>
                          <button
                            onClick={() => {
                              setFormData({ note: dayNotes[index] || '' });
                              setEditModal({ type: 'note', dayIndex: index });
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300"
                          >
                            ✏️ Modifica
                          </button>
                        </div>
                        {dayNotes[index] ? (
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{dayNotes[index]}</p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Nessuna nota. Tocca per aggiungerne una.</p>
                        )}
                      </div>
                      
                      {/* Bookings */}
                      {allBookings.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Prenotazioni</h4>
                            <button
                              onClick={() => {
                                setFormData({});
                                setEditModal({ type: 'booking', dayIndex: index });
                              }}
                              className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-500/30"
                            >
                              + Aggiungi
                            </button>
                          </div>
                          {allBookings.map((booking, bIndex) => (
                            <div key={booking.id} className={`rounded-xl p-4 space-y-2 ${booking.type === 'train' ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20' : 'bg-white/5'} ${booking.isCustom ? 'border-l-4 border-l-blue-500' : ''}`}>
                              <div className="flex items-start justify-between">
                                <div className="font-semibold">{booking.name}</div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                                    {getStatusText(booking.status)}
                                  </span>
                                  {booking.isCustom && (
                                    <button
                                      onClick={() => deleteCustomBooking(index, booking.id)}
                                      className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                      🗑️
                                    </button>
                                  )}
                                  {!booking.isCustom && (
                                    <button
                                      onClick={() => {
                                        const origIndex = parseInt(booking.id.replace('orig-', ''));
                                        const key = `${index}-${origIndex}`;
                                        setFormData({
                                          time: editedBookings[key]?.time || day.bookings[origIndex].time || '',
                                          notes: editedBookings[key]?.notes || day.bookings[origIndex].notes || '',
                                        });
                                        setEditModal({ type: 'editBooking', dayIndex: index, booking: { ...booking, id: key } as CustomBooking });
                                      }}
                                      className="text-gray-400 hover:text-white text-sm"
                                    >
                                      ✏️
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              {/* Train: Carriage & Seat - BIG AND PROMINENT */}
                              {booking.type === 'train' && (booking.carriage || booking.seat) && (
                                <div className="flex gap-3 my-2">
                                  {booking.carriage && (
                                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-center">
                                      <div className="text-xs opacity-80">Carrozza</div>
                                      <div className="text-2xl font-bold">{booking.carriage}</div>
                                    </div>
                                  )}
                                  {booking.seat && (
                                    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-center">
                                      <div className="text-xs opacity-80">Posto</div>
                                      <div className="text-2xl font-bold">{booking.seat}</div>
                                    </div>
                                  )}
                                  {booking.class && (
                                    <div className="bg-white/10 px-4 py-2 rounded-lg text-center flex items-center">
                                      <div className="text-sm text-gray-300">{booking.class}</div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Train: Ticket Buttons */}
                              {booking.type === 'train' && (booking.ticketPdf || booking.link) && (
                                <div className="flex flex-wrap gap-2">
                                  {booking.ticketPdf && (
                                    <a 
                                      href={booking.ticketPdf}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                      🎫 Biglietto PDF
                                    </a>
                                  )}
                                  {booking.link && (
                                    <a 
                                      href={booking.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                      🌐 Gestisci Online
                                    </a>
                                  )}
                                </div>
                              )}
                              
                              {booking.code && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400 text-sm">Codice:</span>
                                  <CopyButton text={booking.code} />
                                </div>
                              )}
                              {booking.time && <p className="text-sm text-gray-400">🕐 {booking.time}</p>}
                              {booking.address && <MapsLink address={booking.address} className="text-sm" />}
                              {booking.phone && (
                                <a href={`tel:${booking.phone}`} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                  📞 {booking.phone}
                                </a>
                              )}
                              {booking.price && <p className="text-sm text-green-400">💰 {booking.price}</p>}
                              {booking.notes && <p className="text-sm text-gray-500 italic">📝 {booking.notes}</p>}
                              {booking.link && booking.type !== 'train' && (
                                <a 
                                  href={booking.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                                >
                                  🔗 Apri link
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Road Trip Stops */}
                      {day.roadTrip && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                            🛣️ Road Trip: {day.roadTrip.from} → {day.roadTrip.to}
                          </h4>
                          <p className="text-xs text-gray-400">Durata: {day.roadTrip.duration}</p>
                          <div className="space-y-3">
                            {day.roadTrip.stops.map((stop, sIndex) => {
                              const stopId = `stop-${index}-${sIndex}`;
                              const isFav = favorites.has(stopId);
                              const isVisited = visited.has(stopId);
                              
                              return (
                                <div key={sIndex} className={`bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl p-4 border-l-2 ${isVisited ? 'border-green-500 opacity-60' : 'border-amber-500'}`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-amber-300 flex items-center gap-2">
                                        {stop.name}
                                        {isFav && <span>⭐</span>}
                                        {isVisited && <span>✅</span>}
                                      </h5>
                                      <p className="text-sm text-gray-400 mt-1">{stop.description}</p>
                                      <p className="text-xs text-gray-500 mt-1">⏱️ {stop.stayTime}</p>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => toggleFavorite(stopId)}
                                        className={`p-2 rounded-lg ${isFav ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-gray-400'}`}
                                      >
                                        ⭐
                                      </button>
                                      <button
                                        onClick={() => toggleVisited(stopId)}
                                        className={`p-2 rounded-lg ${isVisited ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                                      >
                                        ✓
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {stop.highlights.map((h, hIndex) => (
                                      <span key={hIndex} className="text-xs px-2 py-1 bg-white/10 rounded-full">
                                        {h}
                                      </span>
                                    ))}
                                  </div>
                                  {stop.mapLink && (
                                    <a 
                                      href={stop.mapLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300"
                                    >
                                      🗺️ Apri in Maps
                                    </a>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Free Time & Activities */}
                      {(allActivities.length > 0 || day.freeTime?.available) && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                              ⭐ Tempo libero {day.freeTime?.hours && `(${day.freeTime.hours})`}
                            </h4>
                            <button
                              onClick={() => {
                                setFormData({});
                                setEditModal({ type: 'activity', dayIndex: index });
                              }}
                              className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/30"
                            >
                              + Aggiungi
                            </button>
                          </div>
                          <div className="space-y-2">
                            {allActivities.map((activity, aIndex) => {
                              const actId = `act-${index}-${activity.id}`;
                              const isFav = favorites.has(actId);
                              const isVisited = visited.has(actId);
                              
                              return (
                                <div key={activity.id} className={`bg-white/5 rounded-xl p-3 ${activity.isCustom ? 'border-l-4 border-l-green-500' : ''} ${isVisited ? 'opacity-60' : ''}`}>
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="font-medium flex items-center gap-2">
                                        {activity.name}
                                        {isFav && <span>⭐</span>}
                                        {isVisited && <span>✅</span>}
                                      </div>
                                      <p className="text-sm text-gray-400">{activity.description}</p>
                                      {activity.duration && <p className="text-xs text-gray-500">⏱️ {activity.duration}</p>}
                                      {activity.tips && <p className="text-xs text-amber-400 mt-1">💡 {activity.tips}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => toggleFavorite(actId)}
                                        className={`p-1.5 rounded-lg text-sm ${isFav ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-gray-400'}`}
                                      >
                                        ⭐
                                      </button>
                                      <button
                                        onClick={() => toggleVisited(actId)}
                                        className={`p-1.5 rounded-lg text-sm ${isVisited ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                                      >
                                        ✓
                                      </button>
                                      {activity.isCustom && (
                                        <button
                                          onClick={() => deleteCustomActivity(index, activity.id)}
                                          className="p-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 bg-white/10"
                                        >
                                          🗑️
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SAN SEBASTIÁN TAB */}
        {activeTab === 'san-sebastian' && (
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages['san-sebastian']})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Guida San Sebastián</h2>
                <p className="text-gray-300">La capitale gastronomica d'Europa</p>
              </div>
            </div>

            {/* Pintxos Bars */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">🍢 Pintxos Bars</h3>
                <button
                  onClick={() => {
                    setFormData({});
                    setEditModal({ type: 'pintxo', dayIndex: 0 });
                  }}
                  className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full hover:bg-amber-500/30"
                >
                  + Aggiungi
                </button>
              </div>
              <p className="text-sm text-gray-400">Il giro dei pintxos nella Parte Vieja è un must!</p>
              <div className="grid gap-3">
                {[...sanSebastianGuide.pintxosBars, ...customPintxos].map((bar, index) => {
                  const isCustom = 'id' in bar;
                  const barId = `bar-${index}`;
                  const isFav = favorites.has(barId);
                  const isVisited = visited.has(barId);
                  
                  return (
                    <div key={isCustom ? (bar as {id: string}).id : index} className={`bg-white/5 rounded-xl p-4 flex justify-between items-start ${isVisited ? 'opacity-60' : ''} ${isCustom ? 'border-l-4 border-l-amber-500' : ''}`}>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {bar.name}
                          {isFav && <span>⭐</span>}
                          {isVisited && <span>✅</span>}
                        </div>
                        <div className="text-sm text-amber-400">★ {bar.specialty}</div>
                        <div className="text-xs text-gray-500">{bar.area}</div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleFavorite(barId)}
                          className={`p-2 rounded-lg ${isFav ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-gray-400'}`}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => toggleVisited(barId)}
                          className={`p-2 rounded-lg ${isVisited ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                        >
                          ✓
                        </button>
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(bar.name + ' San Sebastián')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 p-2"
                        >
                          🗺️
                        </a>
                        {isCustom && (
                          <button
                            onClick={() => setCustomPintxos(customPintxos.filter(p => p.id !== (bar as {id: string}).id))}
                            className="p-2 rounded-lg text-red-400 hover:text-red-300 bg-white/10"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Must See */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">📸 Da non perdere</h3>
                <button
                  onClick={() => {
                    setFormData({});
                    setEditModal({ type: 'mustSee', dayIndex: 0 });
                  }}
                  className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full hover:bg-purple-500/30"
                >
                  + Aggiungi
                </button>
              </div>
              <div className="grid gap-3">
                {[...sanSebastianGuide.mustSee, ...customMustSee].map((place, index) => {
                  const isCustom = 'id' in place;
                  const placeId = `must-${isCustom ? (place as {id: string}).id : index}`;
                  const isFav = favorites.has(placeId);
                  const isVisited = visited.has(placeId);
                  
                  return (
                    <div key={isCustom ? (place as {id: string}).id : index} className={`bg-white/5 rounded-xl p-4 ${isVisited ? 'opacity-60' : ''} ${isCustom ? 'border-l-4 border-l-purple-500' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {place.name}
                            {isFav && <span>⭐</span>}
                            {isVisited && <span>✅</span>}
                          </div>
                          <div className="text-sm text-gray-400">{place.description}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{place.time}</span>
                          <button
                            onClick={() => toggleFavorite(placeId)}
                            className={`p-1.5 rounded-lg ${isFav ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-gray-400'}`}
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => toggleVisited(placeId)}
                            className={`p-1.5 rounded-lg ${isVisited ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                          >
                            ✓
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => setCustomMustSee(customMustSee.filter(p => p.id !== (place as {id: string}).id))}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-white/10"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ristoranti stellati */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold flex items-center gap-2">⭐ Ristoranti Stellati</h3>
              <div className="grid gap-3">
                {sanSebastianGuide.restaurants.map((rest, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">
                          {rest.name} 
                          {rest.stars > 0 && <span className="text-amber-400 ml-1">{'⭐'.repeat(rest.stars)}</span>}
                        </div>
                        <div className="text-sm text-gray-400">{rest.type}</div>
                      </div>
                      <span className="text-green-400">{rest.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BILBAO TAB */}
        {activeTab === 'bilbao' && (
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages['bilbao']})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Gita a Bilbao</h2>
                <p className="text-gray-300">1h 15min da San Sebastián</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-5">
              <h3 className="text-xl font-bold mb-2">🏛️ Guggenheim Museum</h3>
              <p className="text-gray-300 mb-3">Il capolavoro di Frank Gehry. Da solo vale il viaggio!</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full">2-3 ore</span>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full">€18 ingresso</span>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full">Chiuso lunedì</span>
              </div>
              <a 
                href="https://maps.google.com/?q=Guggenheim+Bilbao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                🗺️ Apri in Maps
              </a>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">📍 Altre cose da vedere</h3>
                <button
                  onClick={() => {
                    setFormData({});
                    setEditModal({ type: 'bilbaoPlace', dayIndex: 0 });
                  }}
                  className="text-xs bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full hover:bg-pink-500/30"
                >
                  + Aggiungi
                </button>
              </div>
              <div className="grid gap-3">
                {[
                  { name: 'Casco Viejo', desc: '7 strade storiche con bar, negozi e atmosfera autentica' },
                  { name: 'Mercado de la Ribera', desc: 'Mercato coperto più grande d\'Europa, ottimo per tapas' },
                  { name: 'Puente Zubizuri', desc: 'Ponte pedonale di Calatrava, iconico' },
                  ...customBilbao.map(b => ({ name: b.name, desc: b.description, id: b.id }))
                ].map((item, index) => {
                  const isCustom = 'id' in item;
                  const itemId = `bilbao-${isCustom ? (item as {id: string}).id : index}`;
                  const isFav = favorites.has(itemId);
                  const isVisited = visited.has(itemId);
                  
                  return (
                    <div key={isCustom ? (item as {id: string}).id : index} className={`bg-white/5 rounded-xl p-4 ${isVisited ? 'opacity-60' : ''} ${isCustom ? 'border-l-4 border-l-pink-500' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {item.name}
                            {isFav && <span>⭐</span>}
                            {isVisited && <span>✅</span>}
                          </div>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleFavorite(itemId)}
                            className={`p-1.5 rounded-lg ${isFav ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-gray-400'}`}
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => toggleVisited(itemId)}
                            className={`p-1.5 rounded-lg ${isVisited ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                          >
                            ✓
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => setCustomBilbao(customBilbao.filter(p => p.id !== (item as {id: string}).id))}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-white/10"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">📋 Tutte le Prenotazioni</h2>
            
            {/* Group by type */}
            {['train', 'hotel', 'car', 'restaurant'].map(type => {
              const allBookings = initialTripData.flatMap((day, dayIndex) => 
                day.bookings.filter(b => b.type === type).map((b, i) => ({ 
                  ...getMergedBooking(b, dayIndex, day.bookings.findIndex(x => x === b)), 
                  day: day.date,
                  dayIndex 
                }))
              );
              if (allBookings.length === 0) return null;
              
              const typeLabels: Record<string, { label: string; emoji: string }> = {
                train: { label: 'Treni', emoji: '🚄' },
                hotel: { label: 'Hotel', emoji: '🏨' },
                car: { label: 'Auto', emoji: '🚗' },
                restaurant: { label: 'Ristoranti', emoji: '🍽️' },
              };
              
              return (
                <div key={type} className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {typeLabels[type].emoji} {typeLabels[type].label}
                  </h3>
                  <div className="space-y-3">
                    {allBookings.map((booking, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{booking.name}</div>
                            <div className="text-xs text-gray-500">{booking.day}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        {booking.code && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Codice:</span>
                            <CopyButton text={booking.code} />
                          </div>
                        )}
                        {booking.time && <p className="text-sm text-gray-400">🕐 {booking.time}</p>}
                        {booking.address && <MapsLink address={booking.address} className="text-sm" />}
                        {booking.phone && (
                          <a href={`tel:${booking.phone}`} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            📞 {booking.phone}
                          </a>
                        )}
                        {booking.price && <p className="text-sm text-green-400">💰 {booking.price}</p>}
                        {booking.notes && <p className="text-sm text-gray-500 italic">📝 {booking.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Custom bookings */}
            {Object.values(customBookings).flat().length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  ✨ Aggiunti da te
                </h3>
                <div className="space-y-3">
                  {Object.entries(customBookings).flatMap(([dayIndex, bookings]) =>
                    bookings.map((booking) => (
                      <div key={booking.id} className="bg-white/5 rounded-xl p-4 space-y-2 border-l-4 border-l-blue-500">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{booking.name}</div>
                            <div className="text-xs text-gray-500">{initialTripData[parseInt(dayIndex)]?.date}</div>
                          </div>
                          <div className="flex gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                            <button
                              onClick={() => deleteCustomBooking(parseInt(dayIndex), booking.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        {booking.time && <p className="text-sm text-gray-400">🕐 {booking.time}</p>}
                        {booking.address && <MapsLink address={booking.address} className="text-sm" />}
                        {booking.notes && <p className="text-sm text-gray-500 italic">📝 {booking.notes}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Torino Restaurants */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">⭐ Ristoranti Stellati Torino</h3>
              <p className="text-sm text-gray-400">Per la cena del 1 Febbraio</p>
              <div className="space-y-3">
                {torinoRestaurants.map((rest, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{rest.name} {rest.stars > 0 && '⭐'.repeat(rest.stars)}</div>
                        <p className="text-sm text-gray-400">{rest.description}</p>
                      </div>
                      <a href={`tel:${rest.phone}`} className="text-blue-400 hover:text-blue-300 p-2">
                        📞
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ENTERTAINMENT TAB */}
        {activeTab === 'entertainment' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">🎬 Entertainment per il Viaggio</h2>
            <p className="text-sm text-gray-400">Film, serie e podcast per le 8+ ore di treno</p>

            {/* Films */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">🎬 Film</h3>
              <div className="space-y-3">
                {entertainment.films.map((film, index) => {
                  const filmId = `film-${index}`;
                  const isWatched = visited.has(filmId);
                  
                  return (
                    <div key={index} className={`bg-white/5 rounded-xl p-4 ${isWatched ? 'opacity-60' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {film.title} <span className="text-gray-500">({film.year})</span>
                            {isWatched && <span>✅</span>}
                          </div>
                          <div className="text-sm text-gray-400">{film.genre} • {film.duration}</div>
                          <p className="text-sm text-gray-300 mt-1">{film.description}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <div className="text-amber-400 font-bold">⭐ {film.rating}</div>
                          <div className="text-xs text-gray-500">{film.streaming}</div>
                          <button
                            onClick={() => toggleVisited(filmId)}
                            className={`p-1 rounded text-xs ${isWatched ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                          >
                            {isWatched ? 'Visto' : 'Segna visto'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Series */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">📺 Serie</h3>
              <div className="space-y-3">
                {entertainment.series.map((serie, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{serie.title}</div>
                        <div className="text-sm text-gray-400">{serie.genre} • {serie.episodeDuration}/ep</div>
                        <p className="text-sm text-gray-300 mt-1">{serie.description}</p>
                        {serie.recommended && (
                          <p className="text-xs text-amber-400 mt-1">👉 Consigliato: {serie.recommended}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">⭐ {serie.rating}</div>
                        <div className="text-xs text-gray-500">{serie.streaming}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">📖 Letture</h3>
              {readingList.map((item, index) => {
                const readId = `read-${index}`;
                const isRead = visited.has(readId);
                
                return (
                  <div key={index} className={`bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 ${isRead ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {item.title}
                          {isRead && <span>✅</span>}
                        </div>
                        <div className="text-sm text-gray-400">di {item.author}</div>
                        <p className="text-sm text-gray-300 mt-2">{item.description}</p>
                      </div>
                      <button
                        onClick={() => toggleVisited(readId)}
                        className={`p-1 rounded text-xs ${isRead ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                      >
                        {isRead ? 'Letto' : 'Segna letto'}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">⏱️ {item.readTime}</span>
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                      >
                        Leggi →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Podcasts */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">🎧 Podcast</h3>
              {entertainment.podcasts.map((pod, index) => {
                const podId = `pod-${index}`;
                const isListened = visited.has(podId);
                
                return (
                  <div key={index} className={`bg-white/5 rounded-xl p-4 ${isListened ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {pod.title}
                          {isListened && <span>✅</span>}
                        </div>
                        <div className="text-sm text-amber-400">{pod.episode}</div>
                        <div className="text-sm text-gray-400">{pod.duration} • {pod.platform}</div>
                        <p className="text-sm text-gray-300 mt-1">{pod.description}</p>
                      </div>
                      <button
                        onClick={() => toggleVisited(podId)}
                        className={`p-1 rounded text-xs ${isListened ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-gray-400'}`}
                      >
                        {isListened ? 'Ascoltato' : 'Segna'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      
      {/* Note Modal */}
      <Modal
        isOpen={editModal?.type === 'note'}
        onClose={() => setEditModal(null)}
        title="📝 Note personali"
      >
        <textarea
          value={formData.note || ''}
          onChange={e => setFormData({ ...formData, note: e.target.value })}
          placeholder="Scrivi le tue note per questo giorno..."
          className="w-full h-40 bg-white/10 border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (editModal) {
                saveNote(editModal.dayIndex, formData.note || '');
                setEditModal(null);
              }
            }}
            className="flex-1 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 font-medium"
          >
            Salva
          </button>
        </div>
      </Modal>

      {/* Add Booking Modal */}
      <Modal
        isOpen={editModal?.type === 'booking'}
        onClose={() => setEditModal(null)}
        title="➕ Aggiungi Prenotazione"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Tipo</label>
            <select
              value={formData.type || 'restaurant'}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            >
              <option value="train">🚄 Treno</option>
              <option value="hotel">🏨 Hotel</option>
              <option value="car">🚗 Auto</option>
              <option value="restaurant">🍽️ Ristorante</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Nome *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="es. Ristorante La Concha"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Orario</label>
            <input
              type="text"
              value={formData.time || ''}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              placeholder="es. 20:00"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Indirizzo</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="es. Calle Mayor 12"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Codice prenotazione</label>
            <input
              type="text"
              value={formData.code || ''}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              placeholder="es. ABC123"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Note</label>
            <textarea
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Note aggiuntive..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1 h-20 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Stato</label>
            <select
              value={formData.status || 'pending'}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            >
              <option value="confirmed">✓ Confermato</option>
              <option value="pending">⏳ Da confermare</option>
              <option value="todo">📝 Da fare</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (editModal && formData.name) {
                addCustomBooking(editModal.dayIndex, {
                  type: (formData.type || 'restaurant') as Booking['type'],
                  name: formData.name,
                  time: formData.time,
                  address: formData.address,
                  code: formData.code,
                  notes: formData.notes,
                  status: (formData.status || 'pending') as Booking['status'],
                });
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 font-medium"
          >
            Aggiungi
          </button>
        </div>
      </Modal>

      {/* Edit Existing Booking Modal */}
      <Modal
        isOpen={editModal?.type === 'editBooking'}
        onClose={() => setEditModal(null)}
        title="✏️ Modifica Prenotazione"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Orario</label>
            <input
              type="text"
              value={formData.time || ''}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              placeholder="es. 20:00 → 21:30"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Note aggiuntive</label>
            <textarea
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Note personali..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1 h-20 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (editModal?.booking?.id) {
                if (formData.time) {
                  updateBookingField(editModal.booking.id, 'time', formData.time);
                }
                if (formData.notes) {
                  updateBookingField(editModal.booking.id, 'notes', formData.notes);
                }
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 font-medium"
          >
            Salva
          </button>
        </div>
      </Modal>

      {/* Add Activity Modal */}
      <Modal
        isOpen={editModal?.type === 'activity'}
        onClose={() => setEditModal(null)}
        title="➕ Aggiungi Attività"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Nome *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="es. Visita al museo"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Descrizione</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrivi l'attività..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1 h-20 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Durata</label>
            <input
              type="text"
              value={formData.duration || ''}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              placeholder="es. 2 ore"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Tips</label>
            <input
              type="text"
              value={formData.tips || ''}
              onChange={e => setFormData({ ...formData, tips: e.target.value })}
              placeholder="Consigli utili..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (editModal && formData.name) {
                addCustomActivity(editModal.dayIndex, {
                  name: formData.name,
                  description: formData.description || '',
                  duration: formData.duration,
                  tips: formData.tips,
                  type: 'leisure',
                });
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-green-500 rounded-lg hover:bg-green-600 font-medium"
          >
            Aggiungi
          </button>
        </div>
      </Modal>

      {/* Add Pintxo Modal */}
      <Modal
        isOpen={editModal?.type === 'pintxo'}
        onClose={() => setEditModal(null)}
        title="🍢 Aggiungi Pintxos Bar"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Nome del bar *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="es. Bar Txepetxa"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Specialità *</label>
            <input
              type="text"
              value={formData.specialty || ''}
              onChange={e => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="es. Anchoas"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Zona</label>
            <input
              type="text"
              value={formData.area || 'Parte Vieja'}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
              placeholder="es. Parte Vieja"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (formData.name && formData.specialty) {
                setCustomPintxos([...customPintxos, {
                  id: Date.now().toString(),
                  name: formData.name,
                  specialty: formData.specialty,
                  area: formData.area || 'Parte Vieja'
                }]);
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-amber-500 rounded-lg hover:bg-amber-600 font-medium"
          >
            Aggiungi
          </button>
        </div>
      </Modal>

      {/* Add Must See Modal */}
      <Modal
        isOpen={editModal?.type === 'mustSee'}
        onClose={() => setEditModal(null)}
        title="📸 Aggiungi Luogo"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Nome *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="es. Monte Igueldo"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Descrizione</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="es. Vista panoramica"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Tempo consigliato</label>
            <input
              type="text"
              value={formData.time || ''}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              placeholder="es. 2h"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (formData.name) {
                setCustomMustSee([...customMustSee, {
                  id: Date.now().toString(),
                  name: formData.name,
                  description: formData.description || '',
                  time: formData.time || ''
                }]);
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 font-medium"
          >
            Aggiungi
          </button>
        </div>
      </Modal>

      {/* Add Bilbao Place Modal */}
      <Modal
        isOpen={editModal?.type === 'bilbaoPlace'}
        onClose={() => setEditModal(null)}
        title="📍 Aggiungi Luogo Bilbao"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Nome *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="es. Museo de Bellas Artes"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Descrizione</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrizione breve..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (formData.name) {
                setCustomBilbao([...customBilbao, {
                  id: Date.now().toString(),
                  name: formData.name,
                  description: formData.description || ''
                }]);
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 font-medium"
          >
            Aggiungi
          </button>
        </div>
      </Modal>

      {/* SWITCH Notes Modal */}
      <Modal
        isOpen={editModal?.type === 'switchNote'}
        onClose={() => setEditModal(null)}
        title="📝 Note Meeting SWITCH"
      >
        <textarea
          value={formData.note || ''}
          onChange={e => setFormData({ ...formData, note: e.target.value })}
          placeholder="Domande da fare, cose da ricordare, appunti..."
          className="w-full h-48 bg-white/10 border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              setSwitchNotes(formData.note || '');
              setEditModal(null);
              setFormData({});
            }}
            className="flex-1 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 font-medium"
          >
            Salva
          </button>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={(editModal?.type as string) === 'task'}
        onClose={() => setEditModal(null)}
        title="📋 Nuovo Task"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Task *</label>
            <input
              type="text"
              value={formData.text || ''}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              placeholder="es. Prenotare ristorante"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Tratta</label>
            <select
              value={formData.leg || 'altro'}
              onChange={e => setFormData({ ...formData, leg: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            >
              {tripLegs.map(leg => (
                <option key={leg.id} value={leg.id}>{leg.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (formData.text) {
                setTripTasks([...tripTasks, {
                  id: Date.now().toString(),
                  text: formData.text,
                  completed: false,
                  leg: formData.leg || 'altro',
                  createdAt: new Date().toISOString()
                }]);
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 font-medium"
          >
            Aggiungi
          </button>
        </div>
      </Modal>

      {/* Add Diary Entry Modal */}
      <Modal
        isOpen={(editModal?.type as string) === 'diary'}
        onClose={() => setEditModal(null)}
        title="📔 Nuova Entry Diario"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Titolo *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="es. Arrivo a San Sebastián!"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Data</label>
            <input
              type="date"
              value={formData.date || new Date().toISOString().split('T')[0]}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Luogo</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="es. Parte Vieja"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Testo</label>
            <textarea
              value={formData.diaryText || ''}
              onChange={e => setFormData({ ...formData, diaryText: e.target.value })}
              placeholder="Racconta la tua giornata..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1 h-24 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Foto</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const photos: string[] = [];
                for (const file of files) {
                  const reader = new FileReader();
                  const base64 = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                  });
                  photos.push(base64);
                }
                setFormData({ ...formData, photos: JSON.stringify(photos) });
              }}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 mt-1 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-amber-500 file:text-white"
            />
            {formData.photos && JSON.parse(formData.photos).length > 0 && (
              <p className="text-xs text-green-400 mt-1">
                ✓ {JSON.parse(formData.photos).length} foto selezionate
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditModal(null)}
            className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            onClick={() => {
              if (formData.title) {
                setDiaryEntries([...diaryEntries, {
                  id: Date.now().toString(),
                  date: formData.date || new Date().toISOString().split('T')[0],
                  title: formData.title,
                  text: formData.diaryText || '',
                  photos: formData.photos ? JSON.parse(formData.photos) : [],
                  location: formData.location,
                  createdAt: new Date().toISOString()
                }]);
                setEditModal(null);
                setFormData({});
              }
            }}
            className="flex-1 py-2 bg-amber-500 rounded-lg hover:bg-amber-600 font-medium"
          >
            Salva
          </button>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Made with 🦞 by Chat • Aggiornato: {new Date().toLocaleDateString('it-IT')}
      </footer>
    </main>
  );
}
