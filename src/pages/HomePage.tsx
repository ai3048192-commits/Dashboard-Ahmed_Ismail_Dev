import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Plus,
  ExternalLink,
  Code2,
  ShieldCheck,
  Clock,
  Mail,
  MessageCircle,
  User,
  MessageSquare,
  Inbox,
  Loader2,
  Trash2,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  // 1. حالات البيانات (State)
  const [stats, setStats] = useState([
    {
      title: "إجمالي المشاريع",
      value: "0",
      change: "+100%",
      period: "قاعدة البيانات",
      icon: FolderKanban,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "الرسائل الواردة",
      value: "0",
      change: "نشط",
      period: "جدول messages",
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "زيارات البرتفوليو",
      value: "0",
      change: "+حي",
      period: "جدول analytics",
      icon: Eye,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/20",
    },
  ]);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [incomingClients, setIncomingClients] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolioViews, setPortfolioViews] = useState("0");

  // 2. دالة جلب البيانات من Supabase
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // جلب وتحديث عداد الزيارات
      let { data: analyticsData, error: analyticsError } = await supabase
        .from("analytics")
        .select("views_count")
        .eq("id", 1)
        .single();

      let currentViews = 0;
      if (!analyticsError && analyticsData) {
        currentViews = analyticsData.views_count + 1;
        await supabase
          .from("analytics")
          .update({ views_count: currentViews })
          .eq("id", 1);
      }
      setPortfolioViews(String(currentViews));

      // جلب إجمالي عدد المشاريع الحقيقي بالكامل من الجدول
      const { count: totalProjectsCount, error: countError } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

      const totalCount = countError ? 0 : totalProjectsCount || 0;

      // جلب أحدث 4 مشاريع للعرض في القائمة السريعة
      const { data: projectsData, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      const projectsList = projError ? [] : projectsData || [];
      setProjects(projectsList);

      // جلب رسائل العملاء
      const { data: messagesData, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (msgError) throw msgError;
      const messagesList = messagesData || [];
      setIncomingClients(messagesList);

      // تحديث مصفوفة الإحصائيات بالبيانات الحية
      setStats([
        {
          title: "إجمالي المشاريع",
          value: String(totalCount),
          change: "+100%",
          period: "قاعدة البيانات",
          icon: FolderKanban,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        },
        {
          title: "الرسائل الواردة",
          value: String(messagesList.length),
          change: "نشط",
          period: "جدول messages",
          icon: Users,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10 border-cyan-500/20",
        },
        {
          title: "زيارات البرتفوليو",
          value: String(currentViews),
          change: "+حي",
          period: "جدول analytics",
          icon: Eye,
          color: "text-teal-400",
          bg: "bg-teal-500/10 border-teal-500/20",
        },
        {
          title: "المهام المنجزة",
          value: "186",
          change: "+99%",
          period: "مستقر",
          icon: CheckCircle2,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
        },
      ]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoadingProjects(false);
      setLoadingMessages(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 3. دوال الحذف والتحكم بالرسائل
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة نهائياً؟")) return;

    try {
      setDeletingId(id);
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;

      const updatedList = incomingClients.filter((client) => client.id !== id);
      setIncomingClients(updatedList);

      setStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.title === "الرسائل الواردة") {
            return { ...stat, value: String(updatedList.length) };
          }
          return stat;
        })
      );
    } catch (err) {
      console.error("Error deleting message:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("تحذير: هل تريد حذف جميع الرسائل؟")) return;
    try {
      setRefreshing(true);
      const { error } = await supabase.from("messages").delete().neq("id", 0);
      if (error) throw error;
      setIncomingClients([]);
      setStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.title === "الرسائل الواردة") return { ...stat, value: "0" };
          return stat;
        })
      );
    } catch (err) {
      console.error("Error deleting all:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* --- 1. قسم الترحيب الملكي مع تأثيرات الإضاءة الخلفية والـ Glow --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#08080c] via-[#0d0d15] to-[#08080c] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-500 hover:border-emerald-500/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-2 shadow-inner">
                <Sparkles
                  size={14}
                  className="animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                Full-Stack Architect & System Admin
              </span>
              <span className="px-3.5 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono rounded-full flex items-center gap-1.5">
                <ShieldCheck size={14} /> Secure Node Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              مرحباً بك، أحمد إسماعيل <span className="inline-block animate-bounce">🚀</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              إليك نظرة تحليلية متقدمة لأداء مشاريعك البرمجية، وحالة النظام، ومتابعة تفاعلات ورسائل العملاء الحية لحظة بلحظة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/portfolio/add"
              className="flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:scale-95"
            >
              <Plus size={20} className="stroke-[3]" />
              <span>إضافة مشروع جديد</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. بطاقات الإحصائيات الديناميكية مع حركات Hover فخمة --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group relative bg-[#08080c] border border-white/[0.06] rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1.5 shadow-xl hover:shadow-emerald-500/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`p-3.5 rounded-2xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${item.bg} ${item.color}`}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.period}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {item.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-4xl font-black text-white tracking-wider mb-1.5 transition-colors group-hover:text-emerald-300">
                  {item.value}
                </h3>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">
                  {item.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- 3. سكشن أحدث المشاريع في البرتفوليو مع روابط سريعة --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-[#08080c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 hover:border-white/10">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Code2 size={20} />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                أحدث المشاريع المضافة في البرتفوليو
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-bold group bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20"
            >
              <span>عرض كل المشاريع</span>
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-xs text-slate-400 font-mono">
                جاري تحميل المشاريع من قاعدة البيانات...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
              <p className="text-sm font-bold text-white">
                لا توجد مشاريع مضافة حتى الآن
              </p>
              <p className="text-xs text-slate-400">
                قم بإضافة أول مشروع ليظهر هنا تلقائياً.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, idx) => (
                <div
                  key={project.id || idx}
                  className="group relative flex items-center justify-between p-4 sm:p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm font-mono shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {project.name_ar} <span className="text-slate-500 font-normal">/</span> {project.name_en}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 text-slate-300 rounded-md font-mono border border-white/10">
                          {project.category || "عام"}
                        </span>
                      </div>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:underline font-mono inline-flex items-center gap-1.5 pt-0.5 truncate max-w-[240px] sm:max-w-xs"
                        >
                          <ExternalLink size={11} className="shrink-0" />
                          <span className="truncate">{project.url}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 text-slate-300 hover:text-white rounded-xl border border-white/10 hover:bg-emerald-500 hover:border-emerald-400 hover:text-slate-950 transition-all duration-300 shrink-0 shadow-md"
                      title="فتح المعاينة الحية"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- 4. سكشن إدارة رسائل العملاء الاحترافي --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#050510] via-[#09091c] to-[#050510] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:border-purple-500/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                <Inbox size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">
                    مركز تحكم وإدارة رسائل العملاء
                  </h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2.5 py-0.5 rounded-full border border-purple-500/30 font-bold">
                    {incomingClients.length} رسالة نشطة
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  تحكم كامل ومزامنة فورية لرسائل صفحة التواصل
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin text-purple-400" : ""}
                />
                <span>تحديث البيانات</span>
              </button>

              {incomingClients.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  disabled={refreshing}
                  className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 active:scale-95"
                >
                  <Trash2 size={14} />
                  <span>حذف الكل</span>
                </button>
              )}
            </div>
          </div>

          {loadingMessages ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-xs text-zinc-400 font-mono">
                جاري مزامنة الرسائل...
              </p>
            </div>
          ) : incomingClients.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto shadow-inner">
                <CheckCheck size={26} />
              </div>
              <p className="text-sm font-bold text-white">
                صندوق الوارد نظيف تماماً! لا توجد رسائل جديدة.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingClients.map((client) => (
                <div
                  key={client.id}
                  className="group bg-[#08080c] border border-purple-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/25 transition-colors" />

                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                          {client.is_read ? "تمت القراءة" : "رسالة جديدة"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                          <Clock size={13} />
                          <span>
                            {new Date(client.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteMessage(client.id)}
                          disabled={deletingId === client.id}
                          className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all duration-300 disabled:opacity-50 active:scale-95"
                          title="حذف الرسالة"
                        >
                          {deletingId === client.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-3 group-hover:bg-white/[0.04] transition-colors">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                          <User size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            اسم العميل
                          </span>
                          <h4 className="text-xs font-bold text-white truncate">
                            {client.name}
                          </h4>
                        </div>
                      </div>

                      <div className="p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-3 group-hover:bg-white/[0.04] transition-colors">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                          <Mail size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            البريد الإلكتروني
                          </span>
                          <h4 className="text-xs font-bold text-white truncate">
                            {client.email}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-black/40 border border-white/[0.04] rounded-2xl space-y-1.5 shadow-inner">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                        <MessageSquare size={13} className="text-purple-400" />
                        <span>نص الرسالة:</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        "{client.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <a
                        href={`mailto:${client.email}`}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl text-center transition-all duration-300 shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Mail size={15} />
                        <span>الرد عبر البريد</span>
                      </a>
                      <a
                        href={`https://wa.me/?text=مرحباً ${client.name}، بخصوص طلبك...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <MessageCircle size={15} className="text-emerald-400" />
                        <span>واتساب</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
