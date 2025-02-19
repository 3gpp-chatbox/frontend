import mermaid from 'mermaid'

export const initializeMermaid = () => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'monospace',
    flowchart: {
      nodeWidth: 150,
      nodeHeight: 50,
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    }
  })
}

export const validateMermaidSyntax = async code => {
  try {
    await mermaid.parse(code)
    return true
  } catch (error) {
    console.error('Mermaid syntax error:', error)
    return false
  }
}
