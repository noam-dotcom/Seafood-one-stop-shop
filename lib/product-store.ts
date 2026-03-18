'use client'
// ─── PRODUCT STORE — localStorage persistence for admin-added products ────
import type { Product } from './data'

const STORAGE_KEY = 'seahub_admin_products'

export function getAdminProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Product[]) : []
  } catch {
    return []
  }
}

export function saveAdminProduct(product: Product): void {
  if (typeof window === 'undefined') return
  const existing = getAdminProducts()
  const idx = existing.findIndex(p => p.id === product.id)
  if (idx >= 0) {
    existing[idx] = product
  } else {
    existing.push(product)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  window.dispatchEvent(new Event('seahub_products_updated'))
}

export function deleteAdminProduct(id: string): void {
  if (typeof window === 'undefined') return
  const existing = getAdminProducts().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  window.dispatchEvent(new Event('seahub_products_updated'))
}

export function generateProductId(category: string): string {
  const prefix: Record<string, string> = {
    'frozen-seafood': 'fz',
    'frozen-value-added': 'va',
    'seafood-specials': 'sp',
    'fresh-seafood': 'fr',
  }
  const pfx = prefix[category] ?? 'xx'
  const ts = Date.now().toString(36).slice(-4)
  return `${pfx}-adm-${ts}`
}
