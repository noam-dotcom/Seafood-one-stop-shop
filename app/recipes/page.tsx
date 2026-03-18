'use client'

import { useState } from 'react'
import {
  ChefHat, Clock, Users, Star, Search, Filter, Heart,
  Share2, BookOpen, TrendingUp, Globe2, Sparkles, ArrowRight,
  BarChart3, DollarSign, Utensils, Plus, Camera
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RECIPES } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger',
}

const TRENDING_DISHES = [
  { dish: 'Norwegian Salmon Poke Bowl', trend: '+340%', region: 'USA', emoji: '🍱' },
  { dish: 'Ecuadorian Ceviche', trend: '+125%', region: 'Global', emoji: '🍋' },
  { dish: 'Japanese Tuna Tataki', trend: '+89%', region: 'Europe', emoji: '🐠' },
  { dish: 'Thai Shrimp Green Curry', trend: '+67%', region: 'MENA', emoji: '🍛' },
  { dish: 'Icelandic Fish & Chips', trend: '+54%', region: 'UK', emoji: '🐟' },
  { dish: 'Portuguese Cod Bacalhau', trend: '+43%', region: 'Americas', emoji: '🥘' },
]

const CHEF_PICKS = [
  { name: 'Chef Nobu Matsuhisa', specialty: 'Japanese-Peruvian Fusion', flag: '🇯🇵', rating: 5.0 },
  { name: 'Chef José Andrés', specialty: 'Spanish Mediterranean', flag: '🇪🇸', rating: 4.9 },
  { name: 'Chef Alice Waters', specialty: 'California Farm-to-Table', flag: '🇺🇸', rating: 4.8 },
  { name: 'Chef Yotam Ottolenghi', specialty: 'Middle Eastern Fusion', flag: '🇮🇱', rating: 4.9 },
]

