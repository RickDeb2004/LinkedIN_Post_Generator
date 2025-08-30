"use client";

import { useState, useEffect, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";


const PostCard = memo(({ post, index, onCopy }) => (
  <div className="card linkedin-preview">
    <div className="post-header">
      <img src="/placeholder-user.png" alt="User" className="profile-img" />
      <div>
        <span className="post-author">Your Name</span>
        <span className="post-time">Just now</span>
      </div>
    </div>
    <h2>Post Option {index + 1}</h2>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post}</ReactMarkdown>
    <div className="post-actions">
      <button className="copy-btn" onClick={() => onCopy(post)}>
        Copy
      </button>
    </div>
  </div>
));

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("general");
  const [length, setLength] = useState(200);
  const [postCount, setPostCount] = useState(3);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(null);
  const [estimatedTokens, setEstimatedTokens] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!topic) {
      setError("Topic is required!");
      return;
    }
    setLoading(true);
    setPosts([]);
    setLatency(null);
    setEstimatedTokens(null);
    setError(null);

    const startTime = Date.now();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, audience, length, postCount }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setPosts(data.posts);
      setEstimatedTokens(data.estimatedTokens);
      const endTime = Date.now();
      setLatency((endTime - startTime) / 1000); // in seconds
    } catch (error) {
      console.error(error);
      setError("Error generating posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (post) => {
    navigator.clipboard.writeText(post);
    alert("Post copied to clipboard!");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    posts.forEach((post, index) => {
      doc.text(`Post ${index + 1}`, 10, yOffset);
      yOffset += 10;
      doc.text(post, 10, yOffset, { maxWidth: 180 });
      yOffset += 50; 
    });
    doc.save("linkedin-posts.pdf");
  };

  return (
    <div className="container">
      <h1>LinkedIn Post Generator</h1>
      <p>Enter a topic and optional details to generate post drafts.</p>

      <label>Topic (required):</label>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g., cold-start strategies for marketplaces"
      />

      <label>Tone:</label>
      <select value={tone} onChange={(e) => setTone(e.target.value)}>
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
        <option value="inspirational">Inspirational</option>
      </select>

      <label>Audience:</label>
      <select value={audience} onChange={(e) => setAudience(e.target.value)}>
        <option value="general">General</option>
        <option value="tech">Tech Professionals</option>
        <option value="business">Business Leaders</option>
      </select>

      <label>Approximate Length (words):</label>
      <input
        type="number"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        min="100"
        max="500"
      />

      <label>Number of Posts (min 3):</label>
      <input
        type="number"
        value={postCount}
        onChange={(e) => setPostCount(Math.max(3, e.target.value))}
        min="3"
      />

      <button onClick={handleGenerate} disabled={loading}>
        Generate Posts
      </button>

      {loading && <p className="loading">Generating...</p>}
      {error && <p className="error">{error}</p>}
      {latency && <p>Generation took {latency} seconds.</p>}
      {estimatedTokens && <p>Estimated tokens used: {estimatedTokens}</p>}

      {posts.length > 0 && (
        <button onClick={handleExportPDF} className="export-btn">
          Export as PDF
        </button>
      )}

      {posts.map((post, index) => (
        <PostCard key={index} post={post} index={index} onCopy={handleCopy} />
      ))}
    </div>
  );
}


export const dynamic = "force-static";
