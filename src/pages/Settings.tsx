import { useState, useEffect } from "react";
import { 
  Settings, 
  MessageSquare, 
  FileText,  
  Save, 
  CheckCircle2,
  Upload,
  Loader2,
  Sparkles,
  ShieldCheck,
  ExternalLink
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
      <div className={`p-16 text-center flex flex-col items-center justify-center space-y-4 rounded-3xl transition-colors duration-300 ${isDark ? "bg-[#08080c] text-white border border-white/[0.06]" : "bg-slate-100 text-slate-900"}`}>
        <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" />
        <p className="text-xs text-zinc-400 font-mono tracking-wider">جاري تحميل لوحة الإعدادات...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 p-6 md:p-10 rounded-3xl transition-all duration-500 ${isDark ? "bg-[#08080c] text-white border border-white/[0.06] shadow-2xl" : "bg-slate-50 text-slate-900 border border-slate-200 shadow-xl"}`}>
      
      {/* --- قسم العنوان والتنويه بتصميم فخم --- */}
      <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${isDark ? "bg-gradient-to-br from-[#0d0d15] to-[#08080c] border-white/[0.08]" : "bg-white border-slate-200 shadow-md"}`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                <Sparkles size={13} className="animate-spin" style={{ animationDuration: "3s" }} />
                System Preferences
              </span>
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono rounded-full flex items-center gap-1">
                <ShieldCheck size={13} /> Secure Config
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">إعدادات الموقع العامة</h1>
            <p className={`text-xs sm:text-sm ${isDark ? "text-zinc-400" : "text-slate-600"}`}>
              إدارة قنوات التواصل الفوري وروابط السيرة الذاتية (CV) السحابية بكفاءة عالية.
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shrink-0 shadow-inner">
            <Settings size={26} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* --- تنبيهات النجاح أو الخطأ --- */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-fadeIn shadow-lg shadow-emerald-500/5">
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="text-sm font-bold">تم حفظ التغييرات وتطبيقها في قاعدة البيانات بنجاح!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold flex items-center gap-3 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* --- نموذج الإعدادات --- */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* بطاقة الواتساب */}
          <div className={`group p-6 sm:p-7 rounded-3xl border transition-all duration-300 hover:border-emerald-500/40 shadow-lg ${isDark ? "bg-[#0d0d15] border-white/[0.06]" : "bg-white border-slate-200"}`}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/[0.06]">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">تواصل واتساب</h2>
                <span className="text-[11px] text-zinc-400 font-mono">رقم التواصل المباشر في البرتفوليو</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-400">رقم الواتساب (مع رمز الدولة)</label>
              <input 
                type="text" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#14141f] border-white/10 text-white focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"}`}
                placeholder="+201234567890"
                required
              />
            </div>
          </div>

          {/* بطاقة ملف الـ PDF (CV) */}
          <div className={`group p-6 sm:p-7 rounded-3xl border transition-all duration-300 hover:border-blue-500/40 shadow-lg ${isDark ? "bg-[#0d0d15] border-white/[0.06]" : "bg-white border-slate-200"}`}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/[0.06]">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">ملف السيرة الذاتية (CV)</h2>
                <span className="text-[11px] text-zinc-400 font-mono">رابط ملف الـ PDF السحابي للتحميل</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-400">رابط الملف أو ارفعه مباشرة</label>
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={cvFile}
                  onChange={(e) => setCvFile(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none transition-all ${isDark ? "bg-[#14141f] border-white/10 text-white focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20" : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"}`}
                  placeholder="https://...file.pdf"
                  required
                />
                <label className={`px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 active:scale-95 ${uploadingCv ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploadingCv ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  <span>{uploadingCv ? "جاري الرفع..." : "رفع PDF"}</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              {cvFile.startsWith("http") && (
                <div className="pt-1">
                  <a href={cvFile} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1 font-mono">
                    <span>معاينة الملف المرفوع حالياً</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* --- زر الحفظ النهائي بتصميم جذاب وتأثيرات ضوئية --- */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="py-4 px-9 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 size={18} className="animate-spin stroke-[3]" /> : <Save size={18} className="stroke-[2.5]" />}
            <span>{saving ? "جاري حفظ التعديلات..." : "حفظ التعديلات في قاعدة البيانات"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
