import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../constant/app.constant'

const TODOS_PER_PAGE = 5

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [filteredTodos, setFilteredTodos] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newTodo, setNewTodo] = useState('')
  const [posting, setPosting] = useState(false)

  const fetchTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/todos/get-all-todos`)
      const data = await res.json()
      setTodos(data)
      setFilteredTodos(data)
    } catch (err) {
      setError('Failed to fetch todos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    let temp = [...todos]

    if (searchTerm.trim()) {
      temp = temp.filter((todo) =>
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (fromDate) {
      temp = temp.filter((todo) => new Date(todo.createdAt) >= new Date(fromDate))
    }

    if (toDate) {
      temp = temp.filter((todo) => new Date(todo.createdAt) <= new Date(toDate))
    }

    setFilteredTodos(temp)
    setCurrentPage(1)
  }, [searchTerm, fromDate, toDate, todos])

  const totalPages = Math.ceil(filteredTodos.length / TODOS_PER_PAGE)
  const startIndex = (currentPage - 1) * TODOS_PER_PAGE
  const currentTodos = filteredTodos.slice(startIndex, startIndex + TODOS_PER_PAGE)


  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setPosting(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/todos/create-todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: newTodo, completed: false }),
      })


      if (!res.ok) {
        throw new Error('Failed to add todo')
      }
      alert('Todo added successfully!')
      setNewTodo('')
      fetchTodos() // Refresh list
    } catch (err) {
      setError('Failed to add new todo.')
    } finally {
      setPosting(false)
    }
  }
return (
  <div className="container py-4 bg-light min-vh-100">
    <div className="card shadow-sm rounded-4 p-3 mx-auto" style={{ maxWidth: '700px' }}>
      <h3 className="text-center text-primary mb-3 fw-bold"> Todo List</h3>

      {error && <div className="alert alert-danger py-2 text-center mb-2">{error}</div>} 

      <div className="border-bottom pb-2 mb-3">
        <h6 className="mb-2 text-secondary fw-semibold"> Add New Task</h6>
        <form className="d-flex gap-2" onSubmit={handleAddTodo}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="New task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            disabled={posting}
            style={{ borderRadius: '8px' }}
          />
          <button className="btn btn-primary btn-sm px-3" type="submit" disabled={posting}>
            {posting ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* ✅ Filters Section */}
      <div className="border-bottom pb-2 mb-3">
        <h6 className="mb-2 text-secondary fw-semibold"> Filter Tasks</h6>
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control form-control-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control form-control-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

  
      {loading ? (
        <p className="text-center text-muted mt-3">Loading...</p>
      ) : currentTodos.length === 0 ? (
        <p className="text-center text-muted mt-3">No tasks found.</p>
      ) : (
        <ul className="list-group mb-3 mt-2">
          {currentTodos.map((todo) => (
            <li
              key={todo._id}
              className="list-group-item d-flex justify-content-between align-items-center shadow-sm border-0 mb-2 py-2 px-3"
              style={{ borderRadius: '10px', backgroundColor: '#fefefe' }}
            >
              <div>
                <span className="fw-medium">{todo.todo}</span><br />
                <small className="text-muted">{new Date(todo.createdAt).toLocaleDateString()}</small>
              </div>
              <span
                className={`badge px-3 py-1 fs-7 ${todo.completed
                  ? 'bg-success text-white'
                  : 'bg-warning text-dark'
                  }`}
                style={{ borderRadius: '50px' }}
              >
                {todo.completed ? '✔ Done' : '⏳ Pending'}
              </span>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination pagination-sm mb-0">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ borderRadius: '50%' }}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  </div>
)



}
