import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';

const StyledInput = styled.input<{ disabled: boolean }>`
  padding: 0.7rem 1rem;
  margin: 0.1rem 0;
  border: 0;
  border-radius: 0.4rem;
  background-color: #f9f9f9;
  font-size: 1rem;
  height: max-content;

  &[type='submit'] {
    background-color: ${(props) => (props.disabled ? '#f9f9f9' : '#fee500')};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const Input = ({
  className,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoFocus = false,
  disabled = false,
  inputRef,
  style,
}: {
  className?: string;
  type?: InputTypes;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  style?: React.CSSProperties;
}) => (
  <StyledInput
    className={className}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    autoFocus={autoFocus}
    disabled={disabled}
    ref={inputRef}
    style={style}
  />
);

export default Input;
