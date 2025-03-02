import { useSuspenseQuery } from '@tanstack/react-query';

export interface Hospital {
  id: number;
  name: string;
  type: string;
  features?: string[]; // FeatureTag가 정확히 어떤 값인지 모르므로 임시로 string[]
  latitude?: string;
  longitude?: string;
  naver_map?: string;
  google_map?: string;
  distance?: string;
}

const fetchHospitals = async (): Promise<Hospital[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/place/hospital`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch hospital data');
  }

  return response.json();
};

export const useHospitals = () => {
  return useSuspenseQuery<Hospital[]>({
    queryKey: ['hospitals'],
    queryFn: fetchHospitals
  });
};
