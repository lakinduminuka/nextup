import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, X, Check, Pencil, Trash2 } from "lucide-react";
import { supabase } from "./supabaseClient";

// Every browser/device shares this single row in the "nextup_state" table.
const STATE_ROW_ID = 1;

const RAW_SESSIONS = [{"name": "First Session", "songs": [{"id": 0, "title": "Oba dutu e mul dine", "artist": "Gypsies", "key": "F", "status": "Practiced", "remark": "Tranceposed to G after last Chorus"}, {"id": 1, "title": "Sanasennam Ma", "artist": "Senaka Batagoda", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 2, "title": "Dagakara Hadakari", "artist": "Various Artists", "key": "Bb", "status": "Need to Practice", "remark": null}, {"id": 3, "title": "Unmadini Medley", "artist": "BNS", "key": "C", "status": "Practiced Once", "remark": null}, {"id": 4, "title": "Perfect", "artist": "Ed Sheeran", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 5, "title": "Hitha Hiri Watunado", "artist": "Bachi Susan", "key": "B", "status": "Practiced Once", "remark": null}, {"id": 6, "title": "Tharuka Niwa Dura", "artist": "Ajith Bandara", "key": "Em", "status": "Practiced Once", "remark": null}, {"id": 7, "title": "Soduru Atheethaya", "artist": "TM Jayarathne", "key": "F", "status": "Need to Practice", "remark": null}, {"id": 8, "title": "Anganawo", "artist": "Rookantha Gunathilake", "key": "F", "status": "Practiced Once", "remark": null}, {"id": 9, "title": "Atha Ran Wiman", "artist": "Priya Sooriayasena", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 10, "title": "Sansarini", "artist": "Yasas Madagedara", "key": "Ab", "status": "Need to Practice", "remark": null}, {"id": 11, "title": "Eka dawasaka", "artist": "Sandeep Jayalath", "key": "Ebm", "status": "Need to Practice", "remark": null}, {"id": 12, "title": "Aadaree kiyanna (Shenal)", "artist": "Piyath Rajapakse", "key": "E", "status": "Need to Practice", "remark": null}, {"id": 13, "title": "Unmada prema geeya", "artist": "BNS", "key": "C", "status": "Need to Practice", "remark": null}, {"id": 14, "title": "Thawa Dawasak", "artist": "Keerthi Pasquel", "key": "E", "status": "Need to Practice", "remark": null}, {"id": 15, "title": "Ra ahase", "artist": "Billy Fernando", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 16, "title": "Oba kamathinam Mata kiyanna", "artist": "Gypsies", "key": "F", "status": "Need to Practice", "remark": null}, {"id": 17, "title": "Raya Pahan Kala", "artist": "nadeeka jayawardana", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 18, "title": "Mandaram Kathawe", "artist": "Wasthi", "key": "Dm", "status": "Need to Practice", "remark": null}, {"id": 19, "title": "Marunu hithe", "artist": "Wasthi", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 20, "title": "Mathake Hasaral", "artist": "Dushyanth Weeraman", "key": "Bbm", "status": "Need to Practice", "remark": null}]}, {"name": "Second Session", "songs": [{"id": 21, "title": "Ran wan mal dam", "artist": "Centigratez", "key": "Dm", "status": "Need to Practice", "remark": null}, {"id": 22, "title": "Tiken Tika", "artist": "Daddy", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 23, "title": "Chandrayan Pidu", "artist": "Daddy", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 24, "title": "Sarath Sande", "artist": "Charith Abesinghe", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 25, "title": "Dasa Piyagath kala", "artist": "Clarence Wijewardana", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 26, "title": "Mal Madahasa Medley", "artist": "Various Artist", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 27, "title": "Sili Sili Seethala", "artist": "Raj Seneviratne", "key": "Bb", "status": "Need to Practice", "remark": null}, {"id": 28, "title": "Nurawani", "artist": "Wasthi", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 29, "title": "Rahasin Awith", "artist": "Sureni De mel", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 30, "title": "Malsara", "artist": "Chamara Ranawaka", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 31, "title": "Sanda Basa giya thana na", "artist": "Rookantha", "key": "Bbm", "status": "Need to Practice", "remark": null}, {"id": 32, "title": "Api aye hamu nowena", "artist": "Sanka dineth", "key": "F#m", "status": "Need to Practice", "remark": null}, {"id": 33, "title": "Mage manik apsarawi", "artist": "Tharindu Arsecularathna", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 34, "title": "Jeththu None", "artist": "Dushyanth Weeraman", "key": "\u2014", "status": "Need to Practice", "remark": null}, {"id": 35, "title": "Nelum Wilen", "artist": "Dushyanth Weeraman", "key": "\u2014", "status": "Need to Practice", "remark": null}, {"id": 36, "title": "Ratakin eha", "artist": "Priya Sooriyasena", "key": "A", "status": "Need to Practice", "remark": null}, {"id": 37, "title": "Mathakayan Obe", "artist": "Chamara Weerasinghe", "key": "Bbm", "status": "Need to Practice", "remark": null}, {"id": 38, "title": "Ninda Noyana", "artist": "Ranindu", "key": "Ebm", "status": "Need to Practice", "remark": null}, {"id": 39, "title": "Hinahenne mang", "artist": "Ranindu", "key": "Cm", "status": "Need to Practice", "remark": null}]}, {"name": "Third Session", "songs": [{"id": 40, "title": "Sumihiri pane", "artist": "Desmond De Silva", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 41, "title": "Rookantha Medley", "artist": "Unknown", "key": "\u2014", "status": "Need to Practice", "remark": null}, {"id": 42, "title": "Sawandari", "artist": "Sangeeth Wijesuriya", "key": "G", "status": "Need to Practice", "remark": null}, {"id": 43, "title": "Mata sithanna ba Medley", "artist": "Unknown", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 44, "title": "Radio Active/Roo Sara", "artist": "Unknown", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 45, "title": "Thaththa mata anapu tokka", "artist": "Gypsies", "key": "Eb", "status": "Need to Practice", "remark": null}, {"id": 46, "title": "Ulath ekai Pilath ekai", "artist": "Rookantha", "key": "D", "status": "Need to Practice", "remark": null}, {"id": 47, "title": "Layla", "artist": "Marianz", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 48, "title": "Bombe Motai", "artist": "Wasthi", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 49, "title": "Sudu Ammiya", "artist": "Wasthi", "key": "Em", "status": "Need to Practice", "remark": null}, {"id": 50, "title": "Yami Pain Yami", "artist": "Wasthi", "key": "Bm", "status": "Need to Practice", "remark": null}, {"id": 51, "title": "Ingi Marana Tharu Rana", "artist": "K.Sujeewa", "key": "Ebm", "status": "Need to Practice", "remark": null}, {"id": 52, "title": "Me Diaganthaye", "artist": "Rookantha Gunathilaka", "key": "E", "status": "Need to Practice", "remark": null}, {"id": 53, "title": "Thrailoka", "artist": "Shane Zing", "key": "Am", "status": "Need to Practice", "remark": null}, {"id": 54, "title": "Sanwedana", "artist": "Shane Zing", "key": "B", "status": "Need to Practice", "remark": null}]}];

