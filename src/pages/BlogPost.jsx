import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, Share2, Copy, CheckCircle2 } from 'lucide-react';
import Footer from '../components/Footer';
import { BLOG_POSTS } from './Blog'; // Make sure this import points to your actual Blog.jsx file

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Find the post that matches the URL slug
  const post = BLOG_POSTS.find(p => p.slug === slug);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // If someone types a random URL, boot them back to the main blog page
  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) return null; // Prevents flashing while redirecting

  // Handle Share Link Copy
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 pt-32 pb-20 overflow-x-hidden">
      <Helmet>
        <title>{post.title} — ShopLink.vi</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Ambient glow */}
      <div className="fixed top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none z-0 flex justify-center">
        <div className="w-[800px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm mb-10 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Blog
        </Link>

        {/* ── ARTICLE HEADER ── */}
        <header className="mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="inline-block bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20">
            {post.category}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800/60 py-6">
            
            {/* Author & Meta */}
            <div className="flex items-center gap-6">
              {post.author && (
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 shadow-sm" />
                  <span className="font-bold text-slate-900 dark:text-white">{post.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 hidden sm:flex">
                 <Calendar size={16} className="text-slate-400" /> {post.date}
              </div>
              <div className="flex items-center gap-2 hidden sm:flex">
                 <Clock size={16} className="text-slate-400" /> {post.readTime}
              </div>
            </div>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800"
            >
              {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Share2 size={16} />} 
              <span className="font-bold">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </header>

        {/* ── HERO IMAGE ── */}
        <div className="w-full h-[300px] md:h-[450px] rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl border border-slate-100 dark:border-slate-800 relative group animate-in zoom-in-95 fade-in duration-1000 delay-200">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* ── ARTICLE BODY ── */}
        {/* We use strict Tailwind child selectors here so you don't need external markdown plugins */}
        <article className="
          max-w-none text-lg leading-relaxed mb-24
          [&>p]:mb-8 [&>p]:text-slate-600 [&>p]:dark:text-slate-400 [&>p]:font-medium
          [&>h2]:text-3xl [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:dark:text-white [&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:tracking-tight
          [&>h3]:text-2xl [&>h3]:font-black [&>h3]:text-slate-900 [&>h3]:dark:text-white [&>h3]:mb-4 [&>h3]:mt-8
          [&>ul]:mb-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:text-slate-600 [&>ul>li]:dark:text-slate-400 [&>ul>li]:font-medium
          [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:text-slate-700 [&>blockquote]:dark:text-slate-300 [&>blockquote]:my-8 [&>blockquote]:bg-emerald-50 [&>blockquote]:dark:bg-emerald-500/5 [&>blockquote]:py-4 [&>blockquote]:rounded-r-2xl
        "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── BOTTOM CTA ── */}
        <div className="bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Ready to upgrade your hustle?</h3>
            <p className="text-slate-400 mb-8 font-medium text-lg max-w-lg mx-auto">
              Stop fighting with disorganized DMs. Launch your ShopLink store today and start receiving perfectly formatted WhatsApp orders.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/30">
              Create Your Free Store
            </Link>
          </div>
        </div>

      </div>
      <Footer className="pt-[100px]" />
    </div>
  );
}