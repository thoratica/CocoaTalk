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

const StyledTextArea = styled.textarea<{ disabled: boolean }>`
  padding: 0.7rem 1rem;
  margin: 0.1rem 0;
  border: 0;
  border-radius: 0.4rem;
  background-color: #f9f9f9;
  font-size: 1rem;
  height: 1.102rem;
  resize: none;
  line-height: 1;
  width: 100%;

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
  multiline = false,
  onSubmit = async () => '',
}: {
  className?: string;
  type?: InputTypes;
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  autoFocus?: boolean;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  style?: React.CSSProperties;
  multiline?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<string | undefined>;
}) =>
  multiline ? (
    <StyledTextArea
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      disabled={disabled}
      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
      style={style}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
          console.log('wa', onSubmit);
        }
      }}
    />
  ) : (
    <StyledInput
      className={className}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      disabled={disabled}
      ref={inputRef as React.RefObject<HTMLInputElement>}
      style={style}
    />
  );

export default Input;
