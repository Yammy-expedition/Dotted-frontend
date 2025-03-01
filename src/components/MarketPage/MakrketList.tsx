import { EachMarketPost } from '@/types/MarketPost';
import { formatRelativeTime } from '@/utils/formatTime';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface MarketListProps {
  pagedData: EachMarketPost[];
}

export default function MakrketList({ pagedData }: MarketListProps) {
  const navigate = useNavigate();
  return (
    <MarketListContainer>
      <ul>
        {pagedData.map((post) => {
          const status = post.status
            .toLocaleLowerCase()
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          // console.log(status);
          return (
            <li key={post.id} onClick={() => navigate(`detail/${post.id}`)}>
              <Tag
                className={`${post.status === 'FOR_SALE' ? 'onSale' : 'soldOut'}`}
              >
                {status}
              </Tag>
              <MarketImageWrapper>
                <img src={post.thumbnail} />
              </MarketImageWrapper>
              <ItemInfo>
                <div className="title">
                  <span>{post.title}</span>
                </div>

                <div>
                  <span className="price">₩ {post.price}</span>
                  <span className=" created">
                    {formatRelativeTime(post.created_at)}
                  </span>
                </div>
              </ItemInfo>
            </li>
          );
        })}
      </ul>
    </MarketListContainer>
  );
}
const Tag = styled.div`
  z-index: 10;
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 8.6rem;
  background-color: ${({ theme }) => theme.colors.purple600};
  color: ${({ theme }) => theme.colors.gray50};
  text-align: center;

  font-size: 1.4rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.07rem;
  padding: 0.25rem 1rem;
  border-radius: 1.6rem;

  &.onSale {
    background: ${({ theme }) => theme.colors.purple600};
    color: ${({ theme }) => theme.colors.gray50};
  }

  &.soldOut {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray500};
    font-weight: 600;
  }
`;

const MarketListContainer = styled.div`
  min-height: 50vh;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;

  > ul {
    margin-top: 2rem;
    width: 100%;
    display: grid;
    flex: 1;

    grid-template-columns: repeat(4, minmax(23.4%, auto));
    grid-gap: 2rem;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, minmax(30%, auto));
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 47.5%);
    }

    @media (max-width: 450px) {
      grid-template-columns: repeat(1, 100%);
    }

    > li {
      width: 100%;

      position: relative;
      cursor: pointer;
      aspect-ratio: 0.7833;
      display: flex;
      flex-direction: column;

      border-radius: 16px;
      border: 1px solid ${({ theme }) => theme.colors.backgroundBase};
      background: ${({ theme }) => theme.colors.backgroundLayer2};
    }
  }
`;

const MarketImageWrapper = styled.div`
  width: 100%;
  height: 70%;
  border-radius: 16px 16px 0 0;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 비율을 유지하면서 꽉 채움 */
    border-radius: 16px 16px 0 0;
    transition: transform 0.2s ease-in-out;
    transform-origin: center; /* 중심을 기준으로 확대 */ /* 부모와 동일한 border-radius 적용 */
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        transform: scale(1.1);
      }
    }
  }
`;

const ItemInfo = styled.div`
  padding: 1rem 2rem 1.2rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  gap: 1.2rem;

  > div {
    display: flex;
    justify-content: space-between;

    &.title {
      > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${({ theme }) => theme.colors.gray700};

        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        letter-spacing: -1px;
        line-height: 2;
      }
    }

    > span {
      &.price {
        color: ${({ theme }) => theme.colors.gray700};

        font-size: 1.4rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.07rem;
      }

      &.created {
        color: ${({ theme }) => theme.colors.gray500};

        font-size: 1.4rem;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
        letter-spacing: -0.07rem;
      }
    }
  }
  > span {
    line-height: 3rem;

    &:nth-child(2) {
      color: ${({ theme }) => theme.colors.gray400};

      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 21px; /* 131.25% */
      letter-spacing: -0.8px;
    }
  }
`;
