import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

describe('StatusBadge', () => {
  it('renders the Pending status', () => {
    render(
      <MemoryRouter>
        <StatusBadge status="Pending" />
      </MemoryRouter>
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders the Accepted status', () => {
    render(
      <MemoryRouter>
        <StatusBadge status="Accepted" />
      </MemoryRouter>
    );
    expect(screen.getByText('Accepted')).toBeInTheDocument();
  });
});
