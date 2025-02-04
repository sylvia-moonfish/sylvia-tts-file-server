export interface User {
  id: string;
  username: string;
  recordings: { [promptId: string]: string };
  useCustom: boolean;
  customPromptId: string;
  submittedForTraining: boolean;
}
