import styled from 'styled-components';
import AgreeItem from './AgreeItem';

interface AgreeBoxProps {
  onChangeCheckedTos: () => void;
  onChangeCheckedPP: () => void;
  isCheckedTOS: boolean;
  isCheckedPP: boolean;
}

export default function AgreeBox({
  onChangeCheckedTos,
  onChangeCheckedPP,
  isCheckedTOS,
  isCheckedPP
}: AgreeBoxProps) {
  return (
    <AgreeBoxContainer>
      <AgreeItem
        text="Agree to Dotted’s Terms of Service"
        link="https://rustic-tulip-dff.notion.site/Terms-of-Service-1a72493912ca80258a20e709cf6b9e27"
        onChangeChecked={onChangeCheckedTos}
        ischecked={isCheckedTOS}
      />
      <AgreeItem
        text="Acknowledge Dotted’s privacy policy"
        link="https://rustic-tulip-dff.notion.site/Privacy-Policy-1a72493912ca808ab6eec4647468fb5c"
        onChangeChecked={onChangeCheckedPP}
        ischecked={isCheckedPP}
      />
    </AgreeBoxContainer>
  );
}

const AgreeBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
