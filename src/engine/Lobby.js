import { initializeApp } from 'firebase/app'
import {
  getDatabase, ref, set, get, onValue, off,
  remove, onDisconnect, runTransaction, serverTimestamp,
} from 'firebase/database'
import { firebaseConfig } from './firebase-config.js'

// ── Singleton Firebase instance ───────────────────────────────

let _db = null

function getDb() {
  if (!_db) {
    initializeApp(firebaseConfig)
    _db = getDatabase()
  }
  return _db
}

export function isFirebaseConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.databaseURL)
}

// ── User identity (persisted in localStorage) ─────────────────

export function getUserId() {
  let id = localStorage.getItem('chess-uid')
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 18))
    localStorage.setItem('chess-uid', id)
  }
  return id
}

export function getNickname() {
  return localStorage.getItem('chess-nickname') ?? ''
}

export function setNickname(name) {
  localStorage.setItem('chess-nickname', name.trim())
}

// ── Presence (online counter) ─────────────────────────────────

export function registerPresence(userId) {
  if (!isFirebaseConfigured()) return
  const db   = getDb()
  const pRef = ref(db, `presence/${userId}`)
  set(pRef, true)
  onDisconnect(pRef).remove()
}

export function subscribeOnlineCount(callback) {
  if (!isFirebaseConfigured()) { callback(0); return () => {} }
  const pRef = ref(getDb(), 'presence')
  const handler = snap => callback(snap.size ?? 0)
  onValue(pRef, handler)
  return () => off(pRef, 'value', handler)
}

// ── Matchmaking queue ─────────────────────────────────────────

export async function enterQueue(userId, nickname, peerId) {
  const db    = getDb()
  const entry = ref(db, `lobby/${userId}`)
  await set(entry, { nickname, peerId, status: 'waiting', ts: Date.now() })
  onDisconnect(entry).remove()
  return () => remove(entry)
}

export async function findOpponent(userId) {
  const snap = await get(ref(getDb(), 'lobby'))
  if (!snap.exists()) return null
  let best = null
  snap.forEach(child => {
    const d = child.val()
    if (child.key !== userId && d.status === 'waiting') {
      if (!best || d.ts < best.ts) best = { id: child.key, ...d }
    }
  })
  return best
}

// Atomic claim — returns true if we successfully claimed the opponent slot
export async function claimOpponent(opponentId) {
  let claimed = false
  await runTransaction(ref(getDb(), `lobby/${opponentId}`), data => {
    if (data?.status === 'waiting') { claimed = true; return { ...data, status: 'matched' } }
    return data // abort
  })
  return claimed
}

export function watchMyEntry(userId, callback) {
  const r = ref(getDb(), `lobby/${userId}`)
  onValue(r, snap => callback(snap.val()))
  return () => off(r, 'value')
}

export function leaveQueue(userId) {
  return remove(ref(getDb(), `lobby/${userId}`))
}
