# 🚀 Quick Start - Match Request Flow Implementation

## 📋 Overview

When Player B accepts Player A's match request:
- ✅ Player A gets an **email** (HTML formatted with match details)
- ✅ Player A gets an **in-app notification** (bell icon with badge)
- ✅ Player A **cannot request again** (validated on backend & frontend)

---

## ⚡ 5-Minute Implementation Checklist

### Backend (Spring Boot)

#### 1️⃣ Create New Files (5 files)
Copy these from `BACKEND_IMPLEMENTATION.md`:

- [ ] `entity/Notification.java` (Section 1)
- [ ] `repository/NotificationRepository.java` (Section 2)
- [ ] `service/EmailService.java` (Section 3)
- [ ] `service/NotificationService.java` (Section 4)
- [ ] `controller/NotificationController.java` (Section 6)
- [ ] `config/AsyncConfig.java` (Section 8)

#### 2️⃣ Update Existing File (1 file)
- [ ] Update `MatchService.java` - Add to `respondToRequest()` method (Section 5)
  ```java
  // After accepting request, add:
  notificationService.notifyMatchRequestAccepted(player, match.getTitle(), match.getMatchId(), user.getName());
  emailService.sendMatchRequestAcceptedEmail(player.getEmail(), player.getName(), ...);
  ```

#### 3️⃣ Database Migration
- [ ] Run SQL from Section 10 of `BACKEND_IMPLEMENTATION.md`
  ```sql
  CREATE TABLE notifications (...);
  ```

#### 4️⃣ Configuration
- [ ] Add to `application.properties`:
  ```properties
  spring.mail.host=smtp.gmail.com
  spring.mail.port=587
  spring.mail.username=your-email@gmail.com
  spring.mail.password=your-app-password
  ```

#### 5️⃣ Dependencies
- [ ] Add to `pom.xml`:
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-mail</artifactId>
  </dependency>
  ```

#### 6️⃣ Restart Backend
- [ ] `mvn clean install`
- [ ] Restart Spring Boot application

---

### Frontend (React/TypeScript)

#### 1️⃣ Files Already Created ✅
- [x] `frontend/src/types/match.types.ts` - Type definitions
- [x] `frontend/src/helper/requests.ts` - API endpoint fixed

#### 2️⃣ Create Components (2 components)
Copy from `FRONTEND_IMPLEMENTATION.md`:

- [ ] `components/player/MatchDetailCard.tsx` (Section 2)
- [ ] `components/player/MatchRequestsManager.tsx` (Section 3)

#### 3️⃣ Update Notification Bell
- [ ] Update `components/notifications/NotificationBell.tsx` (Section 4)
  - Add navigation on notification click
  - Add match-specific handling

#### 4️⃣ Create/Update Matches Page
- [ ] Create or update matches detail page (Section 5)
  - Use `MatchDetailCard` component
  - Use `MatchRequestsManager` for creators
  - Add refresh functionality

---

## 🧪 Testing (3 minutes)

### Test Scenario 1: Accept Request
```
1. Player A: Browse matches
2. Player A: Click "Request to Join" on a match
3. Player A: Enter message and submit
4. Player B: View match requests
5. Player B: Click "Accept"
✅ Player A receives email
✅ Player A sees notification (within 30 seconds)
✅ Player A cannot request again
```

### Test Scenario 2: Duplicate Prevention
```
1. Player A: Request to join match
2. Player A: Try to request again
✅ Button is disabled/hidden
✅ Shows "Request Pending" message
✅ Backend returns 400 if API called directly
```

### Test Scenario 3: Notification Click
```
1. Player A: Click notification bell
2. Player A: See new notification
3. Player A: Click on notification
✅ Navigates to match details
✅ Shows "Request Accepted" badge
✅ Notification marked as read
```

---

## 📧 Email Setup (Gmail Example)

### For Gmail:
1. **Enable 2-Factor Authentication**
   - Go to Google Account Settings
   - Security → 2-Step Verification → Turn On

2. **Generate App Password**
   - Security → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

3. **Update application.properties**
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=xxxx-xxxx-xxxx-xxxx  # App password
   ```

### For Other Providers:
- **Outlook/Office365:** `smtp.office365.com`, port 587
- **Yahoo:** `smtp.mail.yahoo.com`, port 587
- **Custom SMTP:** Check your email provider's documentation

---

## 🎯 Key Code Snippets

### Backend: Accept Request
```java
@Transactional
public MatchRequestResponse respondToRequest(Long requestId, RespondToRequestRequest request, User user) {
    // ... existing validation code ...
    
    if ("accept".equals(request.action())) {
        // ... existing accept logic ...
        
        // ✅ ADD THESE LINES:
        notificationService.notifyMatchRequestAccepted(
            player, match.getTitle(), match.getMatchId(), user.getName()
        );
        
        emailService.sendMatchRequestAcceptedEmail(
            player.getEmail(), player.getName(), match.getTitle(),
            match.getMatchDateTime().toString(), match.getLocation(), user.getName()
        );
    }
    
    // ... rest of method ...
}
```

