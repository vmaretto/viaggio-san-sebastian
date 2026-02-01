'use client';

import { useState, useEffect } from 'react';
import { tripData, sanSebastianGuide, torinoRestaurants, readingList, entertainment } from '@/data/trip';

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

// Hero images for destinations
const heroImages: Record<string, string> = {
  'san-sebastian': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'bilbao': 'https://images.unsplash.com/photo-1558618047-3c8c76f7f8c8?w=800&q=80',
  'bordeaux': 'https://images.unsplash.com/photo-1565169007649-da8c6f0a38ba?w=800&q=80',
  'torino': 'https://images.unsplash.com/photo-1583167617321-a5bfd4c2a03e?w=800&q=80',
  'biarritz': 'https://images.unsplash.com/photo-1598977054780-2e4f0a4e6b3b?w=800&q=80',
  'dune-pilat': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'san-sebastian' | 'bilbao' | 'bookings' | 'entertainment'>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));

  const toggleDay = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
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
      <nav className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
            {[
              { id: 'itinerary', label: '📅 Itinerario', icon: '📅' },
              { id: 'san-sebastian', label: '🍷 San Sebastián', icon: '🍷' },
              { id: 'bilbao', label: '🏛️ Bilbao', icon: '🏛️' },
              { id: 'bookings', label: '📋 Prenotazioni', icon: '📋' },
              { id: 'entertainment', label: '🎬 Entertainment', icon: '🎬' },
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
        
        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            {tripData.map((day, index) => (
              <div 
                key={index} 
                className="day-card overflow-hidden card-hover"
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
                    {/* Bookings */}
                    {day.bookings.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Prenotazioni</h4>
                        {day.bookings.map((booking, bIndex) => (
                          <div key={bIndex} className="bg-white/5 rounded-xl p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="font-semibold">{booking.name}</div>
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
                            {booking.link && (
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
                          {day.roadTrip.stops.map((stop, sIndex) => (
                            <div key={sIndex} className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl p-4 border-l-2 border-amber-500">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-semibold text-amber-300">{stop.name}</h5>
                                  <p className="text-sm text-gray-400 mt-1">{stop.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">⏱️ {stop.stayTime}</p>
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
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Free Time */}
                    {day.freeTime?.available && day.freeTime.suggestions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                          ⭐ Tempo libero {day.freeTime.hours && `(${day.freeTime.hours})`}
                        </h4>
                        <div className="space-y-2">
                          {day.freeTime.suggestions.map((activity, aIndex) => (
                            <div key={aIndex} className="bg-white/5 rounded-xl p-3">
                              <div className="font-medium">{activity.name}</div>
                              <p className="text-sm text-gray-400">{activity.description}</p>
                              {activity.duration && <p className="text-xs text-gray-500">⏱️ {activity.duration}</p>}
                              {activity.tips && <p className="text-xs text-amber-400 mt-1">💡 {activity.tips}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
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
              <h3 className="text-lg font-bold flex items-center gap-2">🍢 Pintxos Bars</h3>
              <p className="text-sm text-gray-400">Il giro dei pintxos nella Parte Vieja è un must!</p>
              <div className="grid gap-3">
                {sanSebastianGuide.pintxosBars.map((bar, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{bar.name}</div>
                      <div className="text-sm text-amber-400">★ {bar.specialty}</div>
                      <div className="text-xs text-gray-500">{bar.area}</div>
                    </div>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(bar.name + ' San Sebastián')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 p-2"
                    >
                      🗺️
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Must See */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold flex items-center gap-2">📸 Da non perdere</h3>
              <div className="grid gap-3">
                {sanSebastianGuide.mustSee.map((place, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{place.name}</div>
                        <div className="text-sm text-gray-400">{place.description}</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{place.time}</span>
                    </div>
                  </div>
                ))}
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
              <h3 className="text-lg font-bold">📍 Altre cose da vedere</h3>
              <div className="grid gap-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="font-semibold">Casco Viejo</div>
                  <p className="text-sm text-gray-400">7 strade storiche con bar, negozi e atmosfera autentica</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="font-semibold">Mercado de la Ribera</div>
                  <p className="text-sm text-gray-400">Mercato coperto più grande d'Europa, ottimo per tapas</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="font-semibold">Puente Zubizuri</div>
                  <p className="text-sm text-gray-400">Ponte pedonale di Calatrava, iconico</p>
                </div>
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
              const allBookings = tripData.flatMap(day => 
                day.bookings.filter(b => b.type === type).map(b => ({ ...b, day: day.date }))
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
                {entertainment.films.map((film, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{film.title} <span className="text-gray-500">({film.year})</span></div>
                        <div className="text-sm text-gray-400">{film.genre} • {film.duration}</div>
                        <p className="text-sm text-gray-300 mt-1">{film.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-bold">⭐ {film.rating}</div>
                        <div className="text-xs text-gray-500">{film.streaming}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
              {readingList.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-400">di {item.author}</div>
                  <p className="text-sm text-gray-300 mt-2">{item.description}</p>
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
              ))}
            </div>

            {/* Podcasts */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">🎧 Podcast</h3>
              {entertainment.podcasts.map((pod, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <div className="font-semibold">{pod.title}</div>
                  <div className="text-sm text-amber-400">{pod.episode}</div>
                  <div className="text-sm text-gray-400">{pod.duration} • {pod.platform}</div>
                  <p className="text-sm text-gray-300 mt-1">{pod.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Made with 🦞 by Chat • Aggiornato: {new Date().toLocaleDateString('it-IT')}
      </footer>
    </main>
  );
}
