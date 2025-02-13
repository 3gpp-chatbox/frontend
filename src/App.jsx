import { useState } from 'react';
import { AppShell, Container, Title, TextInput, Button, Paper, Text, ScrollArea, Loader } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('/api/query', { query: query.trim() });
      const botMessage = { role: 'assistant', content: response.data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your query. Please try again.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <AppShell>
      <Container size="lg">
        <Title order={1} align="center" mt="xl" mb="xl">
          3GPP Knowledge Graph Chat
        </Title>

        <Paper shadow="sm" p="md" withBorder style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          <ScrollArea style={{ flex: 1 }} mb="md">
            {messages.map((message, index) => (
              <Paper
                key={index}
                p="sm"
                mb="xs"
                bg={message.role === 'user' ? 'blue.1' : 'gray.0'}
                style={{
                  marginLeft: message.role === 'user' ? 'auto' : '0',
                  marginRight: message.role === 'user' ? '0' : 'auto',
                  maxWidth: '80%',
                }}
              >
                <Text color={message.isError ? 'red' : 'inherit'}>
                  {message.content}
                </Text>
              </Paper>
            ))}
            {loading && (
              <Paper p="sm" mb="xs" bg="gray.0" style={{ marginRight: 'auto', maxWidth: '80%' }}>
                <Loader size="sm" />
              </Paper>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <TextInput
              placeholder="Ask about 3GPP specifications..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1 }}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !query.trim()} rightSection={<IconSend size={14} />}>
              Send
            </Button>
          </form>
        </Paper>
      </Container>
    </AppShell>
  );
}

export default App;
