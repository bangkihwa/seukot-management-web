import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
  placeholder?: string
  presets?: readonly string[]
  color?: string
}

export default function TagInput({ value, onChange, maxTags = 5, placeholder = '키워드 입력 후 Enter', presets, color = 'teal' }: TagInputProps) {
  const [input, setInput] = useState('')

  const colorMap: Record<string, { tag: string; btn: string }> = {
    teal: { tag: 'bg-teal-50/80 text-teal-700 border border-teal-200/40', btn: 'text-teal-400 hover:text-teal-600' },
    blue: { tag: 'bg-sky-50/80 text-sky-700 border border-sky-200/40', btn: 'text-sky-400 hover:text-sky-600' },
    green: { tag: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/40', btn: 'text-emerald-400 hover:text-emerald-600' },
  }
  const colors = colorMap[color] || colorMap.teal

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return
    onChange([...value, trimmed])
    setInput('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    }
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {value.map((tag, i) => (
          <span key={i} className={`px-3 py-1 ${colors.tag} rounded-full text-sm flex items-center gap-1 backdrop-blur-sm`}>
            {tag}
            <button type="button" onClick={() => removeTag(i)} className={`${colors.btn} font-bold`}>&times;</button>
          </span>
        ))}
        {value.length === 0 && <span className="text-slate-400 text-sm">미입력</span>}
      </div>

      {presets && presets.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-2">
          {presets.filter(p => !value.includes(p)).map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => addTag(preset)}
              disabled={value.length >= maxTags}
              className="px-3 py-1 text-xs border border-slate-200/80 rounded-full hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600 text-slate-500 transition-all duration-200 disabled:opacity-30"
            >
              + {preset}
            </button>
          ))}
        </div>
      )}

      {value.length < maxTags && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="input-field !py-1.5 text-sm flex-1"
          />
          <button
            type="button"
            onClick={() => addTag(input)}
            className="btn-ghost text-sm"
          >
            추가
          </button>
        </div>
      )}
    </div>
  )
}
