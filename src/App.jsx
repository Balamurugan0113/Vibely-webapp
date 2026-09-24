import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home, Search, Library, Clock, User, PlusCircle, Play, Pause, SkipBack, SkipForward, Volume2, Trash2, Edit } from 'lucide-react';
import { supabase } from './supabaseClient';

export const PlayerContext = React.createContext();

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    fetchSongs();
    const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(savedHistory);
  }, []);

  const fetchSongs = async () => {
    const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (data) setSongs(data);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setQueue(songs);
    // Add to history
    const newHistory = [song, ...history.filter(s => s.id !== song.id)].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  const nextSong = () => {
    if (!currentSong) return;
    const idx = queue.findIndex(s => s.id === currentSong.id);
    if (idx !== -1 && idx < queue.length - 1) {
      playSong(queue[idx + 1]);
    }
  };

  const prevSong = () => {
    if (!currentSong) return;
    const idx = queue.findIndex(s => s.id === currentSong.id);
    if (idx > 0) {
      playSong(queue[idx - 1]);
    }
  };

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, setIsPlaying, nextSong, prevSong, songs, history, fetchSongs }}>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/manage-songs" element={<ManageSongsPage />} />
          </Routes>
        </div>
        <Player />
      </div>
    </PlayerContext.Provider>
  );
}

function Sidebar() {
  return (
    <div className="sidebar glass">
      <h2>VIBELY</h2>
      <div className="nav-links">
        <Link to="/" className="nav-item"><Home size={20} /> Home</Link>
        <Link to="/search" className="nav-item"><Search size={20} /> Search</Link>
        <Link to="/library" className="nav-item"><Library size={20} /> Library</Link>
        <Link to="/history" className="nav-item"><Clock size={20} /> History</Link>
        <Link to="/profile" className="nav-item"><User size={20} /> Profile</Link>
        <Link to="/admin" className="nav-item" style={{ marginTop: '20px', color: '#a0a0a0' }}><PlusCircle size={20} /> Add Song</Link>
        <Link to="/manage-songs" className="nav-item" style={{ color: '#a0a0a0' }}><Edit size={20} /> Manage Songs</Link>
      </div>
    </div>
  );
}

function HomePage() {
  const { songs, playSong } = React.useContext(PlayerContext);
  return (
    <div>
      <div className="carousel">
        <h1>Discover New Music</h1>
      </div>
      <h2 style={{ marginBottom: '20px' }}>All Songs</h2>
      <div className="song-grid">
        {songs.map(song => (
          <div key={song.id} className="song-card glass" onClick={() => playSong(song)}>
            <img src={song.cover_url} alt={song.title} className="song-cover" />
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPage() {
  const { songs, playSong } = React.useContext(PlayerContext);
  const [query, setQuery] = useState('');

  const filtered = songs.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        className="search-input"
        placeholder="Search for songs, artists..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="song-grid">
        {filtered.map(song => (
          <div key={song.id} className="song-card glass" onClick={() => playSong(song)}>
            <img src={song.cover_url} alt={song.title} className="song-cover" />
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LibraryPage() {
  // Simplified for beginner project: just show all songs as library
  const { songs, playSong } = React.useContext(PlayerContext);
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Your Library</h2>
      <div className="song-grid">
        {songs.slice(0, 5).map(song => (
          <div key={song.id} className="song-card glass" onClick={() => playSong(song)}>
            <img src={song.cover_url} alt={song.title} className="song-cover" />
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryPage() {
  const { history, playSong } = React.useContext(PlayerContext);
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Recently Played</h2>
      <div className="song-grid">
        {history.map(song => (
          <div key={song.id} className="song-card glass" onClick={() => playSong(song)}>
            <img src={song.cover_url} alt={song.title} className="song-cover" />
            <div className="song-title">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="glass" style={{ padding: '40px', maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
      <User size={64} style={{ color: 'var(--accent)', marginBottom: '20px' }} />
      <h2>Music Fan</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Ready to vibe.</p>
    </div>
  );
}

function AdminPage() {
  const { fetchSongs } = React.useContext(PlayerContext);
  const [form, setForm] = useState({ title: '', artist: '', album: '', cover_url: '', audio_url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('songs').insert([form]);
    if (error) alert(error.message);
    else {
      alert('Song added successfully!');
      setForm({ title: '', artist: '', album: '', cover_url: '', audio_url: '' });
      fetchSongs();
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Admin Dashboard - Add Song</h2>
      <form className="admin-form glass" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Song Title</label>
          <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Artist</label>
          <input required type="text" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Album</label>
          <input type="text" value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Cover Image URL</label>
          <input required type="text" value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Cloudinary Audio URL</label>
          <input required type="text" value={form.audio_url} onChange={e => setForm({ ...form, audio_url: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary">Add Song</button>
      </form>
    </div>
  );
}

function ManageSongsPage() {
  const { songs, fetchSongs } = React.useContext(PlayerContext);
  const [editingSong, setEditingSong] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('songs').update({
      title: editingSong.title,
      artist: editingSong.artist,
      album: editingSong.album,
      cover_url: editingSong.cover_url,
      audio_url: editingSong.audio_url
    }).eq('id', editingSong.id);

    if (error) alert(error.message);
    else {
      alert('Song updated successfully!');
      setEditingSong(null);
      fetchSongs();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchSongs();
    }
  };

  if (editingSong) {
    return (
      <div>
        <h2 style={{ marginBottom: '20px' }}>Edit Song</h2>
        <form className="admin-form glass" onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Song Title</label>
            <input required type="text" value={editingSong.title} onChange={e => setEditingSong({ ...editingSong, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Artist</label>
            <input required type="text" value={editingSong.artist} onChange={e => setEditingSong({ ...editingSong, artist: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Album</label>
            <input type="text" value={editingSong.album || ''} onChange={e => setEditingSong({ ...editingSong, album: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Cover Image URL</label>
            <input required type="text" value={editingSong.cover_url} onChange={e => setEditingSong({ ...editingSong, cover_url: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Cloudinary Audio URL</label>
            <input required type="text" value={editingSong.audio_url} onChange={e => setEditingSong({ ...editingSong, audio_url: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">Update Song</button>
          <button type="button" className="btn-primary" style={{ background: 'var(--bg-panel)', color: 'var(--text-main)', marginTop: '10px' }} onClick={() => setEditingSong(null)}>Cancel Edit</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Manage Songs</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {songs.map(song => (
          <div key={song.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={song.cover_url} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{song.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{song.artist}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-icon" onClick={() => setEditingSong(song)}><Edit size={20} /></button>
              <button type="button" className="btn-icon" onClick={() => handleDelete(song.id)} style={{ color: '#ff4444' }}><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Player() {
  const { currentSong, isPlaying, setIsPlaying, nextSong, prevSong } = React.useContext(PlayerContext);
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log('Audio play error', e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(total);
    setProgress((current / total) * 100 || 0);
  };

  const handleProgressClick = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) return null;

  return (
    <div className="player-bar">
      <audio
        ref={audioRef}
        src={currentSong.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />

      <div className="player-info">
        <img src={currentSong.cover_url} alt="" className="player-cover" />
        <div>
          <div style={{ fontWeight: 600 }}>{currentSong.title}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentSong.artist}</div>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button className="btn-icon" onClick={prevSong}><SkipBack size={24} /></button>
          <button className="btn-icon" onClick={togglePlay} style={{ transform: 'scale(1.2)' }}>
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button className="btn-icon" onClick={nextSong}><SkipForward size={24} /></button>
        </div>
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <Volume2 size={20} style={{ color: 'var(--text-muted)' }} />
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
}
