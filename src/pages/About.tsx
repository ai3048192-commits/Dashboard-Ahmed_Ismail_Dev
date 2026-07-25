import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Code2,
  Languages,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function PortfolioManagement() {
  const [items, setItems] = useState([]);
  
  // الحقول الجديدة لدعم اللغتين
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error.message);
        throw error;
      }
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleAr.trim() || !descriptionAr.trim()) return;

    try {
      const payload = {
        title: titleAr, // الاحتفاظ بالحقل الأساسي كنسخة احتياطية
        description: descriptionAr,
        title_ar: titleAr,
        title_en: titleEn || titleAr,
        description_ar: descriptionAr,
        description_en: descriptionEn || descriptionAr,
      };

      if (editId !== null) {
        const { error } = await supabase
          .from("items")
          .update(payload)
          .eq("id", editId);

        if (error) throw error;

        setItems(
          items.map((item) =>
            item.id === editId ? { ...item, ...payload } : item
          )
        );
        setEditId(null);
      } else {
        const { data, error } = await supabase
          .from("items")
          .insert([payload])
          .select();

        if (error) {
          console.error("Supabase insert error:", error.message);
          alert("خطأ أثناء الحفظ: " + error.message);
          throw error;
        }

        if (data) {
          setItems([data[0], ...items]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const resetForm = () => {
    setTitleAr("");
    setTitleEn("");
    setDescriptionAr("");
    setDescriptionEn("");
    setEditId(null);
  };

  const handleEdit = (item) => {
    setTitleAr(item.title_ar || item.title || "");
    setTitleEn(item.title_en || "");
    setDescriptionAr(item.description_ar || item.description || "");
    setDescriptionEn(item.description_en || "");
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setItems(items.filter((item) => item.id !== id));
      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* عنوان الصفحة */}
      <div className="bg-[#050510]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
            <Code2 size={22} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            إدارة سجلات البرتفوليو وتعدد اللغات
          </h1>
        </div>
        <p className="text-sm text-zinc-400">
          أضف بيانات مشاريعك باللغتين العربية والإنجليزية لكي تتحدث تلقائياً في واجهة الموقع بحسب لغة المستخدم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* نموذج الإضافة / التعديل */}
        <div className="bg-[#050510]/90 backdrop-blur-3xl border border-white/[0.08] 
        rounded-[2.5rem] p-6 sm:p-8 shadow-2xl h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r 
          from-emerald-500 to-cyan-500" />
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b
           border-white/[0.06]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Languages size={18} className="text-cyan-400" />
              {editId !== null ? "تعديل السجل" : "إضافة سجل جديد"}
            </h2>
            {editId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-rose-400 hover:underline font-mono"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* العنوان بالعربية */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                العنوان (عربي) *
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="أدخل العنوان بالعربية..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl
                 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all
                 "
                required
              />
            </div>

            {/* العنوان بالإنجليزية */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                العنوان (إنجليزي)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Enter title in English..."
                dir="ltr"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 
                rounded-2xl text-white text-sm focus:outline-none focus:border-cyan-500
                 transition-all "
              />
            </div>

            {/* الوصف بالعربية */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                الوصف (عربي) *
              </label>
              <textarea
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="اكتب الوصف بالعربية..."
                rows={3}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl
                 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all
                  resize-none "
                required
              />
            </div>

            {/* الوصف بالإنجليزية */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                الوصف (إنجليزي)
              </label>
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Enter description in English..."
                dir="ltr"
                rows={3}
                className="w-full px-4 py-3 bg-black/40 border border-white/10
                 rounded-2xl text-white text-sm focus:outline-none
                  focus:border-cyan-500 transition-all resize-none "
              />
            </div>

            <button
              type="submit"
              className={`w-full py-4 px-4 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                editId !== null
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              }`}
            >
              <Plus size={16} />
              <span>{editId !== null ? "حفظ التعديلات" : "إضافة السجل للنظام"}</span>
            </button>
          </form>
        </div>

        {/* عرض السجلات الحالية */}
        <div className="lg:col-span-2 bg-[#050510]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500" />
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <h2 className="text-base font-bold text-white">
              السجلات الحالية ({items.length})
            </h2>
            <span className="text-xs text-cyan-400  bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              متصل بـ Supabase (Multilingual)
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-3">
              <AlertCircle size={36} className="mx-auto opacity-40 text-cyan-400" />
              <p className="text-sm font-mono">لا توجد سجلات مضافة حالياً في قاعدة البيانات.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white/[0.02] border border-white/[0.06] 
                  rounded-2xl flex flex-col sm:flex-row sm:items-center 
                  justify-between gap-4 hover:border-cyan-500/30 transition-all"
                >
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 
                      rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        ID: #{item.id}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        🇸🇦 {item.title_ar || item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {item.description_ar || item.description}
                      </p>
                    </div>
                    {item.title_en && (
                      <div className="pt-1 border-t border-white/5" dir="ltr">
                        <h4 className="text-xs  text-purple-300">
                          🇺🇸 {item.title_en}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          {item.description_en}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>تعديل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
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