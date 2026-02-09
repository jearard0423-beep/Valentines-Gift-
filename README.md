# 💝 Valentine's Day Surprise Gift Box

A beautiful interactive web page featuring a 3D gift box that opens to reveal a heart-shaped message with adorable photos arranged like a flock of birds.

## 📋 Setup Instructions

### 1. **Add Your Images**
Place 5 images in the project directory (or create an `images/` folder):
- **File names:** `PIC1.jpg`, `PIC2.jpg`, `PIC3.jpg`, `PIC4.jpg`, `PIC5.jpg`
- **Supported formats:** JPG, PNG, GIF, WebP
- **Recommended size:** 400×300px or similar (landscape orientation works best)
- **Paths tested:**
  - Root directory: `PIC1.jpg`, `PIC2.jpg`, etc.
  - Subfolder: `images/PIC1.jpg`, `images/PIC2.jpg`, etc.

### 2. **Add Your Audio (Optional but Recommended)**
To enable music playback, place the MP3 file in the root directory:
- **Primary filename:** `wave to earth - love. (Official Lyric Video).mp3`
- **Alternative names (auto-detected):** 
  - `love-wave-to-earth.mp3`
  - `Love.mp3`
- **Audio folder fallback:** `audio/` subfolder with any of the above names
- **Note:** Browsers may require user interaction (click) before playing audio due to autoplay policies

### 3. **Run the Project**
Choose one method:

#### Option A: Python (easiest)
```bash
python -m http.server 8000
```
Then open http://localhost:8000

#### Option B: Node.js
```bash
npx http-server
```

#### Option C: Live Server (VS Code)
- Install the "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

#### Option D: Direct Open
- Simply double-click `index.html` to open in your browser (limited functionality)

## 🎨 Features

✨ **3D Gift Box**
- Click to open with smooth rotating lid animation
- Decorative ribbon and bow with physics-like animation
- Professional 3D perspective effect

💖 **Heart-Shaped Message**
- "Will you be my Valentine?" centered in a pink heart shape
- Decorative vine and flower border around the heart
- Beautiful gradient background

🐦 **Bird Formation**
- Your 5 photos animate into view like a flock of birds
- Images appear below the heart in a grouped formation
- Smooth staggered pop-in animation with depth effects
- Responsive layout that adapts to mobile screens

🎉 **Interactive Elements**
- "Yes" button reveals an adorable Tenor bear GIF
- Click outside the GIF to close it
- Confetti burst when the box opens
- Mouse trail effect using your photos

🎵 **Music**
- Optional background music (auto-detected filename)
- Play/pause button to control music playback
- Music plays once when box opens

📱 **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Touch-friendly button sizes
- Adapts layout for smaller screens

## 🎯 How to Use

1. **Open** the page in a web browser
2. **Click** the gift box to open it
3. **Watch** the heart shape with your message appear
4. **See** your photos animate in as a flock of birds below
5. **Click** the "Yes" button for a surprise GIF
6. **Control** the music with the play/pause button at the bottom
7. **Move** your mouse to create an image trail effect

## 🔍 Troubleshooting

**Images not showing?**
- Verify filenames are exactly: `PIC1.jpg`, `PIC2.jpg`, `PIC3.jpg`, `PIC4.jpg`, `PIC5.jpg` (case-sensitive)
- Check file location: either root directory or `images/` subfolder
- Ensure browser can read the file format

**Music not playing?**
- Verify MP3 filename matches one of: 
  - `wave to earth - love. (Official Lyric Video).mp3` (exact spaces/punctuation)
  - `love-wave-to-earth.mp3`
  - `Love.mp3`
- Check browser console (F12) for error messages
- Some browsers block autoplay; click the play button manually
- Ensure browser has permission to play audio

**Layout looks broken on mobile?**
- The page is fully responsive; try rotating your device
- Check browser zoom level (should be 100%)
- Clear browser cache if styling looks off

**GIF not loading?**
- Ensure you have an active internet connection (GIF loads from Tenor)
- Try refreshing the page

## 📝 File Structure

```
Valentines-Gift-/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive behavior
├── README.md           # This file
├── PIC1.jpg            # Your photos (optional location)
├── PIC2.jpg
├── PIC3.jpg
├── PIC4.jpg
├── PIC5.jpg
├── images/             # Alternative photo location (optional)
│   ├── PIC1.jpg
│   ├── PIC2.jpg
│   └── ...
├── audio/              # Alternative audio location (optional)
│   └── (MP3 file)
└── (Optional audio file in root)
```

## 🎓 Technical Details

- **HTML5** / **CSS3** / **Vanilla JavaScript**
- **3D Transforms:** CSS perspective, preserve-3d, rotateX
- **Animations:** CSS transitions, @keyframes, requestAnimationFrame
- **Audio:** HTML5 Audio API with auto-detection
- **SVG:** Heart clip-path for precise shape clipping
- **Responsive:** CSS media queries for all screen sizes

## 📄 License

Free to use and customize for your Valentine!

---

Made with ❤️ for a special someone!