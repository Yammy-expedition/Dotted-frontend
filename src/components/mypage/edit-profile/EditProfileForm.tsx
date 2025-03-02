import { useState, useEffect } from 'react';
import styled from 'styled-components';
import BitrhIcon from '@/assets/svg/mypage/birth.svg?react';
import KeyIcon from '@/assets/svg/mypage/key.svg?react';
import NicknameIcon from '@/assets/svg/mypage/nickname.svg?react';
import ProfileIcon from '@/assets/svg/mypage/profile.svg?react';
import WarningIcon from '@/assets/svg/mypage/warning.svg?react';
import ModalPortal from '@/components/common/portal/ModalPortal';
import PasswordModal from './PasswordModal';

type dataType = {
  name: string;
  password: string;
  birth: string;
  nickname: string;
  login_type: string;
  email: string;
  id: number;
  univ_certified: boolean;
  registered_marketposts: [];
  comments: [];
  registered_posts: [];
  scrapped_marketposts: [];
  scrapped_posts: [];
};

export default function EditProfileForm({
  setSubmitName,
  setSubmitNickname,
  setIsAllChecked
}: {
  setSubmitName: (value: string) => void;
  setSubmitNickname: (value: string) => void;
  setIsAllChecked: (value: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    nickname: ''
  });
  const [fetchedData, setFetchedData] = useState<dataType>();
  const [modalOpen, setModalOpen] = useState(false);
  const [isUserAlready, setIsUserAlready] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  useEffect(() => {
    const fetchProfileData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/profile`,
        {
          headers: headers,
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFetchedData(data);
        setSubmitName(data.name);
        setSubmitNickname(data.nickname);

        const birth = data.birth || '';
        setFormData({
          birthYear: birth ? birth.slice(0, 4) : '',
          birthMonth: birth ? birth.slice(4, 6) : '',
          birthDay: birth ? birth.slice(6, 8) : '',
          nickname: data.nickname || ''
        });
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [id]: value };
      return updatedFormData;
    });
  };

  const handleValidationCheck = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/api/user/nickname-check?nickname=${encodeURIComponent(formData.nickname)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.ok) {
      setIsUserAlready(false);
      setIsUserChecked(true);
      setSubmitNickname(formData.nickname);
      setIsAllChecked(true);
    } else {
      setIsUserAlready(true);
      setIsUserChecked(false);
    }
  };

  return (
    <Form>
      <FieldBox>
        <label htmlFor="name">
          <ProfileIcon /> Name
        </label>
        <InputBox>
          <input
            type="text"
            id="name"
            value={fetchedData?.name}
            onChange={handleChange}
            disabled
          />
        </InputBox>
      </FieldBox>
      {fetchedData?.login_type === 'EMAIL' && (
        <FieldBox>
          <label htmlFor="password">
            <KeyIcon /> Password
          </label>
          <InputBox>
            <button onClick={() => setModalOpen(true)}>Change Password</button>
          </InputBox>
        </FieldBox>
      )}
      <FieldBox>
        <label htmlFor="birth">
          <BitrhIcon /> Birth
        </label>
        <BirthBox>
          <span>
            <label htmlFor="birthYear">Year</label>
            <div id="birthYear">{formData.birthYear}</div>
          </span>
          <span>
            <label htmlFor="birthMonth">Month</label>
            <div id="birthMonth">{formData.birthMonth}</div>
          </span>
          <span>
            <label htmlFor="birthDay">Day</label>
            <div id="birthDay">{formData.birthDay}</div>
          </span>
        </BirthBox>
      </FieldBox>
      <FieldBox>
        <label htmlFor="nickname">
          <NicknameIcon /> Nickname
        </label>
        <InputBox>
          <input
            type="text"
            id="nickname"
            value={formData.nickname}
            onChange={handleChange}
          />
          <button onClick={handleValidationCheck}>Validation Check</button>
        </InputBox>
        {isUserAlready && (
          <p>
            <WarningIcon /> You can't use this nickname
          </p>
        )}
        {isUserChecked && (
          <p className="success">Validation Checked Successfully</p>
        )}
      </FieldBox>
      {modalOpen && (
        <ModalPortal>
          <PasswordModal
            setModalOpen={setModalOpen}
            email={fetchedData?.email}
          />
        </ModalPortal>
      )}
    </Form>
  );
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1rem;

  > label {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.6rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray700};
  }

  p {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--negative-900);
    &.success {
      color: ${({ theme }) => theme.colors.purple600};
    }
  }
`;

const InputBox = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;

  > input {
    width: 30vw;
    height: 4rem;
    padding: 0 1.4rem;
    border-radius: 5px;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.gray700};
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    @media (max-width: 700px) {
      width: 20rem;
    }
  }

  > button {
    width: fit-content;
    padding: 0 2rem;
    height: 4rem;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.gray50};
    border: none;
    font-size: 1.3rem;
    font-weight: 500;
    @media (max-width: 400px) {
      padding: 0 1.5rem;
      font-size: 1.1rem;
    }
  }
`;

const BirthBox = styled.div`
  display: flex;
  gap: 1.5rem;

  > span {
    display: flex;
    flex-direction: column;

    > label {
      margin-bottom: 1rem;
      font-size: 1.4rem;
      font-weight: 300;
    }

    > div {
      width: 10vw;
      height: 4rem;
      border-radius: 5px;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.gray700};
      border: 1px solid ${({ theme }) => theme.colors.gray300};
      display: flex;
      align-items: center;
      padding: 0 1.4rem;
      background-color: ${({ theme }) => theme.colors.gray100};
      @media (max-width: 700px) {
        width: 10rem;
      }
      @media (max-width: 400px) {
        width: 7rem;
      }
    }
  }
`;
