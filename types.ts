
export interface FormData {
  description: string;
  theme: string;
  responsiveness: string;
  extraDetails?: string;
}

export interface PreviewData {
  layoutDescription: string;
  imageUrls: string[];
  imageBase64s: string[];
}

export interface StepInfo {
  id: number;
  title: string;
  field: keyof FormData;
  placeholder: string;
}

export enum AppStep {
  Form,
  Summary,
  Preview,
  Result,
}
