const dayjs = require('dayjs')
const Feed = require('picofeed')
const Repo = require('./pico-repo')
const Store = require('./pico-store')
const { Profile, Report, Transaction } = require('./schema')
const KEY_SK = 'reg/sk'
const {
  TYPE_PROFILE,
  TYPE_REPORT,
  TYPE_PACT,
  TYPE_TRANSACTION,
  A_ORD,
  A_HRM,
  A_CHS,
  unpackToken,
  reduceAlignment
} = require('../constants')
class Kernel {
  constructor (db) {
    this.db = db
    this.repo = new Repo(db)
    this.store = new Store(this.repo)

    // Configure store
    this.store.register(profileStore.apply(this))
    this.store.register(tokenBalances.apply(this))
  }

  async load () {
    await this.store.load() // returns notification
    this._sk = await this.repo.readReg(KEY_SK)
      .catch(err => {
        if (!err.notFound) throw err
      })
    if (!this._sk) return false
    return true
  }

  get ready () {
    return !!this._sk
  }

  get pk () {
    return this._sk.slice(32)
  }

  get profile () {
    return this.store.state.peers[this.pk.toString('hex')]
  }

  get balance () {
    return this.store.state.assets[this.pk.toString('hex')]
  }

  async register (profile) {
    const { sk } = Feed.signPair()
    await this.repo.writeReg(KEY_SK, sk)
    this._sk = sk
    const f = (await this.repo.loadHead(this.pk, 1)) || new Feed()
    const seq = f.length ? parseBlock(f.last.body).seq + 1 : 0
    const data = { ...profile, date: new Date().getTime(), seq }
    const buffer = Buffer.alloc(1 + Profile.encodingLength(data))
    buffer[0] = TYPE_PROFILE
    Profile.encode(data, buffer, 1)
    f.append(buffer, sk)
    const mut = await this.store.dispatch(f)
    if (!mut.length) throw new Error('Failed persisting profile')
    return mut
  }

  async feed () {
    this._checkReady()
    return this.repo.loadHead(this.pk)
  }

  /**
   * Mood: -1..2
   * Rumors: array of pk's and tokens
   * Date: careful, setting one in the future will timelock your chain
   *       setting it to earlier than lastReport will brick your chain.
   *       safe default is to leave it `undefined`
   */
  async appendReport (mood = 0, rumors = [], date) {
    this._checkReady()
    const f = await this.repo.loadHead(this.pk, 1)
    const seq = parseBlock(f.last.body).seq + 1
    const data = {
      seq,
      date: date || new Date().getTime(),
      mood,
      rumors: rumors.map(r => ({ ...r, pk: toBuffer(r.pk) }))
    }
    console.info('Appending report', data)
    const buffer = Buffer.alloc(1 + Report.encodingLength(data))
    buffer[0] = TYPE_REPORT
    Report.encode(data, buffer, 1)
    f.append(buffer, this._sk)
    return await this.store.dispatch(f)
  }

  async appendTransaction (target, asset, value) {
    this._checkReady()
    const f = await this.repo.loadHead(this.pk, 1)
    const seq = parseBlock(f.last.body).seq + 1
    const data = {
      seq,
      date: new Date().getTime(),
      pk: toBuffer(target),
      asset,
      value
    }
    console.info('Appending transaction', data)
    const buffer = Buffer.alloc(1 + Transaction.encodingLength(data))
    buffer[0] = TYPE_TRANSACTION
    Transaction.encode(data, buffer, 1)
    f.append(buffer, this._sk)
    return await this.store.dispatch(f)
  }

  async findProfileBlock (key) {
    const f = await this.repo.loadHead(key, (block, abort) => {
      if (block.body[0] === TYPE_PROFILE) {
        abort(true)
      }
    })
    f?.truncate(1)
    return f
  }

  /**
   * Mutates store and reduced state
   */
  async dispatch (patch) {
    this._checkReady()
    return await this.store.dispatch(patch)
  }

  _checkReady () {
    if (!this.ready) throw new Error('Kernel is not ready, still loading or user is not registerd')
  }

  /**
   * TODO: strategy's are only used in case of multi-head merge-conflict.
   */
  async _mergeStrategy (block, repo) {
    console.info('Running observer', block, repo)
    debugger
    return true
  }

  // -- HIGHER LEVEL LOGIC --

  // TODO: move to helpers probably as functional calculateTrend(pHistory, date = new Date())
  alignmentAt (date = new Date()) {
    // TODO: calculate perspective overall, previous week, current week.
    const empty = () => ({
      mood: 0,
      forces: [0, 0, 0]
    })
    const overall = empty()
    const month = empty()
    const week = empty()
    const lastWeek = empty()
    const w1 = dayjs(date).subtract(1, 'week').toDate().getTime()
    const w2 = dayjs(date).subtract(2, 'week').toDate().getTime()
    const m1 = dayjs(date).subtract(1, 'month').toDate().getTime()
    for (const day of this.profile.pHistory) {
      if (day.date > date.getTime()) break
      if (day.date >= w1) {
        // reduce to current week
      }
      if (day.date < w1 && day.date >= w2) {
        // reduce to previous week
      }
      if (day.date >= m1) {
        // reduce to current month
      }
      // reduce overall.
      debugger
    }
  }
}

