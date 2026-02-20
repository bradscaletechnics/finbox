// Web Audio API sound synthesis — no external files needed
//
// AUDIO UNLOCK PATTERN
// Browsers block AudioContext until a user gesture. Any sound queued before
// the first gesture is stored in `pendingFns` and flushed the moment the user
// interacts (first key press / click on the PIN screen).
// ─────────────────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;
let audioUnlocked = false;
const pendingFns: Array<() => void> = [];

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

/** Call this on the very first user gesture (first PIN digit, click, etc.).
 *  Resumes the AudioContext and flushes any sounds that were queued before
 *  the first interaction. */
export function unlockAudio(): void {
  if (audioUnlocked) return;
  audioUnlocked = true;
  const c = getCtx();
  c.resume().then(() => {
    const fns = pendingFns.splice(0);
    fns.forEach((fn) => fn());
  });
}

/** Wrap a sound function so it plays immediately if audio is unlocked,
 *  or queues it to play on the next unlock otherwise. */
function withUnlock(fn: () => void): void {
  if (audioUnlocked && ctx?.state === "running") {
    fn();
  } else {
    pendingFns.push(fn);
    // Also attempt a resume in case the gesture happened but we missed it
    if (ctx) {
      ctx.resume().then(() => {
        audioUnlocked = true;
        const fns = pendingFns.splice(0);
        fns.forEach((f) => f());
      });
    }
  }
}

function isEnabled(key: string): boolean {
  try { return localStorage.getItem(key) !== "false"; } catch { return true; }
}

