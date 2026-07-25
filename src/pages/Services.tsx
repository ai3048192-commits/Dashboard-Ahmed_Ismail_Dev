import { useState, useEffect } from "react";
import { 
  Terminal, 
  Star,
  Plus,
  Edit3,
  Trash2,
  AlertCircle
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Services({ lang = "EN", isDark = true, onSkillChange }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول الفورم (النموذج) ثنائية اللغة
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [level, setLevel] = useState("85");
  const [category, setCategory] = useState("Frontend");
  const [color, setColor] = useState("#06b6d4");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");

  const [editId, setEditId] = useState(null);

  // جلب البيانات من Supabase
  const fetchSkills = async () => {
    const { data, error } = await supabase.from("skills").select("*").order("id", { ascending: false });
    if (error) {
      console.error("Error fetching skills:", error.message);
    } else {
      setSkills(data || []);
      if (onSkillChange) onSkillChange(data || []);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // دالة الإضافة أو التعديل في Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) return;

    setLoading(true);

    const skillPayload = {
      name_ar: nameAr,
      name_en: nameEn,
      level: Number(level),
      category,
      color,
      desc_ar: descAr,
      desc_en: descEn
    };

    if (editId !== null) {
      const { error } = await supabase.from("skills").update(skillPayload).eq("id", editId);
      if (error) alert("حدث خطأ أثناء التعديل");
      else setEditId(null);
    } else {
      const { error } = await supabase.from("skills").insert([skillPayload]);
      if (error) alert("حدث خطأ أثناء الإضافة");
    }

    // تصفير الفورم
    setNameAr("");
    setNameEn("");
    setLevel("85");
    setCategory("Frontend");
    setColor("#06b6d4");
    setDescAr("");
    setDescEn("");
    setLoading(false);
    
    fetchSkills();
  };

  // تعبئة البيانات للتعديل
  const handleEdit = (skill) => {
    setNameAr(skill.name_ar);
    setNameEn(skill.name_en);
    setLevel(skill.level.toString());
    setCategory(skill.category);
    setColor(skill.color);
    setDescAr(skill.desc_ar);
    setDescEn(skill.desc_en);
    setEditId(skill.id);
  };

  // الحذف من قاعدة البيانات
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) alert("حدث خطأ أثناء الحذف");
    else {
      if (editId === id) setEditId(null);
      fetchSkills();
    }
  };

  return (
    <div className={`space-y-8 p-6 md:p-8 rounded-3xl ${isDark ? "bg-[#07090F] text-white" : "bg-slate-100 text-slate-900"}`}>
      
      {/* رأس الصفحة */}
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Terminal size={22} />
          </div>
          <h1 className="text-2xl font-black">
            {lang === "AR" ? "إدارة ترسانة المهارات (Services Dashboard)" : "Skills Arsenal Dashboard (Services)"}
          </h1>
        </div>
        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
          {lang === "AR" ? "التعديلات هنا ستنعكس مباشرة في قسم Skills.tsx." : "Modifications here will directly reflect in Skills.tsx."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* فورم الإضافة والتعديل */}
        <div className={`p-6 rounded-2xl border h-fit ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
          <h2 className="text-base font-bold mb-5 pb-3 border-b border-zinc-700/50">
            {editId !== null ? "تعديل المهارة" : "إضافة مهارة جديدة"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">اسم المهارة (عربي)</label>
              <input type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} required className={`w-full px-4 py-2.5 rounded-xl text-sm border ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">اسم المهارة (English)</label>
              <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required className={`w-full px-4 py-2.5 rounded-xl text-sm border ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">مستوى الكفاءة (%)</label>
              <input type="number" min="1" max="100" value={level} onChange={(e) => setLevel(e.target.value)} required className={`w-full px-4 py-2.5 rounded-xl text-sm border ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">الفئة (Category)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl text-sm border ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}>
                <option value="Frontend">Frontend</option>
                <option value="Design">Design</option>
                <option value="Backend">Backend</option>
                <option value="Tools">Tools</option>
                <option value="Optimization">Optimization</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">لون التميز</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-xl bg-transparent cursor-pointer border-0" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">الوصف (عربي)</label>
              <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={2} required className={`w-full px-4 py-2.5 rounded-xl text-sm border resize-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Description (English)</label>
              <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={2} required className={`w-full px-4 py-2.5 rounded-xl text-sm border resize-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`} />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 px-4 font-bold text-sm rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer flex items-center justify-center gap-2">
              <Plus size={18} />
              <span>{loading ? "جاري الحفظ..." : editId !== null ? "حفظ التعديل" : "إضافة المهارة"}</span>
            </button>
          </form>
        </div>

        {/* عرض المهارات وإدارتها */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
          <h2 className="text-base font-bold mb-6 pb-3 border-b border-zinc-700/50">المهارات المسجلة ({skills.length})</h2>

          {skills.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-2">
              <AlertCircle size={32} className="mx-auto opacity-40" />
              <p className="text-sm">لا توجد مهارات مضافة حالياً.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-[#12192B]/60 border-[#1E273F]" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5" style={{ backgroundColor: `${skill.color || "#3b82f6"}15`, color: skill.color || "#3b82f6" }}>
                      <Star size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold">{lang === "AR" ? skill.name_ar : skill.name_en}</h3>
                        <span className="text-xs font-mono text-blue-400">({skill.level}%)</span>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{skill.desc_ar}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button type="button" onClick={() => handleEdit(skill)} className="px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer">
                      <Edit3 size={14} /> تعديل
                    </button>
                    <button type="button" onClick={() => handleDelete(skill.id)} className="px-3 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer">
                      <Trash2 size={14} /> حذف
                    </button>
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