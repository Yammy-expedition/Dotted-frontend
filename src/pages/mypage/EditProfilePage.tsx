import EditProfileForm from '@/components/mypage/edit-profile/EditProfileForm';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

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

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [submitNickname, setSubmitNickname] = useState('');
  const [submitName, setSubmitName] = useState('');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/user/update`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ nickname: submitNickname, name: submitName })
      });
    } catch (error) {
      console.error('Error changing:', error);
    } finally {
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setisLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/user/delete`,
        {
          method: 'DELETE',
          headers: headers
        }
      );

      if (response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
      } else {
        console.error('Account deletion failed:', response.status);
      }
    } catch (error) {
      console.error('Error occurred while deleting account:', error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Main>
      <Modal
        isOpen={deleteAccountModal}
        style={customStyles}
        onRequestClose={() => setDeleteAccountModal((prev) => !prev)}
        contentLabel="example"
      >
        <AccessRestrictedWrapper>
          <div>
            <AccessRestrictedNormal>
              <TextNormal>
                <span>Are you sure you want to delete account</span>
              </TextNormal>
            </AccessRestrictedNormal>
            <ButtonBox>
              <LaterButton
                onClick={() => setDeleteAccountModal((prev) => !prev)}
              >
                Cancel
              </LaterButton>
              <NowButton onClick={handleDeleteAccount}>
                {isLoading ? 'Deleting...' : 'Delete'}
              </NowButton>
            </ButtonBox>
          </div>
        </AccessRestrictedWrapper>
      </Modal>
      <EditProfileForm
        setSubmitNickname={setSubmitNickname}
        setSubmitName={setSubmitName}
        setIsAllChecked={setIsAllChecked}
      />
      <DeleteBtn>
        <button onClick={() => setDeleteAccountModal(true)}>
          Delete Account
        </button>
      </DeleteBtn>
      <SubmitBtn>
        <button
          className={isAllChecked ? '' : 'unchecked'}
          onClick={handleSubmit}
          disabled={!isAllChecked}
        >
          Submit
        </button>
      </SubmitBtn>
    </Main>
  );
}

const Main = styled.main`
  padding-bottom: 3rem;
  height: 100%;
  > h1 {
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 3.6rem;
    letter-spacing: -1.6px;
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

const DeleteBtn = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  button {
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.gray400};
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: -0.8px;
    text-decoration-line: underline;
  }
`;

const SubmitBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  button {
    width: 19rem;
    height: 4rem;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.purple600};
    color: ${({ theme }) => theme.colors.gray50};
    border: none;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 3.6rem;
    letter-spacing: -0.6px;
    &.unchecked {
      background-color: ${({ theme }) => theme.colors.gray300};
      color: ${({ theme }) => theme.colors.gray500};
      cursor: not-allowed;
    }
  }
`;

const AccessRestrictedWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  background: var(--Modal-Background, rgba(12, 12, 12, 0.3));
  position: absolute;
  z-index: 10;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    width: 100%;
    max-width: 51rem;
  }
`;

const AccessRestrictedNormal = styled.div`
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 5.6rem 2rem 0 2rem;
  width: 100%;
  max-width: 51rem;
  height: 23.6rem;
  flex-shrink: 0;
  border-radius: 5px 5px 0 0;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.11);
`;

const TextNormal = styled.div`
  display: flex;
  justify-content: center;
  > span {
    color: ${({ theme }) => theme.colors.gray700};
    text-align: center;

    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-style: normal;
    font-weight: 400;
    line-height: 34px;
    letter-spacing: -0.8px;
    > span {
      font-weight: 700;
    }
  }
`;

const ButtonBox = styled.div`
  display: flex;
  width: 100%;
  height: 7.4rem;
  border-radius: 0 0 5px 5px;
  background: ${({ theme }) => theme.colors.backgroundLayer1};
  > div {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    font-size: 2rem;
    @media (max-width: 460px) {
      font-size: 1.7rem;
    }
    font-style: normal;
    font-weight: 500;
    line-height: 25px;
    letter-spacing: -0.6px;
  }
`;

const LaterButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 0px 5px;
  background: ${({ theme }) => theme.colors.backgroundBase};
  color: ${({ theme }) => theme.colors.gray700};
`;

const NowButton = styled.div`
  width: 50%;
  border-radius: 0px 0px 5px 0px;
  background: var(--Semantic-Negative-900, #ea3729);
  color: ${({ theme }) => theme.colors.gray50};
`;

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.4rem;
  @media (max-width: 460px) {
    font-size: 1.1rem;
  }
  font-weight: 300;
  letter-spacing: -0.07rem;
`;
