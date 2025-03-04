import { MarketPostDetail } from '@/pages/market/DetailMarketPage';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { NextArrow, PrevArrow } from '@/components/MainPage/CustomArrow';
import Profile from '@/assets/svg/CommunityPage/Profile.svg?react';
import Scrap from '@/assets/svg/CommunityPage/Scrap.svg?react';
import MoreButton from '../CommunityPage/MoreButton';
import { formatRelativeTime } from '@/utils/formatTime';
import Modal from 'react-modal';
import Close from '@/assets/svg/MarketPage/close.svg?react';

const customStyles = {
  content: {
    inset: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'hidden' as 'auto' | 'hidden' | 'scroll' | 'visible' | undefined,
    backgroundColor: 'var(--modal-Background)',
    zIndex: 9999
  },
  overlay: {
    zIndex: 9999
  }
};

interface MarketPostingProps {
  post: MarketPostDetail;
  isScraped: boolean;
  onClickScrap: () => void;
}

export default function MarketPosting({
  post,
  isScraped,
  onClickScrap
}: MarketPostingProps) {
  const [openMore, setOpenMore] = useState(false);

  const [localScrapCount, setLocalScrapCount] = useState(post.scrap_count);
  const [localScrapped, setLocalScrapped] = useState(post.is_scrapped);
  const [localStatus, setLocalStatus] = useState(post.status);
  const [openModal, setOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const handleZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setZoomLevel((prevZoom) => {
          const newZoom = prevZoom + (e.deltaY > 0 ? -0.1 : 0.1);
          return Math.min(Math.max(newZoom, 0.5), 2);
        });
      }
    };

    if (openModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('wheel', handleZoom, { passive: false });
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('wheel', handleZoom);
    };
  }, [openModal]);

  const setting = {
    infinite: true,
    speed: 750,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,

    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    afterChange: (index: number) => setCurrentIndex(index),
    accessibility: false
  };

  useEffect(() => {
    const handleListClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('.slick-prev') || target.closest('.slick-next')) {
        return;
      }

      // console.log('slick-list 내부 클릭됨:', target);
      setOpenModal(true);
    };

    const list = document.querySelector('.slick-list');
    if (list) {
      list.addEventListener('click', handleListClick as EventListener);
    }

    return () => {
      if (list) {
        list.removeEventListener('click', handleListClick as EventListener);
      }
    };
  }, []);

  const handleScrapClick = () => {
    if (localScrapped) {
      setLocalScrapCount((prev) => prev - 1);
    } else {
      setLocalScrapCount((prev) => prev + 1);
    }
    setLocalScrapped((prev) => !prev);
    onClickScrap();
  };

  const onClickImgWrapper = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  return (
    <ItemWrapper $isImage={post.images.length > 0}>
      <Modal
        isOpen={openModal}
        style={customStyles}
        onRequestClose={() => setOpenModal((prev) => !prev)}
        contentLabel="example"
      >
        <CloseButton type="button" onClick={() => setOpenModal(false)}>
          Close <Close />
        </CloseButton>
        <AccessRestrictedWrapper>
          <AccessRestrictedNormal>
            <div>
              <img
                src={post.images[currentIndex]?.image_url}
                alt="Market Image"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-in-out' // 부드러운 확대 효과
                }}
              />
            </div>
          </AccessRestrictedNormal>
        </AccessRestrictedWrapper>
      </Modal>
      <div>
        {post.images.length > 0 && (
          <ImgCarouselWrapper>
            <StyledSlider {...setting}>
              {post.images.map((image, idx) => (
                <SlideContent
                  key={idx}
                  onClick={(e) => {
                    onClickImgWrapper(e);
                  }}
                >
                  <ImageWrapper>
                    <img src={image.image_url} />
                  </ImageWrapper>
                </SlideContent>
              ))}
            </StyledSlider>
          </ImgCarouselWrapper>
        )}
      </div>

      <div>
        <Text>
          <TagWrapper>
            <Tag
              className={`${localStatus === 'FOR_SALE' ? 'onSale' : 'soldOut'}`}
            >
              {localStatus === 'FOR_SALE'
                ? 'For Sale'
                : localStatus === 'SOLD_OUT'
                  ? 'Sold Out'
                  : 'Reserved'}
            </Tag>
          </TagWrapper>

          <Title>
            {post.title}
            <span>
              <MoreButton
                post={post}
                openMore={openMore}
                setOpenMore={setOpenMore}
                origin="market"
                setLocalStatus={setLocalStatus}
              />
            </span>
          </Title>
          <Price>
            ₩ {post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Price>
          <Writer>
            <div>
              <Profile />
              <div>
                <span>
                  by <span>{post.writer_nickname}</span>
                </span>
                <span>•</span>
                <span>{formatRelativeTime(post.created_at)}</span>
              </div>
            </div>
          </Writer>
        </Text>

        <ScrapButtonWrapper $isImage={post.images.length > 0}>
          <ScrapButton
            onClick={handleScrapClick}
            className={`${isScraped && 'scraped'}`}
          >
            <Scrap />
            <span>
              {localScrapCount} <MobileScrap>scraps</MobileScrap>
            </span>
          </ScrapButton>
        </ScrapButtonWrapper>
      </div>
    </ItemWrapper>
  );
}

