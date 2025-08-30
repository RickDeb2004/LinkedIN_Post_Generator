# LinkedIn Post Generator

## Overview
This is a full-stack web application built with Next.js (React) that generates multiple LinkedIn-ready post drafts based on a user-provided topic and optional inputs. Powered by Google's Gemini AI (Gemini 1.5 Flash) and deployed on Vercel, the app fulfills the requirements of the internship assignment by demonstrating web deployment and AI agent design skills. It features a multi-step AI process for post generation, a polished LinkedIn-style UI, and performance optimizations, making it a robust and user-friendly tool.

## Features Implemented
The Minimum Viable Product (MVP) meets all assignment requirements and includes additional enhancements for a superior user experience and technical depth:

1. **Public Web App with User Inputs**:
   - Input form with required topic field and optional fields: tone (Professional, Casual, Inspirational), audience (General, Tech Professionals, Business Leaders), approximate length (100–500 words), and number of posts (minimum 3).
   - Clean, responsive UI with error handling (e.g., alerts for missing topic).
   - Deployed on Vercel at a public URL (e.g., https://linkedin-post-generator.vercel.app) with no login required.

2. **Agentic AI Workflow with Gemini**:
   - Uses Gemini 1.5 Flash (or Pro with subscription) for post generation via a multi-turn process:
     - **Planning Step**: Generates a post structure (hook, key points, CTA, hashtags) based on inputs and web search context.
     - **Drafting Step**: Creates unique post drafts using the plan, formatted in Markdown.
     - **Guardrails**: Filters out profanity or inappropriate content.
   - Integrates lightweight web search using Serper API (free tier) to add relevant context (e.g., recent stats or trends) to posts, with citations included where applicable.

3. **LinkedIn-Style Post Preview**:
   - Outputs are rendered as cards mimicking LinkedIn’s post UI, including:
     - Profile image (placeholder or user-specific if authenticated).
     - Author name and timestamp.
     - Markdown-rendered content (via `react-markdown`) with proper formatting for headings, bold, italics, bullet lists, and links.
     - Action buttons (e.g., Copy) styled to match LinkedIn’s aesthetic.

4. **Performance Metrics**:
   - Displays latency (generation time in seconds, e.g., “Generation took 2.5 seconds”).
   - Estimates token usage (words × 1.3, as Gemini API lacks native token metadata) shown as “Estimated tokens used: X”.

5. **User-Friendly Output Options**:
   - **Copy-to-Clipboard**: Each post has a “Copy” button to copy content to the clipboard.
   - **PDF Export**: A button to export all posts as a PDF using `jspdf`, formatted for easy sharing or printing.

6. **Performance Optimizations**:
   - Static generation for the homepage (`export const dynamic = "force-static"`) for faster load times.
   - Memoized `PostCard` component to reduce React re-renders.
   - API caching (`revalidate = 3600`) for `/api/generate` to improve response times for repeated queries.

7. **Robust Error Handling**:
   - Displays user-friendly error messages (e.g., “Error generating posts. Please try again.”) for failed API calls.
   - Graceful fallback for web search failures to ensure uninterrupted post generation.

## Future Features
With additional time, the following enhancements would further improve the app’s functionality, interactivity, and technical sophistication:

1. **Interactive Hashtag and CTA Suggestions**:
   - Add a dedicated API route (`/api/suggestions`) to generate AI-powered hashtag and CTA suggestions for the topic.
   - Display suggestions as checkboxes (hashtags) and a dropdown (CTA) in the UI, allowing users to select them before generation.
   - Integrate selections into the post generation process for more tailored outputs.

2. **User Authentication for Personalized Previews**:
   - Implement GitHub OAuth using NextAuth.js to allow optional user login.
   - Use the user’s GitHub profile name and image in the LinkedIn-style post preview, replacing the placeholder for a personalized experience.

3. **Post Editing and Real-Time Preview**:
   - Add an “Edit” button to each post card, toggling a textarea for direct editing.
   - Show real-time Markdown previews of edits and update the PDF export to include edited content.

4. **Analytics Dashboard**:
   - Integrate Vercel Postgres to log generation data (e.g., topics, user IDs).
   - Create an `/analytics` page showing top topics and usage stats, demonstrating scalability and data-driven insights.

5. **AI-Powered Post Scoring**:
   - Add a step where Gemini evaluates each post for engagement potential (e.g., clarity, hook strength) and provides a score and feedback.
   - Display scores in the UI (e.g., “Engagement Score: 8/10 – Strong hook, add more specificity.”).

## Tech Stack
- **Frontend**: Next.js (React), JavaScript, `react-markdown` for rendering Markdown, `jspdf` for PDF export.
- **Backend**: Next.js API routes, `@google/generative-ai` for Gemini integration, Serper API for web search.
- **Styling**: Tailwind CSS (via Next.js) for responsive, LinkedIn-like UI.
- **Deployment**: Vercel (free tier) with environment variables for secure API key storage.
- **Dependencies**: Minimal, using free-tier-compatible libraries to meet assignment rules.

## Set Up Environment Variables:
  **Create a .env.local file:**
  GOOGLE_API_KEY=your-google-ai-api-key-here
SERPER_API_KEY=your-serper-api-key-here



## Setup Instructions
1. **Clone the Repository**:
