'use client';

import { useEffect, useState } from 'react';

export function RateLimitDisplay() {
  const [rateLimit, setRateLimit] = useState<{
    limit: number;
    remaining: number;
    reset: number;
  } | null>(null);

  const [minutesUntilReset, setMinutesUntilReset] = useState<number | null>(null);

  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const res = await fetch('/api/rate-limit');
        const data = await res.json();
        setRateLimit(data);

        // Calculate minutes until reset
        if (data.reset) {
          const now = Math.floor(Date.now() / 1000);
          const minutes = Math.max(0, Math.ceil((data.reset - now) / 60));
          setMinutesUntilReset(minutes);
        }
      } catch (error) {
        console.error('Failed to fetch rate limit:', error);
      }
    };

    // Fetch immediately
    fetchRateLimit();

    // Update every 30 seconds
    const interval = setInterval(fetchRateLimit, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!rateLimit) return null;

  const used = rateLimit.limit - rateLimit.remaining;
  const percentageUsed = Math.round((used / rateLimit.limit) * 100);

  const barColor =
    percentageUsed > 80 ? '#e74c3c' : percentageUsed > 50 ? '#f39c12' : '#27ae60';

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
        fontFamily: 'monospace',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <strong>GitHub API Rate Limit</strong>
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ marginBottom: 4 }}>
          Remaining: <strong>{rateLimit.remaining}</strong> / {rateLimit.limit}
        </div>
        <div style={{ marginBottom: 4 }}>Used: {used}</div>
        <div>
          <div
            style={{
              width: '100%',
              height: 6,
              backgroundColor: '#ecf0f1',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${percentageUsed}%`,
                height: '100%',
                backgroundColor: barColor,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ marginTop: 4, textAlign: 'center' }}>{percentageUsed}% used</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: 8, marginTop: 8 }}>
        {minutesUntilReset !== null && (
          <div>
            Refresh in: <strong>{minutesUntilReset} min</strong>
          </div>
        )}
      </div>
    </div>
  );
}
