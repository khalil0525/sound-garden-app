import React from 'react';

const Duration = ({ className, seconds }) => {
  const format = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // When this fires it will add a "0" to the time string and extract
  // The last numbers in the string.
  // e.g: 0 + "1" -> "01"... 0 + "12" -> 12
  const pad = (string) => {
    return ('0' + string).slice(-2);
  };

  return (
    <div style={{ padding: '8px' }}>
      <time
        dateTime={`P${Math.round(seconds)}S`}
        className={`${className}`}>
        {format(seconds)}
      </time>
    </div>
  );
};

export default Duration;
