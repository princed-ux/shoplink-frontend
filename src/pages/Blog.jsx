import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, Calendar, Clock, ArrowRight, 
  TrendingUp, Sparkles, Mail, ChevronRight, CheckCircle2 
} from 'lucide-react';
import Footer from '../components/Footer';

// --- MOCK DATA FOR BLOG POSTS ---
export const BLOG_POSTS = [
  {
    id: 1,
    slug: 'how-lagos-baker-doubled-sales',
    category: 'Success Story',
    title: 'How a Lagos baker doubled her weekend sales using ShopLink',
    excerpt: 'Meet Sarah, the founder of SweetTooth NG. By switching from confusing Instagram DMs to a streamlined ShopLink store, she eliminated order errors and doubled her weekend revenue.',
    // Added full content for the dynamic route
    content: `
      <p>Before ShopLink, my weekends were a nightmare of mixed-up orders and angry customers on WhatsApp.</p>
      <h2>The Problem with "DM for Price"</h2>
      <p>I was spending more time calculating totals and sending account numbers than actually baking my cakes. When you have 50 people messaging you on a Friday evening asking "is the red velvet still available?", things get missed.</p>
      <h2>The ShopLink Solution</h2>
      <p>Setting up my ShopLink took 10 minutes. I uploaded my weekend menu, set my stock limits, and put the link in my Instagram bio. Now, customers just click, add to cart, and check out. I receive a perfectly formatted WhatsApp message with their exact order and delivery address. My sales literally doubled because I wasn't losing customers to slow reply times.</p>
    `,
    date: 'April 4, 2026',
    readTime: '5 min read',
    // Updated image to feature a Black baker/entrepreneur
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a8e1b?auto=format&fit=crop&q=80&w=1200&h=800',
    author: { name: 'ShopLink Team', avatar: 'https://ui-avatars.com/api/?name=ShopLink+Team&background=10b981&color=fff' },
    featured: true
  },
  {
    id: 2,
    slug: 'whatsapp-selling-tips-2026',
    category: 'Vendor Tips',
    title: '5 WhatsApp Selling Tips Every Vendor Needs in 2026',
    excerpt: 'The WhatsApp commerce landscape is changing fast. Here are five actionable strategies to keep your customers engaged and buying.',
    content: `<p>Coming soon...</p>`,
    date: 'April 1, 2026',
    readTime: '4 min read',
    // Updated image
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800&h=600',
    featured: false
  },
  {
    id: 3,
    slug: 'product-update-q2',
    category: 'Product Update',
    title: 'ShopLink Q2 Update: Faster load times and new themes',
    excerpt: 'We have been hard at work optimizing your storefronts. Your ShopLink links now load 40% faster on 3G networks.',
    content: `<p>Coming soon...</p>`,
    date: 'March 28, 2026',
    readTime: '3 min read',
    // Updated image
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800&h=600',
    featured: false
  },
  {
    id: 4,
    slug: 'aesthetic-product-photos',
    category: 'Vendor Tips',
    title: 'Taking aesthetic product photos with just your smartphone',
    excerpt: 'You do not need a professional DSLR camera to make your products look premium. Learn how to use natural light and basic phone settings.',
    content: `<p>Coming soon...</p>`,
    date: 'March 15, 2026',
    readTime: '6 min read',
    // Updated image
    image: 'https://images.unsplash.com/photo-1620063234958-3d88195a6396?auto=format&fit=crop&q=80&w=800&h=600',
    featured: false
  },
  {
    id: 5,
    slug: 'handling-difficult-customers',
    category: 'Vendor Tips',
    title: 'How to handle difficult customers professionally on WhatsApp',
    excerpt: 'De-escalation techniques and template messages you can use when a customer is unhappy with a delivery delay.',
    content: `<p>Coming soon...</p>`,
    date: 'March 2, 2026',
    readTime: '5 min read',
    // Updated image
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=600',
    featured: false
  },
  {
    id: 6,
    slug: 'introducing-analytics',
    category: 'Product Update',
    title: 'Now Live: Track your store views directly from your dashboard',
    excerpt: 'Stop guessing how much traffic you are getting. Our new analytics dashboard shows you exactly how many people click your link.',
    content: `<p>Coming soon...</p>`,
    date: 'February 18, 2026',
    readTime: '2 min read',
    // Updated image
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600',
    featured: false
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Vendor Tips', 'Success Story', 'Product Update'];

  const filteredPosts = activeCategory === 'All' 
    ? BLOG_POSTS.filter(post => !post.featured) 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setIsSubscribed(true);
        setEmail('');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 pt-24 pb-20 overflow-hidden">
      <Helmet>
        <title>Blog — ShopLink.vi</title>
        <meta name="description" content="Tips, stories, and product updates for modern WhatsApp vendors." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="px-6 py-12 lg:py-16 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full px-5 py-2 mb-6 shadow-sm">
            <BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">The Vendor's Playbook</span>
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-[1.05]">
            ShopLink <span className="text-emerald-500 italic">Blog</span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            Sales strategies, success stories, and the latest updates to help you scale your WhatsApp business.
          </p>
        </div>
      </section>

      {/* --- FEATURED POST --- */}
      {activeCategory === 'All' && featuredPost && (
        <section className="px-6 mb-20 max-w-7xl mx-auto relative z-10 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
          <Link to={`/blog/${featuredPost.slug}`} className="group block relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
            <div className="grid lg:grid-cols-2 gap-0 h-full">
              {/* Image Side */}
              <div className="relative h-64 lg:h-full overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
              </div>
              
              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500" />
                
                <div className="flex items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest relative z-10">
                  <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={14} className="animate-pulse" /> {featuredPost.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar size={14} /> {featuredPost.date}
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors relative z-10">
                  {featuredPost.title}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-md relative z-10">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                  <div className="flex items-center gap-3">
                    <img src={featuredPost.author.avatar} alt="Author" className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 shadow-sm" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{featuredPost.author.name}</p>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><Clock size={12} /> {featuredPost.readTime}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-emerald-500/30">
                    <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* --- CATEGORY FILTER --- */}
      <section className="px-6 mb-12 max-w-7xl mx-auto flex flex-wrap items-center justify-center lg:justify-start gap-3 relative z-10 animate-in fade-in duration-1000 delay-300">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === category 
                ? 'bg-slate-900 dark:bg-emerald-500 text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* --- POSTS GRID --- */}
      <section className="px-6 max-w-7xl mx-auto mb-32 relative z-10">
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link 
                to={`/blog/${post.slug}`} 
                key={post.id} 
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in fill-mode-both"
                style={{ animationDelay: `${(index + 2) * 150}ms`, animationDuration: '700ms' }}
              >
                {/* Post Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                    {post.category}
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col relative">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-[1.3] mb-3 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    Read Article <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 animate-in fade-in duration-500 shadow-sm">
            <TrendingUp size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-6 animate-bounce" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-slate-500 font-medium">We haven't published any articles in this category yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* --- NEWSLETTER CTA --- */}
      <section className="px-6 max-w-5xl mx-auto relative z-10 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500">
        <div className="bg-slate-900 dark:bg-[#064e3b] rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30 transform group-hover:rotate-12 transition-transform duration-500">
              {isSubscribed ? <CheckCircle2 size={28} /> : <Mail size={28} />}
            </div>
            
            {isSubscribed ? (
              <div className="animate-in zoom-in duration-500">
                 <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">You're on the list!</h2>
                 <p className="text-slate-400 dark:text-emerald-100 font-medium mb-10 text-lg">
                   Thanks for subscribing. Keep an eye on your inbox for the latest ShopLink updates.
                 </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Stay ahead of the curve.</h2>
                <p className="text-slate-400 dark:text-emerald-100 font-medium mb-10 text-lg">
                  Get the latest WhatsApp selling strategies and ShopLink updates delivered straight to your inbox every month. No spam, ever.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-slate-400 dark:placeholder-emerald-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium backdrop-blur-sm transition-all"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-emerald-500 text-white hover:bg-emerald-400 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/30 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer className="pt-[100px]" />
    </div>
  );
}