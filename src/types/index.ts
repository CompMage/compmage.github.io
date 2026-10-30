/**
 * Types for the Chesapeake Real Ale Brewers Society (C.R.A.B.S.)
 */

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  relationship: string;
}

export interface MemberRegistration {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  brewingExperience: string;
  equipment: string;
  attendedMeeting: 'yes' | 'no' | 'first_time';
  isFamily: boolean;
  familyMembers: FamilyMember[];
  paymentMethod: 'paypal' | 'cash_at_meeting';
  duesAmount: number;
  status: 'pending' | 'paid' | 'verified';
  notes?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  notes?: string;
}

export interface HopAddition {
  name: string;
  amount: string;
  time: string;
  use: string;
}

export interface Recipe {
  id: string;
  name: string;
  style: string;
  category: 'real-ale' | 'ipa' | 'stout' | 'wheat-farmhouse' | 'lager-specialty';
  brewer: string;
  og: string;
  fg: string;
  abv: string;
  ibu: number;
  srm: number;
  batchSize: string;
  description: string;
  notes?: string;
  fermentables: RecipeIngredient[];
  hops: HopAddition[];
  yeast: string;
  mashTemp: string;
  fermentationTemp: string;
  caskConditioned?: boolean;
  award?: string;
}