### Frontend: Button Logic
```typescript
const canRequestToJoin = 
    !match.isCreator && 
    match.status === 'OPEN' && 
    !match.hasRequested &&  // ← Prevents duplicate
    match.currentPlayers < match.requiredPlayers;

{canRequestToJoin && (
    <button onClick={handleRequestToJoin}>
        Request to Join
    </button>
)}

{match.hasRequested && match.requestStatus === 'ACCEPTED' && (
    <div className="success-badge">
        ✅ Request Accepted - Check your email!
    </div>
)}
```

---

## 🔍 Verification Commands

### Check Database:
```sql
-- Check if notification was created
SELECT * FROM notifications 
WHERE user_id = [player_a_id] 
ORDER BY created_at DESC LIMIT 1;

-- Check match request status
SELECT * FROM match_requests 
WHERE request_id = [request_id];

-- Check match player count
SELECT current_players, required_players 
FROM matches 
WHERE match_id = [match_id];
```

### Check Backend Logs:
```bash
# Look for these log messages:
grep "Email sent successfully" application.log
grep "Notification created" application.log
grep "Match request accepted" application.log
```

### Check Frontend Network:
```javascript
// In browser console:
localStorage.getItem('token')  // Should have valid JWT
// Network tab: Look for 200 responses on notification endpoints
```

---

## ❌ Common Issues & Fixes

### ❌ Email Not Sent
**Problem:** No email received, no errors in logs
**Solution:** 
```bash
# Test email service manually:
curl -X POST http://localhost:8080/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'

# Check logs for SMTP errors
```

### ❌ Notification Not Appearing
**Problem:** Player A doesn't see notification
**Solution:**
```sql
-- Check if notification exists in DB:
SELECT * FROM notifications WHERE user_id = [player_a_id];

-- Check if NotificationService is injected:
// In MatchService constructor, verify:
private final NotificationService notificationService;
```

### ❌ Can Request Multiple Times
**Problem:** Player A can request same match twice
**Solution:**
```sql
-- Add UNIQUE constraint:
ALTER TABLE match_requests 
ADD CONSTRAINT unique_match_player 
UNIQUE (match_id, player_id);

-- Verify backend check:
if (matchRequestRepository.existsByMatchAndPlayer(match, player)) {
    throw new RuntimeException("Already requested");
}
```

---

## 📊 API Endpoints Reference

### Match Requests:
```
POST   /api/player/matches/{matchId}/request
       Body: { message: "I'd like to join!" }
       Response: { success: true, data: {...} }

PUT    /api/player/matches/requests/{requestId}
       Body: { action: "accept" }  // or "reject"
       Response: { success: true, data: {...} }

GET    /api/player/matches/{matchId}/requests
       Response: { success: true, data: [{...}, {...}] }
```

### Notifications:
```
GET    /api/notifications/unread-count
       Response: { success: true, data: { unreadCount: 5 } }

GET    /api/notifications/unread
       Response: { success: true, data: { data: [...], unreadCount: 5 } }

PUT    /api/notifications/{id}/read
       Response: { success: true, message: "Marked as read" }
```

---

## 🎨 UI States

### Match Detail Card States:

#### 1. Can Request (Show button)
```
Player: Not creator
Match: OPEN
Has Requested: No
Not Full: Yes
→ Show "Request to Join" button
```

#### 2. Request Pending (Show badge)
```
Has Requested: Yes
Request Status: PENDING
→ Show "⏳ Request Pending" badge
→ Hide request button
```

#### 3. Request Accepted (Show success)
```
Has Requested: Yes
Request Status: ACCEPTED
→ Show "✅ Request Accepted" badge
→ Show "Check your email" message
→ Hide request button
```

#### 4. Request Rejected (Show info)
```
Has Requested: Yes
Request Status: REJECTED
→ Show "❌ Request Rejected" badge
→ Optional: Allow re-request or show other matches
```

#### 5. Match Full (Show message)
```
Current Players >= Required Players
→ Show "Match is full" message
→ Hide request button
```

#### 6. Is Creator (Show management)
```
User is creator
→ Show "You are the organizer"
→ Show "Manage Requests" section
```

---

## 📈 Success Metrics

After implementation, you should see:

✅ **Backend:**
- Notification records in database
- Email service logs showing successful sends
- Match request status updates correctly
- Match player count increments

✅ **Frontend:**
- Notification bell shows badge count
- Clicking notification navigates correctly
- Request button disabled appropriately
- Success messages displayed

✅ **User Experience:**
- Player A receives email within seconds
- Player A sees notification within 30 seconds
- Player A cannot accidentally request twice
- Clear visual feedback at every step

---

## 🎉 You're Done!

After following these steps, your match request flow will:
1. ✅ Send beautiful HTML emails
2. ✅ Show in-app notifications
3. ✅ Prevent duplicate requests
4. ✅ Provide excellent user experience

---

## 📚 Full Documentation

For detailed information, see:
- **BACKEND_IMPLEMENTATION.md** - Complete Java code
- **FRONTEND_IMPLEMENTATION.md** - Complete React code
- **MATCH_REQUEST_FLOW_DIAGRAM.md** - Visual diagrams
- **README_MATCH_REQUEST_IMPLEMENTATION.md** - Complete overview

---

## 🆘 Need Help?

Check these in order:
1. **Troubleshooting section** in README_MATCH_REQUEST_IMPLEMENTATION.md
2. **Backend logs** for errors
3. **Browser console** for frontend errors
4. **Database queries** to verify data
5. **Network tab** to check API calls

**Good luck! 🚀**
