import { validateGraph } from './schema_validation';

export function validateMermaidCode(mermaidCode) {
  if (!mermaidCode || typeof mermaidCode !== 'string') return false;
  
  const lines = mermaidCode.split('\n').map(line => line.trim());
  
  // Check for flowchart declaration
  if (!lines.some(line => line.startsWith('flowchart'))) return false;
  
  return true;
}

export function convertMermaidToJson(mermaidCode) {
  const lines = mermaidCode.split('\n');

  const jsonOutput = {
    nodes: [],
    edges: [],
    direction: 'TD' // Default direction
  };

  const labelToIdMap = {};
  let lastElementType = null;
  let lastElementRef = null;

  // Clean text helper function
  const cleanText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/<br>/g, '').replace(/['"]/g, '').trim();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Handle flowchart declaration and direction
    if (line.startsWith('flowchart')) {
      const dirMatch = line.match(/flowchart\s+(TD|LR)/);
      if (dirMatch) {
        jsonOutput.direction = dirMatch[1];
      }
      continue;
    }

    // Skip class definitions
    if (line.startsWith('classDef')) continue;

    // Match node definitions
    const nodeMatch = line.match(/^([A-Z0-9]+)(?:\[|\(\()["']([^"']+)["'](?:\]|\)\))(?:::(\w+))?/);
    if (nodeMatch) {
      const [, label, content, nodeType] = nodeMatch;
      
      // Clean the content
      const cleanContent = cleanText(content);
      
      labelToIdMap[label] = cleanContent;
      
      let type = 'state';
      if (nodeType) {
        type = nodeType;
      } else if (line.includes('((') && line.includes('))')) {
        type = 'event';
      }

      if (!['state', 'event'].includes(type)) {
        type = 'state';
      }
      
      const node = {
        id: cleanContent,
        type: type,
        description: ""
      };
      
      jsonOutput.nodes.push(node);
      lastElementType = "node";
      lastElementRef = node;
      continue;
    }

    // Match edge definitions with improved label handling
    const edgeMatch = line.match(/^([A-Z0-9]+)\s*-->\s*(?:\|["']([^"']+)["']\|)?\s*([A-Z0-9]+)/);
    if (edgeMatch) {
      const [, fromLabel, messageType, toLabel] = edgeMatch;
      const from = cleanText(labelToIdMap[fromLabel] || fromLabel);
      const to = cleanText(labelToIdMap[toLabel] || toLabel);
      
      const edge = {
        from,
        to,
        type: "trigger", // Default type
        description: messageType ? cleanText(messageType) : ""
      };
      
      jsonOutput.edges.push(edge);
      lastElementType = "edge";
      lastElementRef = edge;
      continue;
    }

    // Match Type and Description comments
    const typeMatch = line.match(/^%% Type:\s*(.+)$/);
    if (typeMatch && lastElementRef) {
      const [, matchedType] = typeMatch;
      if (lastElementType === "edge") {
        lastElementRef.type = ['trigger', 'condition'].includes(matchedType.toLowerCase()) ? matchedType.toLowerCase() : 'trigger';
      } else {
        lastElementRef.type = ['state', 'event'].includes(matchedType.toLowerCase()) ? matchedType.toLowerCase() : 'state';
      }
      continue;
    }

    const descMatch = line.match(/^%% Description:\s*(.+)$/);
    if (descMatch && lastElementRef) {
      lastElementRef.description = cleanText(descMatch[1]);
      continue;
    }
  }

  return jsonOutput;
}

export async function saveMermaidAsJson(mermaidCode) {
  try {
    // First validate Mermaid syntax
    if (!validateMermaidCode(mermaidCode)) {
      return {
        success: false,
        message: 'Invalid Mermaid syntax'
      };
    }

    // Convert to JSON
    const jsonData = convertMermaidToJson(mermaidCode);
    
    // Validate the JSON structure
    const validationResult = validateGraph(jsonData);
    
    if (!validationResult.valid) {
      return {
        success: false,
        message: 'Invalid graph structure',
        error: validationResult.error
      };
    }

    return {
      success: true,
      message: 'Successfully converted and validated',
      data: jsonData
    };

  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error occurred',
      error: error.message
    };
  }
} 