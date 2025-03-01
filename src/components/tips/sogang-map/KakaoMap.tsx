import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { buildings } from '@/constants/buildings';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MapModal from './MapModal';

const fetchBuildings = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/api/campus/building`
  );
  return response.json();
};

export type BuildsDataType = {
  id: number;
  name: string;
  entrance: string;
  departments: string;
  studyingspots: {
    id: number;
    name: string;
    location_detail: string;
    open_hours: string;
    features: { id: number; name: string }[];
    photo: string | null;
    building: number;
    building_name: string;
  }[];
  cafeterias: {
    id: number;
    name: string;
    location_detail: string;
    open_hours: string;
    features: { id: number; name: string }[];
    photo: string;
    building: number;
    building_name: string;
  }[];
  healthcenters: {
    id: number;
    name: string;
    location_detail: string;
    open_hours: string;
    features: { id: number; name: string }[];
    photo: string;
    building: number;
    building_name: string;
  }[];
  printers: {
    id: number;
    name: string;
    location_detail: string;
    open_hours: string;
    features: { id: number; name: string }[];
    photo: string;
    building: number;
    building_name: string;
  }[];
};

interface KakaoMapProps {
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export default function KakaoMap({ modalOpen, setModalOpen }: KakaoMapProps) {
  const [initLatLon, _] = useState({
    lat: 37.551086,
    lon: 126.940983
  });
  const [mapLevel, __] = useState(3);
  const [buildingsData, setBuildingsData] = useState<BuildsDataType[]>([]);
  const [selectedBuildingData, setSelectedBuildingData] =
    useState<BuildsDataType | null>(null);
  const [studyList, setStudyList] = useState<BuildsDataType[]>([]);
  const [cafeList, setCafeList] = useState<BuildsDataType[]>([]);
  const [healthCenterList, setHealthCenterList] = useState<BuildsDataType[]>(
    []
  );
  const [printerList, setPrinterList] = useState<BuildsDataType[]>([]);
  const [searchParams] = useSearchParams();
  const {
    data: fetchedData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['buildings'],
    queryFn: fetchBuildings
  });

  if (error) {
    alert('error');
  }

  useEffect(() => {
    // 건물 데이터 가져오기
    if (fetchedData && !isLoading) {
      setBuildingsData(fetchedData);
      setStudyList(
        fetchedData.filter(
          (building: BuildsDataType) => building.studyingspots?.length > 0
        )
      );
      setCafeList(
        fetchedData.filter(
          (building: BuildsDataType) => building.cafeterias?.length > 0
        )
      );
      setHealthCenterList(
        fetchedData.filter(
          (building: BuildsDataType) => building.healthcenters?.length > 0
        )
      );
      setPrinterList(
        fetchedData.filter(
          (building: BuildsDataType) => building.printers?.length > 0
        )
      );
    }

    const handleSelectBuildingData = (id: number) => {
      const selectedData = buildingsData.find((data) => data.id === id);
      if (selectedData) {
        setSelectedBuildingData(selectedData);
      }
    };

    const mapLoad = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao API가 아직 로드되지 않았습니다.');
        return;
      }
      if (window.kakao && window.kakao.maps) {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          //맵의 첫 화면을 설정
          center: new window.kakao.maps.LatLng(initLatLon.lat, initLatLon.lon),
          level: mapLevel
          // mapTypeId: window.kakao.maps.MapTypeId.HYBRID
        };

        // 마커 이미지 관련 설정
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        map.jump(mapOption.center, 3, { animate: true });
        const control = new window.kakao.maps.ZoomControl();
        map.addControl(control, window.kakao.maps.ControlPosition.BOTTOMLEFT);
        const markerImageUrl = 'https://i.imgur.com/8AasUJG.png',
          studyMarkerImageUrl = 'https://i.imgur.com/LkdoZZj.png',
          cafeMarkerImageUrl = 'https://i.imgur.com/3A7y9aq.png',
          printerMarkerImageUrl = 'https://i.imgur.com/WCUDCMs.png',
          healthMarkerImageUrl = 'https://i.imgur.com/p4OR2Du.png';

        // 마커 생성 함수
        const handleMarker = (url: string, datas: BuildsDataType[]) => {
          const markerImageUrl = url,
            markerImageSize = new window.kakao.maps.Size(30, 30), // 마커 이미지의 크기
            markerImageOptions = {
              offset: new window.kakao.maps.Point(15, 15) // 마커 좌표에 일치시킬 이미지 안의 좌표
            };

          // 마커 이미지를 생성한다
          const markerImage = new window.kakao.maps.MarkerImage(
            markerImageUrl,
            markerImageSize,
            markerImageOptions
          );

          // 마커 생성 및 표시
          datas.forEach(({ id }) => {
            // 마커 생성
            const eng_name = buildings[id]?.eng_name;
            const lat = buildings[id]?.lat;
            const lon = buildings[id]?.lon;
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lat, lon),
              map,
              image: markerImage,
              title: eng_name
            });

            // 마커 클릭 이벤트 추가
            window.kakao.maps.event.addListener(marker, 'click', () => {
              const moveLatLng = new window.kakao.maps.LatLng(lat, lon);
              map.jump(moveLatLng, 1, { animate: true });
              setModalOpen(true);
              handleSelectBuildingData(id);
            });
          });
        };

        //서치에 따른 이벤트...
        if (searchParams.has('search')) {
          const buildingId = Number(searchParams.get('search'));

          const searchedBuilding = buildingsData.find(
            (data) => data.id === Number(searchParams.get('search'))
          );
          if (searchedBuilding) {
            handleSelectBuildingData(searchedBuilding.id);
            setModalOpen(true);
            const moveLatLng = new window.kakao.maps.LatLng(
              buildings[buildingId]?.lat,
              buildings[buildingId]?.lon
            );
            map.jump(moveLatLng, 1, { animate: true });
          }
        }

        if (searchParams.has('spot')) {
          if (searchParams.get('spot') === 'study') {
            handleMarker(studyMarkerImageUrl, studyList);
          } else if (searchParams.get('spot') === 'cafe') {
            handleMarker(cafeMarkerImageUrl, cafeList);
          } else if (searchParams.get('spot') === 'all') {
            handleMarker(markerImageUrl, buildingsData);
          } else if (searchParams.get('spot') === 'health') {
            handleMarker(healthMarkerImageUrl, healthCenterList);
          } else if (searchParams.get('spot') === 'printer') {
            handleMarker(printerMarkerImageUrl, printerList);
          }
        } else {
          handleMarker(markerImageUrl, buildingsData);
        }
      }
    };

    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao API가 아직 로드되지 않았습니다.');
      return;
    }

    window.kakao.maps.load(() => {
      mapLoad();
    });
  }, [searchParams, buildingsData, fetchedData]);
  //buildingsData, initLatLon, mapLevel, searchParams
  return (
    <MapSection>
      <MapDiv id="map"></MapDiv>
      <MapModal
        selectedBuildingData={selectedBuildingData}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </MapSection>
  );
}

const MapSection = styled.section`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const MapDiv = styled.div`
  width: 100%;
  height: 100%;
`;
