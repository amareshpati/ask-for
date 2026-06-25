export type InvitationType = 'date' | 'travel';

export type InvitationStatus = 'draft' | 'shared' | 'responded';

export type ResponseType = 'yes' | 'maybe' | 'no';

export interface Invitation {
  id: string;
  user_id: string;
  type: InvitationType;
  recipient_name: string;
  welcome_message: string;
  favourite_food: string;
  favourite_location: string;
  final_question: string;
  status: InvitationStatus;
  unique_slug: string;
  created_at: string;
  updated_at: string;
}

export type PublicInvitation = Omit<Invitation, 'user_id' | 'created_at' | 'updated_at'>;

export interface InvitationResponse {
  id: string;
  invitation_id: string;
  response: ResponseType;
  selected_date: string | null;
  selected_time_slot: string | null;
  selected_food?: string | null;
  selected_location?: string | null;
  responded_at: string;
}

export interface InvitationWithResponse extends Invitation {
  invitation_responses: InvitationResponse | InvitationResponse[] | null;
}

export interface CreateInvitationData {
  type: InvitationType;
  recipient_name: string;
  welcome_message: string;
  favourite_food: string;
  favourite_location: string;
  final_question: string;
}

export interface SubmitResponseData {
  response: ResponseType;
  selected_date?: string;
  selected_time_slot?: string;
}

export type TimeSlot = {
  label: string;
  description: string;
  icon: string;
};

export const TIME_SLOTS: TimeSlot[] = [
  { label: 'Morning', description: '8:00 AM – 11:00 AM', icon: '🌅' },
  { label: 'Afternoon', description: '12:00 PM – 3:00 PM', icon: '☀️' },
  { label: 'Evening', description: '4:00 PM – 7:00 PM', icon: '🌇' },
  { label: 'Night', description: '7:00 PM – 10:00 PM', icon: '🌙' },
];

export const FOOD_OPTIONS = [
  'Pizza', 'Burger', 'Pasta', 'Coffee', 'Tea', 'Boba',
  'Beer', 'Wine', 'Ice Cream', 'Sushi', 'Ramen', 'Tacos',
  'Chocolate', 'Cake', 'Smoothie', 'Cocktails',
] as const;

export const LOCATION_OPTIONS = [
  'Restaurant', 'Café', 'Bar', 'Hotel', 'Beach', 'Mountain',
  'Park', 'Road Trip', 'Sunset Point', 'Rooftop', 'Movie', 'Arcade',
] as const;
