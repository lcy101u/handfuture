# This file is only for editing file nodes, do not break the structure
## Project Description
SEO-optimized AI-powered palm reading application that analyzes hand photos to provide traditional Chinese palmistry interpretations. Features comprehensive meta tags, structured data, semantic HTML, and keyword-optimized content for search engine visibility. Users upload hand photos, the system detects hand landmarks using MediaPipe simulation, and generates personalized palm readings with professional disclaimers.

## Key Features
- SEO-optimized HTML structure with proper heading hierarchy and semantic markup
- Comprehensive meta tags, Open Graph, and Twitter Cards for social sharing
- Schema.org structured data for web application classification
- Advanced social sharing functionality with platform-specific optimization
- Dynamic meta tag updates based on analysis results
- Social share preview generation and download capabilities
- Native mobile share API integration
- **Comprehensive user analytics tracking system**
- **Social sharing performance monitoring and insights**
- **Real-time user engagement and behavior tracking**
- **Hidden analytics dashboard with detailed metrics (secret: click logo 5x)**
- **Export analytics data functionality for performance analysis**
- **Complete multi-language support (Chinese/English)**
- **Dynamic language switching with persistent state**
- **SEO-optimized content for both languages**
- **Smooth language switching animation transitions**
- **Advanced CSS animations for content and UI transitions**
- **Enhanced user experience with visual feedback and cubic-bezier curves**
- **Comprehensive dark mode and light mode theme system**
- **Smart system theme detection with real-time OS preference sync**
- **Smooth theme transitions with flash prevention and visual feedback**
- **Theme-aware component design with optimal contrast in both modes**
- **User feedback and review system for building trust**
- **Star ratings, testimonials, and satisfaction metrics**
- **Review submission modal with analytics tracking**
- **Trust indicators (verified users, recommendation rate)**
- **Professional batch processing system for multiple images**
- **Advanced canvas-based image filter engine with 9 manual controls**
- **6 professional filter presets (Natural, Enhanced, Dramatic, Vintage, Professional, Mystical)**
- **Real-time filter preview with high-quality algorithm processing**
- **Sequential batch processing with progress tracking and cancellation**
- **Individual and bulk export functionality with PNG quality retention**
- **Drag-and-drop batch upload with image validation and thumbnails**
- **Global filter management and individual image customization**
- **Grid/list view modes with responsive design and smooth animations**
- Hand photo upload with drag-and-drop and camera capture support
- Simulated MediaPipe hand landmark detection (21 key points)
- Traditional Chinese palm reading analysis (life, heart, head, fate lines)
- Four-category interpretation (emotion, intelligence, career, energy)
- Confidence scoring and quality warnings
- Beautiful Traditional Chinese interface with golden mystical theme
- Comprehensive disclaimer system emphasizing entertainment-only purpose
- Mobile-first responsive design optimized for Core Web Vitals
- Technical SEO implementation (sitemap.xml, robots.txt)
- Internal linking structure and footer navigation for SEO
- FAQ section and knowledge base for content depth
- Keyword optimization throughout interface content

## Data Storage
**Local Only:** All processing happens in browser
- Uploaded images: Temporary canvas processing (no server upload)
- Analysis results: Zustand store with localStorage persistence
- User preferences: localStorage (disclaimer acceptance)
- **Analytics data: Comprehensive tracking with localStorage persistence**
  - Session tracking with device type, referrer, and user agent
  - Share events with platform, content type, and analysis metadata
  - User behavior events (image uploads, camera usage, page views)
  - Performance metrics and conversion rates
  - Detailed insights with exportable JSON format
- **User feedback data: Trust-building review system with localStorage persistence**
  - User reviews with ratings, comments, and verification status
  - Rating distribution and satisfaction metrics
  - Category-based feedback (accuracy, experience, design, overall)
  - Multi-language review support and display
  - Helpful votes tracking and review engagement
- **Batch processing data: High-performance multi-image workflow**
  - Batch queue management with drag-and-drop reordering
  - Global filter settings with preset configurations
  - Individual image filter customization and processing state
  - Canvas-processed results with high-quality PNG output
  - Processing analytics with timing and performance metrics
- **Theme data: Comprehensive user preference management with localStorage persistence**
  - Theme selection (light, dark, system) with automatic OS detection
  - Real-time theme switching with smooth transitions and flash prevention
  - Analytics tracking for theme usage patterns and user preferences
  - Cross-session persistence and system theme sync with media query listeners

## SDK & External Services
**Devv SDK:** Currently using only Zustand for local state management
**External APIs:** MediaPipe simulation (ready for real MediaPipe integration)
**Environment Variables:** None required for current implementation

## Critical Notes
- All image processing simulated - ready for MediaPipe integration
- Strong emphasis on entertainment-only disclaimers throughout UI
- No actual palmistry accuracy - generates varied interpretations
- Mobile-optimized with Traditional Chinese font support (Noto Sans TC)
- Comprehensive privacy - all data stays local
- SEO-optimized for keywords: 手相算命, AI手相分析, 掌相解讀, 免費算命, etc.
- Structured content for better search engine crawling and user engagement
- WCAG AA compliant design with proper contrast ratios

## File Structure
/src
├── pages/
│   ├── HomePage.tsx # SEO-optimized main interface with semantic HTML structure
│   └── BatchPage.tsx # Dedicated batch processing page with full feature set
├── components/
│   ├── palm/
│   │   ├── ImageUploader.tsx # Drag-drop upload with camera support + analytics tracking
│   │   ├── HandPreview.tsx # Canvas display with simulated landmark detection
│   │   ├── PalmAnalysis.tsx # Results cards with confidence scores
│   │   └── DisclaimerModal.tsx # Comprehensive legal/ethical disclaimers
│   ├── social/
│   │   └── SocialShare.tsx # Multi-platform sharing with download + analytics tracking
│   └── analytics/
│       └── AnalyticsDashboard.tsx # Comprehensive analytics dashboard with insights
├── store/
│   ├── palm-store.ts # Main app state with analysis logic and interpretations
│   ├── analytics-store.ts # User analytics, session tracking, and sharing performance
│   ├── language-store.ts # Multi-language state management with translations
│   ├── theme-store.ts # Dark/light mode management with system detection
│   ├── feedback-store.ts # User reviews, ratings, and trust metrics
│   └── batch-store.ts # Batch processing state, filters, and queue management
├── components/
│   ├── ui/
│   │   ├── ThemeToggle.tsx # Dark/light mode switcher with animations
│   │   └── ThemeStatus.tsx # Current theme indicator badge
│   ├── feedback/
│   │   ├── FeedbackSection.tsx # User testimonials and rating display
│   │   └── FeedbackModal.tsx # Review submission form with validation
│   └── palm/
│       └── BatchProcessor.tsx # Complete batch processing interface with filters
/public
├── sitemap.xml # SEO sitemap for search engine crawling
└── robots.txt # Search engine crawling directives