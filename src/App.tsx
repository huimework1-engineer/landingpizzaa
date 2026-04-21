/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  ChevronRight, 
  Gift, 
  Zap, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Star, 
  Copy, 
  ShoppingBag,
  Ticket,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';

// --- Constants & Types ---

const PRIZES = [
  { label: 'Giảm 10%', value: 'PH10OFF', weight: 40 },
  { label: 'Giảm 20%', value: 'PH20OFF', weight: 25 },
  { label: 'Giảm 30%', value: 'PH30OFF', weight: 15 },
  { label: 'Freeship', value: 'PHFREE', weight: 15 },
  { label: 'Giảm 50%', value: 'PH50OFF', weight: 5 },
];

const BEST_SELLERS = [
  {
    id: 1,
    name: 'Pizza Cá Hồi Hạt Sen',
    image: 'https://i.postimg.cc/nC8n2rCp/image.png',
    price: 199000,
    category: 'Pizza Đặc Sản',
    isNew: true,
    description: 'Cá hồi thượng hạng hòa quyện cùng hạt sen bùi béo và tôm tươi giòn ngọt.'
  },
  {
    id: 2,
    name: 'Pizza Gà Hạt Sen',
    image: 'https://i.postimg.cc/dLKKdfx8/image.png',
    price: 179000,
    category: 'Pizza Đặc Sản',
    isNew: true,
    description: 'Sự kết hợp độc đáo giữa gà nướng thảo mộc, hạt sen và tôm.'
  },
  {
    id: 3,
    name: 'Pizza 4 Cheese Dừa Non',
    image: 'https://i.postimg.cc/Xp00FPzp/image.png',
    price: 189000,
    category: 'Mật Hoa Dừa',
    isNew: true,
    description: '4 loại phô mai hảo hạng phối hợp với dừa non Bến Tre thơm mát.'
  }
];

const REVIEWS = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    content: 'Quay trúng mã 30%, pizza giao nhanh nóng hổi, phô mai kéo sợi cực thích!',
    stars: 5,
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    content: 'Dịch vụ tuyệt vời, nhân viên giao hàng lễ phép. Sẽ tiếp tục ủng hộ The Pizza Company.',
    stars: 5,
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    content: 'Chương trình săn code rất thú vị, mình quay 1 lần là trúng ngay freeship.',
    stars: 4,
    avatar: 'https://i.pravatar.cc/150?u=3'
  }
];

