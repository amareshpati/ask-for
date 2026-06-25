import { z } from 'zod';

export const recipientStepSchema = z.object({
  recipient_name: z
    .string()
    .min(1, 'Please enter the recipient\'s name')
    .max(100, 'Name is too long'),
});

export const welcomeStepSchema = z.object({
  welcome_message: z
    .string()
    .min(1, 'Please enter a welcome message')
    .max(500, 'Message is too long'),
});

export const foodStepSchema = z.object({
  favourite_food: z
    .string()
    .min(1, 'Please select or enter a favourite food'),
});

export const locationStepSchema = z.object({
  favourite_location: z
    .string()
    .min(1, 'Please select or enter a favourite location'),
});

export const questionStepSchema = z.object({
  final_question: z
    .string()
    .min(1, 'Please enter a question')
    .max(300, 'Question is too long'),
});

export const createInvitationSchema = z.object({
  type: z.enum(['date', 'travel']),
  recipient_name: z.string().min(1).max(100),
  welcome_message: z.string().min(1).max(500),
  favourite_food: z.string().min(1),
  favourite_location: z.string().min(1),
  final_question: z.string().min(1).max(300),
});

export const submitResponseSchema = z.object({
  response: z.enum(['yes', 'maybe', 'no']),
  selected_date: z.string().optional(),
  selected_time_slot: z.string().optional(),
  selected_food: z.string().optional(),
  selected_location: z.string().optional(),
});

export type RecipientStepData = z.infer<typeof recipientStepSchema>;
export type WelcomeStepData = z.infer<typeof welcomeStepSchema>;
export type FoodStepData = z.infer<typeof foodStepSchema>;
export type LocationStepData = z.infer<typeof locationStepSchema>;
export type QuestionStepData = z.infer<typeof questionStepSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