// give every seed song an (empty) categories array to tag it into setlists,
// and default the language to Sinhala since that's what the whole sheet is
RAW_SESSIONS.forEach((s) => s.songs.forEach((song) => { song.categories = []; song.language = "Sinhala"; }));
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

function nextStatus(s) {
  const i = STATUS_ORDER.indexOf(s);
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length];
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
  const [query, setQuery] = useState("");
  const [pulse, setPulse] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [manualId, setManualId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [form, setForm] = useState({ title: "", artist: "", key: "", session: RAW_SESSIONS[0].name, remark: "", language: "Sinhala", categories: [] });
  const heroRef = useRef(null);

  const allSongs = useMemo(() => flatten(sessions), [sessions]);

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
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allSongs, activeSession, categoryFilter, languageFilter, statusFilter, query]);

  // Auto-pick (or re-validate) which song is "next" — but only when the
  // current pick becomes invalid (deleted, or no longer in the active
  // session/filter). Re-running this on every status change was what made
  // the hero card jump to a different song right after marking one
  // "Practiced Once" — this keeps it pinned to the song you're looking at.
  useEffect(() => {
    const pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
    const stillValid = manualId != null && pool.some((s) => s.id === manualId);
    if (!stillValid) {
      const pick =
        pool.find((s) => s.status === "Need to Practice") ||
        pool.find((s) => s.status === "Practiced Once") ||
        pool[0] ||
        null;
      setManualId(pick ? pick.id : null);
    }
  }, [allSongs, activeSession]);

  const nextSong = useMemo(() => {
    const pool = activeSession === "all" ? allSongs : allSongs.filter((s) => s.session === activeSession);
    return pool.find((s) => s.id === manualId) || null;
  }, [allSongs, activeSession, manualId]);

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
        songs: s.songs.map((song) => (song.id === id ? { ...song, status } : song)),
      }))
    );
  }

  function advance(id, current) {
    updateStatus(id, nextStatus(current));
    setPulse(true);
    setTimeout(() => setPulse(false), 420);
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
    const newSong = {
      id: NEXT_ID++,
      title: form.title.trim(),
      artist: form.artist.trim() || "Unknown",
      key: form.key.trim() || "—",
      status: "Need to Practice",
      remark: form.remark.trim() || null,
      language: form.language,
      categories: form.categories,
    };
    setSessions((prev) =>
      prev.map((s) => (s.name === form.session ? { ...s, songs: [...s.songs, newSong] } : s))
    );
    setForm({ title: "", artist: "", key: "", session: form.session, remark: "", language: "Sinhala", categories: [] });
    setShowAdd(false);
  }

  function openEdit(song) {
    setEditingId(song.id);
    setEditForm({
      title: song.title,
      artist: song.artist,
      key: song.key,
      session: song.session,
      remark: song.remark || "",
      language: song.language,
      categories: [...(song.categories || [])],
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
        key: editForm.key.trim() || "—",
        remark: editForm.remark.trim() || null,
        language: editForm.language,
        categories: editForm.categories,
      };
      return prev.map((s) => {
        const withoutSong = s.songs.filter((sg) => sg.id !== editingId);
        return s.name === editForm.session ? { ...s, songs: [...withoutSong, updated] } : { ...s, songs: withoutSong };
      });
    });
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
          margin-bottom: 20px;
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
          background: var(--bg-alt);
          border: 1px solid var(--card-line);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
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
          gap: 10px;
          margin-top: 18px;
        }

        @media (max-width: 600px) {
  .ticket-sub { display: none; }
  .hero { padding: 30px 18px 24px; }
  .topbar { align-items: center; }
  .ticket { gap: 8px; padding: 12px 10px; }
  .ticket-order { display: none; }
  .ticket-key { display: none; }
  .langtag.small { display: none; }
  .ticket-status { padding: 4px 6px; font-size: 9px; }
  .ticket-title { font-size: 14px; }
}
      `}</style>

      <div className="wrap">
        <div className="topbar">
          <div>
            <div className="brand">NEXT<span>UP</span></div>
            <div className="brand-sub">
              Practice Queue · {sessions.length} Sessions
              {!loaded && " · Syncing…"}
              {syncError && ` · ${syncError}`}
            </div>
          </div>
          <button className="btn-add" onClick={() => setShowAdd(true)}>
            <Plus size={15} strokeWidth={2.5} /> Add Song
          </button>
        </div>

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
              <h1 className="hero-title">{nextSong.title}</h1>
              <div className="hero-artist">{nextSong.artist}</div>
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
          <div className="section-label">Up Next ({queue.length})</div>
          {selected.size > 0 && (
            <div className="selected-count">{selected.size} selected</div>
          )}
        </div>
        <div className="queue">
          {queue.length === 0 && <div className="empty">No more songs in this queue.</div>}
          {queue.map((song, idx) => {
            const st = STATUS_STYLE[song.status];
            const isChecked = selected.has(song.id);
            return (
              <div className={"ticket" + (isChecked ? " checked" : "")} key={song.id}>
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
                  <div className="ticket-title">{song.title}</div>
                  <div className="ticket-sub">
                    {song.artist} {activeSession === "all" ? "· " + song.session : ""}
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
                  onClick={(e) => { e.stopPropagation(); openEdit(song); }}
                  title="Edit song"
                >
                  <Pencil size={13} strokeWidth={2.2} />
                </span>
              </div>
            );
          })}
        </div>
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
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={addSong}>
            <div className="modal-head">
              <span>Add a Song</span>
              <span className="modal-close" onClick={() => setShowAdd(false)}><X size={16} /></span>
            </div>
            <label className="field-label">Title</label>
            <input
              className="field"
              autoFocus
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Song title"
            />
            <label className="field-label">Artist</label>
            <input
              className="field"
              value={form.artist}
              onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))}
              placeholder="Artist"
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
              <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
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
    </div>
  );
}
