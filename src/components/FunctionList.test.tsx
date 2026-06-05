import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FunctionList from './FunctionList';
import { FunctionItem } from '../types';

describe('FunctionList', () => {
  const mockFunctions: FunctionItem[] = [
    { id: '1', expression: 'x', color: '#FF6384' },
    { id: '2', expression: 'x^2', color: '#36A2EB' },
  ];

  const mockOnRemoveFunction = vi.fn();

  it('should render empty state when no functions', () => {
    render(
      <FunctionList functions={[]} onRemoveFunction={mockOnRemoveFunction} />
    );

    expect(screen.getByText('暂无函数，请添加函数表达式')).toBeInTheDocument();
    expect(screen.getByText('支持数学表达式如 sin(x)、x^2 等')).toBeInTheDocument();
  });

  it('should render function list', () => {
    render(
      <FunctionList functions={mockFunctions} onRemoveFunction={mockOnRemoveFunction} />
    );

    expect(screen.getByText('x')).toBeInTheDocument();
    expect(screen.getByText('x^2')).toBeInTheDocument();
  });

  it('should render delete buttons', () => {
    render(
      <FunctionList functions={mockFunctions} onRemoveFunction={mockOnRemoveFunction} />
    );

    const deleteButtons = screen.getAllByRole('button');
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call onRemoveFunction when delete button is clicked', () => {
    render(
      <FunctionList functions={mockFunctions} onRemoveFunction={mockOnRemoveFunction} />
    );

    const deleteButtons = screen.getAllByRole('button');
    deleteButtons[0].click();

    expect(mockOnRemoveFunction).toHaveBeenCalledWith('1');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <FunctionList functions={mockFunctions} onRemoveFunction={mockOnRemoveFunction} />
    );

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', '已添加的函数列表');

    const deleteButtons = screen.getAllByRole('button');
    expect(deleteButtons[0]).toHaveAttribute('aria-label', '删除函数 x');
    expect(deleteButtons[1]).toHaveAttribute('aria-label', '删除函数 x^2');
  });
});