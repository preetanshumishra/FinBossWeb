import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  it('should render input field with label', () => {
    render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render input with current value', () => {
    render(
      <FormInput
        label="Username"
        type="text"
        name="username"
        value="johndoe"
        onChange={jest.fn()}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('johndoe');
  });

  it('should call onChange handler when input changes', () => {
    const onChange = jest.fn();
    render(
      <FormInput
        label="Name"
        type="text"
        name="name"
        value=""
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'John' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('should display error message when provided', () => {
    render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
        error="Invalid email format"
      />
    );

    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('should apply error class when error exists', () => {
    const { container } = render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
        error="Invalid email"
      />
    );

    const input = container.querySelector('.form-input.error');
    expect(input).toBeInTheDocument();
  });

  it('should not display error class without error', () => {
    const { container } = render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
      />
    );

    const input = container.querySelector('.form-input.error');
    expect(input).not.toBeInTheDocument();
  });

  it('should render required asterisk when required prop is true', () => {
    render(
      <FormInput
        label="Password"
        type="password"
        name="password"
        value=""
        onChange={jest.fn()}
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should support different input types', () => {
    const { container: container1 } = render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
      />
    );

    let input = container1.querySelector('input[type="email"]');
    expect(input).toBeInTheDocument();

    const { container: container2 } = render(
      <FormInput
        label="Password"
        type="password"
        name="password"
        value=""
        onChange={jest.fn()}
      />
    );

    input = container2.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('should handle placeholder text', () => {
    render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
        placeholder="Enter your email"
      />
    );

    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('should have proper input structure', () => {
    const { container } = render(
      <FormInput
        label="Email"
        type="email"
        name="email"
        value=""
        onChange={jest.fn()}
      />
    );

    const input = container.querySelector('input[type="email"]');
    expect(input).toBeInTheDocument();
  });
});
