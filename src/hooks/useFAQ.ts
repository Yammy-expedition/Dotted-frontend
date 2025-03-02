import { useSuspenseQuery } from '@tanstack/react-query';

export interface EachFAQPost {
  id: number;
  college: number;
  college_name: string;
  question: string;
  answer: string;
  created_at: string;
}

const fetchFAQ = async (): Promise<EachFAQPost[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/campus/faq`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch FAQ data');
  }

  return response.json();
};

export const useFAQ = () => {
  return useSuspenseQuery<EachFAQPost[]>({
    queryKey: ['campus_faq'],
    queryFn: fetchFAQ
  });
};