const MobileScrap = styled.span`
  @media (max-width: 470px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.gray50};
  padding: 0.3rem 2rem;
  top: 1rem;
  left: 1rem;
  position: absolute;
  color: ${({ theme }) => theme.colors.gray800};

  font-size: 1.7rem;
  font-style: normal;
  font-weight: 700;
  border-radius: 1.6rem;

  > svg {
    fill: ${({ theme }) => theme.colors.gray800};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray200};
    }
  }
`;

const AccessRestrictedWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: var(--Modal-Background, rgba(12, 12, 12, 0.3));
  position: absolute;
  z-index: 10;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccessRestrictedNormal = styled.div`
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    position: relative;
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: inherit;

    > img {
      width: 100%;
      object-fit: cover;
      max-height: 60vh;
    }
  }
`;

const ItemWrapper = styled.div<{ $isImage: boolean }>`
  display: flex;
  gap: ${({ $isImage }) => ($isImage ? '2rem;' : '0rem;')};
  justify-content: start;
  width: 100%;

  padding-bottom: 2.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};

  > div {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    &:nth-child(2) {
      width: 100%;
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const ImgCarouselWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray100};

  max-width: 30rem;
  aspect-ratio: 1/1;
  border-radius: 5px;
  position: relative;

  @media (max-width: 900px) {
    max-width: 23rem;
  }

  @media (max-width: 700px) {
    width: 100%;
    max-width: 100%;
  }
`;

const StyledSlider = styled(Slider)`
  position: relative;
  width: 100%;
  height: 100%;

  .slick-slider {
    width: 100%;
    height: 100%;
  }

  .slick-list {
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .slick-track {
    width: 100% !important;
    display: flex;
    height: 100%;

    > div {
      transition: transform 0.2s ease-in-out;
      transform-origin: center;
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }

  .slick-slide {
    aspect-ratio: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slick-arrow {
    width: 4rem;
    height: 4rem;
    position: absolute;
  }

  .slick-prev {
    border-radius: 100%;
    position: absolute;
    top: auto !important;
    bottom: 0;
    right: 9rem;
    left: auto !important;
    z-index: 100;
  }

  .slick-next {
    top: auto !important;
    border-radius: 100%;
    position: absolute;
    bottom: 0;
    right: 3rem;
    z-index: 100;
  }

  .slick-prev::before,
  .slick-next::before {
    display: none;
  }

  .slick-prev:focus,
  .slick-next:focus {
    color: white;
  }
`;

const SlideContent = styled.div`
  width: 100%; /* ✅ 부모 요소에 맞게 설정 */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Tag = styled.div`
  display: inline-flex;
  padding: 0.3rem 1.2rem;

  text-align: center;

  font-size: 1.4rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.01rem;
  border-radius: 1.6rem;
  align-items: center;
  justify-content: center;
  height: 2.2rem;

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
const Title = styled.div`
  width: 100%;
  display: flex;
  /* margin-bottom: 1rem; */
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.gray800};
  font-size: 2.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: 3.6rem; /* 128.571% */
  letter-spacing: -0.1px;
  @media (max-width: 460px) {
    font-size: 2rem;
  }
  > span {
    position: relative;
    text-align: center;
    width: 2rem;
    cursor: pointer;
  }
`;
const Price = styled.div`
  color: ${({ theme }) => theme.colors.gray800};
  font-size: 2.6rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3.6rem; /* 112.5% */
  letter-spacing: -0.128rem;
`;
const Writer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;

  color: ${({ theme }) => theme.colors.gray500};

  font-size: 1.4rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.07rem;

  > div {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
      gap: 1rem;
      > span {
        display: flex;
        align-items: center;
        gap: 1rem;
        > span {
          font-weight: 600;
        }
      }
    }
  }
  padding-bottom: 1.7rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};

  @media (max-width: 700px) {
    border: none;
  }
`;

const ScrapButtonWrapper = styled.div<{ $isImage: boolean }>`
  margin-top: ${({ $isImage }) => ($isImage ? '0' : '2rem')};
  @media (max-width: 700px) {
    display: flex;
    justify-content: end;
    border: none;
  }
`;

const ScrapButton = styled.button`
  cursor: pointer;
  padding: 1rem 2rem;
  border-radius: 2.4rem;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  border: none;

  display: inline-flex;
  align-items: center;
  gap: 1rem;

  > span {
    color: ${({ theme }) => theme.colors.gray700};
    text-align: center;

    font-size: 1.6rem;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: -0.08rem;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.purple100};
    }
  }

  &.scraped {
    background: ${({ theme }) => theme.colors.purple100};
    > svg > g > path {
      fill: ${({ theme }) => theme.colors.purple600};
      stroke: ${({ theme }) => theme.colors.purple600};
    }

    > span {
      color: ${({ theme }) => theme.colors.purple600};
      font-weight: 500;
    }
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 5px;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 비율을 유지하면서 꽉 채움 */
  }
`;
