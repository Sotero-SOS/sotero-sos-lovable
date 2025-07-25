import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar cronômetro de SOS
 * 
 * @param requestTime - Horário da solicitação
 * @param estimatedTime - Tempo estimado em minutos
 * @param status - Status atual do SOS
 * @returns Objeto com tempo decorrido, se está atrasado e tempo formatado
 */
export const useSOSTimer = (
  requestTime: string | null,
  estimatedTime: number | null,
  status: string | null
) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!requestTime || status === 'completed' || !estimatedTime) {
      return;
    }

    const interval = setInterval(() => {
      const requestDate = new Date(requestTime);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - requestDate.getTime()) / 1000 / 60); // em minutos
      
      setElapsedTime(elapsed);
      setIsOverdue(elapsed > estimatedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [requestTime, estimatedTime, status]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return {
    elapsedTime,
    isOverdue,
    formattedTime: formatTime(elapsedTime),
    estimatedTimeFormatted: estimatedTime ? formatTime(estimatedTime) : null
  };
};