# 🚀 MaxxLoop: The Closed-Loop AI Companion for Student Focus & Recovery
**Track:** Wellness & Lifestyle — ASYNC 2026 Hackathon Winner Version

MaxxLoop is a **Proof Engine**, not a passive dashboard or generic tip generator. It closes the full loop that conventional wellness applications leave open:

$$\text{Detect capacity drop} \longrightarrow \text{Explain why in plain language} \longrightarrow \text{Recommend exactly one micro-action } (\le 5\text{ min}) \longrightarrow \text{Measure whether it worked} \longrightarrow \text{Learn what works for this user}$$

---

## 🏆 Core Differentiators

1. **Full Closed Action-Verification Loop:** Connects detection directly to active somatic reset and counterfactual measurement.
2. **Proof Card (Hero Component):** The centerpiece after every action, showcasing Before $\rightarrow$ After score lift and verified personal success rates.
3. **Personal Action Memory:** Remembers past successful loops and feeds the user's empirical history into the Gemini prompt.
4. **Strict $n=1$ UX (Hick's Law):** Never provides a list of 50 choices. Recommends exactly ONE high-leverage micro-action ($\le 5$ min).
5. **Short Causal Explanations:** 2–4 lines of plain English diagnosing why capacity dropped.
6. **432Hz Web Audio Harmonic Somatic Pacer:** Native browser sound synthesis with zero external audio dependencies.
7. **Clinical-Grade Safety Interceptor:** Offline deterministic regex protection (English, Hindi, Kannada) integrated with **Tele-MANAS (14416)** crisis helplines.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Web Audio API
- **Backend:** Node.js Express server (`server.ts`) with Vite middlewares
- **AI/LLM:** Google Gemini 3.8 Flash (`@google/genai`) using the exact MaxxLoop system prompt
- **Storage:** Local-first browser storage with pre-seeded personalized action memory
- **Audio Engine:** Pure Web Audio API 432Hz harmonic acoustic synthesizer

---

## 🚀 Running the Live Demo

### 1. Environment Configuration
Ensure your `.env` contains:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 2. Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 3. Step-by-Step Demo Flow
1. **Landing Page:** Open `http://localhost:3000` to view the value proposition, failure of open-loop wellness, and test the 432Hz chimes.
2. **1-Click Demo Sign-In:** Tap `⚡ 1-Click Demo Logins: Aarav Sharma (Exam Crunch)` to authenticate without typing.
3. **Check-In:** Select an initial score (e.g. `2/5` - Heavy / Low) and context (e.g. `After lecture`).
4. **Detect & Explain:** Gemini immediately analyzes your situation and prescribes **one concrete micro-action** (e.g. `Stand up and walk for 4 minutes while drinking water`).
5. **Action Timer:** Run the micro-action timer or launch the synchronized 432Hz Somatic Pacer.
6. **Measure & Proof Card:** Tap **Mark Done**, input your verified after score (e.g. `4/5`), and watch the **Proof Card** appear showing your personal lift (`+2 Points`) and verified success rate.
7. **Personal Action Memory:** Tap **Personal Memory** to inspect the ranked list of "What Works For Me" derived from completed loops.

---

## 📄 Academic Science Foundation
MaxxLoop is grounded in 26 peer-reviewed papers:
- **Hick's Law (1952):** $T = b \cdot \log_2(n+1)$ — preventing decision paralysis in acute mental fatigue.
- **Robust Rolling MAD (Leys et al., 2013):** 50% breakdown point baselining immune to all-nighter data corruption.
- **Thompson Sampling (Agrawal & Goyal):** Bayesian contextual bandit with conjugate Beta posteriors.
- **Rubin Causal Model (1974):** $\text{Net Recovery} = \Delta_{\text{observed}} - \Delta_{\text{control}}$.
- **Cyclic Respiration (Balban, Spiegel & Huberman, 2023):** Autonomic vagal brake deceleration via physiological sighs.
