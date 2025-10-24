
import { StepInfo } from './types';

export const STEPS: StepInfo[] = [
  {
    id: 1,
    title: "First, what are you building?",
    field: 'description',
    placeholder: "e.g., A dashboard for an e-commerce store to track sales, inventory, and customer data."
  },
  {
    id: 2,
    title: "What's the desired color theme?",
    field: 'theme',
    placeholder: "e.g., A clean and modern dark mode with vibrant blue accents for charts and buttons."
  },
  {
    id: 3,
    title: "How should it be responsive?",
    field: 'responsiveness',
    placeholder: "e.g., Fully responsive. A collapsible sidebar on mobile, and cards that stack vertically."
  }
];
