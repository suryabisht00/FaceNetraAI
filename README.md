# Description
---

# 🔥 FaceScan Social – Real-World Face Based Social Media

FaceScan Social is a **futuristic real-life social media platform** where people can discover each other instantly using **face scanning**.  
Just scan a face — if the person is already registered, their **public social profile, Instagram, hobbies, bio, and diary highlights** appear instantly.

This project merges:
- 🔐 AI Face Recognition  
- 🤝 Real-world social networking  
- 📖 Private diary as a feature  
- ⚡ Ultra-futuristic UI  

---

## 🚀 Core Features

### ✅ Face-Based Registration
- Users register only once using their face.
- Liveness detection prevents spoofing.
- Face embeddings are stored as vectors, not raw images.

### ✅ Real-Time Face Scanning (Main Feature)
- Click a photo or upload an image.
- System matches the face using vector search.
- If matched → shows full public profile instantly.
- If not found → option to invite the person.

### ✅ Instagram-Style Social Profile
- Name, username, hobbies, bio, and business info.
- Direct Instagram redirect from profile.
- Public / private profile visibility.
- Face-based identity verification badge.

### ✅ Diary (Optional Feature)
- Users can write personal diary entries.
- Option to show diary highlights publicly.
- Full diary remains private by default.

### ✅ Scan History & Saved Profiles
- Users can view previously scanned profiles.
- Save interesting profiles for later.

---

## 🧠 AI & Security Features

- ✅ **Liveness Detection:** MiniFasNet  
- ✅ **Face Embedding:** InsightFace  
- ✅ **Vector Database:** FAISS  
- ✅ **Backend Framework:** Flask (Python)  
- ✅ **Frontend Framework:** Next.js (Full Stack)  

🛡️ Only **face vectors** are stored — **no raw images are saved**, making it privacy-first.

---

## 🎨 UI / UX Design System

### 🎯 Strict 3-Color Futuristic Theme
- **Primary Dark:** `#0B0F1A`
- **Neon Accent:** `#FF6A00`
- **Neutral Light:** `#E5E7EB`

### 🧊 Design Style
- Glassmorphism cards
- Neon glow effects
- Rounded 2xl UI
- Micro animations
- Cyber-futuristic social media feel

Looks like:  
> **"Future Instagram powered by Face ID"**

---

## 🧱 Tech Stack

### Frontend:
- Next.js
- Tailwind CSS
- React
- Full-stack API routes

### Backend:
- Python Flask
- InsightFace
- MiniFasNet
- FAISS Vector DB

### Database:
- Face Vectors → FAISS
- User Data → SQL / NoSQL (Optional)
- Diary Entries → DB

---

## 🔄 Working Flow

1. User registers with face
2. Face embedding is generated using InsightFace
3. Vector is stored in FAISS
4. User fills profile details
5. Stranger scans or uploads face
6. Face vector is matched with FAISS
7. If match is found → Profile is returned instantly
8. Next.js fetches full user profile using vector ID
9. Public profile is displayed like Instagram

---

## 📁 Folder Structure (Suggested)


/frontend (Next.js)
├── app/
├── components/
├── scan/
├── profile/
├── diary/

/backend (Flask)
├── app.py
├── face_match.py
├── liveness.py
├── vector_store.py
├── models/

````

---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/facescan-social.git
````

---

### 2️⃣ Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

### 3️⃣ Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 API Flow

* `/register-face` → Register new face
* `/match-face` → Match uploaded face
* `/get-profile/:vectorId` → Fetch profile by vector ID
* `/diary` → CRUD diary entries

---

## ⚠️ Privacy & Ethics

* ✅ No face images are permanently stored
* ✅ Only encrypted embeddings (vectors) are saved
* ✅ Users control what is public
* ✅ Diary visibility is optional
* ❌ No face search by name
* ✅ Face-only discovery

This project is strictly for **educational and ethical research purposes**.

---

## 🌟 Future Enhancements

* Face-based friend requests
* Face-to-face chat unlock
* Location-based scan alerts
* AI personality insights
* Zero-knowledge face encryption

---

## 👨‍💻 Author

**Suraj Bisht**
MCA | Full-Stack Developer | AI Systems Builder
Specialized in:

* Next.js
* Python AI Systems
* Vector Databases
* Real-time Face Recognition

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

🔥 *Face is the new username.*
🔥 *Scan people, meet digitally — instantly.*