function playTone(
  freq: number,
  duration: number,
  startTime: number,
  gain: GainNode,
  type: OscillatorType = "sine",
) {
  const c = getCtx();
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHEST OPEN  — wooden thud + coin cascade + gold chord
// Always plays (not gated by settings). Queued until first user gesture.
// ─────────────────────────────────────────────────────────────────────────────
function _playChestOpen() {
  const c = getCtx();
  const now = c.currentTime;

  // 1. Wooden thud / creak
  const thudGain = c.createGain();
  thudGain.gain.setValueAtTime(0.28, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
  thudGain.connect(c.destination);

  const thudOsc = c.createOscillator();
  thudOsc.type = "sine";
  thudOsc.frequency.setValueAtTime(130, now);
  thudOsc.frequency.exponentialRampToValueAtTime(42, now + 0.25);
  thudOsc.connect(thudGain);
  thudOsc.start(now);
  thudOsc.stop(now + 0.35);

  // Filtered noise burst — wood texture
  const bufSize = Math.floor(c.sampleRate * 0.12);
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 300;
  noiseFilter.Q.value = 1.8;
  noise.connect(noiseFilter);
  noiseFilter.connect(thudGain);
  noise.start(now);
  noise.stop(now + 0.12);

  // 2. Coin sparkle cascade — ascending C major arpeggio
  const coinNotes = [
    523.25, 659.25, 783.99, 1046.5, 1318.5,
    1567.98, 2093.0, 1318.5, 1567.98, 2093.0, 2637.0,
  ];
  coinNotes.forEach((freq, i) => {
    const g = c.createGain();
    const t = now + 0.12 + i * 0.065;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    g.connect(c.destination);
    playTone(freq, 0.5, t, g);
  });

  // 3. Warm gold chord after cascade
  const cs = now + 0.85;
  const cg = c.createGain();
  cg.gain.setValueAtTime(0, cs);
  cg.gain.linearRampToValueAtTime(0.065, cs + 0.12);
  cg.gain.exponentialRampToValueAtTime(0.001, cs + 2.2);
  cg.connect(c.destination);
  [261.63, 329.63, 392.0, 523.25].forEach((freq) => playTone(freq, 2.0, cs, cg));
}

export function playChestOpen() {
  withUnlock(_playChestOpen);
}

// ─────────────────────────────────────────────────────────────────────────────
// PIN DIGIT  — soft metallic keypad tap for each number entered
// ─────────────────────────────────────────────────────────────────────────────
export function playPinDigit() {
  const c = getCtx();
  const now = c.currentTime;

  // Quick sine blip — slightly rising, short decay
  const g = c.createGain();
  g.gain.setValueAtTime(0.09, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  g.connect(c.destination);
  playTone(880, 0.07, now, g);        // A5 — bright tap
  playTone(1108.73, 0.04, now + 0.02, g); // C#6 — metallic shimmer
}

// ─────────────────────────────────────────────────────────────────────────────
// PIN SUCCESS  — satisfying two-note unlock chime
// ─────────────────────────────────────────────────────────────────────────────
export function playPinSuccess() {
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.12, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
  g.connect(c.destination);

  playTone(783.99, 0.25, now, g);        // G5
  playTone(1046.5, 0.35, now + 0.12, g); // C6 — rises to unlock
}

// ─────────────────────────────────────────────────────────────────────────────
// PIN ERROR  — soft descending "nope" tone
// ─────────────────────────────────────────────────────────────────────────────
export function playPinError() {
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0.1, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  g.connect(c.destination);

  playTone(349.23, 0.15, now, g);        // F4
  playTone(261.63, 0.2, now + 0.12, g);  // C4 — drops down
}

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING SOUNDS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

/** Short rising two-note chime — plays on step completion */
export function playStepDing() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.12, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
  gain.connect(c.destination);
  playTone(523.25, 0.06, c.currentTime, gain);
  playTone(659.25, 0.08, c.currentTime + 0.05, gain);
}

/** Major triad chord — plays on achievement toast */
export function playAchievementChord() {
  if (!isEnabled("finbox_sound_achieve")) return;
  const c = getCtx();
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, c.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
  gain.connect(c.destination);
  playTone(261.63, 0.4, c.currentTime, gain);
  playTone(329.63, 0.4, c.currentTime, gain);
  playTone(392.0, 0.4, c.currentTime, gain);
}

/** Ascending arpeggio — plays on case completion */
export function playCaseComplete() {
  if (!isEnabled("finbox_sound_case")) return;
  const c = getCtx();
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.1, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.0);
  gain.connect(c.destination);
  [261.63, 329.63, 392.0, 523.25].forEach((freq, i) => {
    playTone(freq, 0.25, c.currentTime + i * 0.15, gain);
  });
}

/** Subtle click/tick — plays on field confirm */
export function playFieldClick() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.06, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
  gain.connect(c.destination);
  const bufferSize = c.sampleRate * 0.03;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  noise.connect(gain);
  noise.start(c.currentTime);
  noise.stop(c.currentTime + 0.03);
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK ERROR  — soft descending two-note "denied" bump
// Triggered when Continue is pressed with missing required fields.
// ─────────────────────────────────────────────────────────────────────────────
export function playBlockError() {
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.14, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
  g.connect(c.destination);

  // F#4 → Db4 — descending minor interval, triangle for a softer texture
  playTone(369.99, 0.14, now, g, "triangle");        // F#4
  playTone(277.18, 0.2, now + 0.12, g, "triangle");  // Db4
}

// ─────────────────────────────────────────────────────────────────────────────
// SELECT  — ascending two-note pop, played when a chip/card is chosen
// ─────────────────────────────────────────────────────────────────────────────
export function playSelect() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.085, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
  g.connect(c.destination);

  playTone(659.25, 0.07, now, g);          // E5
  playTone(880, 0.09, now + 0.045, g);     // A5 — bright rise
}

// ─────────────────────────────────────────────────────────────────────────────
// DESELECT  — descending two-note pop, played when a chip/card is unchecked
// ─────────────────────────────────────────────────────────────────────────────
export function playDeselect() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.06, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  g.connect(c.destination);

  playTone(783.99, 0.06, now, g);          // G5
  playTone(587.33, 0.08, now + 0.04, g);  // D5 — drops
}

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE  — clean single-note click for Yes/No buttons and switches
// ─────────────────────────────────────────────────────────────────────────────
export function playToggle() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.075, now + 0.006);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
  g.connect(c.destination);

  playTone(783.99, 0.065, now, g);  // G5 — bright, instant
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATE  — two-note ascending step-forward chime
// ─────────────────────────────────────────────────────────────────────────────
export function playNavigate() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.09, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  g.connect(c.destination);

  playTone(523.25, 0.11, now, g);          // C5
  playTone(659.25, 0.13, now + 0.075, g); // E5 — steps up
}

// ─────────────────────────────────────────────────────────────────────────────
// BACK  — two-note descending, softer — going back one step
// ─────────────────────────────────────────────────────────────────────────────
export function playBack() {
  if (!isEnabled("finbox_sound_step")) return;
  const c = getCtx();
  const now = c.currentTime;

  const g = c.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.065, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  g.connect(c.destination);

  playTone(523.25, 0.1, now, g);       // C5
  playTone(440, 0.12, now + 0.065, g); // A4 — drops
}
