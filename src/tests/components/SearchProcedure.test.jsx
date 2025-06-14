import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchProcedure from '../../components/SearchProcedure';

// Mock the API calls
vi.mock('../../API/api_calls', () => ({
  fetchProcedures: vi.fn(() => Promise.resolve([])),
  fetchProcedure: vi.fn(() => Promise.resolve({}))
}));

describe('SearchProcedure', () => {
  it('renders search input', () => {
    act(() => {
      render(<SearchProcedure onProcedureSelect={() => {}} />);
    });
    expect(screen.getByPlaceholderText(/search by procedure name/i)).toBeInTheDocument();
  });

  it('shows no results when search returns empty', async () => {
    await act(async () => {
      render(<SearchProcedure onProcedureSelect={() => {}} />);
    });
    const input = screen.getByPlaceholderText(/search by procedure name/i);
    fireEvent.focus(input);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
}); 