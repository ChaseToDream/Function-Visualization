import React, { useMemo } from 'react';
import katex from 'katex';

interface FormulaDisplayProps {
  expression: string;
  displayMode?: boolean;
  className?: string;
}

const expressionToLatex = (expr: string): string => {
  let latex = expr;
  
  // Replace common functions
  latex = latex.replace(/\bsin\(/g, '\\sin(');
  latex = latex.replace(/\bcos\(/g, '\\cos(');
  latex = latex.replace(/\btan\(/g, '\\tan(');
  latex = latex.replace(/\basin\(/g, '\\arcsin(');
  latex = latex.replace(/\bacos\(/g, '\\arccos(');
  latex = latex.replace(/\batan\(/g, '\\arctan(');
  latex = latex.replace(/\bsinh\(/g, '\\sinh(');
  latex = latex.replace(/\bcosh\(/g, '\\cosh(');
  latex = latex.replace(/\btanh\(/g, '\\tanh(');
  latex = latex.replace(/\blog\(/g, '\\ln(');
  latex = latex.replace(/\blog10\(/g, '\\log_{10}(');
  latex = latex.replace(/\blog2\(/g, '\\log_{2}(');
  latex = latex.replace(/\bsqrt\(/g, '\\sqrt{');
  latex = latex.replace(/\bcbrt\(/g, '\\sqrt[3]{');
  latex = latex.replace(/\babs\(/g, '|');
  latex = latex.replace(/\bexp\(/g, 'e^{');
  latex = latex.replace(/\bfloor\(/g, '\\lfloor ');
  latex = latex.replace(/\bceil\(/g, '\\lceil ');
  latex = latex.replace(/\bround\(/g, '\\text{round}(');
  latex = latex.replace(/\bsign\(/g, '\\text{sign}(');
  latex = latex.replace(/\bpi\b/g, '\\pi');
  latex = latex.replace(/\be\b/g, 'e');
  
  // Replace power notation
  latex = latex.replace(/\^(\d+)/g, '^{$1}');
  latex = latex.replace(/\^(\([^)]+\))/g, '^$1');
  
  // Replace multiplication
  latex = latex.replace(/\*/g, ' \\cdot ');
  
  // Handle sqrt closing brace
  latex = latex.replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}');
  
  // Handle abs
  latex = latex.replace(/\|([^|]+)\|/g, '|$1|');
  
  return latex;
};

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ 
  expression, 
  displayMode = false,
  className = '' 
}) => {
  const html = useMemo(() => {
    try {
      const latex = expressionToLatex(expression);
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode,
        trust: true,
      });
    } catch {
      return `<span class="text-red-500">${expression}</span>`;
    }
  }, [expression, displayMode]);

  return (
    <span 
      className={`formula-display ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default FormulaDisplay;
