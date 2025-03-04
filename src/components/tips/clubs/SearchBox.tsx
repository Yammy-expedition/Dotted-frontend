import styled from 'styled-components';
import SearchIcon from '@/assets/svg/tips/clubs/search.svg?react';

interface SearchBoxProps {
  searchValue: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBox({
  searchValue,
  onInputChange,
  onSearch
}: SearchBoxProps) {
  return (
    <Wrapper>
      <span>
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
        />
        <SearchIcon onClick={onSearch} style={{ cursor: 'pointer' }} />
      </span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  > span {
    max-width: 26rem;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.backgroundLayer1};
    padding: 0 1.7rem;
    border-radius: 5px;
    position: relative;

    > input {
      width: 100%;
      height: 4rem;
      flex-shrink: 0;
      border: none;
      background: none;
      color: ${({ theme }) => theme.colors.gray900};

      &:focus {
        outline: none;
      }
    }

    > svg {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 1rem;

      width: 1.5rem;
      height: 1.5rem;
      path {
        fill: ${({ theme }) => theme.colors.gray500};
      }
    }
  }
`;
