import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  Terminal,
  Sparkles,
  Plus,
  ExternalLink,
  Code2,
  ShieldCheck,
  Clock,
  Mail,
  MessageCircle,
  User,
  Layers,
  MessageSquare,
  Inbox,
  Loader2,
  Trash2,
  RefreshCw,
  CheckCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  // حالة الإحصائيات
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

  // حالة المشاريع الحقيقية من قاعدة البيانات
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // مهام سريعة قيد التنفيذ
  const pendingTasks = [
    {
      task: "تحديث واجهات الـ Dashboard وتعديل الـ CSS",
      priority: "عالية",
      time: "اليوم",
    },
    {
      task: "ربط الـ API الخاص ببيانات العملاء الجدد",
      priority: "متوسطة",
      time: "غداً",
    },
    {
      task: "مراجعة أكواد الـ Security في السيرفر",
      priority: "عالية",
      time: "خلال الأسبوع",
    },
  ];

  const [incomingClients, setIncomingClients] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [portfolioViews, setPortfolioViews] = useState("0");

  // دالة لجلب البيانات بالكامل (الزيارات، المشاريع، والرسائل)
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // 1. تحديث وجلب عداد الزيارات
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

      // 2. جلب المشاريع الحقيقية مرتبة من الأحدث
      const { data: projectsData, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4); // نعرض أحدث 4 مشاريع في الـ Dashboard

      const projectsList = projError ? [] : projectsData || [];
      setProjects(projectsList);

      // 3. جلب رسائل العملاء
      const { data: messagesData, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (msgError) throw msgError;
      const messagesList = messagesData || [];
      setIncomingClients(messagesList);

      // 4. تحديث بطاقات الـ Stats بالأرقام الفعلية
      setStats([
        {
          title: "إجمالي المشاريع",
          value: String(projectsList.length),
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

  // دالة حذف رسالة
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
        }),
      );
    } catch (err) {
      console.error("Error deleting message:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // حذف جميع الرسائل
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
        }),
      );
    } catch (err) {
      console.error("Error deleting all:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. قسم الترحيب الملكي */}
      <div className="relative overflow-hidden bg-[#08080c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <Sparkles
                  size={13}
                  className="animate-spin"
                  style={{ animationDuration: "4s" }}
                />
                Full-Stack Architect & System Admin
              </span>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono rounded-full flex items-center gap-1">
                <ShieldCheck size={13} /> Secure Node Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
              مرحباً بك، أحمد إسماعيل 🚀
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              إليك نظرة تحليلية شاملة على أداء مشاريعك البرمجية، وحالة
              السيرفرات، ومتابعة بطاقات بيانات ورسائل العملاء الجدد.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/portfolio/add"
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-2xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02]"
            >
              <Plus size={18} />
              <span>إضافة مشروع جديد</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات الديناميكية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-[#08080c] border border-white/[0.06] rounded-2xl p-5 hover:border-emerald-500/40 transition-all duration-300 shadow-lg group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl border ${item.bg} ${item.color}`}
                >
                  <Icon size={20} />
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
              <h3 className="text-3xl font-black text-white tracking-wider mb-1">
                {item.value}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{item.title}</p>
            </div>
          );
        })}
      </div>

      {/* 3. سكشن عرض المشاريع الحية والمهام */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#08080c] border border-white/[0.06] rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-emerald-400" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  أحدث المشاريع المضافة في البرتفوليو
                </h2>
              </div>
              <Link
                to="/portfolio"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
              >
                عرض الكل <ArrowUpRight size={14} />
              </Link>
            </div>

            {loadingProjects ? (
              <div className="py-12 text-center flex flex-col items-center
               justify-center space-y-3">
                <Loader2 className="w-6 h-9 text-emerald-500 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">
                  جاري تحميل المشاريع من قاعدة البيانات...
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-12 text-center space-y-2 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
                <p className="text-sm font-bold text-white">
                  لا توجد مشاريع مضافة حتى الآن
                </p>
                <p className="text-xs text-slate-400">
                  قم بإضافة أول مشروع ليظهر هنا تلقائياً.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project, idx) => (
                  <div
                    key={project.id || idx}
                    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm font-mono">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {project.title || project.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 bg-white/5 text-slate-400 rounded font-mono border border-white/5">
                            {project.category || project.type || "تطوير"}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                          {project.tech_stack || project.tech}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[11px] px-3 py-1 rounded-full font-semibold ${
                          project.status === "مكتمل" ||
                          project.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {project.status || "نشط"}
                      </span>
                      {project.link || project.path ? (
                        <a
                          href={project.link || project.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/5 text-slate-300 hover:text-white rounded-xl border border-white/5 hover:bg-white/10 transition-all"
                        >
                          <ExternalLink size={15} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. سكشن إدارة رسائل العملاء */}
      <div className="relative overflow-hidden bg-[#050510] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Inbox size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    مركز تحكم وإدارة رسائل العملاء
                  </h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-500/30">
                    {incomingClients.length} رسالة نشطة
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  تحكم كامل وتحديث تلقائي لعدادات الـ Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin text-purple-400" : ""}
                />
                <span>تحديث</span>
              </button>

              {incomingClients.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  disabled={refreshing}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
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
                جاري مزامنة الإحصائيات...
              </p>
            </div>
          ) : incomingClients.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                <CheckCheck size={24} />
              </div>
              <p className="text-sm font-bold text-white">
                صندوق الوارد نظيف تماماً!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-[#08080c] border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-purple-500/60 transition-all"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
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
                          className="p-1.5 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 rounded-xl transition-all disabled:opacity-50"
                        >
                          {deletingId === client.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <User size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            اسم العميل
                          </span>
                          <h4 className="text-xs font-bold text-white">
                            {client.name}
                          </h4>
                        </div>
                      </div>

                      <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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

                    <div className="p-4 bg-black/40 border border-white/[0.04] rounded-2xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                        <MessageSquare size={13} className="text-purple-400" />
                        <span>الرسالة:</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        "{client.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`mailto:${client.email}`}
                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl text-center transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5"
                      >
                        <Mail size={14} />
                        <span>الرد عبر البريد</span>
                      </a>
                      <a
                        href={`https://wa.me/?text=مرحباً ${client.name}، بخصوص طلبك...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={14} className="text-emerald-400" />
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