function profileStore () {
  const mkProfile = (pk = null) => ({
    alias: null,
    pk,
    tagline: null,
    date: null,
    lastReport: null,
    mood: 0,
    reputation: [],
    // rHistory: []
    perspective: [], // Overall.. deprecate maybe
    pHistory: [], // Perspective over time
    level: 0,
    awokenAt: 0
  })

  return {
    name: 'peers',
    initialValue: {},
    filter: ({ block, state }) => {
      const key = block.key.toString('hex')
      /* TODO: logic logic logic
       * Game-rules shold be handeled by feed.append(block, validator)
       */
      if (!state[key]) return // Unknown peers accepted by default
      switch (block.body[0]) {
        case TYPE_REPORT:
          /*
           * - Max 1 report per day
           * - Max 5 tokens per day
           * - Max 1 token per peer
           */
      }
      return false // !(block.key.equals(this.pk) && block.body[0] === TYPE_PROFILE)
    },
    reducer: ({ block, state }) => {
      const key = block.key.toString('hex')
      switch (block.body[0]) {
        case TYPE_PROFILE: {
          state[key] = state[key] || mkProfile(key)
          Object.assign(state[key], Profile.decode(block.body, 1))
          state[key].pk = block.key
          if (block.isGenesis) state[key].awokenAt = state[key].date
          return state
        }

        case TYPE_REPORT: {
          state[key] = state[key] || mkProfile(key)
          const r = Report.decode(block.body, 1)
          state[key].lastReport = r.date
          state[key].mood += r.mood
          state[key].pHistory.push({
            date: r.date,
            mood: r.mood,
            tokens: r.rumors.map(rumor => rumor.token)
          })
          for (const rumor of r.rumors) {
            state[key].perspective.push(rumor.token)
            const rk = rumor.pk.toString('hex')
            state[rk] = state[rk] || mkProfile(rumor.pk)
            state[rk].reputation.push(rumor.token)
          }
          return state
        }
      }
    }
  }
}

function tokenBalances () {
  const mkBalance = () => [0, 0, 0]
  return {
    name: 'assets',
    initialValue: {},
    filter: ({ block, state }) => {
    },
    reducer: ({ block, state }) => {
      // Sender
      const key = block.key.toString('hex')
      switch (block.body[0]) {
        case TYPE_PROFILE: { // not required
          state[key] = state[key] || mkBalance()
          return state
        }
        case TYPE_REPORT: {
          const report = Report.decode(block.body, 1)
          for (const r of report.rumors) {
            const assets = unpackToken(r.token)
            const rpk = r.pk.toString('hex')
            state[rpk] = state[rpk] || mkBalance()
            state[rpk][A_ORD] += assets[A_ORD]
            state[rpk][A_HRM] += assets[A_HRM]
            state[rpk][A_CHS] += assets[A_CHS]
          }
          return state
        }
        case TYPE_TRANSACTION: {
          const t = Transaction.decode(block.body, 1)
          const rpk = t.pk.toString('hex')
          state[rpk] = state[rpk] || mkBalance()
          state[rpk][t.asset] += t.value
          state[key][t.asset] -= t.value
          return state
        }
      }
    }
  }
}

function toBuffer (o) {
  if (!o) return o
  if (Buffer.isBuffer(o)) return o
  if (typeof o === 'object' && o.type === 'Buffer') return Buffer.from(o.data)
  else return o
}

function parseBlock (buffer) {
  switch (buffer[0]) {
    case TYPE_REPORT:
      return Report.decode(buffer, 1)
    case TYPE_PROFILE:
      return Profile.decode(buffer, 1)
    case TYPE_TRANSACTION:
      return Transaction.decode(buffer, 1)
    default:
      throw new Error(`Unknown block type: '${buffer[0]}'`)
  }
}
module.exports = Kernel

// nano-store.js
// Nano sized reactive store
/*
function store (value, setter) {
  const subs = []
  const dispatch = () => for (const cb of subs) cb(value)
  const writable = typeof setter !== 'function'
  const _set = v => {
    // NOPE
    if (Array.isArray(v) && Array.isArray(value)) {
      // depth compare only equally sized arrays
      if (v.length === value.length) {
        let d = false
        for (let i = 0; d && i < v.length; i++) if (v[i] !== value[i]) d = true
        if (!d) return
      }
    } else if (v === value) return
    value = v
    dispatch()
  }
  !writable && setter(_set) // export set method
  return {
    set: writable ? _set : undefined
    subscribe: cb => {
      subs.push(cb)
      cb(value)
      return () => { // export unsub method
        const idx = subs.indexOf(cb)
        if (~idx) subs.splice(idx, 1)
      }
    },
    // black magic interface
    _set,
    _dispatch: () => dispatch(),
  }
}
*/

