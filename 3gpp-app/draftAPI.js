const express = require('express')
const neo4j = require('neo4j-driver')
const router = express.Router()

// Neo4j connection
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
)

// Get all procedures
router.get('/api/procedures', async (req, res) => {
  const session = driver.session()
  try {
    const result = await session.run('MATCH (p:Procedure) RETURN p')
    const procedures = result.records.map(record => {
      const node = record.get('p')
      return {
        id: node.identity.toString(),
        name: node.properties.name,
        description: node.properties.description || ''
      }
    })
    res.json({ procedures })
  } catch (error) {
    res.status(500).json({ error: error.message })
  } finally {
    session.close()
  }
})

// Get Mermaid diagram from backend
router.get('/api/procedures/:id/diagram', async (req, res) => {
  const session = driver.session()
  try {
    const result = await session.run(
      'MATCH (p:Procedure)-[:HAS_RELATIONSHIP]->(r:Relationship)-[:HAS_TARGET]->(n:Node) RETURN p, r, n'
    )
    const mermaidCode = generateMermaidFromNeo4j(result.records)
    res.json({ mermaid: mermaidCode })
  } catch (error) {
    res.status(500).json({ error: error.message })
  } finally {
    session.close()
  }
})

// function generateMermaidFromNeo4j (records) {
//   let mermaidCode = 'graph TD\n'
//   const nodes = new Set()
//   const relationships = new Set()

//   records.forEach(record => {
//     const procedure = record.get('p')
//     const relationship = record.get('r')
//     const target = record.get('n')

//     // Add nodes if they don't exist
//     if (!nodes.has(procedure.identity.toString())) {
//       mermaidCode += `    ${procedure.identity}[${procedure.properties.name}]\n`
//       nodes.add(procedure.identity.toString())
//     }
//     if (!nodes.has(target.identity.toString())) {
//       mermaidCode += `    ${target.identity}[${target.properties.name}]\n`
//       nodes.add(target.identity.toString())
//     }

//     // Add relationship
//     const relationshipKey = `${procedure.identity}-${relationship.type}-${target.identity}`
//     if (!relationships.has(relationshipKey)) {
//       mermaidCode += `    ${procedure.identity}-->|${relationship.type}|${target.identity}\n`
//       relationships.add(relationshipKey)
//     }
//   })

//   return mermaidCode
// }

module.exports = router
