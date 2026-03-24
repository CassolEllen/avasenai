import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import BottomSheet from "@/components/BottomSheet";
import { calendarEvents } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const eventColors: Record<string, string> = {
  presencial: "bg-primary",
  online: "bg-success",
  prova: "bg-destructive",
  trabalho: "bg-warning",
  evento: "bg-muted-foreground",
};

const eventLabels: Record<string, string> = {
  presencial: "Aula Presencial",
  online: "Aula Online",
  prova: "Prova",
  trabalho: "Trabalho",
  evento: "Evento",
};

const Calendario = () => {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState("2024-03-25");
  const [selectedEvent, setSelectedEvent] = useState<typeof calendarEvents[0] | null>(null);

  const year = 2024;
  const month = 2;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const eventsForDate = calendarEvents.filter(e => e.date === selectedDate);
  const eventDates = calendarEvents.reduce<Record<string, string[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e.type);
    return acc;
  }, {});

  const calendarGrid = (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-card rounded-2xl p-4 md:p-6 shadow-senai"
    >
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(d => (
          <div key={d} className="text-center text-[10px] md:text-xs font-semibold text-muted-foreground py-1 md:py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const dateStr = `2024-03-${String(day).padStart(2, "0")}`;
          const isSelected = dateStr === selectedDate;
          const hasEvents = eventDates[dateStr];

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dateStr)}
              className={`tap-feedback relative w-full aspect-square rounded-xl flex flex-col items-center justify-center text-xs md:text-sm font-medium transition-all ${
                isSelected ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              {day}
              {hasEvents && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasEvents.slice(0, 3).map((type, j) => (
                    <div key={j} className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary-foreground" : eventColors[type]}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );

  const eventsList = (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">
        {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
      </h3>
      {eventsForDate.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-2xl mb-2">📅</p>
          <p className="text-xs text-muted-foreground">Nenhum evento neste dia</p>
        </div>
      ) : (
        <div className="space-y-2">
          {eventsForDate.map((event, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedEvent(event)}
              className="tap-feedback bg-card rounded-2xl p-4 shadow-senai flex items-center gap-3 cursor-pointer hover:shadow-senai-lg transition-shadow"
            >
              <div className={`w-1 h-10 rounded-full ${eventColors[event.type]}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.time} · {eventLabels[event.type]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const legend = (
    <div className="flex flex-wrap gap-3 my-4">
      {Object.entries(eventLabels).map(([type, label]) => (
        <div key={type} className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${eventColors[type]}`} />
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );

  // Desktop: calendar full width + right sidebar
  if (!isMobile) {
    return (
      <PageTransition>
        <h2 className="text-lg font-bold text-foreground mb-4">{monthNames[month]} {year}</h2>
        <div className="flex gap-6">
          <div className="flex-1">
            {calendarGrid}
            {legend}
          </div>
          <div className="w-[320px] flex-shrink-0 sticky top-24 self-start">
            {eventsList}
          </div>
        </div>

        <BottomSheet open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title}>
          {selectedEvent && (
            <div className="space-y-3">
              <div><p className="text-xs text-muted-foreground font-medium">Tipo</p><p className="text-sm text-foreground">{eventLabels[selectedEvent.type]}</p></div>
              <div><p className="text-xs text-muted-foreground font-medium">Horário</p><p className="text-sm text-foreground">{selectedEvent.time}</p></div>
              <div><p className="text-xs text-muted-foreground font-medium">Data</p><p className="text-sm text-foreground">{new Date(selectedEvent.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p></div>
            </div>
          )}
        </BottomSheet>
      </PageTransition>
    );
  }

  // Mobile
  return (
    <PageTransition>
      <h2 className="text-lg font-bold text-foreground mb-4">{monthNames[month]} {year}</h2>
      {calendarGrid}
      {legend}
      {eventsList}

      <BottomSheet open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title}>
        {selectedEvent && (
          <div className="space-y-3">
            <div><p className="text-xs text-muted-foreground font-medium">Tipo</p><p className="text-sm text-foreground">{eventLabels[selectedEvent.type]}</p></div>
            <div><p className="text-xs text-muted-foreground font-medium">Horário</p><p className="text-sm text-foreground">{selectedEvent.time}</p></div>
            <div><p className="text-xs text-muted-foreground font-medium">Data</p><p className="text-sm text-foreground">{new Date(selectedEvent.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p></div>
          </div>
        )}
      </BottomSheet>
    </PageTransition>
  );
};

export default Calendario;
