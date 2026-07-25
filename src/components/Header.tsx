import { Menu, User, Code2 } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="bg-[#050505]/90 backdrop-blur-xl px-6 py-3 flex items-center 
    justify-between sticky top-0 z-30 border-b 
    border-white/[0.06] lg:pr-72 transition-all">
      
      {/* زر القائمة للموبايل */}
      <button 
        onClick={onOpenSidebar} 
        className="lg:hidden p-2.5 bg-white/[0.03] text-emerald-400 
        rounded-xl hover:bg-emerald-500/10 transition-all border border-white/10"
      >
        <Menu size={20} />
      </button>

      {/* الشعار أو العنوان للموبايل */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
          <Code2 size={18} />
        </div>
        <h1 className="text-sm font-bold text-white tracking-wide">لوحة التحكم</h1>
      </div>

      {/* مؤشر حالة النظام البرمجي في الديسكتوب */}
      <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 bg-[#08080c] border border-emerald-500/20 rounded-full hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.03)] cursor-default">
  
  {/* مؤشر النبض الذكي */}
  <div className="relative flex items-center justify-center">
    <div className="absolute w-3.5 h-3.5 bg-emerald-500/30 rounded-full animate-ping" />
    <div className="relative w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
  </div>
  
  {/* النص بتنسيق أنيق */}
  <span className="text-[11px] font-bold text-slate-300 tracking-wide">
    النظام يعمل بكفاءة
  </span>

  {/* لمسة برمجية فخمة (نسبة الاستقرار) */}
  <div className="flex items-center border-l border-white/10 pl-2 ml-1">
    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
      99.9%
    </span>
  </div>

</div>

      {/* الجانب الأيمن - معلومات المطور */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3.5 pr-4 border-r border-white/[0.08]">
          
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white tracking-wide">أحمد إسماعيل</p>
            <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
              Full-Stack Dev
            </p>
          </div>

        <div className="relative w-11 h-11 bg-[#0a0a0c] rounded-2xl p-[1.5px] border border-emerald-500/30 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 rounded-[14px] flex items-center justify-center text-emerald-400">
              <User size={20} className="transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}