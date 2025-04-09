import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import './App.css';
import Login from './components/Login';
import Register from './components/Register';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteParticles, setDeleteParticles] = useState({ show: false, x: 0, y: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3002/get');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3002/update/${editId}`, { title, amount });
      } else {
        await axios.post('http://localhost:3002/add', { title, amount });
        setIsCelebrating(true);
        setShowConfetti(true);
        setTimeout(() => {
          setIsCelebrating(false);
          setShowConfetti(false);
        }, 3000);
      }
      setTitle('');
      setAmount('');
      setEditId(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const handleDelete = async (id, event) => {
    try {
      const rect = event.target.getBoundingClientRect();
      setDeleteParticles({
        show: true,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });

      setDeletingId(id);
      await axios.delete(`http://localhost:3002/delete/${id}`);
      fetchExpenses();

      setTimeout(() => {
        setDeleteParticles({ show: false, x: 0, y: 0 });
      }, 1000);
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setEditId(expense._id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Expense Tracker</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      {deleteParticles.show && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 40 },
              color: { value: "#ff4444" },
              shape: { type: "circle" },
              opacity: {
                value: 0.8,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0,
                  sync: false
                }
              },
              size: {
                value: 8,
                random: true
              },
              move: {
                enable: true,
                speed: 10,
                direction: "none",
                random: true,
                straight: false,
                outMode: "out",
              }
            },
            fullScreen: { enable: false }
          }}
          style={{
            position: 'fixed',
            top: deleteParticles.y - 100,
            left: deleteParticles.x - 100,
            width: '200px',
            height: '200px',
            pointerEvents: 'none'
          }}
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" className={isCelebrating ? 'celebrating' : ''}>
          {editId ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      <div className="expenses-list">
        {expenses.map((expense) => (
          <div 
            key={expense._id} 
            className={`expense-item ${deletingId === expense._id ? 'deleting' : ''}`}
          >
            <h3>{expense.title}</h3>
            <p>₹{expense.amount}</p>
            <div className="actions">
              <button onClick={() => handleEdit(expense)}>Edit</button>
              <button onClick={(e) => handleDelete(expense._id, e)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ExpenseTracker />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
