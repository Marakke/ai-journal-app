'use client'

import { updateEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'

const Editor = ({ entry }) => {
  const [text, setText] = useState(entry.content)
  const [currentEntry, setEntry] = useState(entry)
  const [isSaving, setIsSaving] = useState(false)

  useAutosave({
    data: text,
    onSave: async (_text) => {
      setIsSaving(true)

      const updatedEntry = await updateEntry(entry.id, _text)

      setEntry(updatedEntry)
      setIsSaving(false)
    },
  })

  return (
    <div className="w-full h-full">
      {isSaving && (
        <div className="absolute inset-0 flex items-center justify-center">
          Saving...
        </div>
      )}
      <textarea
        className="w-full h-full p-8 text-xl outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

export default Editor
