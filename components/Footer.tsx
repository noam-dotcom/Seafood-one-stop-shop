'use client'

import { useT } from '@/lib/i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/marketplace/buy"  className="hover:text-ocean-600 transition-colors">{t('footer.buy')}</a></li>
              <li><a href="/marketplace/sell" className="hover:text-ocean-600 transition-colors">{t('footer.sell')}</a></li>
              <li><a href="/prices"           className="hover:text-ocean-600 transition-colors">{t('footer.prices')}</a></li>
              <li><a href="/news"             className="hover:text-ocean-600 transition-colors">{t('footer.news')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/knowledge" className="hover:text-ocean-600 transition-colors">{t('footer.knowledge')}</a></li>
              <li><a href="/recipes"   className="hover:text-ocean-600 transition-colors">{t('footer.recipes')}</a></li>
              <li><a href="#"          className="hover:text-ocean-600 transition-colors">{t('footer.regulations')}</a></li>
              <li><a href="#"          className="hover:text-ocean-600 transition-colors">{t('footer.certs')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.press')}</a></li>
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">{t('footer.trust')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.verification')}</a></li>
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.escrow')}</a></li>
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="hover:text-ocean-600 transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-400">{t('footer.copy')}</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="text-xs text-slate-400">{t('footer.trusted')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
