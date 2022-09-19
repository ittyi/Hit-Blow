export const modes = ['normal', 'hard'] as const;
export type Mode = typeof modes[number];
