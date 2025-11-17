# World Changers - Egbodofo Joshua Mentorship Platform

A comprehensive mentorship platform combining marketing website features with a Learning Management System (LMS) for the **World Changers** program by Egbodofo Joshua.

## 🌟 Overview

The World Changers platform is designed to attract, vet, and manage applicants for an exclusive mentorship program focused on:
- Ethical Leadership
- Strategic Business Results
- Innovation and Scaling
- Personal and Professional Transformation

## ✨ Features

### Marketing Website
- **Home Page**: Hero section with value proposition and program overview
- **About Page**: Detailed mentor profile for Egbodofo Joshua
- **Curriculum Page**: 4-week deep-dive program breakdown
- **Testimonials Page**: Social proof from successful graduates
- **Apply Page**: Comprehensive application form
- **Contact Page**: Contact form and FAQ section

### LMS Dashboard (Member Portal)
1. **Goal-Setting & Accountability Hub**
   - Create and track weekly goals
   - Define what, how, and current progress
   - Automated email reminders (simulated)
   - Deadline tracking

2. **Peer Interaction & Progress Stream**
   - Share progress updates with images
   - Community engagement with "Value Added" voting
   - Real-time activity feed

3. **Mentor Reporting & Communication**
   - Receive detailed reports from mentor
   - View strengths, improvements, and next steps
   - Progress tracking and feedback

### Mentor Dashboard
- **Member Overview**: View all program members
- **Goal Monitoring**: Access all member goals and progress
- **Progress Review**: See all member updates
- **Report Writing**: Create and send detailed reports to members
- **Analytics**: Track program-wide statistics

## 🎨 Design

### Theme
- **Primary Color**: Deep Navy Blue (#0A1929)
- **Accent Colors**: Gold (#D4AF37) and Silver (#C0C0C0)
- **Style**: Energetic Luxury, Professional Impact, Executive Excellence
- **Typography**: Clean sans-serif fonts (Inter, Poppins)

### Responsive Design
Fully responsive across:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 📁 Project Structure

```
Joshuaegbodofo/
├── index.html                 # Home page
├── pages/
│   ├── about.html            # About Egbodofo Joshua
│   ├── curriculum.html       # 4-week program curriculum
│   ├── testimonials.html     # Success stories
│   ├── apply.html            # Application form
│   └── contact.html          # Contact page
├── dashboard/
│   ├── login.html            # Member/Mentor login
│   ├── index.html            # Member dashboard
│   └── mentor.html           # Mentor dashboard
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   ├── about.css         # About page styles
│   │   ├── curriculum.css    # Curriculum page styles
│   │   ├── dashboard.css     # Dashboard styles
│   │   └── mentor.css        # Mentor dashboard styles
│   ├── js/
│   │   ├── main.js           # Main JavaScript
│   │   ├── apply.js          # Application form handling
│   │   ├── contact.js        # Contact form handling
│   │   ├── login.js          # Authentication
│   │   ├── dashboard.js      # Member dashboard functionality
│   │   └── mentor.js         # Mentor dashboard functionality
│   └── images/
│       └── egbodofo-joshua.jpg   # Mentor profile image
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- (Optional) A local web server for development

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IamWheelze/Joshuaegbodofo.git
   cd Joshuaegbodofo
   ```

2. **Add Mentor Image**
   - Place the mentor's image (`egbodofo-joshua.jpg`) in the `assets/images/` directory
   - Recommended size: 500x500px or larger, square aspect ratio

3. **Open the website**
   - Simply open `index.html` in your browser
   - Or use a local server: `python -m http.server 8000`

### Demo Credentials

**Member Login:**
- Email: `member@demo.com`
- Password: `password123`

**Mentor Login:**
- Email: `mentor@demo.com`
- Password: `mentor123`

## 🌐 GitHub Pages Deployment

This site is configured for GitHub Pages deployment.

### Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: World Changers platform"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select source: `main` branch, `/ (root)` folder
   - Save

3. **Access Your Site**
   - Your site will be available at: `https://iamwheelze.github.io/Joshuaegbodofo/`

## 💾 Data Storage

Currently, the platform uses **localStorage** for demo purposes:
- Member goals and progress
- Progress updates and interactions
- Mentor reports
- User authentication

### Future Backend Integration

For production, you should integrate with a backend service:

**Recommended Options:**
1. **Firebase** (easiest for static hosting)
   - Firebase Authentication
   - Firestore Database
   - Firebase Storage (for images)

2. **Supabase** (open-source alternative)
   - PostgreSQL database
   - Built-in authentication
   - Real-time subscriptions

3. **Custom Backend**
   - Node.js/Express
   - MongoDB/PostgreSQL
   - RESTful API

## 📧 Email Integration

The platform includes simulated email reminders for goals. To enable real emails:

1. **Use Email Service:**
   - SendGrid
   - Mailgun
   - AWS SES

2. **Implementation:**
   - Set up SMTP configuration
   - Create email templates
   - Schedule reminders based on goal deadlines

## 🔒 Security Notes

⚠️ **Important for Production:**
- Replace demo authentication with proper auth system
- Implement server-side validation
- Use environment variables for API keys
- Add CSRF protection
- Implement rate limiting
- Use HTTPS only

## 🛠️ Customization

### Update Mentor Information
Edit the mentor profile in:
- `pages/about.html`
- `assets/images/egbodofo-joshua.jpg`

### Modify Color Scheme
Update CSS variables in `assets/css/main.css`:
```css
:root {
    --primary-deep-blue: #0A1929;
    --accent-gold: #D4AF37;
    /* ... other colors */
}
```

### Add Firebase (Optional)

1. Create a Firebase project
2. Add Firebase config to your HTML:
   ```html
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>
   ```
3. Replace localStorage calls with Firestore operations

## 📱 Progressive Web App (PWA)

To convert to a PWA, add:
1. `manifest.json` file
2. Service worker for offline functionality
3. App icons

## 🎯 Program Details

**Duration**: 3 months (initial commitment)
**Content**: Structured for 2-year growth journey

### 4-Week Core Curriculum:
1. **Week 1**: Hope vs. Faith
2. **Week 2**: Wishes vs. Desires
3. **Week 3**: Why People Don't Have Desires
4. **Week 4**: Cultivating Desires

## 📞 Support

For questions or issues:
- Email: info@worldchangers.com
- Create an issue in this repository

## 📄 License

Copyright © 2024 World Changers - Egbodofo Joshua Mentorship Program. All Rights Reserved.

## 🙏 Acknowledgments

- Design inspired by modern SaaS platforms
- Built with vanilla HTML, CSS, and JavaScript
- Optimized for GitHub Pages deployment

---

**Built with ❤️ for World Changers**
