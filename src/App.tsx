import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'

interface Session {
  patient_name: string;
  date: string;
  engagement: number;
  notes: string;
}

function App() {
  const [form, setForm] = useState<Session>({
    patient_name: '',
    date: '',
    engagement: 3,
    notes: ''
  });

  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = async () => {
    const res = await axios.get("http://localhost:8000/sessions");
    setSessions(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/sessions", form);
    fetchSessions();
  };

  const handleDelete = async (index: number) => {
    try {
      await axios.delete(`http://localhost:8000/sessions/${index}`);
      // After successful delete, refresh the sessions state:
      setSessions(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };


  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/sessions')
      // Handle successful response
    } catch (error: any) { // Use 'any' for now to easily log the error object
      console.error('There was an error!', error); // Log the full error object
      // Handle the error based on error.response, error.request, or error.message
    }
  };

fetchData();

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>Therapy Session Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Patient Name" value={form.patient_name} onChange={e => setForm({ ...form, patient_name: e.target.value })} /><br/>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /><br/>
        <input type="number" min="1" max="5" value={form.engagement} onChange={e => setForm({ ...form, engagement: Number(e.target.value) })} /><br/>
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea><br/>
        <button type="submit">Add Session</button>
      </form>
      <h3>Logged Sessions</h3>
      <ul>
        {sessions.map((s, i) => (
          <li key={i}>
            <b>{s.patient_name}</b> on {s.date} rated {s.engagement}/5
            <p>{s.notes}</p>
            <button onClick={() => handleDelete(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
