import { render, screen } from '@testing-library/react';
import AddProject from '../add-project';

it('Run test to check if add project page renders', () => {
  render(<AddProject />);
  const titleElement = screen.getByText(/New Project/i);
  expect(titleElement).toBeInTheDocument();
});
