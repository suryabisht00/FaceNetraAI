'use client'

import { useState } from 'react'
import { X, Plus, Pencil } from 'lucide-react'

interface InterestTagsProps {
  interests: string[]
  onRemove: (index: number) => void
  onAdd?: (interest: string) => void
}

export default function InterestTags({ interests, onRemove, onAdd }: InterestTagsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newInterest, setNewInterest] = useState('')

  const handleAdd = () => {
    if (newInterest.trim() && onAdd) {
      onAdd(newInterest.trim())
      setNewInterest('')
      setIsAdding(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewInterest('')
    }
  }

  if (interests.length === 0 && !isAdding) return null

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400">Your Interests</p>
        {onAdd && (
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="text-primary hover:text-primary/80 transition-colors p-1"
            title="Add interest"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary flex items-center gap-2"
          >
            {interest}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Add Interest Input */}
        {isAdding && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add interest..."
              className="px-3 py-1.5 bg-primary/5 border border-primary/30 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary min-w-[120px]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAdd}
              className="p-1 bg-primary hover:bg-primary/90 rounded-full text-white transition-colors"
              title="Add"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
