import { useState, useEffect } from "react";
import { 
  Settings, 
  MessageSquare, 
  FileText,  
  Save, 
  CheckCircle2,
  Upload,
  Loader2
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function GeneralSettingsDashboard({ lang = "EN", isDark = true }) {
  const [whatsapp, setWhatsapp] = useState("+201234567890");
  const [cvFile, setCvFile] = useState("resume_2026.pdf");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // جلب البيانات عند التحميل
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("id", 1)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setWhatsapp(data.whatsapp || "+201234567890");
          setCvFile(data.cv_file || "resume_2026.pdf");
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // دالة رفع ملف الـ PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCv(true);
      setErrorMessage("");

      const fileExt = file.name.split('.').pop();
      const fileName = `cv_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from("portfolio-files")
        .getPublicUrl(filePath);

      if (publicURLData?.publicUrl) {
        setCvFile(publicURLData.publicUrl);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setErrorMessage("فشل رفع الملف، تأكد من إعدادات الـ Storage في Supabase.");
    } finally {
      setUploadingCv(false);
    }
  };

  // دالة الحفظ في قاعدة البيانات
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("settings")
        .upsert({
          id: 1,
          whatsapp,
          cv_file: cvFile,
          updated_at: new Date()
        });

      if (error) throw error;

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setErrorMessage("حدث خطأ أثناء حفظ الإعدادات في قاعدة البيانات.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-12 text-center flex flex-col items-center justify-center space-y-3 rounded-3xl ${isDark ? "bg-[#07090F] text-white" : "bg-slate-100 text-slate-900"}`}>
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs text-zinc-400 font-mono">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 p-6 md:p-8 rounded-3xl transition-colors duration-300 ${isDark ? "bg-[#07090F] text-white" : "bg-slate-100 text-slate-900"}`}>
      
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Settings size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-wide">إعدادات الموقع العامة</h1>
        </div>
        <p className={`text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
          إدارة روابط التواصل ورفع ملفات السيرة الذاتية (CV).
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">تم حفظ التغييرات وتطبيقها في قاعدة البيانات بنجاح!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* الواتساب */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-700/50">
              <MessageSquare size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold">تواصل واتساب</h2>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">رقم الواتساب</label>
              <input 
                type="text" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                required
              />
            </div>
          </div>

          {/* ملف الـ PDF */}
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? "bg-[#0D111C] border-[#1A2338]" : "bg-white border-slate-300 shadow-sm"}`}>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-700/50">
              <FileText size={18} className="text-blue-400" />
              <h2 className="text-base font-bold">ملف الـ PDF (CV)</h2>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">رابط الملف السحابي</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={cvFile}
                  onChange={(e) => setCvFile(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none ${isDark ? "bg-[#151D33] border-[#232F4C] text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                  required
                />
                <label className={`px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${uploadingCv ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploadingCv ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploadingCv ? "جاري الرفع..." : "رفع PDF"}</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            disabled={saving}
            className="py-3.5 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? "جاري الحفظ..." : "حفظ التعديلات في قاعدة البيانات"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}