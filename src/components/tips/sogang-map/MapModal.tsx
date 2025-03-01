import styled, { keyframes } from 'styled-components';
import { BuildsDataType } from './KakaoMap';
import ExitIcon from '@/assets/svg/tips/sogang-map/exit.svg?react';
import LocationIcon from '@/assets/svg/tips/sogang-map/map.svg?react';
import TimeIcon from '@/assets/svg/tips/sogang-map/time.svg?react';
import BuildingIcon from '@/assets/svg/tips/sogang-map/building.svg?react';

interface MapModalProps {
  setModalOpen: (value: boolean) => void;
  modalOpen: boolean;
  selectedBuildingData: BuildsDataType | null;
}

export default function MapModal({
  modalOpen,
  setModalOpen,
  selectedBuildingData
}: MapModalProps) {
  return (
    <ModalWrapper modalopen={modalOpen.toString()}>
      <ExitIcon className="exit" onClick={() => setModalOpen(false)} />
      <h1>
        <BuildingIcon />
        {selectedBuildingData?.name}
      </h1>
      <div>
        <h2>Entrance</h2>
        <p>{selectedBuildingData?.entrance}</p>
      </div>
      <div>
        <h2>Mainly used by</h2>
        <p>
          {selectedBuildingData?.departments
            ? selectedBuildingData.departments
            : 'All departments'}
        </p>
      </div>
      {selectedBuildingData?.studyingspots.length! > 0 && (
        <StudyingSpotDiv>
          <h2>Study spots</h2>
          {selectedBuildingData?.studyingspots?.map((spot) => (
            <div key={spot.id}>
              <figure>
                {spot.photo && <img src={spot.photo} alt="studying spot" />}
                <figcaption>
                  <h3>{spot.name}</h3>
                  <p>
                    <LocationIcon />
                    {spot.location_detail}
                  </p>
                  <p className="openhour">
                    <TimeIcon />
                    {spot.open_hours}
                  </p>
                  <Tags>
                    {spot.features?.map((feature) => (
                      <span key={feature.id}>{feature.name} </span>
                    ))}
                  </Tags>
                </figcaption>
              </figure>
            </div>
          ))}
        </StudyingSpotDiv>
      )}
      {selectedBuildingData?.cafeterias.length! > 0 && (
        <StudyingSpotDiv>
          <h2>Cafeterias</h2>
          {selectedBuildingData?.cafeterias?.map((spot) => (
            <div key={spot.id}>
              <figure>
                {spot.photo && <img src={spot.photo} alt="studying spot" />}
                <figcaption>
                  <h3>{spot.name}</h3>
                  <p>
                    <LocationIcon />
                    {spot.location_detail}
                  </p>
                  <p className="openhour">
                    <TimeIcon />
                    {spot.open_hours}
                  </p>
                  <Tags>
                    {spot.features?.map((feature) => (
                      <span key={feature.id}>{feature.name} </span>
                    ))}
                  </Tags>
                </figcaption>
              </figure>
            </div>
          ))}
        </StudyingSpotDiv>
      )}
      {selectedBuildingData?.printers.length! > 0 && (
        <StudyingSpotDiv>
          <h2>Printers</h2>
          {selectedBuildingData?.printers?.map((spot) => (
            <div key={spot.id}>
              <figure>
                {spot.photo && <img src={spot.photo} alt="studying spot" />}
                <figcaption>
                  <h3>{spot.name}</h3>
                  <p>
                    <LocationIcon />
                    {spot.location_detail}
                  </p>
                  <p className="openhour">
                    <TimeIcon />
                    {spot.open_hours}
                  </p>
                  <Tags>
                    {spot.features?.map((feature) => (
                      <span key={feature.id}>{feature.name} </span>
                    ))}
                  </Tags>
                </figcaption>
              </figure>
            </div>
          ))}
        </StudyingSpotDiv>
      )}
      {selectedBuildingData?.healthcenters.length! > 0 && (
        <StudyingSpotDiv>
          <h2>Health Centers</h2>
          {selectedBuildingData?.healthcenters?.map((spot) => (
            <div key={spot.id}>
              <figure>
                {spot.photo && <img src={spot.photo} alt="studying spot" />}
                <figcaption>
                  <h3>{spot.name}</h3>
                  <p>
                    <LocationIcon />
                    {spot.location_detail}
                  </p>
                  <p className="openhour">
                    <TimeIcon />
                    {spot.open_hours}
                  </p>
                  <Tags>
                    {spot.features?.map((tag) => (
                      <span key={tag.id}>{tag.name} </span>
                    ))}
                  </Tags>
                </figcaption>
              </figure>
            </div>
          ))}
        </StudyingSpotDiv>
      )}
      <h6>Ⓒ copyright by 서강대학교 공식블로그</h6>
    </ModalWrapper>
  );
}

