'use client';

import { useState } from 'react';
import { tripData, sanSebastianGuide, torinoRestaurants, readingList, entertainment } from '@/data/trip';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'san-sebastian' | 'bilbao' | 'bookings' | 'entertainment'>('itinerary');

  return (
    <main 
      className="min-h-screen text-white" 
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-green-900/30" />
        <div className="relative max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🇪🇸</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
              San Sebastián
            </h1>
            <p className="text-xl text-gray-300">SWITCH Meeting 2026</p>
            <p className="text-sm text-gray-400 mt-2">1-6 Febbraio • Roma → Torino → Francia → Paesi Baschi</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
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
                onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === 'itinerary' && <ItineraryView />}
        {activeTab === 'san-sebastian' && <SanSebastianView />}
        {activeTab === 'bilbao' && <BilbaoView />}
        {activeTab === 'bookings' && <BookingsView />}
        {activeTab === 'entertainment' && <EntertainmentView />}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Made with 🦞 by Chat • Aggiornato: {new Date().toLocaleDateString('it-IT')}
      </footer>
    </main>
  );
}

function ItineraryView() {
  return (
    <div className="space-y-6">
      {tripData.map((day, index) => (
        <DayCard key={index} day={day} />
      ))}
    </div>
  );
}

function DayCard({ day }: { day: typeof tripData[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="day-card p-5 card-hover cursor-pointer" onClick={() => setExpanded(!expanded)}>
      {/* Header */}
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
        <div className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-6 space-y-4 border-t border-white/10 pt-4">
          {/* Bookings */}
          {day.bookings.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">📌 Prenotazioni</h4>
              <div className="space-y-3">
                {day.bookings.map((booking, i) => (
                  <BookingItem key={i} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {/* Road Trip */}
          {day.roadTrip && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">
                🚗 Road Trip: {day.roadTrip.from} → {day.roadTrip.to}
                <span className="text-xs font-normal ml-2">({day.roadTrip.duration})</span>
              </h4>
              <div className="relative pl-8">
                <div className="timeline-line" />
                {day.roadTrip.stops.map((stop, i) => (
                  <div key={i} className="relative mb-6 last:mb-0">
                    <div className="absolute left-[-24px] w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-green-500 border-2 border-white/20" />
                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-white">{stop.name}</h5>
                        <span className="text-xs text-gray-400">⏱️ {stop.stayTime}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{stop.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {stop.highlights.map((h, j) => (
                          <span key={j} className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                            {h}
                          </span>
                        ))}
                      </div>
                      {stop.mapLink && (
                        <a 
                          href={stop.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs text-blue-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          📍 Apri in Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free Time */}
          {day.freeTime?.available && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">
                🎯 Tempo libero <span className="font-normal">({day.freeTime.hours})</span>
              </h4>
              <div className="space-y-2">
                {day.freeTime.suggestions.map((activity, i) => (
                  <div key={i} className="glass rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{activity.name}</span>
                      {activity.duration && (
                        <span className="text-xs text-gray-400">{activity.duration}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                    {activity.tips && (
                      <p className="text-xs text-yellow-400/70 mt-1">💡 {activity.tips}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BookingItem({ booking }: { booking: typeof tripData[0]['bookings'][0] }) {
  const statusColors = {
    confirmed: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    todo: 'bg-red-500/20 text-red-400'
  };

  const statusLabels = {
    confirmed: '✓ Confermato',
    pending: '⏳ Da prenotare',
    todo: '❌ Da fare'
  };

  const typeIcons = {
    train: '🚄',
    hotel: '🏨',
    car: '🚗',
    restaurant: '🍽️'
  };

  return (
    <div className="glass rounded-lg p-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{typeIcons[booking.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{booking.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[booking.status]}`}>
              {statusLabels[booking.status]}
            </span>
          </div>
          
          {booking.code && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">Codice:</span>
              <code 
                className="text-sm font-mono bg-white/10 px-2 py-0.5 rounded cursor-pointer hover:bg-white/20"
                onClick={() => navigator.clipboard.writeText(booking.code!)}
                title="Clicca per copiare"
              >
                {booking.code}
              </code>
            </div>
          )}
          
          {booking.time && (
            <p className="text-sm text-gray-300 mt-1">🕐 {booking.time}</p>
          )}
          
          {booking.address && (
            <p className="text-xs text-gray-400 mt-1">📍 {booking.address}</p>
          )}
          
          {booking.phone && (
            <a 
              href={`tel:${booking.phone}`} 
              className="text-xs text-blue-400 mt-1 inline-block hover:underline"
            >
              📞 {booking.phone}
            </a>
          )}
          
          {booking.notes && (
            <p className="text-xs text-gray-500 mt-1 italic">{booking.notes}</p>
          )}
          
          {booking.price && (
            <p className="text-sm font-semibold text-green-400 mt-1">{booking.price}</p>
          )}
          
          {booking.link && (
            <a 
              href={booking.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
            >
              🔗 Prenota ora
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SanSebastianView() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🍷 San Sebastián</h2>
        <p className="text-gray-400">La capitale gastronomica dei Paesi Baschi</p>
      </div>

      {/* Pintxos Bars */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🍢</span> Pintxos Bars Imperdibili
        </h3>
        <div className="grid gap-3">
          {sanSebastianGuide.pintxosBars.map((bar, i) => (
            <div key={i} className="glass rounded-xl p-4 card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{bar.name}</h4>
                  <p className="text-sm text-gray-400">📍 {bar.area}</p>
                </div>
                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                  {bar.specialty}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Consiglio: 1 pintxo + 1 txakoli per bar, poi si cambia!
        </p>
      </section>

      {/* Must See */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📸</span> Da Non Perdere
        </h3>
        <div className="grid gap-3">
          {sanSebastianGuide.mustSee.map((place, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{place.name}</h4>
                  <p className="text-sm text-gray-400">{place.description}</p>
                </div>
                <span className="text-xs text-gray-500">⏱️ {place.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⭐</span> Ristoranti Top
        </h3>
        <div className="grid gap-3">
          {sanSebastianGuide.restaurants.map((rest, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">
                    {rest.name} 
                    {rest.stars > 0 && <span className="ml-2">{'⭐'.repeat(rest.stars)}</span>}
                  </h4>
                  <p className="text-sm text-gray-400">{rest.type}</p>
                </div>
                <span className="text-sm text-green-400">{rest.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BilbaoView() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🏛️ Gita a Bilbao</h2>
        <p className="text-gray-400">~1h 15min da San Sebastián</p>
      </div>

      {/* Guggenheim Feature */}
      <div className="day-card p-6 text-center">
        <div className="text-6xl mb-4">🏛️</div>
        <h3 className="text-2xl font-bold mb-2">Guggenheim Museum</h3>
        <p className="text-gray-400 mb-4">
          Capolavoro di Frank Gehry. L'edificio stesso è un'opera d'arte.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full">⏱️ 2-3 ore</span>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full">💰 €18</span>
          <span className="text-xs bg-white/10 px-3 py-1 rounded-full">🕐 10:00-20:00</span>
        </div>
        <a 
          href="https://maps.google.com/?q=Guggenheim+Bilbao"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 btn-primary"
        >
          📍 Indicazioni
        </a>
      </div>

      {/* Other Things */}
      <section>
        <h3 className="text-xl font-bold mb-4">🎯 Cosa vedere</h3>
        <div className="grid gap-3">
          {[
            { name: "Casco Viejo", desc: "7 strade storiche, bar e negozi", time: "1-2h" },
            { name: "Mercado de la Ribera", desc: "Mercato coperto più grande d'Europa", time: "1h" },
            { name: "Puente Zubizuri", desc: "Ponte pedonale di Calatrava", time: "15min" },
            { name: "Funicular de Artxanda", desc: "Vista panoramica sulla città", time: "1h" }
          ].map((place, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{place.name}</h4>
                  <p className="text-sm text-gray-400">{place.desc}</p>
                </div>
                <span className="text-xs text-gray-500">⏱️ {place.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <div className="glass rounded-xl p-4 border-l-4 border-yellow-500">
        <h4 className="font-semibold text-yellow-400 mb-2">💡 Consigli</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Meglio andata la mattina presto (meno traffico)</li>
          <li>• Parcheggio: sotto il Guggenheim o zona Casco Viejo</li>
          <li>• Pranzo: pintxos nel Casco Viejo (più economici di San Seb)</li>
          <li>• Se piove: perfetto per il museo!</li>
        </ul>
      </div>
    </div>
  );
}

function BookingsView() {
  const allBookings = tripData.flatMap(day => 
    day.bookings.map(b => ({ ...b, dayDate: day.date }))
  );

  const confirmed = allBookings.filter(b => b.status === 'confirmed');
  const pending = allBookings.filter(b => b.status === 'pending' || b.status === 'todo');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">📋 Tutte le Prenotazioni</h2>
        <p className="text-gray-400">Codici rapidi e status</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4 text-yellow-400">⚠️ Da completare ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map((booking, i) => (
              <div key={i} className="glass rounded-xl p-4 border-l-4 border-yellow-500">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-400">{booking.dayDate}</span>
                    <h4 className="font-semibold">{booking.name}</h4>
                    {booking.notes && <p className="text-sm text-gray-400">{booking.notes}</p>}
                  </div>
                  {booking.link && (
                    <a 
                      href={booking.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs"
                    >
                      Prenota
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmed */}
      <section>
        <h3 className="text-xl font-bold mb-4 text-green-400">✅ Confermati ({confirmed.length})</h3>
        <div className="space-y-3">
          {confirmed.map((booking, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-gray-400">{booking.dayDate}</span>
                  <h4 className="font-semibold">{booking.name}</h4>
                  {booking.code && (
                    <code 
                      className="text-lg font-mono bg-white/10 px-3 py-1 rounded mt-2 inline-block cursor-pointer hover:bg-white/20"
                      onClick={() => navigator.clipboard.writeText(booking.code!)}
                      title="Clicca per copiare"
                    >
                      {booking.code}
                    </code>
                  )}
                  {booking.phone && (
                    <a href={`tel:${booking.phone}`} className="block text-sm text-blue-400 mt-1">
                      📞 {booking.phone}
                    </a>
                  )}
                </div>
                {booking.price && (
                  <span className="text-green-400 font-semibold">{booking.price}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Torino Restaurants */}
      <section>
        <h3 className="text-xl font-bold mb-4">🍝 Ristoranti Torino (1 feb sera)</h3>
        <div className="space-y-3">
          {torinoRestaurants.map((rest, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{rest.name} ⭐</h4>
                  <p className="text-sm text-gray-400">{rest.description}</p>
                </div>
                <a href={`tel:${rest.phone}`} className="text-xs text-blue-400 whitespace-nowrap">
                  📞 Chiama
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EntertainmentView() {
  const [subTab, setSubTab] = useState<'watch' | 'read'>('watch');
  
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🎬 Entertainment</h2>
        <p className="text-gray-400">Per le ore di treno</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex justify-center gap-3">
        {[
          { id: 'watch', label: '🎬 Film & Serie' },
          { id: 'read', label: '📚 Letture' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as typeof subTab)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              subTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Film & Serie */}
      {subTab === 'watch' && (
        <div className="space-y-6">
          {/* Films Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>🎬</span> Film
            </h3>
            <div className="space-y-3">
              {entertainment.films.map((film, i) => (
                <div key={i} className="glass rounded-xl p-4 card-hover">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold">{film.title}</h4>
                        <span className="text-xs text-gray-500">({film.year})</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                          ⭐ {film.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{film.genre} • {film.duration}</p>
                      <p className="text-gray-300 mt-2 text-sm">{film.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 whitespace-nowrap ml-2">
                      {film.streaming}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Series Section */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>📺</span> Serie TV
            </h3>
            <div className="space-y-3">
              {entertainment.series.map((series, i) => (
                <div key={i} className="glass rounded-xl p-4 card-hover">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold">{series.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                          ⭐ {series.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {series.seasons} stagioni • {series.episodeDuration}/ep
                      </p>
                      <p className="text-gray-300 mt-2 text-sm">{series.description}</p>
                      {series.recommended && (
                        <p className="text-xs text-green-400 mt-2">
                          ✨ {series.recommended}
                        </p>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 whitespace-nowrap ml-2">
                      {series.streaming}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Podcast bonus */}
          <div className="glass rounded-xl p-4 border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-400 mb-2">🎧 Podcast Bonus</h4>
            <p className="text-sm text-white font-medium">{entertainment.podcasts[0].title}</p>
            <p className="text-sm text-gray-400">{entertainment.podcasts[0].episode} • {entertainment.podcasts[0].duration}</p>
            <p className="text-xs text-gray-300 mt-1">{entertainment.podcasts[0].description}</p>
          </div>
        </div>
      )}

      {/* Letture */}
      {subTab === 'read' && (
        <div className="space-y-4">
          {readingList.map((item, i) => (
            <a 
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block day-card p-5 card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">📖</div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-400">di {item.author}</p>
                  <p className="text-gray-300 mt-2 text-sm">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.topics.map((topic, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="text-gray-500">⏱️ {item.readTime}</span>
                    <span className="text-blue-400">Leggi →</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
          
          <div className="text-center py-4 text-gray-500 text-sm">
            Altri articoli in arrivo...
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="glass rounded-xl p-4 border-l-4 border-blue-500">
        <h4 className="font-semibold text-blue-400 mb-2">💡 Pro tip</h4>
        <p className="text-sm text-gray-300">
          Scarica tutto offline prima di partire! Netflix/Prime permettono download. 
          Per gli articoli usa Pocket o Safari Reading List.
        </p>
      </div>
    </div>
  );
}
