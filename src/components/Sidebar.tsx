import {
  LayoutGrid,
  User,
  Palette,
  Briefcase,
  Award,
  Settings,
  LogOut,
  X,
  Code2,
  Terminal,
  Globe,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  { name: "زيارة الموقع", icon: Globe, path: "http://localhost:5174/" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Overlay للموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* تم جعل الـ aside ثابتة تماماً في الشاشات الكبيرة والصغيرة */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-[#050505] text-white z-50 border-l border-emerald-500/10 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* شريط علوي نابض كمظهر برمجي فاخر */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 flex-shrink-0" />

        {/* محتوى الـ Sidebar مع إمكانية التمرير داخلياً لو القائمة طويلة */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6 pb-24 flex flex-col justify-between">
          <div>
            {/* قسم الشعار والعنوان الفاخر لمطور الويب */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3.5">
                <div className="relative p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-2xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Code2 className="text-emerald-400" size={26} />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                    Web Dev
                  </h1>
                  <span className="text-[11px] text-emerald-500/80 font-mono tracking-widest block">
                    SYSTEM V2.6
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2.5 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/5 hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* القائمة الرئيسية */}
            <nav className="space-y-2.5">
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
                        ? "bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                        : "text-gray-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            : "bg-white/5 text-gray-400 group-hover:text-emerald-400 group-hover:bg-white/10"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span className="font-semibold tracking-wide">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="bg-emerald-500 text-[10px] font-bold text-slate-950 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_10px_#10b981]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* زر تسجيل الخروج ثابت أسفل القائمة */}
          <div className="pt-4 mt-auto">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-center gap-3 p-3.5 text-red-400 hover:text-white hover:bg-red-500/15 rounded-2xl border border-red-500/10 hover:border-red-500/30 transition-all font-bold text-sm shadow-[0_4px_20px_rgba(239,68,68,0.05)]"
            >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}