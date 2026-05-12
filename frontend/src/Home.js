import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  BsCircleFill,
  BsFillCheckCircleFill,
  BsFillTrashFill,
  BsPencil,
  BsCheck
} from 'react-icons/bs';

// Enable relative time plugin
dayjs.extend(relativeTime);

const Home = () => {
  const [todos, setTodos]         = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState('');

  useEffect(() => {
    // ← only this changed
    axios.get('/api/get')
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleDone = id => {
    // ← and this
    axios.put(`/api/edit/${id}`)
      .then(() => {
        setTodos(todos.map(t => t._id === id ? { ...t, done: !t.done } : t));
      })
      .catch(err => console.error(err));
  };

  const saveUpdate = (id, text) => {
    // ← and this
    axios.put(`/api/update/${id}`, { task: text })
      .then(() => {
        setTodos(todos.map(t => t._id === id ? { ...t, task: text } : t));
        setEditingId(null);
        setDraftText('');
      })
      .catch(err => console.error(err));
  };

  const handleDelete = id => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    // ← and this
    axios.delete(`/api/delete/${id}`)
      .then(() => setTodos(todos.filter(t => t._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <main>
      <Create />

      {todos.length === 0 ? (
        <div className="task">No tasks found</div>
      ) : (
        todos.map(todo => {
          const isEditing = editingId === todo._id;
          return (
            <div className="task" key={todo._id}>

              <div className="checkbox">
                {todo.done ? (
                  <BsFillCheckCircleFill
                    className="icon"
                    onClick={() => toggleDone(todo._id)}
                  />
                ) : (
                  <BsCircleFill
                    className="icon"
                    onClick={() => toggleDone(todo._id)}
                  />
                )}

                {isEditing ? (
                  <input
                    className="edit-input"
                    type="text"
                    value={draftText}
                    onChange={e => setDraftText(e.target.value)}
                  />
                ) : (
                  <p className={todo.done ? 'through' : 'normal'}>
                    {todo.task}
                  </p>
                )}
              </div>

              <div className="actions">
                <button
                  className="icon-btn"
                  onClick={() => {
                    if (isEditing) {
                      saveUpdate(todo._id, draftText);
                    } else {
                      setEditingId(todo._id);
                      setDraftText(todo.task);
                    }
                  }}
                >
                  {isEditing ? (
                    <BsCheck className="icon" />
                  ) : (
                    <BsPencil className="icon" />
                  )}
                </button>

                <button
                  className="icon-btn"
                  onClick={() => handleDelete(todo._id)}
                >
                  <BsFillTrashFill className="icon" />
                </button>
              </div>

              <div className="timestamp">
                Created {todo.createdAt ? dayjs(todo.createdAt).fromNow() : '--'}
              </div>

            </div>
          );
        })
      )}
    </main>
  );
};

export default Home;
