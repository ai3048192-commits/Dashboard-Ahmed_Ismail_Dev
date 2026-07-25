import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { supabase } from "../lib/supabase"; // تأكد من صحة مسار ملف Supabase في مشروعك

export default function EducationManagementDashboard({ lang = "EN", isDark = true }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول الفورم المزدوجة (عربي / إنجليزي)
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [orgAr, setOrgAr] = useState("");
  const [orgEn, setOrgEn] = useState("");
  const [type, setType] = useState("certificate");
  const [period, setPeriod] = useState("");
  const [badgeAr, setBadgeAr] = useState("معتمد");
  const [badgeEn, setBadgeEn] = useState("PROFESSIONAL");
  const [image, setImage] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");

  // تتبع حالة التعديل
  const [editId, setEditId] = useState(null);

  // جلب البيانات من Supabase عند التحميل
  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching education/certificates:", error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  // دالة الإضافة أو التعديل في Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleAr.trim() || !titleEn.trim() || !orgAr.trim() || !orgEn.trim() || !descAr.trim() || !descEn.trim()) return;

    const eduData = {
      title_ar: titleAr,
      title_en: titleEn,
      org_ar: orgAr,
      org_en: orgEn,
      type,
      period,
      badge_ar: badgeAr,
      badge_en: badgeEn,
      image: image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
      desc_ar: descAr,
      desc_en: descEn
    };

    if (editId !== null) {
      // تعديل سجل موجود
      const { error } = await supabase
        .from('education')
        .update(eduData)
        .eq('id', editId);

      if (error) {
        console.error("Error updating education record:", error);
        return;
      }
      setEditId(null);
    } else {
      // إضافة سجل جديد
      const { error } = await supabase
        .from('education')
        .insert([eduData]);

      if (error) {
        console.error("Error inserting education record:", error);
        return;
      }
    }

    resetForm();
    fetchEducation();
  };

  // تعبئة البيانات للتعديل
  const handleEdit = (item) => {
    setTitleAr(item.title_ar || "");
    setTitleEn(item.title_en || "");
    setOrgAr(item.org_ar || "");
    setOrgEn(item.org_en || "");
    setType(item.type || "certificate");
    setPeriod(item.period || "");
    setBadgeAr(item.badge_ar || "");
    setBadgeEn(item.badge_en || "");
    setImage(item.image || "");
    setDescAr(item.desc_ar || "");
    setDescEn(item.desc_en || "");
    setEditId(item.id);
  };

  // دالة الحذف من Supabase
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting education record:", error);
      return;
    }

    if (editId === id) {
      resetForm();
      setEditId(null);
    }
    fetchEducation();
  };

  const resetForm = () => {
    setTitleAr("");
    setTitleEn("");
    setOrgAr("");
    setOrgEn("");
    setType("certificate");
    setPeriod("");
    setBadgeAr("معتمد");
    setBadgeEn("PROFESSIONAL");
    setImage("");
    setDescAr("");
    setDescEn("");
  };

  return (
    <div className={`space-y-8 p-6 md:p-8 rounded-3xl transition-colors duration-300 ${isDark ? "bg-[#07090F] text-white" : "bg-slate-100 text-slate-900"}`}>
      
      {/* رأس لوحة التحكم */}
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <GraduationCap size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-wide">إدارة التعليم والشهادات (Supabase Synced)</h1>
        </div>
        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
          إدارة المؤهلات الأكاديمية والشهادات الاحترافية المتصلة بقاعدة بيانات Supabase (عربي وإنجليزي).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. نموذج الإضافة / التعديل */}
        <div className={`p-6 rounded-2xl border h-fit ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-700/50">
            <h2 className="text-base font-bold">
              {editId !== null ? "تعديل المؤهل الحالي" : "إضافة مؤهل أو شهادة جديدة"}
            </h2>
            {editId !== null && (
              <button 
                onClick={() => { resetForm(); setEditId(null); }}
                className="text-xs text-rose-400 hover:underline"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* نوع السجل */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">نوع السجل</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
              >
                <option value="certificate">شهادة احترافية (Certificate)</option>
                <option value="education">تعليم أكاديمي (Education)</option>
              </select>
            </div>

            {/* العنوان بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">عنوان المؤهل (عربي)</label>
              <input 
                type="text" 
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: هندسة الحاسب الآلي" 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* العنوان بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">عنوان المؤهل (إنجليزي)</label>
              <input 
                type="text" 
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Example: Computer Science" 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* الجهة المانحة بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">الجهة / المؤسسة (عربي)</label>
              <input 
                type="text" 
                value={orgAr}
                onChange={(e) => setOrgAr(e.target.value)}
                placeholder="مثال: كلية الهندسة • جامعة..." 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* الجهة المانحة بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">الجهة / المؤسسة (إنجليزي)</label>
              <input 
                type="text" 
                value={orgEn}
                onChange={(e) => setOrgEn(e.target.value)}
                placeholder="Example: Faculty of Engineering" 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* الفترة الزمنية */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">الفترة الزمنية / سنة التخرج</label>
              <input 
                type="text" 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="مثال: 2018 - 2022" 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* الشعار البصري بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">نص الشعار البصري (عربي)</label>
              <input 
                type="text" 
                value={badgeAr}
                onChange={(e) => setBadgeAr(e.target.value)}
                placeholder="مثال: درجة أكاديمية" 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* الشعار البصري بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">نص الشعار البصري (إنجليزي)</label>
              <input 
                type="text" 
                value={badgeEn}
                onChange={(e) => setBadgeEn(e.target.value)}
                placeholder="Example: ACADEMIC DEGREE" 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* رابط الصورة */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">رابط صورة الوثيقة أو الشهادة</label>
              <input 
                type="url" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..." 
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
              />
            </div>

            {/* الوصف بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">الوصف التفصيلي (عربي)</label>
              <textarea 
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="اكتب نبذة مختصرة بالعربية..." 
                rows={2}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all resize-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* الوصف بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">الوصف التفصيلي (إنجليزي)</label>
              <textarea 
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Write brief description in English..." 
                rows={2}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all resize-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-purple-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"}`}
                required
              />
            </div>

            {/* زر الحفظ */}
            <button 
              type="submit"
              className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                editId !== null 
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              }`}
            >
              <Plus size={18} />
              <span>{editId !== null ? "حفظ التعديلات" : "إضافة المؤهل الجديد"}</span>
            </button>
          </form>
        </div>

        {/* 2. جدول السجلات الحالية */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-700/50">
            <h2 className="text-base font-bold">السجلات الحالية ({items.length})</h2>
            <span className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
              Supabase Connected
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-zinc-500 space-y-2 flex flex-col items-center justify-center">
              <Loader2 size={32} className="animate-spin text-purple-500" />
              <p className="text-sm">جاري جلب السجلات من قاعدة البيانات...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-2">
              <AlertCircle size={32} className="mx-auto opacity-40" />
              <p className="text-sm">لا توجد سجلات مضافة حالياً في قاعدة البيانات.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const title = lang === "EN" ? (item.title_en || item.title_ar) : (item.title_ar || item.title_en);
                const org = lang === "EN" ? (item.org_en || item.org_ar) : (item.org_ar || item.org_en);
                const badge = lang === "EN" ? (item.badge_en || item.badge_ar) : (item.badge_ar || item.badge_en);
                const desc = lang === "EN" ? (item.desc_en || item.desc_ar) : (item.desc_ar || item.desc_en);

                return (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isDark ? "bg-[#12192B]/60 border-[#1E273F] hover:border-zinc-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                          item.type === "education" 
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                            : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        }`}
                      >
                        {item.type === "education" ? <GraduationCap size={18} /> : <Award size={18} />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold">{title}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-white/5 border-white/10 text-purple-300">
                            {badge}
                          </span>
                          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                            <Calendar size={11} className="text-purple-400" />
                            {item.period}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-purple-400/90">{org}</p>
                        <p className={`text-xs ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{desc}</p>
                      </div>
                    </div>

                    {/* أزرار التعديل والحذف */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 size={14} />
                        <span>تعديل</span>
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}