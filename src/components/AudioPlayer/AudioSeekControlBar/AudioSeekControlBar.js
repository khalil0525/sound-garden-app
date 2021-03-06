import React from "react";
import Duration from "./Duration";
import styles from "./AudioSeekControlBar.module.css";

const AudioSeekControlBar = ({
  className,
  durationClassName,
  duration,
  played,
  onChange,
  onMouseDown,
  onMouseUp,
}) => {
  return (
    <div className={`${styles.audioseekcontrolbar} ${className}`}>
      <Duration className={durationClassName} seconds={duration * played} />

      <input
        type="range"
        min={0}
        max={0.999999}
        step="any"
        value={played}
        onChange={onChange}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
      <Duration
        className={durationClassName}
        seconds={duration * (1 - played)}
      />
    </div>
  );
};
export default AudioSeekControlBar;
