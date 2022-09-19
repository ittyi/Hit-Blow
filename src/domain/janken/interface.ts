export const jankenOptions = ['rock', 'paper', 'scissors'] as const
export type JankenOption = typeof jankenOptions[number]