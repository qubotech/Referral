# 🚀 SUPER SIMPLE Google Sheets Setup (5 Minutes!)

## Step 1: Create Your Google Sheet

1. Go to: https://sheets.google.com
2. Click **+ Blank** to create a new sheet
3. In **Row 1**, add these column headers (copy-paste this):
   ```
   id	name	email	password	referralCode	referredBy	createdAt
   ```

## Step 2: Make It Public

1. Click the **Share** button (top right)
2. Click **"Change to anyone with the link"**
3. Make sure it's set to **"Viewer"** (or "Editor" if you want to add users directly)
4. Click **"Copy link"**
5. Click **"Done"**

## Step 3: Add Sample User (Optional for Testing)

Add this test user in Row 2:
```
test123	Test User	test@example.com	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL55h7UK	REFTEST	testuser	2025-12-10T00:00:00.000Z
```

**Note**: Password is already hashed. The actual password is: `password123`

## Step 4: Update .env File

1. Open `server/.env`
2. Find this line:
   ```
   GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0
   ```
3. **Replace it** with your copied link

## Step 5: Restart Server

```bash
npm start
```

## ✅ That's It!

The server will now:
- ✅ Read users from your Google Sheet
- ✅ Validate login credentials
- ✅ Check referral codes

## 📝 Adding New Users

Since the sheet is read-only from the backend, you have 2 options:

### Option A: Add Manually to Sheet
1. Open your Google Sheet
2. Add a new row with user data
3. For password, use an online bcrypt generator: https://bcrypt-generator.com/
4. Generate a referral code like: `REF` + random 6 characters

### Option B: Use Google Forms (Recommended)
1. Create a Google Form linked to your sheet
2. Users fill the form to register
3. Form automatically adds rows to your sheet

## 🔍 Testing

**Login with test user:**
```json
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

## 🎯 Column Meanings

- **id**: Unique user ID (use any unique value like `user1`, `user2`)
- **name**: User's full name
- **email**: User's email (must be unique)
- **password**: Bcrypt hashed password (use https://bcrypt-generator.com/)
- **referralCode**: User's unique referral code (like `REFABC123`)
- **referredBy**: Who referred this user (their referralCode)
- **createdAt**: Timestamp when user registered

## ⚠️ Important Notes

- Sheet must be PUBLIC (anyone with link)
- Don't share the link publicly as it contains user data
- Passwords are hashed so they're safe even if someone sees the sheet
- For production, consider making the sheet private and using service accounts

## 🐛 Troubleshooting

**"Error fetching Google Sheet"**
- Make sure the sheet is public
- Check that the URL in .env is correct
- Make sure sheet has the exact column headers

**"Invalid Credentials" even with correct password**
- Password in sheet must be bcrypt hashed
- Use: https://bcrypt-generator.com/
- Rounds: 10

---

**Need help?** Just paste your Google Sheet link and I'll verify it!