// --- Utilities ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// --- Components ---

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number }>({
    days: 7, hours: 12, minutes: 45, seconds: 22
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else if (days > 0) { days--; hours = 23; minutes = 59; seconds = 59; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
      <Clock size={16} className="text-brand-yellow animate-pulse" />
      <span className="hidden sm:inline">Kết thúc sau: </span>
      <span className="text-brand-yellow tracking-tighter">
        {pad(timeLeft.days)}n {pad(timeLeft.hours)}g {pad(timeLeft.minutes)}p {pad(timeLeft.seconds)}s
      </span>
    </div>
  );
};

const LuckyWheel = ({ onWin }: { onWin: (prize: typeof PRIZES[0], code: string) => void }) => {
  const [mustShowForm, setMustShowForm] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const sections = 8;
  const prizeLabels = [
    '10%', '20%', '30%', 'Freeship', 
    'Thử lại', '50%', '10%', '20%'
  ];

  const handleSpin = () => {
    if (!formData.name || !formData.phone) {
      alert('Vui lòng nhập thông tin để tham gia săn code 🍕');
      return;
    }

    const lastSpin = localStorage.getItem('last_spin_date');
    const today = new Date().toDateString();
    if (lastSpin === today) {
       alert('Bạn đã quay hôm nay rồi! Hãy quay lại vào ngày mai nhé 🔥');
       return;
    }

    setIsSpinning(true);
    
    // Logic xác suất (giả lập)
    const random = Math.random() * 100;
    let selectedPrizeIndex = 0;
    if (random < 5) selectedPrizeIndex = 5; // 50%
    else if (random < 20) selectedPrizeIndex = 3; // Freeship
    else if (random < 35) selectedPrizeIndex = 2; // 30%
    else if (random < 65) selectedPrizeIndex = 1; // 20%
    else selectedPrizeIndex = 0; // 10%

    // Calculate rotation: 5-8 full spins + individual offset
    const extraDegrees = 360 * 8 + (360 - (selectedPrizeIndex * (360 / 8)));
    const newRotation = rotation + extraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      localStorage.setItem('last_spin_date', today);
      
      const prizeMapping: Record<number, string> = {
        0: '10%', 1: '20%', 2: '30%', 3: 'Freeship', 5: '50%'
      };
      const label = prizeMapping[selectedPrizeIndex] || '10%';
      const code = 'HUNTER' + Math.random().toString(36).substring(7).toUpperCase();
      
      onWin({ label: label, value: label, weight: 0 }, code);
      console.log('Spin Data:', { ...formData, prize: label, code });
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-4 sm:p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <AnimatePresence mode="wait">
        {mustShowForm && !localStorage.getItem('last_spin_date') ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full space-y-4"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Nhập thông tin săn code</h3>
              <p className="text-gray-400 text-sm">Mỗi ngày 1 lượt quay cho khách hàng may mắn</p>
            </div>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Họ và tên"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                type="tel" 
                placeholder="Số điện thoại"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
              <button 
                onClick={() => setMustShowForm(false)}
                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-brand-green/20"
              >
                Tiếp tục đến vòng quay
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Arrow */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-brand-yellow drop-shadow-lg">
                <ChevronRight size={48} className="rotate-90 fill-current" />
              </div>

              {/* Wheel */}
              <div 
                className="w-full h-full rounded-full border-8 border-brand-yellow shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0.1, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ 
                      transform: `rotate(${i * 45}deg)`,
                      background: i % 2 === 0 ? '#008037' : '#FFFFFF',
                      clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 19%)'
                    }}
                  >
                    <span 
                      className={`absolute top-[20%] left-1/2 -translate-x-1/2 font-bold text-xs sm:text-sm rotate-0 select-none ${i % 2 === 0 ? 'text-white' : 'text-brand-green'}`}
                    >
                      {prizeLabels[i]}
                    </span>
                  </div>
                ))}
                {/* Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-brand-yellow rounded-full z-10 shadow-inner flex items-center justify-center">
                   <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`px-12 py-4 bg-brand-yellow text-brand-green font-black text-xl rounded-full shadow-2xl transition-all active:scale-95 ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:-translate-y-1'}`}
            >
              {isSpinning ? 'Đang quay...' : 'QUAY NGAY 🍕'}
            </button>
            <p className="text-white/60 text-xs text-center">Bằng cách quay, bạn đồng ý với điều khoản săn code của chúng tôi.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SuccessPopup = ({ prize, code, onClose }: { prize: string, code: string, onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="bg-brand-green p-8 text-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X size={24} />
          </button>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Gift className="mx-auto mb-4 w-16 h-16 animate-bounce" />
            <h3 className="text-3xl font-black mb-1">CHÚC MỪNG!</h3>
            <p className="text-lg opacity-90">Bạn đã quay trúng mã {prize}</p>
          </motion.div>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-gray-100 p-4 rounded-2xl border-2 border-dashed border-brand-green flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Mã ưu đãi của bạn</p>
              <p className="text-2xl font-mono font-black text-brand-green">{code}</p>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`p-3 rounded-xl transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-white text-gray-400 hover:text-brand-green'}`}
            >
              <Copy size={20} />
            </button>
          </div>
          <div className="space-y-3">
            <a 
              href="https://thepizzacompany.vn" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-brand-green-light hover:bg-brand-green-dark text-white font-bold py-4 rounded-xl transition-all"
            >
              <ShoppingBag size={20} />
              ĐẶT HÀNG NGAY
            </a>
            <p className="text-[10px] text-gray-400 text-center italic">*Áp dụng cho đơn hàng từ 150k tại website/app</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [showPopup, setShowPopup] = useState<{ show: boolean, prize: string, code: string }>({ show: false, prize: '', code: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="font-sans antialiased">
      {/* --- Sticky Header --- */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-2 sm:py-3 px-4 sm:px-8 border-b border-brand-green/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <img 
                src="https://i.postimg.cc/k2mXJGC4/image.png" 
                alt="Logo" 
                className="h-10 sm:h-14 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="h-10 w-[2px] bg-gray-200"></div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Phone size={10} className="text-brand-green fill-current" />
                  </div>
                  <span className="text-lg sm:text-3xl font-black italic tracking-tighter text-[#D82032] hotline-text">1900 6066</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-[2px] flex-1 bg-[#D82032]"></div>
                  <span className="text-[6px] sm:text-[9px] font-bold text-gray-900 uppercase tracking-[0.2em] whitespace-nowrap">GIAO HÀNG NHANH</span>
                  <div className="h-[2px] flex-1 bg-[#008037]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden xs:block">
              <CountdownTimer />
            </div>
            <button 
              onClick={() => scrollToSection('spin-section')}
              className="hidden md:flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-2.5 rounded-full font-black shadow-lg shadow-brand-green/20 transition-all hover:scale-105"
            >
              <Zap size={18} />
              SĂN CODE
            </button>
            <button 
              className="md:hidden text-brand-green p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white overflow-hidden shadow-xl"
            >
               <nav className="flex flex-col px-6 py-8 border-b border-brand-green/10">
                 <button onClick={() => scrollToSection('features')} className="text-left py-4 text-gray-800 font-bold border-b border-gray-50">Cách thức tham gia</button>
                 <button onClick={() => scrollToSection('spin-section')} className="text-left py-4 text-brand-green font-black border-b border-gray-50">Vòng quay may mắn</button>
                 <button onClick={() => scrollToSection('menu')} className="text-left py-4 text-gray-800 font-bold border-b border-gray-50">Thực đơn nổi bật</button>
                 <button onClick={() => scrollToSection('reviews')} className="text-left py-4 text-gray-800 font-bold">Đánh giá khách hàng</button>
               </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 overflow-hidden bg-[#f9fafb]">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-10">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green-light rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <span className="inline-block px-5 py-2 bg-brand-green text-white font-black rounded-full text-sm mb-8 shadow-xl animate-pulse tracking-widest">
                🔥 CHIẾN DỊCH HOT NHẤT THÁNG 4
              </span>
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-gray-900 leading-[0.9] mb-8">
                PIZZA HUNTER <br/>
                <span className="text-brand-green drop-shadow-sm">MUA 1 TẶNG 1</span>
              </h1>
              <p className="text-xl sm:text-3xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                Vị ngon Đặc Sản Việt Nam - Quay quà cực khủng <br className="hidden sm:block" /> nhận ngay mã ưu đãi hấp dẫn mỗi ngày! 🍕
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => scrollToSection('spin-section')}
                className="w-full sm:w-auto px-12 py-6 bg-brand-green hover:bg-brand-green-dark text-white text-2xl font-black rounded-2xl shadow-2xl shadow-brand-green/30 transition-all hover:scale-105 active:scale-95"
              >
                QUAY SĂN CODE NGAY
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white text-xl font-bold rounded-2xl backdrop-blur-md border border-white/30 transition-all"
              >
                XEM THỰC ĐƠN
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Pizza Icons */}
        <div className="absolute bottom-10 left-10 animate-spin-slow opacity-20 hidden lg:block">
           <img src="https://thepizzacompany.vn/static/media/icon-pizza.4c3c3a44.png" alt="" className="w-32 h-32" referrerPolicy="no-referrer" />
        </div>
      </section>

      {/* --- Mechanism Section --- */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-brand-green mb-4">SĂN CODE DỄ DÀNG</h2>
            <p className="text-gray-500">Chỉ 30 giây để nhận ngay ưu đãi hời</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-12 h-12 text-brand-green-light" />, title: '1. Nhập & Quay', desc: 'Điền thông tin và quay vòng may mắn mỗi ngày.' },
              { icon: <Ticket className="w-12 h-12 text-brand-green-light" />, title: '2. Nhận Code', desc: 'Mã giảm lên đến 50% hoặc Freeship cho bạn.' },
              { icon: <CheckCircle2 className="w-12 h-12 text-brand-green-light" />, title: '3. Thưởng Thức', desc: 'Đặt pizza yêu thích và nhận hàng trong 30 phút.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center"
              >
                <div className="bg-green-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-4 bg-brand-green/5 rounded-2xl text-center">
            <p className="text-brand-green font-bold text-lg">Hơn 50.000 code đã được sử dụng. Nhanh tay kẻo lỡ!</p>
          </div>
        </div>
      </section>

      {/* --- Spin Section --- */}
      <section id="spin-section" className="py-20 bg-black relative overflow-hidden">
        {/* Background Pizza Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 gap-20">
             {[...Array(24)].map((_, i) => <Zap key={i} size={80} className="text-white" />)}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">KHOẢNH KHẮC <span className="text-brand-yellow">HỒI HỘP</span></h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Mỗi ngày 1000 mã code săn được tung ra. Bạn sẽ là người tiếp theo sở hữu ưu đãi khủng?</p>
           </div>
           
           <LuckyWheel onWin={(p, c) => setShowPopup({ show: true, prize: p.label, code: c })} />
        </div>
      </section>

      {/* --- Featured Menu --- */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-brand-green mb-2">THỰC ĐƠN BÁN CHẠY</h2>
              <p className="text-gray-500">Những hương vị làm nên thương hiệu được yêu thích nhất</p>
            </div>
            <button className="flex items-center gap-2 text-brand-green-light font-bold hover:underline">
              XEM TOÀN BỘ THỰC ĐƠN <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BEST_SELLERS.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {item.category}
                    </div>
                    {item.isNew && (
                      <div className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        MỚI
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-brand-green transition-colors">{item.name}</h3>
                  <p className="text-gray-500 text-xs mb-4 line-clamp-2 h-8">{item.description}</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-black text-brand-green-light">{formatCurrency(item.price)}</span>
                    <span className="text-xs text-gray-400">Giá chỉ từ</span>
                  </div>
                  <button 
                    onClick={() => window.open('https://thepizzacompany.vn', '_blank')}
                    className="w-full bg-gray-900 hover:bg-brand-green text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    ĐẶT TRỰC TIẾP
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Social Proof --- */}
      <section id="reviews" className="py-24 bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">
                HƠN CẢ MỘT <br /> <span className="text-brand-yellow">CHIẾN DỊCH</span>
              </h2>
              <p className="text-xl text-white/80 mb-12">
                Chúng tôi tự hào mang đến hàng ngàn niềm vui mỗi ngày cho các "Pizza Hunter" trên khắp Việt Nam.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div>
                   <p className="text-5xl font-black text-brand-yellow mb-1">50K+</p>
                   <p className="text-sm uppercase tracking-widest font-bold opacity-70">Lượt quay</p>
                 </div>
                 <div>
                   <p className="text-5xl font-black text-brand-yellow mb-1">4.8/5</p>
                   <p className="text-sm uppercase tracking-widest font-bold opacity-70">Đánh giá sao</p>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              {REVIEWS.map((review) => (
                <div key={review.id} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-brand-yellow" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold">{review.name}</h4>
                      <div className="flex text-brand-yellow">
                        {[...Array(review.stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="italic opacity-90 text-sm">"{review.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Newsletter Section --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-green/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
           <div className="bg-gray-50 border border-gray-100 p-8 sm:p-16 rounded-[3rem] shadow-2xl relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-6">ĐỪNG BỎ LỠ QUAY QUÀ!</h2>
              <p className="text-lg text-gray-600 mb-10">Nhận ngay code <span className="text-brand-green-light font-bold">GIẢM 25%</span> khi đăng ký nhận thông báo chiến dịch mới nhất qua Email.</p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={e => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="flex-1 px-8 py-5 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green text-lg"
                />
                <button className="px-10 py-5 bg-brand-green hover:bg-brand-green-dark text-white font-black text-xl rounded-2xl shadow-xl transition-all">
                  GỬI TẶNG CODE
                </button>
              </form>
              <p className="mt-6 text-sm text-gray-400">Không spam, chỉ gửi ưu đãi săn code mỗi tuần🍕✨</p>
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="https://i.postimg.cc/k2mXJGC4/image.png" 
                  alt="Logo" 
                  className="h-12" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-2xl font-black italic tracking-tighter text-[#D82032]">1900 6066</span>
                  <div className="flex items-center gap-1">
                    <div className="h-[1px] flex-1 bg-[#D82032]"></div>
                    <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest whitespace-nowrap">GIAO HÀNG NHANH</span>
                    <div className="h-[1px] flex-1 bg-brand-green"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Thương hiệu Pizza hàng đầu Việt Nam. Nổi tiếng với hương vị đặc trưng, nguyên liệu tươi ngon và dịch vụ giao hàng siêu tốc.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-brand-green transition-colors"><Facebook size={20} /></a>
                <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-brand-green transition-colors"><Instagram size={20} /></a>
                <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-brand-green transition-colors"><Twitter size={20} /></a>
                <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-brand-green transition-colors"><MessageCircle size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">LIÊN KẾT NHANH</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Thực đơn</a></li>
                <li><a href="#" className="hover:text-white">Khuyến mãi</a></li>
                <li><a href="#" className="hover:text-white">Danh sách cửa hàng</a></li>
                <li><a href="#" className="hover:text-white">Chính sách giao hàng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">HỖ TRỢ</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">CSKH: 1900 633 606</a></li>
                <li><a href="#" className="hover:text-white">Quy định chung</a></li>
                <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">ỨNG DỤNG DI ĐỘNG</h4>
              <div className="space-y-3">
                 <img src="https://thepizzacompany.vn/static/media/google-play.879f5fdb.png" alt="App Store" className="h-10 cursor-pointer" referrerPolicy="no-referrer" />
                 <img src="https://thepizzacompany.vn/static/media/app-store.2ea60e1d.png" alt="Play Store" className="h-10 cursor-pointer" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-500 space-y-4">
             <p>© 2024 The Pizza Company Vietnam. Toàn bộ quyền sở hữu trí tuệ thuộc về The Pizza Company.</p>
             <p className="max-w-2xl mx-auto italic">
               Chú thích: Chương trình "PIZZA HUNTER" áp dụng cho đơn hàng tối thiểu 150k tại website/app. Mỗi khách hàng chỉ được tham gia 01 lần/ngày. Không kết hợp đồng thời với các chương trình khuyến mãi khác.
             </p>
          </div>
        </div>
      </footer>

      {/* --- Popups & Modals --- */}
      <AnimatePresence>
        {showPopup.show && (
          <SuccessPopup 
            prize={showPopup.prize} 
            code={showPopup.code} 
            onClose={() => setShowPopup({ ...showPopup, show: false })} 
          />
        )}
      </AnimatePresence>

      {/* --- Global Action Button (Mobile Only) --- */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
         <button 
           onClick={() => scrollToSection('spin-section')}
           className="w-16 h-16 bg-brand-green-light text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce"
         >
           <Zap size={32} />
         </button>
      </div>
    </div>
  );
}

