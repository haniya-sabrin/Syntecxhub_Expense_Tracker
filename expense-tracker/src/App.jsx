import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './App.css'

function App() {

  // 1. useState
  const [transactions, setTransactions] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 2. useRef
  const titleInputRef = useRef(null)

  // 3. useEffect - Fetch mock API data
  useEffect(() => {

    const fetchTransactions = async () => {

      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=3'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }

        const data = await response.json()

        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title.slice(0, 20),
          amount: item.id * 100,
          type: 'expense'
        }))

        setTransactions(formattedData)

      } catch (err) {
        console.error('API Error:', err)
        setError('Unable to load sample transactions.')
      } finally {
        setLoading(false)
      }

    }

    fetchTransactions()

    // Focus description input
    titleInputRef.current?.focus()

  }, [])

  // useCallback - Add transaction
const addTransaction = useCallback((e) => {

  e.preventDefault()

  if (!title.trim() || !amount || Number(amount) <= 0) {
    alert('Please enter valid details!')
    return
  }

  const newTransaction = {
    id: Date.now(),
    title: title.trim(),
    amount: Number(amount),
    type: type
  }

  setTransactions((prev) => [...prev, newTransaction])

  setTitle('')
  setAmount('')
  setType('expense')

  titleInputRef.current?.focus()

}, [title, amount, type])

  // useCallback - Delete transaction
const deleteTransaction = useCallback((id) => {

  setTransactions((prev) =>
    prev.filter((item) => item.id !== id)
  )

}, [])

  // Calculate total income using useMemo
const income = useMemo(() => {
  return transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)
}, [transactions])

// Calculate total expenses using useMemo
const expenses = useMemo(() => {
  return transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0)
}, [transactions])

// Calculate balance using useMemo
const balance = useMemo(() => {
  return income - expenses
}, [income, expenses])

  // 9. Display application
  return (

    <div className="app">

      <header>
        <h1>SpendWise 💰</h1>
        <p>Manage your money smarter!</p>
      </header>

      <main>

        {/* Summary Cards */}

        <section className="summary">

          <div className="card">
            <h3>Total Balance</h3>
            <h2>₹{balance.toFixed(2)}</h2>
          </div>

          <div className="card">
            <h3>Total Income</h3>
            <h2>₹{income.toFixed(2)}</h2>
          </div>

          <div className="card">
            <h3>Total Expenses</h3>
            <h2>₹{expenses.toFixed(2)}</h2>
          </div>

        </section>

        {/* Add Transaction */}

        <section className="transactions">

          <h2>Add New Transaction</h2>

          <form onSubmit={addTransaction}>

            <input
              ref={titleInputRef}
              type="text"
              placeholder="Enter description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button type="submit">
              Add Transaction
            </button>

          </form>

          {/* Recent Transactions */}

          <h2>Recent Transactions</h2>

          {loading ? (

            <p>Loading transactions...</p>

          ) : error ? (

            <p>{error}</p>

          ) : transactions.length === 0 ? (

            <p>No transactions yet. Start adding one!</p>

          ) : (

            transactions.map((item) => (

              <div className="transaction-item" key={item.id}>

                <span>{item.title}</span>

                <span>
                  {item.type === 'income' ? '+' : '-'}
                  ₹{item.amount.toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => deleteTransaction(item.id)}
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </section>

      </main>

    </div>

  )
}

// VERY IMPORTANT: Keep this outside the function!
export default App