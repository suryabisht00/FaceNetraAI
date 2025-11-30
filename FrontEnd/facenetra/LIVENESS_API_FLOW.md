# Liveness Detection API Flow & Data Architecture

## Overview
The liveness detection system uses a **proxy-based architecture** where the Next.js frontend communicates with a Python Flask backend via API proxy routes.

---

## Architecture Components

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Login Page     │─────▶│  useRealtimeAPI  │─────▶│  API Proxy      │
│  (React UI)     │◀─────│  (Custom Hook)   │◀─────│  /api/proxy/    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │  Flask Backend  │
                                                    │  localhost:5000 │
                                                    └─────────────────┘
```

---

## Data Flow Sequence

### 1️⃣ **Session Creation** (Camera Start)

**Frontend → Hook → Proxy → Backend**

```typescript
// USER ACTION: Click "Start Camera"
startCamera() 
  └─→ createSession()
      └─→ POST /api/proxy/session
          └─→ Backend: POST http://localhost:5000/session
              Body: { action: "create" }
```

**Response Flow:**
```json
{
  "success": true,
  "session_id": "abc123",
  "message": "Session created successfully"
}
```

**State Updates:**
- ✅ `sessionId` set to "abc123"
- ✅ Camera permission requested
- ✅ Video stream starts
- ✅ Frame processing interval begins (100ms)

---

### 2️⃣ **Frame Processing** (Real-time Detection)

**Runs every 100ms while camera is active**

```typescript
// AUTOMATIC: Interval running
captureAndProcessFrame()
  └─→ Capture frame from video element
  └─→ Convert to base64 JPEG
  └─→ POST /api/proxy/process_frame
      └─→ Backend: POST http://localhost:5000/process_frame
          Body: { 
            session_id: "abc123",
            frame: "data:image/jpeg;base64,..." 
          }
```

**Response Flow:**
```json
{
  "status": "processing",
  "confidence": 0.95,
  "is_real": true,
  "blinks": 3,
  "head_pose": {
    "direction": "Forward",
    "pitch": 0.5,
    "yaw": -2.1,
    "roll": 0.8
  },
  "eyes": {
    "left_center": [120, 150],
    "right_center": [180, 150],
    "blinking": false
  },
  "face_detected": true,
  "anti_spoof_summary": {
    "real_count": 45,
    "fake_count": 2,
    "real_percentage": 95.7,
    "fake_percentage": 4.3,
    "total_processed": 47,
    "status": "Real"
  }
}
```

**State Updates:**
- ✅ `detectionResult` updated with latest frame analysis
- ✅ Head direction displayed: "Forward", "Left", "Right", "Up", "Down"
- ✅ Real-time UI feedback

---

### 3️⃣ **Start Liveness Tasks** (Verification)

**User clicks "Start Verification" button**

```typescript
// USER ACTION: Click "Start Verification"
startLivenessTask()
  └─→ POST /api/proxy/liveness/{sessionId}
      └─→ Backend: POST http://localhost:5000/liveness/abc123
          Body: { action: "start" }
```

**Response Flow:**
```json
{
  "success": true,
  "message": "Liveness task session started",
  "session_status": {
    "active": true,
    "completed_tasks": 0,
    "total_tasks": 4,
    "time_remaining": 30.0,
    "current_task": {
      "description": "Look Left",
      "task": "look_left",
      "index": 0,
      "total": 4
    },
    "tasks": ["look_left", "look_right", "look_up", "look_down"]
  }
}
```

**State Updates:**
- ✅ `taskStatus` set with task info
- ✅ Task polling starts (every 200ms)
- ✅ UI shows current task instruction
- ✅ Progress bar and timer displayed

---

### 4️⃣ **Task Status Updates** (Polling)

**Runs every 200ms during active task session**

```typescript
// AUTOMATIC: Interval running
updateTaskStatus()
  └─→ POST /api/proxy/liveness/{sessionId}
      └─→ Backend: POST http://localhost:5000/liveness/abc123
          Body: { action: "status" }
```

**Response During Active Tasks:**
```json
{
  "session_status": {
    "active": true,
    "completed_tasks": 2,
    "total_tasks": 4,
    "time_remaining": 18.5,
    "current_task": {
      "description": "Look Up",
      "task": "look_up",
      "index": 2,
      "total": 4
    },
    "tasks": ["look_left", "look_right", "look_up", "look_down"]
  }
}
```

**Response When Completed:**
```json
{
  "session_status": {
    "active": false,
    "completed_tasks": 4,
    "total_tasks": 4,
    "result": {
      "passed": true,
      "completed": 4,
      "total": 4,
      "success_rate": 1.0,
      "duration": 12.3,
      "anti_spoof_passed": true,
      "final_result": true,
      "anti_spoof_validation": {
        "real_predictions": 58,
        "total_predictions": 60,
        "real_percentage": 96.7,
        "average_confidence": 0.94,
        "reason": "High real prediction rate with strong confidence",
        "is_valid": true
      }
    }
  }
}
```

**State Updates:**
- ✅ `taskStatus.completed_tasks` increments
- ✅ `taskStatus.current_task` updates to next task
- ✅ Timer countdown updates
- ✅ On completion: Shows final result
- ✅ Auto-stops camera after completion

---

### 5️⃣ **Reset Task** (Optional)

**User clicks "Reset" button**

```typescript
// USER ACTION: Click "Reset"
resetTaskSession()
  └─→ POST /api/proxy/liveness/{sessionId}
      └─→ Backend: POST http://localhost:5000/liveness/abc123
          Body: { action: "reset" }
