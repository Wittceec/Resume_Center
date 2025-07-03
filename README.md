# Data Center Explorer Resume

An interactive 3D resume website with a data center theme, perfect for IT professionals specializing in networking and Linux administration.

## 🚀 Features

- **3D Data Center Environment**: Navigate through a virtual data center with server racks
- **Interactive Sections**: Click on glowing racks to explore different resume sections
- **Smooth Animations**: GSAP-powered animations for professional transitions
- **Responsive Design**: Works on desktop and mobile devices
- **AI Integration**: Optional Gemini API integration for dynamic content generation
- **Terminal Aesthetic**: Roboto Mono font and cyberpunk styling

## 📋 Sections Included

1. **About** - Professional summary and background
2. **Experience** - Work history with data center and IT roles
3. **Projects** - Technical projects and home lab work
4. **Skills & Certifications** - Technical skills and professional certifications
5. **Contact** - Contact information and social links

## 🛠️ Setup Instructions

### 1. Basic Setup
1. Clone or download this repository
2. Open `index.html` in a web browser
3. The resume is ready to use!

### 2. Customization

#### Personal Information
Update the following sections in `index.html`:

**About Section (Lines ~95-100):**
```html
<p class="mb-4">I am a passionate IT professional with extensive data center experience...</p>
```

**Experience Section (Lines ~105-125):**
```html
<h3 class="font-bold text-white">Data Center Technician | Enterprise Solutions Inc.</h3>
<p class="text-sm text-gray-400 mb-2">2022 - Present</p>
```

**Skills Section (Lines ~140-160):**
```html
<li>• Linux Administration (Ubuntu, CentOS, RHEL)</li>
<li>• Network Configuration & Troubleshooting</li>
```

**Contact Section (Lines ~170-180):**
```html
<p class="text-lg text-white">📧 your.email@example.com</p>
<p class="text-lg text-white">📱 (555) 123-4567</p>
```

#### Optional: Gemini AI Integration
To enable AI-powered content generation:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace the empty `apiKey` variable in the JavaScript (around line 450):
```javascript
const apiKey = "your-actual-api-key-here";
```

**⚠️ Security Note**: Never commit your API key to version control. For production, use environment variables or a backend service.

### 3. GitHub Pages Deployment

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch" and choose `main` branch
4. Your resume will be available at `https://yourusername.github.io/repository-name`

## 🎨 Customization Tips

### Colors
The theme uses a cyberpunk color palette:
- Primary Blue: `#38bdf8`
- Background: `#0a0a1a`
- Text: `#e0e0e0`
- Accent: `#4ade80`

### Adding New Sections
1. Add a new panel div following the existing pattern
2. Update the `sections` array in JavaScript
3. Add a new hero rack position
4. Update the rack creation loop

### Styling
The resume uses Tailwind CSS for styling. You can modify classes directly in the HTML or add custom CSS in the `<style>` section.

## 📱 Mobile Optimization

The resume is fully responsive and includes:
- Touch support for mobile navigation
- Responsive panel sizing
- Optimized 3D rendering for mobile devices

## 🔧 Technical Details

- **3D Engine**: Three.js for 3D graphics
- **Animations**: GSAP for smooth transitions
- **Styling**: Tailwind CSS for responsive design
- **Font**: Roboto Mono for terminal aesthetic
- **AI Integration**: Google Gemini API (optional)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and customize it for your own use. If you make improvements that could benefit others, consider submitting a pull request!

## 📞 Support

If you need help customizing your resume or run into any issues, feel free to open an issue on GitHub.

---

**Happy job hunting! 🚀** 