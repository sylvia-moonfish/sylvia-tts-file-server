export interface User {
  id: string;
  username: string;
  recordings: { [promptId: string]: string };
  useVoice: number; // 1: default, 2: trainer custom, 3: listener custom
  trainer: Trainer;
  listener: Listener;
}

export interface Trainer {
  isReady: boolean;
  submittedForTraining: boolean;
  model: Model;
}

export interface Listener {
  isReady: boolean;
  model: Model;
}

export interface Model {
  gptPath: string;
  sovitsPath: string;
  promptPath: string;
  promptText: string;
  promptLanguage: string;
}
