import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentForm from '../appComponents/AppointmentForm';
import '@testing-library/jest-dom';

describe('AppointmentForm', () => {
  test('renders the appointment form', () => {
    render(<AppointmentForm />);

    // Check if all fields are rendered
    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/appointment type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason for visit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<AppointmentForm />);

    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for validation error messages
    expect(await screen.findByText(/patient name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/phone number must be at least 10 digits/i)).toBeInTheDocument();
    expect(await screen.findByText(/preferred date is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/reason for visit is required/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', async () => {
    render(<AppointmentForm />);

    // Enter an invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for validation error message
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid phone number', async () => {
    render(<AppointmentForm />);

    // Enter an invalid phone number
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '123' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check for validation error message
    expect(await screen.findByText(/invalid phone number/i)).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    render(<AppointmentForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/patient name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '(123) 456-7890' },
    });
    fireEvent.change(screen.getByLabelText(/appointment type/i), {
      target: { value: 'CHECKUP' },
    });
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: '2023-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/reason for visit/i), {
      target: { value: 'Annual checkup' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if the form is submitted (e.g., alert is shown)
    expect(await screen.findByText(/appointment booked successfully/i)).toBeInTheDocument();
  });

  test('shows loading state during submission', async () => {
    render(<AppointmentForm />);

    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/patient name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '(123) 456-7890' },
    });
    fireEvent.change(screen.getByLabelText(/appointment type/i), {
      target: { value: 'CHECKUP' },
    });
    fireEvent.change(screen.getByLabelText(/preferred date/i), {
      target: { value: '2023-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/reason for visit/i), {
      target: { value: 'Annual checkup' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if the button shows loading state
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });
});