```

**Response:**
```json
{
  "success": true,
  "message": "Task session reset successfully"
}
```

**State Updates:**
- ✅ `taskStatus` set to null
- ✅ Task polling stopped
- ✅ UI returns to ready state

---

### 6️⃣ **Session End** (Camera Stop)

**User clicks "Stop Camera" or auto-stops after task completion**

```typescript
// USER ACTION: Click "Stop Camera" OR Task completes
stopCamera()
  └─→ endSession()
      └─→ POST /api/proxy/session
          └─→ Backend: POST http://localhost:5000/session
              Body: { 
                action: "end",
                session_id: "abc123"
              }
```

**Response:**
```json
{
  "success": true,
  "message": "Session ended successfully"
}
```

**State Updates:**
- ✅ Frame processing interval cleared
- ✅ Task polling interval cleared
- ✅ Media stream stopped
- ✅ All state reset to initial values

---

## API Proxy Structure

### Proxy Route: `/api/proxy/[...path]/route.ts`

**Purpose:** Acts as a bridge between frontend and backend
- Hides backend URL from client
- Adds API key authentication
- Handles CORS
- Provides error handling

**Endpoints Proxied:**
1. `/api/proxy/session` → `http://localhost:5000/session`
2. `/api/proxy/process_frame` → `http://localhost:5000/process_frame`
3. `/api/proxy/liveness/{id}` → `http://localhost:5000/liveness/{id}`

---

## Key Data Structures

### DetectionResult
```typescript
{
  status: string;              // "processing", "completed"
  confidence: number;          // 0.0 - 1.0
  is_real: boolean;           // true/false
  blinks: number;             // Count of eye blinks
  head_pose: {
    direction: string;        // "Forward", "Left", "Right", "Up", "Down"
    pitch: number;            // -90 to 90 degrees
    yaw: number;              // -90 to 90 degrees
    roll: number;             // -180 to 180 degrees
  };
  face_detected: boolean;
  anti_spoof_summary: {...};
}
```

### TaskStatus
```typescript
{
  active: boolean;
  completed_tasks: number;
  total_tasks: number;
  time_remaining: number;     // seconds
  current_task: {
    description: string;      // "Look Left"
    task: string;            // "look_left"
    index: number;
    total: number;
  };
  tasks: string[];           // Array of all tasks
  result?: {
    passed: boolean;
    anti_spoof_passed: boolean;
    final_result: boolean;
    duration: number;
    ...
  };
}
```

---

## Timing & Intervals

| Process | Interval | Purpose |
|---------|----------|---------|
| Frame Processing | 100ms (10 FPS) | Real-time face detection & head tracking |
| Task Status Polling | 200ms (5 Hz) | Update task progress during verification |
| Hidden Page Processing | 500ms (2 FPS) | Slower processing when page not visible |

---

## Error Handling

### Session Expiry
```json
{
  "error": "Invalid session_id or session expired"
}
```
**Action:** Auto-stops camera, prompts restart

### Network Errors
**Action:** Sets `offline` flag, continues retrying

### Camera Permission Denied
**Action:** Shows error message, disables start button

---

## State Management Flow

```
Initial State
    ↓
[Start Camera] → Creating Session → Camera Active
    ↓                                      ↓
Session Created                    Frame Processing
    ↓                                      ↓
Camera Permission                  Detection Results
    ↓                                      ↓
Stream Started                     Head Direction
    ↓
[Start Verification] → Task Session Active
    ↓                          ↓
Task Started            Task Polling
    ↓                          ↓
Task Updates            Progress Updates
    ↓                          ↓
Task Completed          Result Displayed
    ↓
[Auto Stop] → Session Ended → Initial State
```

---

## Summary

**API Call Sequence:**
1. **POST /session** (action: create) → Get session_id
2. **POST /process_frame** (loop) → Get real-time detection
3. **POST /liveness/{id}** (action: start) → Begin tasks
4. **POST /liveness/{id}** (action: status, loop) → Monitor progress
5. **POST /liveness/{id}** (action: reset) → Optional restart
6. **POST /session** (action: end) → Cleanup

**Data Flow:**
- **Input:** Video frames (base64 JPEG)
- **Processing:** AI model analyzes face, head pose, anti-spoofing
- **Output:** Real-time feedback + task verification results
- **Storage:** Session-based temporary data on backend

**Key Features:**
- ✅ Real-time face detection (10 FPS)
- ✅ Head direction tracking
- ✅ Liveness task verification
- ✅ Anti-spoofing validation
- ✅ Automatic session management
- ✅ Error handling & recovery
