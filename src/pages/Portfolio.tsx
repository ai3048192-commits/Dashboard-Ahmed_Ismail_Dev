import { useState, useEffect } from "react";
import {
  FolderGit2,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ProjectsManagementDashboard({
  lang = "EN",
  isDark = true,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // حقول الفورم المزدوجة (عربي / إنجليزي)
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [category, setCategory] = useState("Dashboards");
  const [tagsInputAr, setTagsInputAr] = useState("رياكت, تيلويند");
  const [tagsInputEn, setTagsInputEn] = useState("React, Tailwind");

  // تتبع حالة التعديل
  const [editId, setEditId] = useState(null);

  // جلب المشاريع من Supabase عند تحميل الصفحة
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  // دالة الإضافة أو التعديل
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !nameAr.trim() ||
      !nameEn.trim() ||
      !url.trim() ||
      !descAr.trim() ||
      !descEn.trim()
    )
      return;

    const tagsArrayAr = tagsInputAr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const tagsArrayEn = tagsInputEn
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const projectData = {
      name_ar: nameAr,
      name_en: nameEn,
      url,
      image: image || "../assets/projects/default.png",
      desc_ar: descAr,
      desc_en: descEn,
      category,
      tags_ar: tagsArrayAr,
      tags_en: tagsArrayEn,
    };

    if (editId !== null) {
      // تعديل مشروع موجود في Supabase
      const { error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editId);

      if (error) {
        console.error("Error updating project:", error);
        return;
      }
      setEditId(null);
    } else {
      // إضافة مشروع جديد إلى Supabase
      const { error } = await supabase.from("projects").insert([projectData]);

      if (error) {
        console.error("Error inserting project:", error);
        return;
      }
    }

    // إعادة ضبط الحقول وإعادة جلب البيانات
    resetForm();
    fetchProjects();
  };

  // جلب بيانات المشروع للتعديل
  const handleEdit = (project) => {
    setNameAr(project.name_ar || "");
    setNameEn(project.name_en || "");
    setUrl(project.url || "");
    setImage(project.image || "");
    setDescAr(project.desc_ar || "");
    setDescEn(project.desc_en || "");
    setCategory(project.category || "Dashboards");
    setTagsInputAr(project.tags_ar ? project.tags_ar.join(", ") : "");
    setTagsInputEn(project.tags_en ? project.tags_en.join(", ") : "");
    setEditId(project.id);
  };

  // دالة الحذف من Supabase
  const handleDelete = async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return;
    }

    if (editId === id) {
      resetForm();
      setEditId(null);
    }
    fetchProjects();
  };

  const resetForm = () => {
    setNameAr("");
    setNameEn("");
    setUrl("");
    setImage("");
    setDescAr("");
    setDescEn("");
    setCategory("Dashboards");
    setTagsInputAr("رياكت, تيلويند");
    setTagsInputEn("React, Tailwind");
  };

  return (
    <div
      className={`space-y-8 p-6 md:p-8 rounded-3xl transition-colors duration-300 ${isDark ? "bg-[#07090F] text-white" : "bg-slate-100 text-slate-900"}`}
    >
      {/* رأس الصفحة في الداشبورد */}
      <div
        className={`p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <FolderGit2 size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-wide">
            إدارة معرض المشاريع (Supabase Synced)
          </h1>
        </div>
        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
          إدارة وتحديث المشاريع المرتبطة بقاعدة بيانات Supabase مباشرة (عربي
          وإنكليزي).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. نموذج الإضافة / التعديل */}
        <div
          className={`p-6 rounded-2xl border h-fit ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-700/50">
            <h2 className="text-base font-bold">
              {editId !== null ? "تعديل المشروع الحالي" : "إضافة مشروع جديد"}
            </h2>
            {editId !== null && (
              <button
                onClick={() => {
                  resetForm();
                  setEditId(null);
                }}
                className="text-xs text-rose-400 hover:underline"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اسم المشروع بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                اسم المشروع (عربي)
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: نظام العقارات"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
                required
              />
            </div>

            {/* اسم المشروع بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                اسم المشروع (إنجليزي)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Example: Real Estate System"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
                required
              />
            </div>

            {/* رابط المعاينة الحية */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                رابط المعاينة (Live URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourproject.vercel.app/"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
                required
              />
            </div>

            {/* مسار الصورة */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                مسار أو رابط الصورة
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="../assets/projects/system.jpg.png"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
              />
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                فئة المشروع (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
              >
                <option value="Dashboards">Dashboards</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Platforms">Platforms</option>
                <option value="Systems">Systems</option>
                <option value="Applications">Applications</option>
              </select>
            </div>

            {/* الوسوم بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                الوسوم (عربي مفصولة بفواصل)
              </label>
              <input
                type="text"
                value={tagsInputAr}
                onChange={(e) => setTagsInputAr(e.target.value)}
                placeholder="رياكت, تيلويند"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
              />
            </div>

            {/* الوسوم بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                الوسوم (إنجليزي مفصولة بفواصل)
              </label>
              <input
                type="text"
                value={tagsInputEn}
                onChange={(e) => setTagsInputEn(e.target.value)}
                placeholder="React, Tailwind"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
              />
            </div>

            {/* الوصف بالعربي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                وصف المشروع (عربي)
              </label>
              <textarea
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="اكتب نبذة مختصرة عن المشروع بالعربية..."
                rows={2}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all resize-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
                required
              />
            </div>

            {/* الوصف بالإنجليزي */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                وصف المشروع (إنجليزي)
              </label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Write a brief description in English..."
                rows={2}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-all resize-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white focus:border-cyan-500" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500"}`}
                required
              />
            </div>

            {/* زر الحفظ */}
            <button
              type="submit"
              className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                editId !== null
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              }`}
            >
              <Plus size={18} />
              <span>
                {editId !== null ? "حفظ تعديل المشروع" : "إضافة المشروع للمعرض"}
              </span>
            </button>
          </form>
        </div>

        {/* 2. جدول المشاريع المسجلة */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-700/50">
            <h2 className="text-base font-bold">
              المشاريع المسجلة ({projects.length})
            </h2>
            <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Supabase Connected
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-zinc-500 space-y-2 flex flex-col items-center justify-center">
              <Loader2 size={32} className="animate-spin text-cyan-500" />
              <p className="text-sm">جاري جلب البيانات من قاعدة البيانات...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-2">
              <AlertCircle size={32} className="mx-auto opacity-40" />
              <p className="text-sm">
                لا توجد مشاريع مضافة حالياً في قاعدة البيانات.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isDark ? "bg-[#12192B]/60 border-[#1E273F] hover:border-zinc-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 overflow-hidden mt-0.5">
                      <FolderGit2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold">
                          {project.name_en} / {project.name_ar}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-cyan-500/10 border-cyan-500/20 text-cyan-300">
                          {project.category}
                        </span>
                      </div>
                      <p
                        className={`text-xs line-clamp-1 ${isDark ? "text-zinc-400" : "text-slate-600"}`}
                      >
                        {project.desc_en}
                      </p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-cyan-400 hover:underline inline-flex items-center gap-1 pt-0.5"
                      >
                        <span>{project.url}</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* أزرار التعديل والحذف */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>تعديل</span>
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>حذف</span>
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
