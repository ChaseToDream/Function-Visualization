import { useState, useCallback, useEffect } from 'react';
import { validateFunction } from '../utils/math';

export function useValidation(expression: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validate = useCallback(() => {
    if (!expression.trim()) {
      setIsValid(null);
      setErrorMessage('');
      return;
    }

    const valid = validateFunction(expression.trim());
    setIsValid(valid);
    setErrorMessage(valid ? '' : '无效的函数表达式');
  }, [expression]);

  useEffect(() => {
    const timer = setTimeout(validate, 300);
    return () => clearTimeout(timer);
  }, [validate]);

  return { isValid, errorMessage };
}
