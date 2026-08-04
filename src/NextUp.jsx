import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, X, Check, Pencil, Trash2, GripVertical, Link2, Printer, CalendarPlus, Play, Settings, Loader2, Wand2 } from "lucide-react";
import { supabase } from "./supabaseClient";

// Every browser/device shares this single row in the "nextup_state" table.
const STATE_ROW_ID = 1;
// Calendar events (practice days / gigs) are stored in a second row so they
// sync independently of the song library.
const EVENTS_ROW_ID = 2;

const RAW_SESSIONS = [{"name": "First Session", "songs": [{"id": 0, "title": "Oba dutu e mul dine", "artist": "Gypsies", "key": "F", "status": "Practiced", "remark": "Tranceposed to G after last Chorus"}, {"id": 1, "title": "Sanasennam Ma", "artist": "Senaka Batagoda", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 2, "title": "Dagakara Hadakari", "artist": "Various Artists", "key": "Bb", "status": "Need to Practice", "remark": null}, {"id": 3, "title": "Unmadini Medley", "artist": "BNS", "key": "C", "status": "Practiced Once", "remark": null}, {"id": 4, "title": "Perfect", "artist": "Ed Sheeran", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 5, "title": "Hitha Hiri Watunado", "artist": "Bachi Susan", "key": "B", "status": "Practiced Once", "remark": null}, {"id": 6, "title": "Tharuka Niwa Dura", "artist": "Ajith Bandara", "key": "Em", "status": "Practiced Once", "remark": null}, {"id": 7, "title": "Soduru Atheethaya", "artist": "TM Jayarathne", "key": "F", "status": "Need to Practice", "remark": null}, {"id": 8, "title": "Anganawo", "artist": "Rookantha Gunathilake", "key": "F", "status": "Practiced Once", "remark": null}, {"id": 9, "title": "Atha Ran Wiman", "artist": "Priya Sooriayasena", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 10, "title": "Sansarini", "artist": "Yasas Madagedara", "key": "Ab", "status": "Need to Practice", "remark": null}, {"id": 11, "title": "Eka dawasaka", "artist": "Sandeep Jayalath", "key": "Ebm", "status": "Need to Practice", "remark": null}, {"id": 12, "title": "Aadaree kiyanna (Shenal)", "artist": "Piyath Rajapakse", "key": "E", "status": "Need to Practice", "remark": null}, {"id": 13, "title": "Unmada prema geeya", "artist": "BNS", "key": "C", "status": "Need to Practice", "remark": null}, {"id": 14, "title": "Thawa Dawasak", "artist": "Keerthi Pasquel", "key": "E", "status": "Need to Practice", "remark": null}, {"id": 15, "title": "Ra ahase", "artist": "Billy Fernando", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 16, "title": "Oba kamathinam Mata kiyanna", "artist": "Gypsies", "key": "F", "status": "Need to Practice", "remark": null}, {"id": 17, "title": "Raya Pahan Kala", "artist": "nadeeka jayawardana", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 18, "title": "Mandaram Kathawe", "artist": "Wasthi", "key": "Dm", "status": "Need to Practice", "remark": null}, {"id": 19, "title": "Marunu hithe", "artist": "Wasthi", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 20, "title": "Mathake Hasaral", "artist": "Dushyanth Weeraman", "key": "Bbm", "status": "Need to Practice", "remark": null}]}, {"name": "Second Session", "songs": [{"id": 21, "title": "Ran wan mal dam", "artist": "Centigratez", "key": "Dm", "status": "Need to Practice", "remark": null}, {"id": 22, "title": "Tiken Tika", "artist": "Daddy", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 23, "title": "Chandrayan Pidu", "artist": "Daddy", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 24, "title": "Sarath Sande", "artist": "Charith Abesinghe", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 25, "title": "Dasa Piyagath kala", "artist": "Clarence Wijewardana", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 26, "title": "Mal Madahasa Medley", "artist": "Various Artist", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 27, "title": "Sili Sili Seethala", "artist": "Raj Seneviratne", "key": "Bb", "status": "Need to Practice", "remark": null}, {"id": 28, "title": "Nurawani", "artist": "Wasthi", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 29, "title": "Rahasin Awith", "artist": "Sureni De mel", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 30, "title": "Malsara", "artist": "Chamara Ranawaka", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 31, "title": "Sanda Basa giya thana na", "artist": "Rookantha", "key": "Bbm", "status": "Need to Practice", "remark": null}, {"id": 32, "title": "Api aye hamu nowena", "artist": "Sanka dineth", "key": "F#m", "status": "Need to Practice", "remark": null}, {"id": 33, "title": "Mage manik apsarawi", "artist": "Tharindu Arsecularathna", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 34, "title": "Jeththu None", "artist": "Dushyanth Weeraman", "key": "\u2014", "status": "Need to Practice", "remark": null}, {"id": 35, "title": "Nelum Wilen", "artist": "Dushyanth Weeraman", "key": "\u2014", "status": "Need to Practice", "remark": null}, {"id": 36, "title": "Ratakin eha", "artist": "Priya Sooriyasena", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 37, "title": "Mathakayan Obe", "artist": "Chamara Weerasinghe", "key": "Bbm", "status": "Need to Practice", "remark": null}, {"id": 38, "title": "Ninda Noyana", "artist": "Ranindu", "key": "Ebm", "status": "Need to Practice", "remark": null}, {"id": 39, "title": "Hinahenne mang", "artist": "Ranindu", "key": "Cm", "status": "Need to Practice", "remark": null}]}, {"name": "Third Session", "songs": [{"id": 40, "title": "Sumihiri pane", "artist": "Desmond De Silva", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 41, "title": "Rookantha Medley", "artist": "Unknown", "key": "\u2014", "status": "Need to Practice", "remark": null}, {"id": 42, "title": "Sawandari", "artist": "Sangeeth Wijesuriya", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 43, "title": "Mata sithanna ba Medley", "artist": "Unknown", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 44, "title": "Radio Active/Roo Sara", "artist": "Unknown", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 45, "title": "Thaththa mata anapu tokka", "artist": "Gypsies", "key": "Eb", "status": "Need to Practice", "remark": null}, {"id": 46, "title": "Ulath ekai Pilath ekai", "artist": "Rookantha", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 47, "title": "Layla", "artist": "Marianz", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 48, "title": "Bombe Motai", "artist": "Wasthi", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 49, "title": "Sudu Ammiya", "artist": "Wasthi", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 50, "title": "Yami Pain Yami", "artist": "Wasthi", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 51, "title": "Ingi Marana Tharu Rana", "artist": "K.Sujeewa", "key": "Ebm", "status": "Need to Practice", "remark": null}, {"id": 52, "title": "Me Diaganthaye", "artist": "Rookantha Gunathilaka", "key": "E", "status": "Need to Practice", "remark": null}, {"id": 53, "title": "Thrailoka", "artist": "Shane Zing", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 54, "title": "Sanwedana", "artist": "Shane Zing", "key": "B", "status": "Need to Practice", "remark": null}]}];

// give every seed song an (empty) categories array to tag it into setlists,
// and default the language to Sinhala since that's what the whole sheet is
RAW_SESSIONS.forEach((s) => s.songs.forEach((song) => { song.categories = []; song.language = "Sinhala"; song.singer = ""; song.link = ""; song.practicedAt = null; song.duration = null; song.youtubeLink = ""; }));
let NEXT_ID = Math.max(...RAW_SESSIONS.flatMap((s) => s.songs.map((sg) => sg.id))) + 1;

const CATEGORIES = ["Wedding", "Restaurant"];
const CATEGORY_STYLE = {
  Wedding: { bg: "rgba(224,114,156,0.14)", border: "rgba(224,114,156,0.4)", text: "#e0729c" },
  Restaurant: { bg: "rgba(87,184,201,0.14)", border: "rgba(87,184,201,0.4)", text: "#57b8c9" },
};

const LANGUAGES = ["Sinhala", "English", "Hindi"];
const LANGUAGE_STYLE = {
  Sinhala: { bg: "rgba(178,141,251,0.14)", border: "rgba(178,141,251,0.4)", text: "#b28dfb" },
  English: { bg: "rgba(126,200,227,0.14)", border: "rgba(126,200,227,0.4)", text: "#7ec8e3" },
  Hindi: { bg: "rgba(240,180,41,0.14)", border: "rgba(240,180,41,0.4)", text: "#f0b429" },
};

const STATUS_ORDER = ["Need to Practice", "Practiced Once", "Practiced"];
const STATUS_STYLE = {
  "Need to Practice": { label: "Need to Practice", color: "var(--red)", dot: "var(--red)" },
  "Practiced Once": { label: "Practiced Once", color: "var(--amber)", dot: "var(--amber)" },
  "Practiced": { label: "Practiced", color: "var(--green)", dot: "var(--green)" },
};

const STATUS_FILTER_STYLE = {
  "Need to Practice": { bg: "rgba(232,96,76,0.14)", border: "rgba(232,96,76,0.4)", text: "#e8604c" },
  "Practiced Once": { bg: "rgba(242,169,76,0.14)", border: "rgba(242,169,76,0.4)", text: "#f2a94c" },
  "Practiced": { bg: "rgba(95,184,156,0.14)", border: "rgba(95,184,156,0.4)", text: "#5fb89c" },
};

function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1].split("/")[0] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1].split("/")[0] || null;
      return u.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

