import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const pageList = [
  { title: 'Edit Profile', path: 'profile' },
  { title: 'Student Verification', path: 'verification' },
  { title: 'My Posts', path: 'posts' },
  { title: 'My Comments', path: 'comments' },
  { title: 'My Scraps', path: 'scraps' }
];

export default function MyPageLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split('/')[2];

  return (
    <Layout>
      <MyPageSideBar>
        <h1>My Page</h1>
        <List>
          {pageList.map((page, idx) => (
            <li
              className={path === page.path ? 'selected' : 'null'}
              key={idx}
              onClick={() => navigate(`/mypage/${page.path}`)}
            >
              {page.title}
            </li>
          ))}
        </List>
      </MyPageSideBar>
      <Outlet />
    </Layout>
  );
}

const Layout = styled.div`
  padding: 4rem 8rem 0 8rem;
  height: 70vh;
  display: grid;
  grid-template-columns: 21rem 1fr;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 2rem 2rem 0 2rem;
  }
`;

const MyPageSideBar = styled.div`
  display: flex;
  flex-direction: column;

  > h1 {
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 3.6rem;
    letter-spacing: -1.6px;
    color: ${({ theme }) => theme.colors.gray800};
  }

  @media (max-width: 768px) {
    > h1 {
      font-size: 2.4rem;
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 3.6rem;

  > li {
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 2.8rem;
    letter-spacing: -0.8px;
    color: ${({ theme }) => theme.colors.gray700};
    cursor: pointer;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: ${({ theme }) => theme.colors.gray500};
      }
    }
    @media (max-width: 768px) {
      background-color: ${({ theme }) => theme.colors.gray200};
      padding: 0.6rem 1.2rem;
      border-radius: 5rem;
      flex-shrink: 0;
      font-size: 1.2rem;
    }
    &.selected {
      font-weight: 500;
      color: ${({ theme }) => theme.colors.purple600};
    }
  }
  @media (max-width: 768px) {
    flex-direction: row;
    margin: 1.6rem 0;
    overflow-x: scroll;
    gap: 0.5rem;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