const Tags = styled.span`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  span {
    font-weight: 400;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.purple600};
    color: ${({ theme }) => theme.colors.gray50};
    padding: 0.5rem 1rem;
    border-radius: 1rem;
  }
`;

const StudyingSpotDiv = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-top: 1rem;
  img {
    width: 12rem;
    height: 12rem;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }
  h2 {
    font-size: 1.3rem;
    font-weight: 100;
    color: ${({ theme }) => theme.colors.gray800};
  }
  h3 {
    letter-spacing: -1px;
    font-size: 1.8rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray800};
    margin-bottom: 0.5rem;
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-bottom: 1px solid var(--main-gray);
    padding: 1rem 0;
  }
  figure {
    display: flex;
    gap: 1.5rem;
    figcaption {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      p {
        display: flex;
        align-items: flex-start;
        font-size: 1.3rem;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.gray600};
        &.openhour {
          line-height: 140%;
        }
        svg {
          flex-shrink: 0;
          fill: ${({ theme }) => theme.colors.gray800};
          stroke-width: 2;
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.5rem;
          path {
            fill: ${({ theme }) => theme.colors.gray800};
          }
        }
      }
    }
  }
`;

const ModalWrapper = styled.div<{ modalopen: string }>`
  h6 {
    font-size: 1.1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray500};
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      h6 {
        color: ${({ theme }) => theme.colors.purple600};
      }
    }
  }
  border-radius: 5px;
  z-index: 100;
  overflow-y: auto;
  position: absolute;
  right: 10px;
  background-color: white;
  width: 40%;
  height: 80%;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  animation: ${({ modalopen }) => (modalopen === 'true' ? fadeIn : fadeOut)}
    0.3s ease forwards;
  visibility: ${({ modalopen }) =>
    modalopen === 'true' ? 'visible' : 'visible'};
  /* &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gray200};
    border-radius: 10px;
  } */
  h1 {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    font-size: 2.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray900};
    letter-spacing: -0.8px;
    svg {
      stroke: ${({ theme }) => theme.colors.purple850};
    }
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h2 {
      font-size: 1.3rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.gray500};
    }
    p {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.gray800};
    }
  }
  svg {
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    &.exit {
      position: absolute;
      top: 2rem;
      right: 1rem;
      path {
        stroke-width: 2;
        stroke: ${({ theme }) => theme.colors.gray900};
      }

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          path {
            stroke: ${({ theme }) => theme.colors.purple600};
          }
        }
      }
    }
  }
  @media (max-width: 430px) {
    width: 95%;
    height: 60%;
    bottom: 10%;
    animation: ${({ modalopen }) =>
        modalopen === 'true' ? fadeInMobile : fadeOutMobile}
      0.3s ease forwards;
  }
`;

// 등장 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// 사라짐 애니메이션
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
`;

// 등장 애니메이션`
const fadeInMobile = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 사라짐 애니메이션
const fadeOutMobile = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;