function RecipeCard({ recipe, featured = false }: { recipe: typeof RECIPES[0]; featured?: boolean }) {
  const t = useT()
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const difficultyKey = `page.recipes.difficulty.${recipe.difficulty.toLowerCase()}`

  return (
    <Card className={cn('overflow-hidden', featured && 'lg:col-span-2')} hover>
      {/* Recipe Header */}
      <div className={cn(
        'bg-gradient-to-br flex items-center justify-center',
        recipe.species === 'Atlantic Salmon' ? 'from-orange-100 to-red-50' :
        recipe.species === 'White Shrimp' ? 'from-orange-50 to-amber-50' :
        'from-blue-50 to-sky-50',
        featured ? 'h-48' : 'h-32'
      )}>
        <span className={cn('select-none', featured ? 'text-8xl' : 'text-5xl')}>{recipe.image}</span>
      </div>

      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <Badge variant={DIFFICULTY_COLORS[recipe.difficulty] as any}>{t(difficultyKey)}</Badge>
          {recipe.tags.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
        </div>

        {/* Title & Chef */}
        <h3 className={cn('font-bold text-slate-900 mb-1', featured ? 'text-xl' : 'text-base')}>
          {recipe.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {recipe.chef[6]}
          </div>
          <span className="text-sm text-slate-600 font-medium">{recipe.chef}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">{recipe.origin}</span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{recipe.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />{recipe.time} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />{recipe.servings} {t('page.recipes.servings')}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{recipe.rating} ({recipe.reviews.toLocaleString()})
          </span>
        </div>

        {/* Business Note */}
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3 h-3 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Trade Intelligence</span>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">{recipe.businessNote}</p>
        </div>

        {/* Expand for recipe */}
        {expanded && (
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-ocean-400 mt-0.5">•</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Method</h4>
              <ol className="space-y-1.5">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="bg-ocean-100 text-ocean-700 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => setExpanded(!expanded)}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? 'Hide' : t('page.recipes.viewRecipe')}
          </Button>
          <button
            onClick={() => setSaved(!saved)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Heart className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : 'text-slate-400')} />
          </button>
          <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Share2 className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function RecipesPage() {
  const t = useT()
  const [search, setSearch] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('All')

  const SPECIES_FILTER = ['All', 'Atlantic Salmon', 'Yellowfin Tuna', 'Tilapia', 'Shrimp', 'Lobster', 'Value Added Seafood']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 p-6 sm:p-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">{t('page.recipes.curated')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('page.recipes.title')}</h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed max-w-xl">
            {t('page.recipes.subtitle')}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('page.recipes.search')}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Species filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPECIES_FILTER.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSpecies(s)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              selectedSpecies === s
                ? 'bg-rose-500 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Trending Dishes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold text-slate-900">{t('page.recipes.trending')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {TRENDING_DISHES.map(dish => (
            <Card key={dish.dish} className="p-3 text-center cursor-pointer" hover>
              <span className="text-3xl mb-2 block">{dish.emoji}</span>
              <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight mb-1">{dish.dish}</p>
              <p className="text-xs font-bold text-emerald-600">{dish.trend}</p>
              <p className="text-xs text-slate-400">{dish.region}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Chef Picks Banner */}
      <Card className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-slate-900">{t('page.recipes.featuredChefs')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHEF_PICKS.map(chef => (
            <div key={chef.name} className="flex items-center gap-2 p-2 bg-white/60 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {chef.flag}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{chef.name}</p>
                <p className="text-xs text-slate-500 truncate">{chef.specialty}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{chef.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recipes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Chef-Curated Recipes</h2>
          <Badge variant="default">{t('page.recipes.badge')}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECIPES.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} featured={i === 0} />
          ))}
        </div>
      </div>

      {/* Community Section */}
      <Card className="p-6 text-center border-dashed border-2 border-rose-200 bg-rose-50/30">
        <Camera className="w-10 h-10 text-rose-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 mb-1">{t('page.recipes.share')}</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
          Are you a chef, restaurant owner, or passionate seafood cook? Share your recipe and reach
          48,000+ seafood industry professionals worldwide.
        </p>
        <Button variant="primary" className="bg-rose-500 hover:bg-rose-600">
          <Plus className="w-4 h-4" />
          {t('page.recipes.submit')}
        </Button>
      </Card>

      {/* Seafood Culture */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">{t('page.recipes.culture')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { country: 'Japan', dish: 'Sushi & Sashimi', emoji: '🍣', color: 'from-red-50 to-pink-50 border-red-100' },
            { country: 'Portugal', dish: 'Bacalhau (Salt Cod)', emoji: '🐟', color: 'from-yellow-50 to-amber-50 border-yellow-100' },
            { country: 'Thailand', dish: 'Tom Yum Seafood', emoji: '🍜', color: 'from-green-50 to-emerald-50 border-green-100' },
            { country: 'Spain', dish: 'Paella de Mariscos', emoji: '🥘', color: 'from-orange-50 to-red-50 border-orange-100' },
            { country: 'Peru', dish: 'Ceviche Clásico', emoji: '🍋', color: 'from-sky-50 to-blue-50 border-sky-100' },
            { country: 'Morocco', dish: 'Chermoula Fish', emoji: '🫙', color: 'from-amber-50 to-yellow-50 border-amber-100' },
            { country: 'Norway', dish: 'Gravlaks & Smørbrød', emoji: '🍞', color: 'from-purple-50 to-violet-50 border-purple-100' },
            { country: 'USA', dish: 'New England Chowder', emoji: '🥣', color: 'from-slate-50 to-gray-50 border-slate-100' },
          ].map(item => (
            <Card key={item.country} className={`p-4 bg-gradient-to-br border ${item.color} cursor-pointer`} hover>
              <span className="text-3xl mb-2 block">{item.emoji}</span>
              <p className="text-sm font-bold text-slate-900">{item.country}</p>
              <p className="text-xs text-slate-600">{item.dish}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
