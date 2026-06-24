export type IncidentType =
  | ''
  | 'Hit in Database'
  | 'Refusal of Entry'
  | 'Overstay'
  | 'Administrative'
  | 'Asylum Request'
  | 'Avoiding Border Control'
  | 'Document Fraud'
  | 'FTF Suspicious Travel'
  | 'Hiding in Transportation Means/Clandestine'
  | 'Hit in Database – related to Terrorist / Extremist activities'
  | 'Illegal Border- Crossing'
  | 'Readmission'
  | 'Smuggling of goods'
  | 'Stolen Vehicles'
  | 'Trafficking in Human Beings'
  | 'Other';

export interface IncidentRecord {
  incidentType: IncidentType;
  date: string;
  time: string;
  entryExit: string;
  nationality: string;
  gender: string;
  age: string;
  reason: string;
  overstayDays: string;
  penalty: string;
  banTime: string;
  carColor: string;
  carType: string;
  carOld: string;
  carRegisteredCountry: string;
  docuType: string;
  whatGoods: string;
  amountGoods: string;
  whereFounded: string;
  parensOld: string;
  parentGender: string;
  report?: string;
}
