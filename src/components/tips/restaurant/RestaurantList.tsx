import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import NavigateIcon from '@/assets/svg/tips/restaurant/navigate.svg?react';
import LinkIcon from '@/assets/svg/tips/restaurant/link.svg?react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const fetchRestaurants = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/place/restaurant`
  );
  return response.json();
};

interface RestaurantData {
  id: number;
  name: string;
  type: string;
  google_map: string;
  naver_map: string;
  distance: number;
  photo: string;
  intro: string;
}

export default function RestaurantList() {
  const [searchParam, setSearchParam] = useSearchParams();
  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ['tipsRestaurants'],
    queryFn: fetchRestaurants
  });

  useEffect(() => {
    setSearchParam({ q: 'all' });
  }, []);

  const selectedTab = searchParam.get('q') || 'all';
  const filteredRestaurants = data?.filter((restaurant: RestaurantData) => {
    if (selectedTab === 'all') return true;
    return restaurant.type.toLowerCase() === selectedTab;
  });

  //if error
  if (error) {
    return <div>error</div>;
  }

  return (
    <ListSection>
      {!isLoading && filteredRestaurants ? (
        <List>
          {filteredRestaurants.map((el: RestaurantData, idx: number) => {
            // console.log(el);
            return (
              <RestaurantBox key={idx}>
                <img src={el.photo} alt={el.name} />
                <Description>
                  <RestaurantInfo>
                    <h1>{el.name}</h1>
                    <p>{el.intro}</p>
                  </RestaurantInfo>
                  <RestaurantLocation>
                    <span className="location__distance">
                      <NavigateIcon />
                      <span>{el.distance}m from School</span>
                    </span>
                    <span className="location__link">
                      <a target="_blank" href={el.naver_map}>
                        <LinkIcon />
                        {'naver map'}
                      </a>
                      <a target="_blank" href={el.google_map}>
                        <LinkIcon />
                        {'google map'}
                      </a>
                    </span>
                  </RestaurantLocation>
                </Description>
              </RestaurantBox>
            );
          })}
        </List>
      ) : (
        <List>
          {Array(2)
            .fill('')
            .map((_, idx) => (
              <RestaurantBox key={idx}></RestaurantBox>
            ))}
        </List>
      )}
    </ListSection>
  );
}

const ListSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const List = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4.6rem;

  @media (max-width: 470px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const RestaurantBox = styled.li`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundLayer1};
  border-radius: 1.6rem;
  overflow: hidden;
  display: flex;
  aspect-ratio: 2;

  @media (max-width: 900px) {
    aspect-ratio: unset;
  }

  > img {
    width: 40%;

    height: 100%;
    object-fit: cover;
    flex-shrink: 0;

    @media (max-width: 900px) {
      width: 100%;
      aspect-ratio: 1.2;
      height: auto;
    }
  }

  @media (max-width: 900px) {
    display: block;
  }
`;

const Description = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.9rem 2.7rem 2rem 2.7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media (max-width: 1000px) {
    padding: 1rem 1.3rem 1.9rem 1.3rem;
  }

  @media (max-width: 900px) {
    height: auto;
    flex-shrink: 0;
  }
`;

const RestaurantInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 1rem;
  > h1 {
    font-size: 2.4rem;
    font-weight: 400;
    letter-spacing: -1px;
    color: ${({ theme }) => theme.colors.gray700};
    @media (max-width: 1000px) {
      font-size: 2rem;
    }
  }

  > p {
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: -0.8px;
    color: ${({ theme }) => theme.colors.gray400};
    word-wrap: normal;
  }
`;

const RestaurantLocation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & .location__distance {
    display: flex;
    align-items: center;
    gap: 1rem;

    > svg {
      width: 1.8rem;
      height: 1.8rem;
    }

    > span {
      display: flex;
      gap: 1rem;
      font-size: 1.4rem;
      font-weight: 400;
      letter-spacing: -0.7px;
      color: ${({ theme }) => theme.colors.gray600};
    }
  }

  & .location__link {
    display: flex;
    gap: 1rem;

    > a {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 1.4rem;
      font-weight: 400;
      letter-spacing: -0.3px;
      text-decoration-line: underline;
      color: ${({ theme }) => theme.colors.gray500};

      @media (max-width: 900px) {
        font-size: 1rem;
      }

      > svg {
        width: 1.7rem;
        height: 1.7rem;
      }
    }
  }
`;
