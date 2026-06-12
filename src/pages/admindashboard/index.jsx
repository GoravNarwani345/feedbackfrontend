import React, { useEffect, useMemo, useState } from 'react'

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // filters
  const [query, setQuery] = useState('')
  const [sentiment, setSentiment] = useState('All')
  const [sort, setSort] = useState('newest')

  // pagination
  const PAGE_SIZE = 12
  const [page, setPage] = useState(1)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const base = import.meta.env.VITE_API_BASE || 'https://feedbackbackend-raa7.onrender.com'
        const res = await fetch(`${base}/api/feedback`)
        if (!res.ok) throw new Error('Failed to fetch feedback')
        const data = await res.json()
        if (!mounted) return
        setItems(data.feedbacks || [])
      } catch (err) {
        console.error(err)
        if (!mounted) return
        setError(err.message || 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = items.slice()
    if (sentiment !== 'All') arr = arr.filter(i => (i.sentimentTag || '').toLowerCase() === sentiment.toLowerCase())
    if (q) {
      arr = arr.filter(i => {
        return (
          (i.customerName || '').toLowerCase().includes(q) ||
          (i.Email || '').toLowerCase().includes(q) ||
          (i.feedbackText || '').toLowerCase().includes(q)
        )
      })
    }

    arr.sort((a, b) => {
      const ta = new Date(a.createdAt || a.created_at || a.createdAt)
      const tb = new Date(b.createdAt || b.created_at || b.createdAt)
      return sort === 'newest' ? tb - ta : ta - tb
    })

    return arr
  }, [items, query, sentiment, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  useEffect(() => { if (page > totalPages) setPage(1) }, [totalPages])

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Customer Feedback — Admin</h1>
        <p className="text-sm text-gray-500">All feedback entries. Use filters and pagination to browse.</p>
      </header>

      <section className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
        <div className="flex-1">
          <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} placeholder="Search name, email or feedback" className="w-full rounded-md border px-3 py-2" />
        </div>

        <div className="flex gap-2">
          <select value={sentiment} onChange={e => { setSentiment(e.target.value); setPage(1) }} className="rounded-md border px-3 py-2">
            <option>All</option>
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>

          <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {pageItems.map(item => (
              <article key={item._id || item.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{item.customerName || '—'}</h3>
                    <p className="text-xs text-gray-500">{item.Email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${ (item.sentimentTag==='Positive')? 'bg-green-50 text-green-700 border border-green-100' : (item.sentimentTag==='Negative')? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                      {item.sentimentTag || 'Neutral'}
                    </span>
                    <div className="text-xs text-gray-400">#{item.priorityScore || 1}</div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-700 line-clamp-6">{item.feedbackText}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <div>{new Date(item.createdAt || item.created_at).toLocaleString()}</div>
                </div>
              </article>
            ))}
          </div>

          <footer className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</div>

            <nav className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-indigo-600 text-white border-indigo-600' : ''}`}>{i + 1}</button>
              ))}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
            </nav>
          </footer>
        </>
      )}
    </div>
  )
}
