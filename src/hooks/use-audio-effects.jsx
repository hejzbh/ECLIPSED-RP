import React, { createContext, useContext, useRef } from "react";

const AudioEffectsContext = createContext(undefined);

export const AudioEffectsProvider = ({ children }) => {
  const audioRef = useRef(null);
  const backgroundAudioRef = useRef(null);

  const stopEffect = (options = {}) => {
    if (options.inBackground && backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
  };

  const playEffect = (src, options = {}) => {
    if (!audioRef.current) return;

    if (options.inBackground && backgroundAudioRef?.current) {
      const audio = backgroundAudioRef.current;
      audio.src = src;
      audio.volume = options.volume ?? 0.2;
      audio.playbackRate = options.playbackRate ?? 1;
      audio.loop = options.loop ?? false;

      audio.currentTime = 0; // restart from beginning
      audio.play().catch((error) => console.error("Audio play error:", error));
      return;
    }

    const audio = audioRef.current;
    audio.src = src;
    audio.volume = options.volume ?? 0.2;
    audio.playbackRate = options.playbackRate ?? 1;

    audio.currentTime = 0; // restart from beginning
    audio.play().catch((error) => console.error("Audio play error:", error));
  };

  return (
    <AudioEffectsContext.Provider value={{ playEffect, stopEffect }}>
      {children}
      {/* Pre-rendered <audio> elements for instant playback */}
      <audio ref={audioRef} />
      <audio ref={backgroundAudioRef} />
    </AudioEffectsContext.Provider>
  );
};

export const useAudioEffects = () => {
  const context = useContext(AudioEffectsContext);
  if (!context) {
    throw new Error("useAudioEffects must be used inside AudioEffectsProvider");
  }
  return context;
};
