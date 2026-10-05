import {
  LayoutGrid,
  User,
  Palette,
  Briefcase,
  Award,
  Settings,
  X,
  Code2,
  Globe,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { name: "الرئيسية", icon: LayoutGrid, path: "/" },
  { name: "من أنا", icon: User, path: "/about" },
  { name: "خدماتي", icon: Palette, path: "/services" },
  { name: "المشاريع", icon: Briefcase, path: "/portfolio" },
  { name: "الشهادات", icon: Award, path: "/partners" },
  { name: "الإعدادات", icon: Settings, path: "/settings" },
  { name: "زيارة الموقع", icon: Globe, path: "https://ahmed-ismail-dev-22.vercel.app/" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay للموبايل بتأثير زجاجي معتم */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-lg z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* الـ Sidebar الرئيسي بتصميم فخم ومستقبلي */}
      <aside
        className={`fixed top-0 right-0 h-screen w-76 bg-[#040407] text-white z-50 border-l border-white/[0.08] shadow-[-30px_0_60px_rgba(0,0,0,0.95)] transform transition-transform duration-500 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* خلفية ضوئية جمالية هادئة (Ambient Glows) */}
        <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-emerald-500/[0.07] via-cyan-500/[0.03] to-transparent pointer-events-none blur-3xl" />

        {/* خط بريق علوي ديناميكي فاخر */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent relative z-10 opacity-75" />

        {/* محتوى الـ Sidebar الداخلي */}
        <div className="relative z-10 h-[calc(100vh-2px)] p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          
          <div className="space-y-8">
            {/* 1. قسم الشعار والهوية الفاخرة */}
            <div className="flex justify-between items-center pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3.5">
                <div className="relative p-3 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-cyan-500/10 rounded-2xl border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <Code2 className="text-emerald-400" size={22} />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]" />
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent flex items-center gap-1.5">
                    Web Dev <Sparkles size={13} className="text-emerald-400 animate-pulse" />
                  </h1>
                  <span className="text-[10px] text-emerald-400/90 font-mono tracking-widest block mt-0.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                    SYSTEM V2.6
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="lg:hidden p-2.5 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2. القائمة الرئيسية (Navigation Menu) */}
            <nav className="space-y-2">
              <div className="text-[10px] font-mono tracking-wider text-slate-500 px-3 mb-2 uppercase">
                القائمة الرئيسية
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isExternal = item.path.startsWith("http");

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`group relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 font-medium text-sm ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/40 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)] translate-x-1"
                        : "text-gray-400 hover:text-slate-100 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110"
                            : "bg-white/[0.03] text-gray-400 group-hover:text-emerald-400 group-hover:bg-white/[0.08] group-hover:scale-105"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="font-bold tracking-wide transition-colors group-hover:text-white">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-emerald-500 text-[10px] font-black text-slate-950 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]">
                          {item.badge}
                        </span>
                      )}
                      {isExternal && (
                        <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 transition-colors">
                          <ChevronLeft size={14} />
                        </span>
                      )}
                    </div>

                    {/* علامة التحديد الجانبية (Indicator) */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-400 rounded-l-full shadow-[0_0_15px_#10b981]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 3. بطاقة حالة النظام السفلية (System Status Card) */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-white/[0.02] via-emerald-500/[0.02] to-white/[0.04] border border-white/[0.06] flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    الوضع الآمن متصل
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    جميع الأنظمة تعمل بكفاءة عالية
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
