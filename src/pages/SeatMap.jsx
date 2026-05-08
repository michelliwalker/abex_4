import React, { useEffect, useMemo, useState, useRef } from 'react'

/**
 * SeatMap.jsx
 * React component (single-file) to display and manage seat reservations (frontend-only).
 * - Uses Tailwind classes for styling (no external CSS required).
 * - Simulates persistence via localStorage so reservations survive reloads in the same browser.
 * - Reservation timeout: 2 minutes (120 seconds).
 *
 * Props:
 *  - eventId (string|number) optional: namespace for localStorage so multiple events don't collide
 *  - rows (number) optional default 8
 *  - cols (number) optional default 12
 *  - initialSold (array of seatIds) optional: seats already sold
 *  - userId (string|number) optional: identifies current user (if not provided, a random id is generated and stored)
 *
 * Example usage:
 *  <SeatMap eventId="ev1" rows={6} cols={10} initialSold={["r1c4", "r2c3"]} userId={user.id} />
 */

const RESERVATION_SECONDS = 120 // 2 minutes

function fmtSeconds(s) {
  if (s <= 0) return '00:00'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function SeatMap({ eventId = 'default-event', rows = 8, cols = 12, initialSold = [], userId: propUserId = null }) {
  // create or reuse a user id for demo purposes
  const [userId] = useState(() => {
    if (propUserId) return String(propUserId)
    const key = `seatmap_user_id`
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const generated = `u_${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem(key, generated)
    return generated
  })

  const namespace = `seatmap:${eventId}`

  // build seat ids like r1c1 ...
  const seatIds = useMemo(() => {
    const arr = []
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        arr.push(`r${r}c${c}`)
      }
    }
    return arr
  }, [rows, cols])

  // state containing seat metadata: { status: 'disponivel'|'reservado'|'vendido', reservedBy, reservedAt }
  const [seats, setSeats] = useState(() => {
    // try load from localStorage
    const raw = localStorage.getItem(namespace)
    if (raw) {
      try { return JSON.parse(raw) } catch (e) { /* ignore */ }
    }
    // create default
    const map = {}
    for (const id of seatIds) {
      map[id] = { status: 'disponivel', reservedBy: null, reservedAt: null }
    }
    // apply initial sold
    for (const id of initialSold) {
      if (map[id]) map[id].status = 'vendido'
    }
    return map
  })

  const tickRef = useRef(null)

  // persist helper
  const persist = (nextSeats) => {
    setSeats(nextSeats)
    try { localStorage.setItem(namespace, JSON.stringify(nextSeats)) } catch (e) { console.warn(e) }
  }

  // utility: clear expired reservations and update states
  const clearExpired = () => {
    const now = Date.now()
    const changed = { ...seats }
    let any = false
    for (const id of Object.keys(changed)) {
      const s = changed[id]
      if (s.status === 'reservado' && s.reservedAt) {
        if (now - s.reservedAt >= RESERVATION_SECONDS * 1000) {
          changed[id] = { status: 'disponivel', reservedBy: null, reservedAt: null }
          any = true
        }
      }
    }
    if (any) persist(changed)
  }

  // start interval to update countdowns and clear expiration
  useEffect(() => {
    tickRef.current = setInterval(() => {
      // re-load seats from localStorage to keep in sync with other tabs
      const raw = localStorage.getItem(namespace)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          setSeats(parsed)
        } catch (e) {/* ignore */}
      }
      clearExpired()
    }, 1000)
    return () => clearInterval(tickRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // helper to reserve a seat for current user (frontend-only)
  const reserveSeat = (seatId) => {
    const s = seats[seatId]
    if (!s || s.status !== 'disponivel') return
    const next = { ...seats, [seatId]: { status: 'reservado', reservedBy: userId, reservedAt: Date.now() } }
    persist(next)
  }

  // helper to release reservation by current user
  const releaseSeat = (seatId) => {
    const s = seats[seatId]
    if (!s) return
    if (s.status === 'reservado' && s.reservedBy === userId) {
      const next = { ...seats, [seatId]: { status: 'disponivel', reservedBy: null, reservedAt: null } }
      persist(next)
    }
  }

  // finalize purchase: mark reserved seats by this user as sold
  const purchaseReserved = () => {
    const next = { ...seats }
    for (const id of Object.keys(next)) {
      const s = next[id]
      if (s.status === 'reservado' && s.reservedBy === userId) {
        next[id] = { status: 'vendido', reservedBy: null, reservedAt: null }
      }
    }
    persist(next)
  }

  // compute remaining seconds for a reserved seat
  const remainingSeconds = (seat) => {
    if (!seat || seat.status !== 'reservado' || !seat.reservedAt) return 0
    const elapsed = Math.floor((Date.now() - seat.reservedAt) / 1000)
    return Math.max(0, RESERVATION_SECONDS - elapsed)
  }

  // UI helpers
  const getSeatClass = (seatId) => {
    const s = seats[seatId]
    if (!s) return 'bg-gray-100'
    if (s.status === 'vendido') return 'bg-gray-400 cursor-not-allowed'
    if (s.status === 'reservado') {
      if (s.reservedBy === userId) return 'bg-yellow-400'
      return 'bg-red-300 cursor-not-allowed'
    }
    return 'bg-green-400 hover:scale-105'
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Mapa de Assentos — Evento {eventId}</h1>
        <div className="text-sm text-gray-600">Seu id: <span className="font-mono">{userId}</span></div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div className="text-sm text-gray-600">Clique em um assento disponível para reservá-lo por 2 minutos. As reservas expiram automaticamente.</div>
          </div>

          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}>
            {seatIds.map((id) => {
              const s = seats[id]
              const rem = remainingSeconds(s)
              const isMine = s && s.status === 'reservado' && s.reservedBy === userId
              return (
                <button
                  key={id}
                  onClick={() => {
                    // click behaviour
                    const cur = seats[id]
                    if (!cur) return
                    if (cur.status === 'disponivel') return reserveSeat(id)
                    if (cur.status === 'reservado' && cur.reservedBy === userId) return releaseSeat(id)
                    // otherwise do nothing
                  }}
                  className={`p-2 rounded-md flex flex-col items-center justify-center text-xs font-medium text-white ${getSeatClass(id)} transition transform`}
                  title={`Assento ${id} — ${s ? s.status : 'desconhecido'}`}
                  disabled={s && s.status === 'vendido' || (s && s.status === 'reservado' && s.reservedBy !== userId)}
                >
                  <div className="text-[10px]">{id}</div>
                  <div className="text-[11px] opacity-90">
                    {s?.status === 'disponivel' && 'Disponível'}
                    {s?.status === 'vendido' && 'Vendido'}
                    {s?.status === 'reservado' && (isMine ? `Reservado • ${fmtSeconds(rem)}` : 'Reservado')}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="w-64 p-3 bg-white shadow rounded-lg">
          <h2 className="font-semibold mb-2">Resumo</h2>
          <ul className="text-sm space-y-2">
            <li>Disponíveis: <strong>{Object.values(seats).filter(s => s.status === 'disponivel').length}</strong></li>
            <li>Reservados (outros): <strong>{Object.values(seats).filter(s => s.status === 'reservado' && s.reservedBy !== userId).length}</strong></li>
            <li>Suas reservas: <strong>{Object.values(seats).filter(s => s.status === 'reservado' && s.reservedBy === userId).length}</strong></li>
            <li>Vendidos: <strong>{Object.values(seats).filter(s => s.status === 'vendido').length}</strong></li>
          </ul>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={purchaseReserved}
              className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:opacity-90 disabled:opacity-60"
              disabled={Object.values(seats).every(s => !(s.status === 'reservado' && s.reservedBy === userId))}
            >Finalizar compra (vender minhas reservas)</button>

            <button
              onClick={() => {
                // release all mine
                const next = { ...seats }
                let any = false
                for (const id of Object.keys(next)) {
                  const s = next[id]
                  if (s.status === 'reservado' && s.reservedBy === userId) {
                    next[id] = { status: 'disponivel', reservedBy: null, reservedAt: null }
                    any = true
                  }
                }
                if (any) persist(next)
              }}
              className="px-3 py-2 rounded border text-sm"
            >Cancelar minhas reservas</button>

            <button
              onClick={() => {
                // reset demo (danger)
                if (!confirm('Resetar mapa de assentos deste evento (somente demo)?')) return
                const map = {}
                for (const id of seatIds) map[id] = { status: 'disponivel', reservedBy: null, reservedAt: null }
                for (const id of initialSold) if (map[id]) map[id].status = 'vendido'
                persist(map)
              }}
              className="px-3 py-2 rounded border text-sm text-red-600"
            >Reset demo</button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Observações:
            <ul className="list-disc pl-4">
              <li>Reservas duram 2 minutos e expiram automaticamente.</li>
              <li>Este componente é frontend-only. Para produção, sincronize com seu backend para evitar condições de corrida entre usuários.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
