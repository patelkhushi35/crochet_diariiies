# Crochet_Diariiies - Handmade Crochet E-commerce

A beautiful, modern, premium MERN stack e-commerce website for a handmade crochet brand.

## 🌟 Features

### Customer Features
- **Beautiful Homepage** - Hero section, featured products, categories, Instagram feed
- **Shop Page** - Filterable, sortable product grid with pagination
- **Product Details** - Image gallery, color/size selection, reviews, tabs
- **Custom Orders** - Beautiful form with image uploads, color picker
- **Cart & Checkout** - Persistent cart, coupon codes, multiple payment methods
- **Order Tracking** - Real-time status updates with timeline
- **User Profile** - Addresses, wishlist, order history, password management
- **Gallery** - Instagram-style masonry grid with lightbox
- **WhatsApp Integration** - Floating chat button with contextual messages

### Admin Features
- **Dashboard** - Stats, recent orders, revenue charts
- **Product Management** - CRUD with images, variants, SEO
- **Order Management** - Status workflow, filtering, pagination
- **Custom Orders** - Status updates, quotations, internal notes
- **User Management** - View customers, orders, addresses, wishlists
- **Gallery Management** - Drag-and-drop reordering
- **Review Moderation** - Approve/reject customer reviews

### Technical Features
- **MERN Stack** - MongoDB, Express, React, Node.js
- **Authentication** - JWT with HTTP-only cookies, OTP email verification
- **Payments** - Razorpay integration (UPI, Cards, Net Banking, COD)
- **Image Upload** - Cloudinary with multiple file support
- **Email** - Nodemailer with beautiful templates
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Accessibility** - WCAG AA compliant, keyboard navigation
- **Performance** - Lazy loading, optimized images, code splitting

## 🎨 Design System

### Colors
- **Primary**: Cream/Ivory (`#FDF2F8`)
- **Accent**: Dusty Pink (`#EC4899`), Sage Green (`#22C55E`)
- **Text**: Dark Brown (`#831843`)
- **Background**: Warm Beige gradients

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)

### Components
- Rounded cards (16-20px)
- Soft shadows
- Smooth transitions (200-300ms)
- Micro-interactions on hover/tap

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run seed  # Seed sample data
npm run dev   # Start development server
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env
# Edit .env with your API URL
npm install
npm run dev   # Start Vite dev server
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crochet-diaries
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=xxx
```

## 📁 Project Structure

```
Crochet-Orders/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Cloudinary, Razorpay, Email
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts (Auth, Cart, Wishlist)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # API client
│   │   ├── App.jsx         # Routes
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind + custom styles
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🛠️ Available Scripts

### Backend
```bash
npm run dev      # Development with nodemon
npm run start    # Production
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🔐 Authentication Flow

1. **Register/Login** - Email + password or OTP
2. **JWT Tokens** - Stored in HTTP-only cookies
3. **Protected Routes** - Client-side route guards
4. **Role-based Access** - Customer vs Admin routes

## 💳 Payment Integration

### Razorpay Setup
1. Create Razorpay account
2. Get Key ID and Secret
3. Add to environment variables
4. Configure webhooks for production

### Payment Methods Supported
- UPI (Google Pay, PhonePe, Paytm)
- Credit/Debit Cards
- Net Banking
- Cash on Delivery

## 📧 Email Templates

- OTP Verification
- Order Confirmation
- Order Status Updates
- Custom Order Updates
- Admin Notifications

## 🖼️ Image Management

### Cloudinary
- Automatic optimization (WebP, AVIF)
- Responsive transformations
- Folder organization
- CDN delivery

### Image Guidelines
- Product: 800x1000px (4:5 ratio)
- Gallery: 600x600px (1:1 ratio)
- Hero: 1920x1080px
- Thumbnails: 200x200px

## 🌐 Deployment

### Backend (Node.js)
- **Platform**: Railway, Render, Heroku, DigitalOcean
- **Database**: MongoDB Atlas
- **Environment**: Set all production env vars

### Frontend (Vite + React)
- **Platform**: Vercel, Netlify, Vercel
- **Build**: `npm run build`
- **Output**: `dist/` folder

### Docker (Optional)
```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## 📱 Mobile Optimization

- Touch targets ≥ 44px
- Sticky bottom cart bar
- Swipeable image galleries
- Bottom sheet modals
- Reduced motion support

## ♿ Accessibility

- Semantic HTML5
- ARIA labels & roles
- Focus visible states
- Color contrast ≥ 4.5:1
- Keyboard navigation
- Screen reader support
- `prefers-reduced-motion` respected

## 🔒 Security

- Helmet.js for headers
- CORS configuration
- Rate limiting (express-rate-limit)
- Input validation (express-validator)
- JWT with secure cookies
- Password hashing (bcryptjs)
- XSS protection

## 📊 Performance

- Code splitting (React.lazy)
- Image lazy loading
- Service worker (PWA ready)
- Bundle analysis
- Lighthouse CI ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - feel free to use for your own crochet business!

## 💕 Credits

Built with love for Crochet_Diariiies

- **Design**: UI/UX Pro Max guidelines
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Images**: Unsplash (placeholder)

---

**Made with yarn, one stitch at a time.** 🧶