function getYouTubeEmbedUrl(url) {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1`;
}

// Parses an ISO 8601 duration ("PT3M45S") as returned by the YouTube Data
// API into whole seconds.
function parseISO8601Duration(iso) {
  if (!iso) return null;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return null;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 || iso === "PT0S" ? total : null;
}

function nextStatus(s) {
  const i = STATUS_ORDER.indexOf(s);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
}

function timeAgo(ts) {
  if (!ts) return null;
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function parseDuration(str) {
  if (!str) return null;
  const parts = String(str).split(":").map(Number);
  if (parts.some(isNaN)) return null;
  const [m, s] = parts;
  return m * 60 + (s || 0);
}

function formatDuration(total) {
  if (!total) return "0:00";
  const m = Math.floor(total / 60), s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function flatten(sessions) {
  const out = [];
  sessions.forEach((s, si) =>
    s.songs.forEach((song, oi) =>
      out.push({ ...song, session: s.name, sessionIndex: si, order: oi })
    )
  );
  return out;
}

export default function NextUp() {
  const [sessions, setSessions] = useState(RAW_SESSIONS);
  const [loaded, setLoaded] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [activeSession, setActiveSession] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [todayFilter, setTodayFilter] = useState(false);
  const [query, setQuery] = useState("");
  const [pulse, setPulse] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [manualId, setManualId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [form, setForm] = useState({ title: "", artist: "", singer: "", key: "", session: RAW_SESSIONS[0].name, remark: "", language: "Sinhala", categories: [], link: "", duration: "", practicingToday: false, youtubeLink: "" });
  const [confirmDupeAdd, setConfirmDupeAdd] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [gigMode, setGigMode] = useState(false);
  const [view, setView] = useState("queue");
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ date: "", type: "Practice", title: "", location: "", note: "", songIds: [] });
  const [eventSongSearch, setEventSongSearch] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventForm, setEditEventForm] = useState(null);
  const [calendarSearch, setCalendarSearch] = useState("");
  const heroRef = useRef(null);
  const eventsRef = useRef(events);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // YouTube auto-duration lookup. The API key is entered once and kept in
  // localStorage — the app never ships a key of its own.
  const [youtubeApiKey, setYoutubeApiKey] = useState(() => {
    try { return localStorage.getItem("nextup_youtube_api_key") || ""; } catch { return ""; }
  });
  const [apiKeyDraft, setApiKeyDraft] = useState(youtubeApiKey);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [addDurationStatus, setAddDurationStatus] = useState(null); // null | "loading" | "done" | "error" | "nokey"
  const [editDurationStatus, setEditDurationStatus] = useState(null);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  const allSongs = useMemo(() => flatten(sessions), [sessions]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const upcomingEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    const q = calendarSearch.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((ev) => {
      const songMatch = ev.songIds.some((id) => {
        const song = allSongs.find((s) => s.id === id);
        return song && (song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q));
      });
      return (
        songMatch ||
        ev.title.toLowerCase().includes(q) ||
        (ev.location || "").toLowerCase().includes(q) ||
        ev.type.toLowerCase().includes(q)
      );
    });
  }, [events, calendarSearch, allSongs]);

  // Every song attached to an event dated today (any type — Practice, Gig,
  // etc). Backs both the "Today" badge on tickets and the Today filter chip.
  const todaySongIds = useMemo(() => {
    const ids = new Set();
    events.forEach((ev) => {
      if (ev.date === todayStr) ev.songIds.forEach((id) => ids.add(id));
    });
    return ids;
  }, [events, todayStr]);

  // Remarks/notes from today's events, for the banner shown when the Today
  // filter is on.
  const todayNotes = useMemo(() => {
    return events
      .filter((ev) => ev.date === todayStr && ev.note && ev.note.trim())
      .map((ev) => ({ id: ev.id, title: ev.title, note: ev.note.trim() }));
  }, [events, todayStr]);

  const eventSongOptions = useMemo(() => {
    const q = eventSongSearch.trim().toLowerCase();
    if (!q) return allSongs;
    return allSongs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  }, [allSongs, eventSongSearch]);

  // Songs that already exist with the same title (and artist, if given) as
  // whatever's currently typed into the Add-Song form. Used to warn before
  // creating a near-duplicate entry — this is what was letting the same
  // song get added 2-3 times and show up repeated in search results.
  const dupeMatches = useMemo(() => {
    const title = form.title.trim().toLowerCase();
    if (!title) return [];
    const artist = form.artist.trim().toLowerCase();
    return allSongs.filter((s) => {
      if (s.title.trim().toLowerCase() !== title) return false;
      if (!artist) return true;
      return (s.artist || "").trim().toLowerCase() === artist;
    });
  }, [allSongs, form.title, form.artist]);

  const filteredSongs = useMemo(() => {
    let list = allSongs;
    if (activeSession !== "all") list = list.filter((s) => s.session === activeSession);
    if (categoryFilter !== "all") {
      list = list.filter((s) => s.categories && s.categories.includes(categoryFilter));
    }
    if (languageFilter !== "all") {
      list = list.filter((s) => s.language === languageFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }
    if (todayFilter) {
      list = list.filter((s) => todaySongIds.has(s.id));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allSongs, activeSession, categoryFilter, languageFilter, statusFilter, todayFilter, todaySongIds, query]);

  // Auto-pick (or re-validate) which song is "next" — but only when the
  // current pick becomes invalid (deleted, or no longer in the active
  // session/filter). Re-running this on every status change was what made
  // the hero card jump to a different song right after marking one
  // "Practiced Once" — this keeps it pinned to the song you're looking at.
  useEffect(() => {
    let pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
    if (todayFilter) pool = pool.filter((s) => todaySongIds.has(s.id));
    const stillValid = manualId != null && pool.some((s) => s.id === manualId);
    if (!stillValid) {
      const pick =
        pool.find((s) => s.status === "Need to Practice") ||
        pool.find((s) => s.status === "Practiced Once") ||
        pool[0] ||
        null;
      setManualId(pick ? pick.id : null);
    }
  }, [allSongs, activeSession, todayFilter, todaySongIds]);

  // Toggling the Today filter is a deliberate switch of scope — jump the
  // hero straight to the first song in the new queue rather than leaving
  // whatever was showing before (even if it happens to still be valid).
  useEffect(() => {
    let pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
    if (todayFilter) pool = pool.filter((s) => todaySongIds.has(s.id));
    const pick =
      pool.find((s) => s.status === "Need to Practice") ||
      pool.find((s) => s.status === "Practiced Once") ||
      pool[0] ||
      null;
    setManualId(pick ? pick.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayFilter]);

  const nextSong = useMemo(() => {
    let pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
    if (todayFilter) pool = pool.filter((s) => todaySongIds.has(s.id));
    return pool.find((s) => s.id === manualId) || null;
  }, [allSongs, activeSession, todayFilter, todaySongIds, manualId]);

  const queue = useMemo(() => {
    if (!nextSong) return [];
    return filteredSongs.filter((s) => s.id !== nextSong.id);
  }, [filteredSongs, nextSong]);

  const stats = useMemo(() => {
    const pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
    const total = pool.length;
    const done = pool.filter((s) => s.status === "Practiced").length;
    const once = pool.filter((s) => s.status === "Practiced Once").length;
    const need = pool.filter((s) => s.status === "Need to Practice").length;
    return { total, done, once, need, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [allSongs, activeSession]);

  function updateStatus(id, status) {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        songs: s.songs.map((song) =>
          song.id === id
            ? { ...song, status, practicedAt: status === "Practiced" ? Date.now() : song.practicedAt }
            : song
        ),
      }))
    );
  }

  function togglePlay(id) {
    setPlayingId((prev) => (prev === id ? null : id));
  }

  function isPracticingToday(songId) {
    return events.some((ev) => ev.date === todayStr && ev.songIds.includes(songId));
  }

  function addSongToTodayEvent(songId) {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.date === todayStr && ev.type === "Practice");
      if (existing) {
        if (existing.songIds.includes(songId)) return prev;
        return prev.map((ev) => (ev.id === existing.id ? { ...ev, songIds: [...ev.songIds, songId] } : ev));
      }
      return [...prev, { id: Date.now(), date: todayStr, type: "Practice", title: "Practice Session", location: "", songIds: [songId] }];
    });
  }

  function removeSongFromTodayEvent(songId) {
    setEvents((prev) =>
      prev.map((ev) => (ev.date === todayStr ? { ...ev, songIds: ev.songIds.filter((id) => id !== songId) } : ev))
    );
  }

  function openAddEvent(presetSongIds) {
    setEventForm({ date: "", type: "Practice", title: "", location: "", note: "", songIds: presetSongIds || [] });
    setEventSongSearch("");
    setShowAddEvent(true);
  }

  function quickAddToCalendar(songId) {
    openAddEvent([songId]);
  }

  function addEvent(e) {
    e.preventDefault();
    if (!eventForm.date) return;
    const newEvent = {
      id: Date.now(),
      date: eventForm.date,
      type: eventForm.type,
      title: eventForm.title.trim() || (eventForm.type === "Gig" ? "Gig" : "Practice Session"),
      location: eventForm.location.trim(),
      note: eventForm.note.trim(),
      songIds: eventForm.songIds,
    };
    setEvents((prev) => [...prev, newEvent]);
    setEventForm({ date: "", type: "Practice", title: "", location: "", note: "", songIds: [] });
    setEventSongSearch("");
    setShowAddEvent(false);
  }

  function openEditEvent(ev) {
    setEditingEventId(ev.id);
    setEditEventForm({
      date: ev.date,
      type: ev.type,
      title: ev.title,
      location: ev.location || "",
      note: ev.note || "",
      songIds: [...ev.songIds],
    });
    setEventSongSearch("");
  }

  function closeEditEvent() {
    setEditingEventId(null);
    setEditEventForm(null);
    setEventSongSearch("");
  }

  function toggleEditEventSong(id) {
    setEditEventForm((f) => ({
      ...f,
      songIds: f.songIds.includes(id) ? f.songIds.filter((x) => x !== id) : [...f.songIds, id],
    }));
  }

  function saveEditEvent(e) {
    e.preventDefault();
    if (!editEventForm.date) return;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingEventId
          ? {
              ...ev,
              date: editEventForm.date,
              type: editEventForm.type,
              title: editEventForm.title.trim() || (editEventForm.type === "Gig" ? "Gig" : "Practice Session"),
              location: editEventForm.location.trim(),
              note: editEventForm.note.trim(),
              songIds: editEventForm.songIds,
            }
          : ev
      )
    );
    closeEditEvent();
  }

  function deleteEvent(id) {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  }

  function toggleEventSong(id) {
    setEventForm((f) => ({
      ...f,
      songIds: f.songIds.includes(id) ? f.songIds.filter((x) => x !== id) : [...f.songIds, id],
    }));
  }

  function formatEventDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  function moveSong(draggedId, targetId) {
    if (draggedId === targetId) return;
    setSessions((prev) => {
      let dragged = null, targetSession = null;
      prev.forEach((s) => s.songs.forEach((sg) => {
        if (sg.id === draggedId) dragged = sg;
        if (sg.id === targetId) targetSession = s.name;
      }));
      if (!dragged || !targetSession) return prev;
      return prev.map((s) => {
        let songs = s.songs.filter((sg) => sg.id !== draggedId);
        if (s.name === targetSession) {
          const at = songs.findIndex((sg) => sg.id === targetId);
          songs = [...songs.slice(0, at), dragged, ...songs.slice(at)];
        }
        return { ...s, songs };
      });
    });
  }

  function advance(id, current) {
    updateStatus(id, nextStatus(current));
    setPulse(true);
    setTimeout(() => setPulse(false), 420);
  }

  // Pointer-based drag reorder — works uniformly for mouse and touch (unlike
  // the native HTML5 drag-and-drop API, which doesn't fire on touch devices).
  // Dragging only starts from the handle, so scrolling the list elsewhere
  // is unaffected.
  function startDrag(e, id) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingId(id);
    setDragOverId(id);
  }

  function dragMove(e) {
    if (draggingId == null) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const ticketEl = el && el.closest("[data-song-id]");
    if (ticketEl) {
      const id = Number(ticketEl.getAttribute("data-song-id"));
      setDragOverId((prev) => (prev === id ? prev : id));
    }
  }

  function endDrag() {
    if (draggingId != null && dragOverId != null && draggingId !== dragOverId) {
      moveSong(draggingId, dragOverId);
    }
    setDraggingId(null);
    setDragOverId(null);
  }

  function saveYoutubeApiKey() {
    const trimmed = apiKeyDraft.trim();
    setYoutubeApiKey(trimmed);
    try { localStorage.setItem("nextup_youtube_api_key", trimmed); } catch {}
    setShowApiSettings(false);
  }

  // Looks up a YouTube video's length via the YouTube Data API v3 and hands
  // back a formatted mm:ss string through `onResult`. Requires the person to
  // have entered their own (free) API key in Settings.
  async function detectYouTubeDuration(url, setStatus, onResult) {
    const id = extractYouTubeId(url);
    if (!id) {
      setStatus(null);
      return;
    }
    if (!youtubeApiKey) {
      setStatus("nokey");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${encodeURIComponent(id)}&key=${encodeURIComponent(youtubeApiKey)}`
      );
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      const iso = data?.items?.[0]?.contentDetails?.duration;
      const seconds = parseISO8601Duration(iso);
      if (seconds == null) {
        setStatus("error");
        return;
      }
      onResult(formatDuration(seconds));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function pickAsNext(id) {
  setManualId(id);
  if (heroRef.current) {
    heroRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function assignCategories(ids, cats) {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        songs: s.songs.map((song) => {
          if (!ids.has(song.id)) return song;
          const merged = Array.from(new Set([...(song.categories || []), ...cats]));
          return { ...song, categories: merged };
        }),
      }))
    );
    clearSelection();
  }

  function removeCategory(id, cat) {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        songs: s.songs.map((song) =>
          song.id === id ? { ...song, categories: (song.categories || []).filter((c) => c !== cat) } : song
        ),
      }))
    );
  }

  function cycleLanguage(id, current) {
    const i = LANGUAGES.indexOf(current);
    const next = LANGUAGES[(i + 1) % LANGUAGES.length];
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        songs: s.songs.map((song) => (song.id === id ? { ...song, language: next } : song)),
      }))
    );
  }

  function toggleFormCategory(cat) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  }

  function addSong(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (dupeMatches.length > 0 && !confirmDupeAdd) {
      // First submit with a matching song already in the list — hold off
      // and ask the user to confirm rather than silently creating a dupe.
      setConfirmDupeAdd(true);
      return;
    }
    const newSong = {
      id: NEXT_ID++,
      title: form.title.trim(),
      artist: form.artist.trim() || "Unknown",
      singer: form.singer.trim() || "",
      key: form.key.trim() || "—",
      status: "Need to Practice",
      remark: form.remark.trim() || null,
      language: form.language,
      categories: form.categories,
      link: form.link.trim() || "",
      practicedAt: null,
      duration: parseDuration(form.duration),
      youtubeLink: form.youtubeLink.trim() || "",
    };
    setSessions((prev) =>
      prev.map((s) => (s.name === form.session ? { ...s, songs: [...s.songs, newSong] } : s))
    );
    if (form.practicingToday) addSongToTodayEvent(newSong.id);
    setForm({ title: "", artist: "", singer: "", key: "", session: form.session, remark: "", language: "Sinhala", categories: [], link: "", duration: "", practicingToday: false, youtubeLink: "" });
    setConfirmDupeAdd(false);
    setShowAdd(false);
  }
 function openEdit(song) {
    setEditingId(song.id);
    setEditForm({
      title: song.title,
      artist: song.artist,
      singer: song.singer || "",
      key: song.key,
      session: song.session,
      remark: song.remark || "",
      language: song.language,
      categories: [...(song.categories || [])],
      link: song.link || "",
      duration: song.duration ? formatDuration(song.duration) : "",
      practicingToday: isPracticingToday(song.id),
      youtubeLink: song.youtubeLink || "",
    });
  }

  function closeEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  function toggleEditCategory(cat) {
    setEditForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    setSessions((prev) => {
      let original = null;
      prev.forEach((s) => s.songs.forEach((sg) => { if (sg.id === editingId) original = sg; }));
      if (!original) return prev;
      const updated = {
        ...original,
        title: editForm.title.trim(),
        artist: editForm.artist.trim() || "Unknown",
        singer: editForm.singer.trim() || "",
        key: editForm.key.trim() || "—",
        remark: editForm.remark.trim() || null,
        language: editForm.language,
        categories: editForm.categories,
        link: editForm.link.trim() || "",
        duration: parseDuration(editForm.duration),
        youtubeLink: editForm.youtubeLink.trim() || "",
      };
      return prev.map((s) => {
        const withoutSong = s.songs.filter((sg) => sg.id !== editingId);
        return s.name === editForm.session ? { ...s, songs: [...withoutSong, updated] } : { ...s, songs: withoutSong };
      });
    });
    if (editForm.practicingToday) addSongToTodayEvent(editingId);
    else removeSongFromTodayEvent(editingId);
    closeEdit();
  }

  function deleteSong() {
    setSessions((prev) => prev.map((s) => ({ ...s, songs: s.songs.filter((sg) => sg.id !== editingId) })));
    if (manualId === editingId) setManualId(null);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(editingId);
      return next;
    });
    closeEdit();
  }

  // Keep a ref of the latest sessions so the realtime handler below (set up
  // once on mount) can always compare against current state, not stale state.
  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  // Load the shared song list from Supabase once when the app first opens.
  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("nextup_state")
        .select("data")
        .eq("id", STATE_ROW_ID)
        .maybeSingle();
      if (!active) return;
      if (error) {
        setSyncError("Couldn't reach the shared database — showing local data only.");
      } else if (data && data.data) {
        setSessions(data.data);
      } else {
        // Nothing in the table yet — seed it with the starter setlists.
        await supabase.from("nextup_state").upsert({ id: STATE_ROW_ID, data: RAW_SESSIONS });
      }
      setLoaded(true);
    }
    load();
    return () => { active = false; };
  }, []);

  // Whenever the song list changes locally, push it to Supabase (debounced)
  // so every other device sees the same data.
  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => {
      supabase.from("nextup_state").upsert({ id: STATE_ROW_ID, data: sessions }).then(({ error }) => {
        if (error) setSyncError("Couldn't save your last change to the shared database.");
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [sessions, loaded]);

  // Pick up changes made from other devices/tabs in near real time.
  useEffect(() => {
    const channel = supabase
      .channel("nextup_state_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "nextup_state", filter: `id=eq.${STATE_ROW_ID}` },
        (payload) => {
          if (!payload.new || !payload.new.data) return;
          // Skip echoes of a change this same tab just saved — applying them
          // again is what caused status clicks to glitch/revert.
          const incoming = JSON.stringify(payload.new.data);
          const current = JSON.stringify(sessionsRef.current);
          if (incoming === current) return;
          setSessions(payload.new.data);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Load calendar events once when the app first opens.
  useEffect(() => {
    let active = true;
    async function loadEvents() {
      const { data, error } = await supabase
        .from("nextup_state")
        .select("data")
        .eq("id", EVENTS_ROW_ID)
        .maybeSingle();
      if (!active) return;
      if (!error && data && data.data) {
        setEvents(data.data);
      }
      setEventsLoaded(true);
    }
    loadEvents();
    return () => { active = false; };
  }, []);

  // Push event changes to Supabase (debounced).
  useEffect(() => {
    if (!eventsLoaded) return;
    const timeout = setTimeout(() => {
      supabase.from("nextup_state").upsert({ id: EVENTS_ROW_ID, data: events }).then(({ error }) => {
        if (error) setSyncError("Couldn't save your last change to the shared database.");
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [events, eventsLoaded]);

  // Pick up event changes made from other devices/tabs in near real time.
  useEffect(() => {
    const channel = supabase
      .channel("nextup_events_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "nextup_state", filter: `id=eq.${EVENTS_ROW_ID}` },
        (payload) => {
          if (!payload.new || !payload.new.data) return;
          const incoming = JSON.stringify(payload.new.data);
          const current = JSON.stringify(eventsRef.current);
          if (incoming === current) return;
          setEvents(payload.new.data);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.style.opacity = 0;
      heroRef.current.style.transform = "translateY(6px)";
      requestAnimationFrame(() => {
        heroRef.current.style.transition = "opacity .45s ease, transform .45s ease";
        heroRef.current.style.opacity = 1;
        heroRef.current.style.transform = "translateY(0)";
      });
    }
  }, [nextSong && nextSong.id]);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement && document.activeElement.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (typing || showAdd || editingId != null || gigMode) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (nextSong) advance(nextSong.id, nextSong.status);
      } else if (e.code === "ArrowDown" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!nextSong) return;
        const pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
        const idx = pool.findIndex((s) => s.id === nextSong.id);
        const dir = e.code === "ArrowDown" ? 1 : -1;
        const target = pool[idx + dir];
        if (target) pickAsNext(target.id);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextSong, allSongs, activeSession, showAdd, editingId, gigMode]);

  return (
    <div className="stage">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --bg: #0c0a10;
          --bg-alt: #131019;
          --card: #17131f;
          --card-line: #262032;
          --amber: #f2a94c;
          --amber-dim: #a97a3c;
          --red: #e8604c;
          --green: #5fb89c;
          --ink: #f5f1e8;
          --ink-dim: #a89cb6;
          --ink-faint: #6b6178;
        }

        * { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
}
#root {
  min-height: 100vh;
}

        .stage {
          background:
            radial-gradient(ellipse 900px 500px at 50% -10%, rgba(242,169,76,0.10), transparent 60%),
            var(--bg);
          color: var(--ink);
          font-family: 'Work Sans', sans-serif;
          min-height: 100%;
          padding: 28px 20px 60px;
          box-sizing: border-box;
        }

        .wrap { max-width: 780px; margin: 0 auto; }

        .topbar {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 0.08em;
          color: var(--ink);
        }
        .brand span { color: var(--amber); }
        .brand-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ink-faint);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Session tabs */
        .tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .tab {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid var(--card-line);
          background: var(--card);
          color: var(--ink-dim);
          cursor: pointer;
          white-space: nowrap;
          transition: all .15s ease;
        }
        .tab:hover { border-color: var(--amber-dim); color: var(--ink); }
        .tab.active {
          background: var(--amber);
          border-color: var(--amber);
          color: #1a1206;
          font-weight: 600;
        }

        /* Hero: spotlight */
        .hero {
          position: relative;
          border-radius: 18px;
          padding: 38px 28px 30px;
          margin-bottom: 26px;
          overflow: hidden;
          background: linear-gradient(180deg, var(--card) 0%, var(--bg-alt) 100%);
          border: 1px solid var(--card-line);
        }
        .spotlight {
          position: absolute;
          top: -220px;
          left: 50%;
          width: 700px;
          height: 500px;
          transform: translateX(-50%);
          background: conic-gradient(from 180deg at 50% 0%, transparent 20%, rgba(242,169,76,0.18) 50%, transparent 80%);
          filter: blur(4px);
          pointer-events: none;
          animation: sway 6s ease-in-out infinite;
        }
        @keyframes sway {
          0%, 100% { transform: translateX(-50%) rotate(-4deg); }
          50% { transform: translateX(-50%) rotate(4deg); }
        }
        .eyebrow {
          position: relative;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .rec-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--red);
          box-shadow: 0 0 0 0 rgba(232,96,76,0.6);
          animation: rec 1.6s infinite;
        }
        @keyframes rec {
          0% { box-shadow: 0 0 0 0 rgba(232,96,76,0.55); }
          70% { box-shadow: 0 0 0 8px rgba(232,96,76,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,96,76,0); }
        }
        .hero-title {
          position: relative;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 8vw, 58px);
          line-height: 1.02;
          letter-spacing: 0.01em;
          color: var(--ink);
          margin: 0 0 8px;
        }
        .hero-artist {
  position: relative;
  font-size: 16px;
  color: var(--ink-dim);
  margin-bottom: 4px;
}
.hero-singer {
  position: relative;
  font-size: 13px;
  color: var(--ink-faint);
  font-style: italic;
  margin-bottom: 16px;
}
.hero-meta {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .keytag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 8px;
          background: rgba(242,169,76,0.12);
          color: var(--amber);
          border: 1px solid rgba(242,169,76,0.3);
        }
        .langtag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid;
          cursor: pointer;
          transition: filter .12s ease;
        }
        .langtag:hover { filter: brightness(1.15); }
        .langtag.small {
          font-size: 10px;
          padding: 3px 8px;
          letter-spacing: 0.03em;
          flex-shrink: 0;
        }
        .sesstag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--ink-faint);
        }
        .remark {
          position: relative;
          font-size: 13px;
          color: var(--ink-dim);
          background: rgba(255,255,255,0.03);
          border-left: 2px solid var(--amber-dim);
          padding: 8px 12px;
          border-radius: 0 8px 8px 0;
          margin-bottom: 22px;
        }
        .hero-actions {
          position: relative;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .btn-primary {
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 22px;
          border-radius: 10px;
          border: none;
          background: var(--amber);
          color: #1a1206;
          cursor: pointer;
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(242,169,76,0.25); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary.pulse { animation: flash .42s ease; }
        @keyframes flash {
          0% { box-shadow: 0 0 0 0 rgba(95,184,156,0.5); }
          100% { box-shadow: 0 0 0 14px rgba(95,184,156,0); }
        }
        .btn-ghost {
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid var(--card-line);
          background: transparent;
          color: var(--ink-dim);
          cursor: pointer;
        }
        .btn-ghost:hover { border-color: var(--ink-faint); color: var(--ink); }
        .all-done {
          position: relative;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          color: var(--green);
        }

        /* Search + stats row */
        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
          align-items: center;
        }
        .search {
          flex: 1;
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--card-line);
          background: var(--card);
          color: var(--ink);
          outline: none;
        }
        .search::placeholder { color: var(--ink-faint); }
        .search:focus { border-color: var(--amber-dim); }

        .stats {
          display: flex;
          gap: 16px;
          margin-bottom: 18px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ink-faint);
          letter-spacing: 0.04em;
        }
        .stats b { color: var(--ink); font-weight: 600; }
        .bar {
          height: 4px;
          border-radius: 2px;
          background: var(--card-line);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--green), var(--amber));
          transition: width .4s ease;
        }

        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin: 0 0 12px 2px;
        }

        /* Queue ticket cards */
        .queue { display: flex; flex-direction: column; gap: 8px; }
        .ticket {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--card);
          border: 1px solid var(--card-line);
          border-radius: 12px;
          padding: 14px 16px;
          transition: border-color .15s ease, transform .12s ease;
        }
        .ticket:hover { border-color: var(--amber-dim); transform: translateX(2px); }
        .ticket-order {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ink-faint);
          width: 20px;
          flex-shrink: 0;
        }
        .ticket-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0;
        }
        .ticket-body { flex: 1; min-width: 0; cursor: pointer; }
        .ticket-body:hover .ticket-title { color: var(--amber); }
        .ticket-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color .12s ease;
        }
        .ticket-sub {
          font-size: 12px;
          color: var(--ink-faint);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .edit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 7px;
          border: 1px solid var(--card-line);
          color: var(--ink-faint);
          cursor: pointer;
          flex-shrink: 0;
          transition: all .12s ease;
        }
        .edit-btn:hover { color: var(--amber); border-color: var(--amber-dim); }
        .ticket-key {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--ink-dim);
          flex-shrink: 0;
        }
        .ticket-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 6px;
          flex-shrink: 0;
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--ink-faint);
          font-size: 13px;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 9px 14px;
          border-radius: 9px;
          border: 1px solid var(--card-line);
          background: var(--card);
          color: var(--ink);
          cursor: pointer;
          transition: border-color .15s ease, background .15s ease;
        }
        .btn-add:hover { border-color: var(--amber-dim); background: var(--bg-alt); }
        .btn-add.icon-only { padding: 9px; }

        /* YouTube auto-duration detect UI */
        .field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 8px 0 4px;
        }
        .detect-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 11px;
          padding: 4px 9px;
          border-radius: 999px;
          border: 1px solid rgba(240,180,41,0.4);
          background: rgba(240,180,41,0.1);
          color: var(--amber);
          cursor: pointer;
        }
        .detect-btn:hover { background: rgba(240,180,41,0.18); }
        .detect-btn:disabled { opacity: 0.6; cursor: default; }
        .detect-status {
          font-size: 11.5px;
          color: var(--ink-faint);
          margin: 5px 2px 2px;
        }
        .detect-status.success { color: var(--green); }
        .detect-status.error { color: var(--red); }
        .detect-link {
          color: var(--amber);
          text-decoration: underline;
          cursor: pointer;
        }
        .settings-copy {
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--ink-dim);
          margin: 6px 0;
        }
        .settings-copy a { color: var(--amber); }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Category filter chips */
        .cat-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .cat-filter-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-right: 2px;
        }
        .cat-chip {
          font-family: 'Work Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 13px;
          border-radius: 999px;
          border: 1px solid var(--card-line);
          background: var(--card);
          color: var(--ink-dim);
          cursor: pointer;
          transition: all .15s ease;
        }
        .cat-chip:hover { border-color: var(--ink-faint); color: var(--ink); }
        .cat-chip.active { font-weight: 600; }

        /* Checkbox */
        .checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid var(--card-line);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          color: #1a1206;
          transition: all .12s ease;
        }
        .checkbox:hover { border-color: var(--amber-dim); }
        .checkbox.on { background: var(--amber); border-color: var(--amber); }
        .ticket.checked { border-color: var(--amber-dim); background: var(--bg-alt); }

        .section-label-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .selected-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--amber);
        }

        .ticket-tags {
          display: flex;
          gap: 6px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.03em;
          padding: 2px 7px 2px 8px;
          border-radius: 999px;
          border: 1px solid;
        }
        .cat-pill svg { cursor: pointer; opacity: 0.7; }
        .cat-pill svg:hover { opacity: 1; }

        /* Bulk action bar */
        .bulk-bar {
          position: fixed;
          left: 50%;
          bottom: 22px;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          background: #1c1726;
          border: 1px solid var(--card-line);
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          z-index: 40;
          max-width: calc(100% - 32px);
          flex-wrap: wrap;
          justify-content: center;
        }
        .bulk-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: var(--ink-dim);
          white-space: nowrap;
        }
        .bulk-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .bulk-btn {
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 12px;
          padding: 8px 13px;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          white-space: nowrap;
        }
        .bulk-btn.wedding { background: rgba(224,114,156,0.14); color: #e0729c; border-color: rgba(224,114,156,0.4); }
        .bulk-btn.restaurant { background: rgba(87,184,201,0.14); color: #57b8c9; border-color: rgba(87,184,201,0.4); }
        .bulk-btn.both { background: var(--amber); color: #1a1206; }
        .bulk-btn.clear { background: transparent; color: var(--ink-faint); border-color: var(--card-line); }

        /* Add Song modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8,6,11,0.7);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }
        .modal {
          width: 100%;
          max-width: 380px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          background: var(--bg-alt);
          border: 1px solid var(--card-line);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          scrollbar-width: thin;
          scrollbar-color: var(--card-line) transparent;
        }
        .modal::-webkit-scrollbar { width: 6px; }
        .modal::-webkit-scrollbar-track { background: transparent; }
        .modal::-webkit-scrollbar-thumb { background: var(--card-line); border-radius: 999px; }
        .modal::-webkit-scrollbar-thumb:hover { background: var(--ink-faint); }
        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.03em;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .modal-close { color: var(--ink-faint); cursor: pointer; display: flex; }
        .modal-close:hover { color: var(--ink); }
        .field-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin: 8px 0 4px;
        }
        .field {
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          padding: 9px 12px;
          border-radius: 9px;
          border: 1px solid var(--card-line);
          background: var(--card);
          color: var(--ink);
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .field:focus { border-color: var(--amber-dim); }
        textarea.field { font-family: 'Work Sans', sans-serif; resize: vertical; min-height: 40px; }
        select.field { appearance: none; }
        .field-row { display: flex; gap: 10px; }
        .field-cats { display: flex; gap: 8px; margin-top: 2px; }
        .btn-danger {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 9px;
          border: 1px solid rgba(232,96,76,0.35);
          background: rgba(232,96,76,0.1);
          color: var(--red);
          cursor: pointer;
        }
        .btn-danger:hover { background: rgba(232,96,76,0.18); }
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 14px;
          padding: 10px 0 2px;
          position: sticky;
          bottom: 0;
          background: var(--bg-alt);
        }
        .modal-actions .btn-primary,
        .modal-actions .btn-ghost,
        .modal-actions .btn-danger {
          padding: 9px 16px;
          font-size: 13px;
        }

        /* ---------- Mobile responsiveness & touch usability ---------- */
        button, .tab, .cat-chip, .view-tab, .checkbox, .ticket-status,
        .edit-btn, .langtag, .btn-add, .btn-primary, .btn-ghost, .btn-danger {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 640px) {
          .stage { padding: 16px 12px 96px; }
          .wrap { max-width: 100%; }

          /* Header stacks and action buttons become equal-width tap targets */
          .topbar { flex-direction: column; align-items: stretch; gap: 12px; }
          .topbar-actions { width: 100%; }
          .topbar-actions .btn-add:not(.icon-only) { flex: 1; justify-content: center; min-height: 44px; }
          .topbar-actions .btn-add.icon-only { min-height: 44px; min-width: 44px; }

          /* Queue/Calendar switcher fills the width */
          .view-tabs { width: 100%; }
          .view-tab { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 40px; }

          /* Session tabs & filter chips scroll horizontally instead of wrapping into a wall of chips */
          .tabs, .cat-filters {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 2px;
            margin-left: -12px;
            margin-right: -12px;
            padding-left: 12px;
            padding-right: 12px;
          }
          .tabs::-webkit-scrollbar, .cat-filters::-webkit-scrollbar { display: none; }
          .tab, .cat-chip { flex-shrink: 0; min-height: 36px; display: flex; align-items: center; }
          .cat-filter-label { flex-shrink: 0; }
          .cat-filters button.btn-add { flex-shrink: 0; margin-left: 8px !important; }

          /* Hero card */
          .hero { padding: 26px 16px 20px; border-radius: 14px; margin-bottom: 20px; }
          .hero-title { font-size: clamp(30px, 10vw, 42px); }
          .hero-meta { gap: 8px; margin-bottom: 18px; }
          .hero-actions { flex-direction: column; align-items: stretch; gap: 10px; }
          .hero-actions .btn-primary { width: 100%; min-height: 48px; }
          .hero-actions .ticket-status { align-self: center; }

          /* Search + stats */
          .controls { flex-wrap: wrap; }
          .search { font-size: 16px; min-height: 44px; }
          .stats { flex-wrap: wrap; gap: 10px; }

          /* Queue rows: bigger tap targets, trim non-essential columns */
          .ticket { gap: 10px; padding: 12px 10px; }
          .ticket-title { font-size: 14px; }
          .ticket-sub { font-size: 11px; }
          .ticket-order { display: none; }
          .ticket-key { display: none; }
          .langtag.small { display: none; }
          .ticket-status { padding: 5px 8px; font-size: 9px; }
          .drag-handle { padding: 10px 6px; margin: -10px -6px; }
          .checkbox { width: 22px; height: 22px; }
          .edit-btn { width: 32px; height: 32px; }

          /* Forms: 16px inputs stop iOS Safari from auto-zooming on focus */
          .field, select.field, textarea.field { font-size: 16px; min-height: 40px; }
          .field-row { flex-direction: column; gap: 0; }

          /* Modals become a bottom sheet: easier one-thumb reach than a centered popup */
          .modal-backdrop { align-items: flex-end; padding: 0; }
          .modal {
            width: 100%;
            max-width: 100%;
            max-height: 88vh;
            border-radius: 18px 18px 0 0;
            padding: 18px 16px calc(18px + env(safe-area-inset-bottom));
          }

          /* Bulk action bar docks to the bottom edge instead of floating (avoids thumb-reach + overlap issues) */
          .bulk-bar {
            left: 0;
            right: 0;
            bottom: 0;
            transform: none;
            width: 100%;
            max-width: 100%;
            border-radius: 16px 16px 0 0;
            padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
            justify-content: flex-start;
          }
          .bulk-actions { width: 100%; }
          .bulk-btn { min-height: 38px; }

          /* Gig mode */
          .gig-overlay { padding: 16px; }
          .gig-head { flex-direction: column; align-items: flex-start; gap: 10px; }
          .gig-head > div:last-child { width: 100%; }
          .gig-head .btn-add { flex: 1; justify-content: center; }
          .gig-title { font-size: 16px; }

          /* Calendar events */
          .event-row { padding: 12px 10px; gap: 10px; }
          .event-date { width: 38px; }
          .event-day { font-size: 20px; }
        }

        @media (max-width: 380px) {
          .hero-title { font-size: clamp(26px, 11vw, 36px); }
          .brand { font-size: 22px; }
        }

        /* Lyrics/chords link + last-practiced date */
        .lyrics-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--amber);
          text-decoration: none;
        }
        .lyrics-link:hover { text-decoration: underline; }
        .play-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          margin-left: 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--amber);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }
        .play-link:hover { text-decoration: underline; }
        .yt-embed-wrap {
          margin-top: 12px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
        }
        .yt-embed-wrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        .ticket-embed {
          margin: -4px 0 10px;
          max-width: 480px;
        }
        .play-btn { color: var(--amber); }
        .last-practiced {
          margin-top: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ink-faint);
        }
        .ticket-link-icon {
          display: inline-flex;
          margin-left: 6px;
          color: var(--amber);
          vertical-align: middle;
        }
        .ticket-link-icon:hover { color: var(--ink); }

        /* Drag-to-reorder handle */
        .drag-handle {
          color: var(--ink-faint);
          cursor: grab;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          margin: -8px -4px;
          touch-action: none;
          -webkit-user-select: none;
          user-select: none;
        }
        .drag-handle:hover { color: var(--ink-dim); }
        .drag-handle:active { cursor: grabbing; }
        .ticket.dragging {
          opacity: 0.55;
          border-color: var(--amber-dim);
          box-shadow: 0 10px 24px rgba(0,0,0,0.35);
        }
        .ticket.drag-over {
          border-color: var(--amber);
          box-shadow: 0 0 0 2px rgba(242,169,76,0.35) inset;
        }

        /* Gig mode */
        .gig-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg);
          z-index: 60;
          overflow-y: auto;
          padding: 24px;
        }
        .gig-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-dim);
        }
        .gig-head > div:last-child { display: flex; gap: 8px; }
        .gig-head .btn-add { display: flex; align-items: center; gap: 6px; }
        .gig-runtime {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--amber);
          margin-bottom: 18px;
        }
        .gig-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 4px;
          border-bottom: 1px solid var(--card-line);
        }
        .gig-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          color: var(--ink-faint);
          width: 34px;
          flex-shrink: 0;
        }
        .gig-title { font-size: 18px; font-weight: 600; }
        .gig-sub { font-size: 13px; color: var(--ink-dim); margin-top: 2px; }

        /* Queue / Calendar view switcher */
        .topbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-add-ghost {
          background: transparent;
          color: var(--amber);
          border: 1px solid var(--amber-dim, rgba(240,180,41,0.4));
        }
        .btn-add-ghost:hover { background: rgba(240,180,41,0.1); }
        .view-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 14px;
        }
        .view-tab {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-dim);
          border: 1px solid var(--card-line);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .view-tab:hover { color: var(--ink); }
        .view-tab.active {
          color: var(--bg);
          background: var(--amber);
          border-color: var(--amber);
        }

        /* Calendar / upcoming events list */
        .calendar-view { margin-top: 4px; }
        .event-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 12px;
          border: 1px solid var(--card-line);
          border-radius: 12px;
          margin-bottom: 10px;
          background: var(--card-bg);
        }
        .event-row.past { opacity: 0.5; }
        .event-actions { display: flex; flex-direction: column; gap: 6px; }
        .event-date {
          flex-shrink: 0;
          width: 48px;
          text-align: center;
          font-family: 'Bebas Neue', sans-serif;
        }
        .event-day { font-size: 24px; line-height: 1; color: var(--ink); }
        .event-month { font-size: 11px; color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.06em; }
        .event-body { flex: 1; min-width: 0; }
        .event-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .event-type-badge {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 999px;
        }
        .event-type-badge.practice { background: rgba(126,200,227,0.14); color: #7ec8e3; border: 1px solid rgba(126,200,227,0.4); }
        .event-type-badge.gig { background: rgba(240,180,41,0.14); color: #f0b429; border: 1px solid rgba(240,180,41,0.4); }
        .event-title { font-size: 15px; font-weight: 600; color: var(--ink); }
        .event-sub { font-size: 12px; color: var(--ink-dim); margin-top: 3px; }
        .event-songs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .event-song-pill {
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--card-line);
          color: var(--ink-dim);
        }
        .event-song-pill.has-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          background: rgba(240,180,41,0.14);
          color: #f0b429;
          border: 1px solid rgba(240,180,41,0.4);
          cursor: pointer;
        }
        .event-song-pill.has-link:hover { background: rgba(240,180,41,0.22); }

        /* Song picker inside the Add Event modal */
        .event-song-picker {
          max-height: 220px;
          overflow-y: auto;
          border: 1px solid var(--card-line);
          border-radius: 10px;
          padding: 6px;
          margin-bottom: 4px;
        }
        .event-song-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 8px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }
        .event-song-option:hover { background: var(--card-line); }
        .event-song-option.active { color: var(--ink); }
        .event-song-artist { color: var(--ink-faint); font-size: 11.5px; }
        .event-song-link-dot { color: var(--amber); margin-left: 5px; vertical-align: middle; }
        .event-song-empty { padding: 10px 8px; font-size: 12.5px; color: var(--ink-faint); }
        .field-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--ink-dim);
          margin: 4px 0 10px;
          cursor: pointer;
          user-select: none;
        }
        .field-check input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: var(--amber);
          cursor: pointer;
        }
        .today-badge {
          display: inline-flex;
          align-items: center;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(240,180,41,0.14);
          color: #f0b429;
          border: 1px solid rgba(240,180,41,0.4);
          margin-left: 6px;
        }
        .today-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 9px 14px;
          border-radius: 10px;
          border: 1px solid var(--card-line);
          background: var(--card);
          color: var(--ink);
          cursor: pointer;
          transition: border-color .15s ease, background .15s ease, color .15s ease;
        }
        .today-toggle:hover { border-color: var(--amber-dim); }
        .today-toggle.active {
          background: rgba(240,180,41,0.14);
          color: #f0b429;
          border-color: rgba(240,180,41,0.5);
        }
        .today-toggle .today-toggle-count {
          font-size: 11px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
        }
        .today-toggle.active .today-toggle-count {
          background: rgba(240,180,41,0.22);
        }
        @media (max-width: 640px) {
          .today-toggle { min-height: 44px; padding: 9px 12px; }
        }
        .today-note-bar {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 16px;
          padding: 12px 14px;
          background: var(--card);
          border: 1px solid var(--card-line);
          border-left: 3px solid var(--amber);
          border-radius: 12px;
        }
        .today-note-bar-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: 'Work Sans', sans-serif;
          font-size: 13px;
          line-height: 1.4;
          color: var(--ink);
        }
        .today-note-bar-title {
          font-weight: 700;
          color: var(--amber);
          margin-right: 6px;
        }

        @media print {
          body * { visibility: hidden; }
          .gig-overlay, .gig-overlay * { visibility: visible; }
          .gig-overlay { position: absolute; inset: 0; padding: 0; }
          .no-print { display: none; }
        }
      `}</style>

      <div className="wrap">
        {todayFilter && todayNotes.length > 0 && (
          <div className="today-note-bar">
            <div className="today-note-bar-body">
              {todayNotes.map((n) => (
                <div key={n.id} className="today-note-bar-item">
                  {todayNotes.length > 1 && <span className="today-note-bar-title">{n.title}:</span>}
                  {n.note}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="topbar">
          <div>
            <div className="brand">LUMOS<span>Practices</span></div>
            <div className="brand-sub">
              Practice Queue · {sessions.length} Sessions
              {!loaded && " · Syncing…"}
              {syncError && ` · ${syncError}`}
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn-add" onClick={() => setShowAdd(true)}>
              <Plus size={15} strokeWidth={2.5} /> Add Song
            </button>
            <button className="btn-add btn-add-ghost" onClick={() => openAddEvent()}>
              <CalendarPlus size={15} strokeWidth={2.5} /> Add Event
            </button>
            <button
              className="btn-add icon-only"
              onClick={() => { setApiKeyDraft(youtubeApiKey); setShowApiSettings(true); }}
              title="YouTube API key settings"
            >
              <Settings size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="view-tabs">
          <div className={"view-tab" + (view === "queue" ? " active" : "")} onClick={() => setView("queue")}>
            Queue
          </div>
          <div className={"view-tab" + (view === "calendar" ? " active" : "")} onClick={() => setView("calendar")}>
            Calendar
          </div>
        </div>

        {view === "queue" && (
        <>
        <div className="tabs">
          <div
            className={"tab" + (activeSession === "all" ? " active" : "")}
            onClick={() => setActiveSession("all")}
          >
            All Sessions
          </div>
          {sessions.map((s) => (
            <div
              key={s.name}
              className={"tab" + (activeSession === s.name ? " active" : "")}
              onClick={() => setActiveSession(s.name)}
            >
              {s.name}
            </div>
          ))}
        </div>

        <div className="hero" ref={heroRef}>
          <div className="spotlight" />
          {nextSong ? (
            <>
              <div className="eyebrow"><span className="rec-dot" />Now Practicing</div>
              <h1 className="hero-title">
                {nextSong.title}
                {isPracticingToday(nextSong.id) && <span className="today-badge">Today</span>}
              </h1>
              <div className="hero-artist">{nextSong.artist}</div>
              {nextSong.singer && <div className="hero-singer">Sung by {nextSong.singer}</div>}
              <div className="hero-meta">
                <span className="keytag">Key · {nextSong.key}</span>
                <span
                  className="langtag"
                  style={{ color: LANGUAGE_STYLE[nextSong.language].text, borderColor: LANGUAGE_STYLE[nextSong.language].border, background: LANGUAGE_STYLE[nextSong.language].bg }}
                  onClick={() => cycleLanguage(nextSong.id, nextSong.language)}
                  title="Click to change language"
                >
                  {nextSong.language}
                </span>
                <span className="sesstag">{nextSong.session}</span>
              </div>
              {nextSong.remark && <div className="remark">{nextSong.remark}</div>}
              {nextSong.status === "Practiced" && nextSong.practicedAt && (
                <div className="last-practiced">Last practiced {timeAgo(nextSong.practicedAt)}</div>
              )}
              {nextSong.link && (
                <a className="lyrics-link" href={nextSong.link} target="_blank" rel="noreferrer">
                  <Link2 size={13} strokeWidth={2.2} /> Lyrics / Chords
                </a>
              )}
              {nextSong.youtubeLink && (
                <button className="play-link" onClick={() => togglePlay(nextSong.id)}>
                  <Play size={13} strokeWidth={2.2} fill="currentColor" /> {playingId === nextSong.id ? "Hide Player" : "Play Reference"}
                </button>
              )}
              {playingId === nextSong.id && getYouTubeEmbedUrl(nextSong.youtubeLink) && (
                <div className="yt-embed-wrap">
                  <iframe
                    src={getYouTubeEmbedUrl(nextSong.youtubeLink)}
                    title="Reference track"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="hero-actions">
                <button
                  className={"btn-primary" + (pulse ? " pulse" : "")}
                  onClick={() => advance(nextSong.id, nextSong.status)}
                >
                  {nextSong.status === "Practiced" ? "Cycle Status" : "Mark as Practiced →"}
                </button>
                <span className="ticket-status" style={{
                  color: STATUS_STYLE[nextSong.status].color,
                  borderColor: STATUS_STYLE[nextSong.status].color + "55",
                  alignSelf: "center",
                }}>
                  {STATUS_STYLE[nextSong.status].label}
                </span>
              </div>
            </>
          ) : (
            <div className="all-done">All songs practiced 🎸</div>
          )}
        </div>

        <div className="controls">
          <input
            className="search"
            placeholder="Search song or artist…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className={"today-toggle" + (todayFilter ? " active" : "")}
            onClick={() => setTodayFilter((v) => !v)}
            title={todayFilter ? "Showing only today's practice songs" : "Show only songs scheduled for today"}
          >
            <CalendarPlus size={14} strokeWidth={2.4} />
            Today
            <span className="today-toggle-count">{todaySongIds.size}</span>
          </button>
        </div>

        <div className="cat-filters">
          <span className="cat-filter-label">Setlist</span>
          {["all", ...CATEGORIES].map((c) => (
            <div
              key={c}
              className={"cat-chip" + (categoryFilter === c ? " active" : "")}
              style={
                categoryFilter === c && c !== "all"
                  ? { background: CATEGORY_STYLE[c].bg, borderColor: CATEGORY_STYLE[c].border, color: CATEGORY_STYLE[c].text }
                  : undefined
              }
              onClick={() => setCategoryFilter(c)}
            >
              {c === "all" ? "All" : c}
            </div>
          ))}
          {categoryFilter !== "all" && (
            <button className="btn-add" style={{ marginLeft: "auto" }} onClick={() => setGigMode(true)}>
              🎤 Gig Mode
            </button>
          )}
        </div>

        <div className="cat-filters">
          <span className="cat-filter-label">Language</span>
          {["all", ...LANGUAGES].map((l) => (
            <div
              key={l}
              className={"cat-chip" + (languageFilter === l ? " active" : "")}
              style={
                languageFilter === l && l !== "all"
                  ? { background: LANGUAGE_STYLE[l].bg, borderColor: LANGUAGE_STYLE[l].border, color: LANGUAGE_STYLE[l].text }
                  : undefined
              }
              onClick={() => setLanguageFilter(l)}
            >
              {l === "all" ? "All" : l}
            </div>
          ))}
        </div>

        <div className="cat-filters">
          <span className="cat-filter-label">Status</span>
          {["all", ...STATUS_ORDER].map((s) => (
            <div
              key={s}
              className={"cat-chip" + (statusFilter === s ? " active" : "")}
              style={
                statusFilter === s && s !== "all"
                  ? { background: STATUS_FILTER_STYLE[s].bg, borderColor: STATUS_FILTER_STYLE[s].border, color: STATUS_FILTER_STYLE[s].text }
                  : undefined
              }
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : STATUS_STYLE[s].label}
            </div>
          ))}
        </div>

        <div className="stats">
          <span><b>{stats.done}</b>/{stats.total} practiced</span>
          <span style={{ color: "var(--amber)" }}>{stats.once} once</span>
          <span style={{ color: "var(--red)" }}>{stats.need} to go</span>
        </div>
        <div className="bar"><div className="bar-fill" style={{ width: stats.pct + "%" }} /></div>

        <div className="section-label-row">
          <div className="section-label">{todayFilter ? "Today's Practice" : "Up Next"} ({queue.length})</div>
          {selected.size > 0 && (
            <div className="selected-count">{selected.size} selected</div>
          )}
        </div>
        <div className="queue">
          {queue.length === 0 && (
            <div className="empty">
              {todayFilter
                ? (todaySongIds.size === 0
                    ? "No songs scheduled for today yet. Add one from the calendar or tick \"Practicing today\" when adding/editing a song."
                    : "No more songs in today's queue — nice work.")
                : "No more songs in this queue."}
            </div>
          )}
          {queue.map((song, idx) => {
            const st = STATUS_STYLE[song.status];
            const isChecked = selected.has(song.id);
            return (
              <React.Fragment key={song.id}>
              <div
                className={
                  "ticket" +
                  (isChecked ? " checked" : "") +
                  (draggingId === song.id ? " dragging" : "") +
                  (dragOverId === song.id && draggingId != null && draggingId !== song.id ? " drag-over" : "")
                }
                data-song-id={song.id}
              >
                <span
                  className="drag-handle"
                  title="Drag to reorder"
                  onPointerDown={(e) => startDrag(e, song.id)}
                  onPointerMove={dragMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                >
                  <GripVertical size={16} />
                </span>
                <span
                  className={"checkbox" + (isChecked ? " on" : "")}
                  onClick={() => toggleSelect(song.id)}
                  title="Select for setlist"
                >
                  {isChecked && <Check size={11} strokeWidth={3} />}
                </span>
                <span className="ticket-order">{String(idx + 1).padStart(2, "0")}</span>
                <span className="ticket-status-dot" style={{ background: st.dot }} />
                <div className="ticket-body" onClick={() => pickAsNext(song.id)} title="Click to practice this next">
                  <div className="ticket-title">
                    {song.title}
                    {isPracticingToday(song.id) && <span className="today-badge">Today</span>}
                    {song.link && (
                      <a
                        href={song.link}
                        target="_blank"
                        rel="noreferrer"
                        className="ticket-link-icon"
                        onClick={(e) => e.stopPropagation()}
                        title="Lyrics / Chords"
                      >
                        <Link2 size={12} strokeWidth={2.2} />
                      </a>
                    )}
                  </div>
                  <div className="ticket-sub">
                    {song.artist} {activeSession === "all" ? "· " + song.session : ""}
                    {song.status === "Practiced" && song.practicedAt && ` · practiced ${timeAgo(song.practicedAt)}`}
                  </div>
                  {song.categories && song.categories.length > 0 && (
                    <div className="ticket-tags">
                      {song.categories.map((c) => (
                        <span
                          key={c}
                          className="cat-pill"
                          style={{ background: CATEGORY_STYLE[c].bg, borderColor: CATEGORY_STYLE[c].border, color: CATEGORY_STYLE[c].text }}
                        >
                          {c}
                          <X size={10} strokeWidth={3} onClick={(e) => { e.stopPropagation(); removeCategory(song.id, c); }} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="ticket-key">{song.key}</span>
                <span
                  className="langtag small"
                  style={{ color: LANGUAGE_STYLE[song.language].text, borderColor: LANGUAGE_STYLE[song.language].border, background: LANGUAGE_STYLE[song.language].bg }}
                  onClick={() => cycleLanguage(song.id, song.language)}
                  title="Click to change language"
                >
                  {song.language}
                </span>
                <span
                  className="ticket-status"
                  style={{ color: st.color, borderColor: st.color + "55" }}
                  onClick={() => advance(song.id, song.status)}
                  title="Click to advance status"
                >
                  {st.label}
                </span>
                <span
                  className="edit-btn"
                  onClick={(e) => { e.stopPropagation(); quickAddToCalendar(song.id); }}
                  title="Add to calendar"
                >
                  <CalendarPlus size={13} strokeWidth={2.2} />
                </span>
                {song.youtubeLink && (
                  <span
                    className="edit-btn play-btn"
                    onClick={(e) => { e.stopPropagation(); togglePlay(song.id); }}
                    title="Play reference track"
                  >
                    <Play size={13} strokeWidth={2.2} fill="currentColor" />
                  </span>
                )}
                <span
                  className="edit-btn"
                  onClick={(e) => { e.stopPropagation(); openEdit(song); }}
                  title="Edit song"
                >
                  <Pencil size={13} strokeWidth={2.2} />
                </span>
              </div>
              {playingId === song.id && getYouTubeEmbedUrl(song.youtubeLink) && (
                <div className="yt-embed-wrap ticket-embed">
                  <iframe
                    src={getYouTubeEmbedUrl(song.youtubeLink)}
                    title="Reference track"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              </React.Fragment>
            );
          })}
        </div>
        </>
        )}

        {view === "calendar" && (
          <div className="calendar-view">
            <div className="controls">
              <input
                className="search"
                placeholder="Search song, event, or location…"
                value={calendarSearch}
                onChange={(e) => setCalendarSearch(e.target.value)}
              />
            </div>
            <div className="section-label-row">
              <div className="section-label">Upcoming ({upcomingEvents.length})</div>
            </div>
            {upcomingEvents.length === 0 && (
              <div className="empty">
                {calendarSearch.trim() ? "No events match your search." : "No events yet. Add a practice day or a gig to get started."}
              </div>
            )}
            {upcomingEvents.map((ev) => {
              const isPast = ev.date < todayStr;
              const evSongs = allSongs.filter((s) => ev.songIds.includes(s.id));
              return (
                <div className={"event-row" + (isPast ? " past" : "")} key={ev.id}>
                  <div className="event-date">
                    <div className="event-day">{new Date(ev.date + "T00:00:00").getDate()}</div>
                    <div className="event-month">
                      {new Date(ev.date + "T00:00:00").toLocaleDateString(undefined, { month: "short" })}
                    </div>
                  </div>
                  <div className="event-body">
                    <div className="event-top">
                      <span className={"event-type-badge " + ev.type.toLowerCase()}>{ev.type}</span>
                      <span className="event-title">{ev.title}</span>
                    </div>
                    <div className="event-sub">
                      {formatEventDate(ev.date)}
                      {ev.location && ` · ${ev.location}`}
                      {" · "}{evSongs.length} song{evSongs.length !== 1 ? "s" : ""}
                    </div>
                    {evSongs.length > 0 && (
                      <div className="event-songs">
                        {evSongs.map((s) =>
                          s.link ? (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                              className="event-song-pill has-link"
                              key={s.id}
                              title="Open lyrics / chords"
                            >
                              <Link2 size={11} strokeWidth={2.2} /> {s.title}
                            </a>
                          ) : (
                            <span className="event-song-pill" key={s.id}>{s.title}</span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  <div className="event-actions">
                    <span className="edit-btn" onClick={() => openEditEvent(ev)} title="Edit event">
                      <Pencil size={13} strokeWidth={2.2} />
                    </span>
                    <span className="edit-btn" onClick={() => deleteEvent(ev.id)} title="Delete event">
                      <Trash2 size={13} strokeWidth={2.2} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span className="bulk-count">{selected.size} song{selected.size > 1 ? "s" : ""} selected</span>
          <div className="bulk-actions">
            <button className="bulk-btn wedding" onClick={() => assignCategories(selected, ["Wedding"])}>+ Wedding</button>
            <button className="bulk-btn restaurant" onClick={() => assignCategories(selected, ["Restaurant"])}>+ Restaurant</button>
            <button className="bulk-btn both" onClick={() => assignCategories(selected, CATEGORIES)}>+ Both</button>
            <button className="bulk-btn clear" onClick={clearSelection}>Clear</button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-backdrop" onClick={() => { setShowAdd(false); setConfirmDupeAdd(false); }}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={addSong}>
            <div className="modal-head">
              <span>Add a Song</span>
              <span className="modal-close" onClick={() => { setShowAdd(false); setConfirmDupeAdd(false); }}><X size={16} /></span>
            </div>
            <label className="field-label">Title</label>
            <input
              className="field"
              autoFocus
              value={form.title}
              onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setConfirmDupeAdd(false); }}
              placeholder="Song title"
            />
            <label className="field-label">Artist</label>
            <input
              className="field"
              value={form.artist}
              onChange={(e) => { setForm((f) => ({ ...f, artist: e.target.value })); setConfirmDupeAdd(false); }}
              placeholder="Artist"
            />
            {dupeMatches.length > 0 && (
              <div
                style={{
                  marginTop: "-4px",
                  marginBottom: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(239,68,68,0.4)",
                  background: "rgba(239,68,68,0.08)",
                  fontSize: "13px",
                  lineHeight: 1.4,
                  color: "var(--ink, #e8e6e3)",
                }}
              >
                Already in your list: {dupeMatches.slice(0, 3).map((s) => `${s.title} — ${s.artist}`).join(", ")}
                {dupeMatches.length > 3 ? `, +${dupeMatches.length - 3} more` : ""}.
                {confirmDupeAdd
                  ? " Tap \"Add Song\" again to add it anyway."
                  : " Adding again will create a duplicate."}
              </div>
            )}
            <label className="field-label">Singer (who's singing it)</label>
            <input
              className="field"
              value={form.singer}
              onChange={(e) => setForm((f) => ({ ...f, singer: e.target.value }))}
              placeholder="e.g. Kasun"
            />
            <div className="field-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Key</label>
                <input
                  className="field"
                  value={form.key}
                  onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                  placeholder="e.g. G"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Language</label>
                <select
                  className="field"
                  value={form.language}
                  onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Session</label>
                <select
                  className="field"
                  value={form.session}
                  onChange={(e) => setForm((f) => ({ ...f, session: e.target.value }))}
                >
                  {sessions.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="field-label">Remark (optional)</label>
            <textarea
              className="field"
              rows={2}
              value={form.remark}
              onChange={(e) => setForm((f) => ({ ...f, remark: e.target.value }))}
              placeholder="e.g. Capo on 2nd fret, transpose after chorus…"
            />
            <label className="field-label">Lyrics / Chords Link (optional)</label>
            <input
              className="field"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="https://…"
            />
            <label className="field-label">YouTube Link (optional)</label>
            <input
              className="field"
              value={form.youtubeLink}
              onChange={(e) => { setForm((f) => ({ ...f, youtubeLink: e.target.value })); setAddDurationStatus(null); }}
              onBlur={() => {
                if (form.youtubeLink) {
                  detectYouTubeDuration(form.youtubeLink, setAddDurationStatus, (val) => setForm((f) => ({ ...f, duration: val })));
                }
              }}
              placeholder="https://youtube.com/watch?v=…"
            />
            <div className="field-label-row">
              <span className="field-label" style={{ margin: 0 }}>Duration (optional)</span>
              {form.youtubeLink && (
                <button
                  type="button"
                  className="detect-btn"
                  disabled={addDurationStatus === "loading"}
                  onClick={() => detectYouTubeDuration(form.youtubeLink, setAddDurationStatus, (val) => setForm((f) => ({ ...f, duration: val })))}
                >
                  {addDurationStatus === "loading" ? <Loader2 size={11} className="spin" /> : <Wand2 size={11} />}
                  {addDurationStatus === "loading" ? "Detecting…" : "Auto-detect"}
                </button>
              )}
            </div>
            <input
              className="field"
              value={form.duration}
              onChange={(e) => { setForm((f) => ({ ...f, duration: e.target.value })); setAddDurationStatus(null); }}
              placeholder="mm:ss, e.g. 3:45"
            />
            {addDurationStatus === "done" && <div className="detect-status success">Duration detected from YouTube.</div>}
            {addDurationStatus === "error" && <div className="detect-status error">Couldn't detect duration — enter it manually.</div>}
            {addDurationStatus === "nokey" && (
              <div className="detect-status">
                Add a YouTube API key in{" "}
                <span className="detect-link" onClick={() => { setApiKeyDraft(youtubeApiKey); setShowApiSettings(true); }}>Settings</span>{" "}
                to auto-detect duration.
              </div>
            )}
            <label className="field-check">
              <input
                type="checkbox"
                checked={form.practicingToday}
                onChange={(e) => setForm((f) => ({ ...f, practicingToday: e.target.checked }))}
              />
              Practicing today
            </label>
            <label className="field-label">Setlist (optional)</label>
            <div className="field-cats">
              {CATEGORIES.map((c) => (
                <div
                  key={c}
                  className={"cat-chip" + (form.categories.includes(c) ? " active" : "")}
                  style={
                    form.categories.includes(c)
                      ? { background: CATEGORY_STYLE[c].bg, borderColor: CATEGORY_STYLE[c].border, color: CATEGORY_STYLE[c].text }
                      : undefined
                  }
                  onClick={() => toggleFormCategory(c)}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => { setShowAdd(false); setConfirmDupeAdd(false); }}>Cancel</button>
              <button type="submit" className="btn-primary">Add Song</button>
            </div>
          </form>
        </div>
      )}

      {editForm && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={saveEdit}>
            <div className="modal-head">
              <span>Edit Song</span>
              <span className="modal-close" onClick={closeEdit}><X size={16} /></span>
            </div>
            <label className="field-label">Title</label>
            <input
              className="field"
              autoFocus
              value={editForm.title}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Song title"
            />
            <label className="field-label">Artist</label>
            <input
              className="field"
              value={editForm.artist}
              onChange={(e) => setEditForm((f) => ({ ...f, artist: e.target.value }))}
              placeholder="Artist"
            />
            <label className="field-label">Singer (who's singing it)</label>
            <input
              className="field"
              value={editForm.singer}
              onChange={(e) => setEditForm((f) => ({ ...f, singer: e.target.value }))}
              placeholder="e.g. Kasun"
            />
            <div className="field-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Key</label>
                <input
                  className="field"
                  value={editForm.key}
                  onChange={(e) => setEditForm((f) => ({ ...f, key: e.target.value }))}
                  placeholder="e.g. G"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Language</label>
                <select
                  className="field"
                  value={editForm.language}
                  onChange={(e) => setEditForm((f) => ({ ...f, language: e.target.value }))}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Session</label>
                <select
                  className="field"
                  value={editForm.session}
                  onChange={(e) => setEditForm((f) => ({ ...f, session: e.target.value }))}
                >
                  {sessions.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="field-label">Remark (optional)</label>
            <textarea
              className="field"
              rows={2}
              value={editForm.remark}
              onChange={(e) => setEditForm((f) => ({ ...f, remark: e.target.value }))}
              placeholder="e.g. Capo on 2nd fret, transpose after chorus…"
            />
            <label className="field-label">Lyrics / Chords Link (optional)</label>
            <input
              className="field"
              value={editForm.link}
              onChange={(e) => setEditForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="https://…"
            />
            <label className="field-label">YouTube Link (optional)</label>
            <input
              className="field"
              value={editForm.youtubeLink}
              onChange={(e) => { setEditForm((f) => ({ ...f, youtubeLink: e.target.value })); setEditDurationStatus(null); }}
              onBlur={() => {
                if (editForm.youtubeLink) {
                  detectYouTubeDuration(editForm.youtubeLink, setEditDurationStatus, (val) => setEditForm((f) => ({ ...f, duration: val })));
                }
              }}
              placeholder="https://youtube.com/watch?v=…"
            />
            <div className="field-label-row">
              <span className="field-label" style={{ margin: 0 }}>Duration (optional)</span>
              {editForm.youtubeLink && (
                <button
                  type="button"
                  className="detect-btn"
                  disabled={editDurationStatus === "loading"}
                  onClick={() => detectYouTubeDuration(editForm.youtubeLink, setEditDurationStatus, (val) => setEditForm((f) => ({ ...f, duration: val })))}
                >
                  {editDurationStatus === "loading" ? <Loader2 size={11} className="spin" /> : <Wand2 size={11} />}
                  {editDurationStatus === "loading" ? "Detecting…" : "Auto-detect"}
                </button>
              )}
            </div>
            <input
              className="field"
              value={editForm.duration}
              onChange={(e) => { setEditForm((f) => ({ ...f, duration: e.target.value })); setEditDurationStatus(null); }}
              placeholder="mm:ss, e.g. 3:45"
            />
            {editDurationStatus === "done" && <div className="detect-status success">Duration detected from YouTube.</div>}
            {editDurationStatus === "error" && <div className="detect-status error">Couldn't detect duration — enter it manually.</div>}
            {editDurationStatus === "nokey" && (
              <div className="detect-status">
                Add a YouTube API key in{" "}
                <span className="detect-link" onClick={() => { setApiKeyDraft(youtubeApiKey); setShowApiSettings(true); }}>Settings</span>{" "}
                to auto-detect duration.
              </div>
            )}
            <label className="field-check">
              <input
                type="checkbox"
                checked={editForm.practicingToday}
                onChange={(e) => setEditForm((f) => ({ ...f, practicingToday: e.target.checked }))}
              />
              Practicing today
            </label>
            <label className="field-label">Setlist (optional)</label>
            <div className="field-cats">
              {CATEGORIES.map((c) => (
                <div
                  key={c}
                  className={"cat-chip" + (editForm.categories.includes(c) ? " active" : "")}
                  style={
                    editForm.categories.includes(c)
                      ? { background: CATEGORY_STYLE[c].bg, borderColor: CATEGORY_STYLE[c].border, color: CATEGORY_STYLE[c].text }
                      : undefined
                  }
                  onClick={() => toggleEditCategory(c)}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-danger" onClick={deleteSong}>
                <Trash2 size={13} strokeWidth={2.2} /> Delete
              </button>
              <div style={{ flex: 1 }} />
              <button type="button" className="btn-ghost" onClick={closeEdit}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {showAddEvent && (
        <div className="modal-backdrop" onClick={() => setShowAddEvent(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={addEvent}>
            <div className="modal-head">
              <span>Add Event</span>
              <span className="modal-close" onClick={() => setShowAddEvent(false)}><X size={16} /></span>
            </div>
            <div className="field-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Date</label>
                <input
                  className="field"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Type</label>
                <select
                  className="field"
                  value={eventForm.type}
                  onChange={(e) => setEventForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="Practice">Practice</option>
                  <option value="Gig">Gig</option>
                </select>
              </div>
            </div>
            <label className="field-label">Title (optional)</label>
            <input
              className="field"
              value={eventForm.title}
              onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Full band rehearsal"
            />
            <label className="field-label">Location (optional)</label>
            <input
              className="field"
              value={eventForm.location}
              onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Studio 3, or the venue name"
            />
            <label className="field-label">Remark / Note (optional)</label>
            <textarea
              className="field"
              rows={2}
              value={eventForm.note}
              onChange={(e) => setEventForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="e.g. Bring the capo, focus on the bridge section"
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
            <label className="field-label">Songs (optional)</label>
            <input
              className="field"
              value={eventSongSearch}
              onChange={(e) => setEventSongSearch(e.target.value)}
              placeholder="Search song or artist…"
              style={{ marginBottom: "8px" }}
            />
            <div className="event-song-picker">
              {eventSongOptions.length === 0 && <div className="event-song-empty">No songs match.</div>}
              {eventSongOptions.map((s) => (
                <div
                  key={s.id}
                  className={"event-song-option" + (eventForm.songIds.includes(s.id) ? " active" : "")}
                  onClick={() => toggleEventSong(s.id)}
                >
                  <span className={"checkbox" + (eventForm.songIds.includes(s.id) ? " on" : "")}>
                    {eventForm.songIds.includes(s.id) && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span>{s.title} <span className="event-song-artist">· {s.artist}</span>{s.link && <Link2 size={10} strokeWidth={2.2} className="event-song-link-dot" />}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setShowAddEvent(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add Event</button>
            </div>
          </form>
        </div>
      )}

      {editEventForm && (
        <div className="modal-backdrop" onClick={closeEditEvent}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={saveEditEvent}>
            <div className="modal-head">
              <span>Edit Event</span>
              <span className="modal-close" onClick={closeEditEvent}><X size={16} /></span>
            </div>
            <div className="field-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">Date</label>
                <input
                  className="field"
                  type="date"
                  value={editEventForm.date}
                  onChange={(e) => setEditEventForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Type</label>
                <select
                  className="field"
                  value={editEventForm.type}
                  onChange={(e) => setEditEventForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="Practice">Practice</option>
                  <option value="Gig">Gig</option>
                </select>
              </div>
            </div>
            <label className="field-label">Title (optional)</label>
            <input
              className="field"
              value={editEventForm.title}
              onChange={(e) => setEditEventForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Full band rehearsal"
            />
            <label className="field-label">Location (optional)</label>
            <input
              className="field"
              value={editEventForm.location}
              onChange={(e) => setEditEventForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Studio 3, or the venue name"
            />
            <label className="field-label">Remark / Note (optional)</label>
            <textarea
              className="field"
              rows={2}
              value={editEventForm.note}
              onChange={(e) => setEditEventForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="e.g. Bring the capo, focus on the bridge section"
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
            <label className="field-label">Songs (optional)</label>
            <input
              className="field"
              value={eventSongSearch}
              onChange={(e) => setEventSongSearch(e.target.value)}
              placeholder="Search song or artist…"
              style={{ marginBottom: "8px" }}
            />
            <div className="event-song-picker">
              {eventSongOptions.length === 0 && <div className="event-song-empty">No songs match.</div>}
              {eventSongOptions.map((s) => (
                <div
                  key={s.id}
                  className={"event-song-option" + (editEventForm.songIds.includes(s.id) ? " active" : "")}
                  onClick={() => toggleEditEventSong(s.id)}
                >
                  <span className={"checkbox" + (editEventForm.songIds.includes(s.id) ? " on" : "")}>
                    {editEventForm.songIds.includes(s.id) && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span>{s.title} <span className="event-song-artist">· {s.artist}</span>{s.link && <Link2 size={10} strokeWidth={2.2} className="event-song-link-dot" />}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-danger" onClick={() => { deleteEvent(editingEventId); closeEditEvent(); }}>
                <Trash2 size={13} strokeWidth={2.2} /> Delete
              </button>
              <div style={{ flex: 1 }} />
              <button type="button" className="btn-ghost" onClick={closeEditEvent}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {showApiSettings && (
        <div className="modal-backdrop" onClick={() => setShowApiSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span>YouTube Auto-Duration</span>
              <span className="modal-close" onClick={() => setShowApiSettings(false)}><X size={16} /></span>
            </div>
            <p className="settings-copy">
              Paste a YouTube API key to auto-fill a song's duration from its YouTube link. The key is stored
              only on this device (browser local storage) and is never sent anywhere except Google's API.
            </p>
            <p className="settings-copy">
              Get a free key from the{" "}
              <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">
                Google Cloud Console
              </a>{" "}
              — enable "YouTube Data API v3" on a project, then create an API key under Credentials.
            </p>
            <label className="field-label">YouTube Data API Key</label>
            <input
              className="field"
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              placeholder="AIza…"
              autoFocus
            />
            <div className="modal-actions">
              {youtubeApiKey && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => { setApiKeyDraft(""); setYoutubeApiKey(""); try { localStorage.removeItem("nextup_youtube_api_key"); } catch {} setShowApiSettings(false); }}
                >
                  <Trash2 size={13} strokeWidth={2.2} /> Remove Key
                </button>
              )}
              <div style={{ flex: 1 }} />
              <button type="button" className="btn-ghost" onClick={() => setShowApiSettings(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={saveYoutubeApiKey}>Save</button>
            </div>
          </div>
        </div>
      )}

      {gigMode && (
        <div className="gig-overlay">
          <div className="gig-head no-print">
            <div>{categoryFilter} Setlist · {filteredSongs.length} songs</div>
            <div>
              <button className="btn-add" onClick={() => window.print()}>
                <Printer size={14} /> Print
              </button>
              <button className="btn-add" onClick={() => setGigMode(false)}>Exit</button>
            </div>
          </div>
          <div className="gig-runtime">
            Total runtime: {formatDuration(filteredSongs.reduce((sum, s) => sum + (s.duration || 0), 0))}
          </div>
          <div className="gig-list">
            {filteredSongs.map((s, i) => (
              <div className="gig-row" key={s.id}>
                <span className="gig-num">{i + 1}</span>
                <div>
                  <div className="gig-title">{s.title}</div>
                  <div className="gig-sub">
                    {s.artist} · Key {s.key}
                    {s.duration ? ` · ${formatDuration(s.duration)}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
