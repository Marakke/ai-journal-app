'use client'

import { updateEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'

const Editor = ({ entry }) => {
  const [text, setText] = useState(entry.content)
  const [currentEntry, setEntry] = useState(entry)
  const [analysis, setAnalysis] = useState(entry.analysis)
  const [isSaving, setIsSaving] = useState(false)

  useAutosave({
    data: text,
    onSave: async (_text) => {
      setIsSaving(true)

      const { data } = await updateEntry(entry.id, _text)

      setEntry(data)
      setAnalysis(data.analysis)
      setIsSaving(false)
    },
  })

  const { subject, summary, mood, negative, color, sentimentScore } = analysis

  const analysisData = [
    { name: 'Subject', value: subject },
    { name: 'Summary', value: summary },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
    { name: 'Sentiment Score', value: sentimentScore },
  ]

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
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
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">AI Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="flex px-2 py-4 items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Editor
