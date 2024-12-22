import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddBolniskaForm from '../components/AddBolniskaForm';

jest.mock('axios');

describe('AddBolniskaForm', () => {
  test('prikaz vnosnega obrazca z vsemi zahtevanimi polji', () => {
    render(<AddBolniskaForm />);

    screen.getByLabelText(/Začetek/i);
    screen.getByLabelText(/Konec/i);
    screen.getByRole('button', { name: /Dodaj/i });
  });


  test('reset obrazca po uspesni oddaji', () => {
    render(<AddBolniskaForm />);

    const startDate = screen.getByLabelText(/Začetek/i);
    const endDate = screen.getByLabelText(/Konec/i);

    fireEvent.change(startDate, { target: { value: '2024-12-10' } });
    fireEvent.change(endDate, { target: { value: '2024-12-15' } });

    axios.post.mockResolvedValue({ data: { id: 123 } });

    fireEvent.click(screen.getByRole('button', { name: /Dodaj/i }));

    waitFor(() => {
      expect(startDate.value).toBe('');
      expect(endDate.value).toBe('');
    });
  });

  test('prikaz error sporocila ob napaki pri posiljanju podatkov', () => {
    render(<AddBolniskaForm />);

    const startDate = screen.getByLabelText(/Začetek/i);
    const endDate = screen.getByLabelText(/Konec/i);

    fireEvent.change(startDate, { target: { value: '2024-12-10' } });
    fireEvent.change(endDate, { target: { value: '2024-12-15' } });

    axios.post.mockRejectedValue(new Error('API call failed'));

    fireEvent.click(screen.getByRole('button', { name: /Dodaj/i }));

    waitFor(() => {
      expect(screen.getByText(/Error adding bolniska/i)).toBeInTheDocument();
    });
  });
});
