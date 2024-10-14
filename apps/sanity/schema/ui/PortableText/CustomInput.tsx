import type { PortableTextInputProps } from "sanity";
import styled from "styled-components";

const Container = styled.div`
  [data-testid='pt-editor'][data-fullscreen='false'] {
    height: auto;
    min-height: 88px;
    [data-testid="scroll-container"] {
      max-height: 610px;
    }
    .pt-editable {
      padding-bottom: 12px;
    }
  }
`
export const CustomInput = (props: PortableTextInputProps) => {
  return (
    <Container>
      {props.renderDefault({
        initialActive: true,
        ...props,
      })}
    </Container>
  );
};
