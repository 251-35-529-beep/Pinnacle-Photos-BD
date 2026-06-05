# 🎯 Pinnacle Photos BD

A professional photo management website for photographers to showcase their best work across different categories.

## Features

✨ **4 Photo Segments:**
- 🏆 Photo of the Month
- ⭐ Signature Moment of the Day
- 📅 Weekly Best Photo
- 🎨 Theme Best Photo

🔐 **Security System:**
- Master password for admin login
- Individual passwords for each segment
- All data stored locally in browser

📸 **Photo Management:**
- Upload and display photos
- Add photographer name and date
- Add photo descriptions
- Real-time preview

## Default Passwords

**Master Password:** `admin123`

**Segment Passwords:**
- Photo of the Month: `photo123`
- Signature Moment: `signature123`
- Weekly Best: `weekly123`
- Theme Best: `theme123`

⚠️ **Change these passwords for security!**

## How to Use

1. Open the website in your browser
2. Login with Master Password
3. Click on any segment
4. Enter the segment password
5. Upload photo with photographer name and date
6. Save and view your display

## Data Storage

All photos and information are stored in your browser's localStorage. They persist even after closing the browser.

## Customization

Edit the passwords in `script.js`:
```javascript
const MASTER_PASSWORD = "your_password";
const SEGMENT_PASSWORDS = {
    1: "password1",
    2: "password2",
    3: "password3",
    4: "password4"
};
```

## Files

- `index.html` - Main structure
- `style.css` - Design and styling
- `script.js` - Functionality and password system
- `README.md` - Documentation

Made with ❤️ for Pinnacle Photos BD