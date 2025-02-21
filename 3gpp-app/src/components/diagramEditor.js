import React, { useState, useEffect } from 'react'

const DiagramEditor = ({ mermaidCode, onCodeChange }) => {
  const [code, setCode] = useState(mermaidCode || '')

  useEffect(() => {
    setCode(mermaidCode || '')
  }, [mermaidCode])

  const handleCodeChange = e => {
    const newCode = e.target.value
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }

  // Function to highlight the code
  const getHighlightedCode = code => {
    if (!code) return ''

    // Replace node definitions with colored versions
    code = code.replace(
      /\[([^\]]+)\]/g,
      (match, text) => `<span class="text-emerald-400">[${text}]</span>`
    )

    // Replace edge arrows with colored versions
    code = code.replace(/-->/g, `<span class="text-yellow-400">--></span>`)

    // Replace edge text with colored versions
    code = code.replace(
      /\|([^|]+)\|/g,
      (match, text) => `<span class="text-blue-400">|${text}|</span>`
    )

    return code
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 relative'>
        <div
          className='w-full h-full p-4 font-mono text-sm bg-zinc-800 text-gray-200 
                    border-0 whitespace-pre'
          dangerouslySetInnerHTML={{
            __html: getHighlightedCode(code)
          }}
        />
        <textarea
          value={code}
          onChange={handleCodeChange}
          className='absolute inset-0 w-full h-full p-4 font-mono text-sm 
                      bg-transparent text-transparent caret-white
                      border-0 resize-none focus:ring-1 focus:ring-blue-500
                      overflow-hidden'
          placeholder='Select a procedure to view and edit its Mermaid diagram code...'
          spellCheck='false'
        />
      </div>
    </div>
  )
}

export default DiagramEditor
