import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddDopustForm from '../components/AddDopustForm';

jest.mock('axios');

describe('AddDopustForm', () => {
  test('prikaz vnosnega obrazca z vsemi zahtevanimi polji', () => {
    render(<AddDopustForm />);

    screen.getByLabelText(/Začetek Dopusta/i);
    screen.getByLabelText(/Konec Dopusta/i);
    screen.getByLabelText(/Razlog/i);
    screen.getByRole('button', { name: /Dodaj/i });
  });


  test('reset obrazca po uspesni oddaji', () => {
    render(<AddDopustForm />);

    const startDate = screen.getByLabelText(/Začetek Dopusta/i);
    const endDate = screen.getByLabelText(/Konec Dopusta/i);
    const reason = screen.getByLabelText(/Razlog/i);

    fireEvent.change(startDate, { target: { value: '2024-12-10' } });
    fireEvent.change(endDate, { target: { value: '2024-12-15' } });
    fireEvent.change(reason, { target: { value: 'Vacation' } });

    axios.post.mockResolvedValue({ data: { id: 123 } });

    fireEvent.click(screen.getByRole('button', { name: /Dodaj/i }));

    waitFor(() => {
      expect(startDate.value).toBe('');
      expect(endDate.value).toBe('');
      expect(reason.value).toBe('');
    });
  });

  test('prikaz error sporocila ob napaki pri posiljanju podatkov', () => {
    render(<AddDopustForm />);

    const startDate = screen.getByLabelText(/Začetek Dopusta/i);
    const endDate = screen.getByLabelText(/Konec Dopusta/i);
    const reason = screen.getByLabelText(/Razlog/i);

    fireEvent.change(startDate, { target: { value: '2024-12-10' } });
    fireEvent.change(endDate, { target: { value: '2024-12-15' } });
    fireEvent.change(reason, { target: { value: 'Vacation' } });

    axios.post.mockRejectedValue(new Error('API call failed'));

    fireEvent.click(screen.getByRole('button', { name: /Dodaj/i }));

    waitFor(() => {
      expect(screen.getByText(/Error adding dopust/i)).toBeInTheDocument();
    });
  });
});
