# 🧠 AI-Powered Study Assistant

A sophisticated full-stack web application that leverages OpenAI's GPT-4 to provide personalized study sessions, practice questions, and detailed explanations. Built with Next.js, TypeScript, and Supabase, this application offers an intelligent learning experience tailored to individual needs and skill levels.

## ✨ Features

- **AI-Generated Content**: Dynamic study materials created by GPT-4 based on user input
- **Personalized Learning**: Adapts difficulty and content based on user preferences
- **Interactive Study Sessions**: Multi-step learning process with concepts, practice, and review
- **Progress Tracking**: Monitor learning progress and session history
- **Multiple Question Types**: Multiple choice, true/false, and open-ended questions
- **Real-time Explanations**: Instant feedback and detailed explanations for all answers
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Vercel Ready**: One-click deployment to Vercel platform

## 🛠️ Technologies Used

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Forms**: React Hook Form
- **Markdown**: React Markdown with syntax highlighting
- **Notifications**: React Hot Toast

### Backend & APIs
- **AI Integration**: OpenAI GPT-4 API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript
- **Deployment**: Vercel (one-click deploy)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Supabase account and project
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-powered-study-assistant.git
   cd ai-powered-study-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.local.example .env.local
   
   # Edit .env.local with your configuration
   ```

4. **Environment Variables**
   ```bash
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Supabase Setup

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Database Schema**
   ```sql
   -- Users table (extends Supabase auth.users)
   CREATE TABLE public.profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE,
     full_name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Study sessions table
   CREATE TABLE public.study_sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES public.profiles(id),
     topic TEXT NOT NULL,
     difficulty TEXT NOT NULL,
     focus_area TEXT NOT NULL,
     score INTEGER,
     duration_minutes INTEGER,
     questions_answered INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Study progress table
   CREATE TABLE public.study_progress (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES public.profiles(id),
     topic TEXT NOT NULL,
     total_sessions INTEGER DEFAULT 0,
     average_score DECIMAL(5,2) DEFAULT 0,
     total_time_minutes INTEGER DEFAULT 0,
     last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own profile" ON public.profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own study sessions" ON public.study_sessions
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own study sessions" ON public.study_sessions
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can view own progress" ON public.study_progress
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can update own progress" ON public.study_progress
     FOR UPDATE USING (auth.uid() = user_id);
   ```

## 📱 Application Structure

### File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── StudySession.tsx   # Main study session component
│   ├── ProgressChart.tsx  # Learning progress visualization
│   ├── RecentTopics.tsx   # Recent study topics display
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── supabase.ts        # Supabase client configuration
│   ├── openai.ts          # OpenAI API configuration
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

### Component Architecture

- **HomePage**: Main landing page with study session initiation
- **StudySession**: Core learning experience with concepts, practice, and review
- **ProgressChart**: Visual representation of learning progress
- **RecentTopics**: Display of previously studied topics

## 🧠 AI Integration

### OpenAI GPT-4 Integration

The application integrates with OpenAI's GPT-4 API to generate:

1. **Core Concepts**: Fundamental explanations tailored to difficulty level
2. **Practice Questions**: Multiple question types with varying complexity
3. **Detailed Explanations**: Comprehensive answers with learning insights
4. **Session Summaries**: Personalized learning summaries

### Prompt Engineering

```typescript
const generateStudyContent = async (topic: string, difficulty: string, focus: string) => {
  const prompt = `
    Create a comprehensive study session for "${topic}" at ${difficulty} level.
    Focus area: ${focus}
    
    Include:
    1. 4 core concepts with clear explanations
    2. 3 practice questions (mix of multiple choice, true/false, open-ended)
    3. Detailed explanations for each answer
    4. A session summary
    
    Format as JSON with the structure:
    {
      "concepts": ["concept1", "concept2", ...],
      "questions": [...],
      "summary": "summary text"
    }
  `;
  
  // API call to OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  
  return JSON.parse(response.choices[0].message.content);
};
```

## 🗄️ Database Design

### Core Tables

1. **Profiles**: Extended user information
2. **Study Sessions**: Individual learning sessions
3. **Study Progress**: Aggregated learning metrics
4. **Topics**: Categorized study topics

### Data Relationships

- Users have many study sessions
- Study sessions contribute to progress metrics
- Topics are linked to sessions and progress

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel
   - Configure environment variables

2. **Environment Variables in Vercel**
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Deploy**
   - Vercel automatically builds and deploys
   - Custom domain configuration available

### Alternative Deployment Options

1. **Netlify**
   - Similar to Vercel process
   - Environment variable configuration required

2. **Self-Hosted**
   - Docker containerization
   - VPS or cloud server deployment

## 🔧 Configuration

### OpenAI API Settings

```typescript
// lib/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false, // Server-side only
});

// API configuration
export const OPENAI_CONFIG = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};
```

### Supabase Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

## 🧪 Testing

### Development Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build testing
npm run build
```

### API Testing

```bash
# Test OpenAI integration
curl -X POST /api/generate-content \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript","difficulty":"beginner","focus":"concepts"}'
```

## 📈 Performance & Optimization

### Next.js Optimizations

- **App Router**: Latest Next.js routing system
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting and lazy loading

### Database Optimization

- **Indexed Queries**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Real-time Updates**: Supabase real-time subscriptions

## 🔐 Security

### Authentication & Authorization

- **Supabase Auth**: Secure user authentication
- **Row Level Security**: Database-level access control
- **API Key Protection**: Server-side API calls only

### Data Protection

- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check API key validity
   - Verify API quota and billing
   - Check rate limiting

2. **Supabase Connection Issues**
   - Verify project URL and keys
   - Check database schema
   - Review RLS policies

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use proper ESLint configuration
- Write meaningful commit messages
- Include tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI team for GPT-4 API
- Supabase team for the excellent backend platform
- Next.js team for the amazing React framework
- Vercel team for seamless deployment

## 📞 Support

- **Documentation**: Check code comments and README
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Email**: Contact maintainers for urgent issues

---

**Built with ❤️ for intelligent learning and personal growth**
