import React from 'react';
import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-emerald-500/10 py-5 px-6 text-center relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* حقوق النشر بتنسيق مطور الويب */}
        <div className="text-sm text-gray-400 font-medium">
          &copy; {new Date().getFullYear()} <span className="text-emerald-400 font-bold">Ahmed Ismail</span>. جميع الحقوق محفوظة.
        </div>

        {/* توقيع برمجي فخم */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Code2 size={15} className="text-emerald-400" />
          <span>تم التطوير والبرمجة باحترافية عالية</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;