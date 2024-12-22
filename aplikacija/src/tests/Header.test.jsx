import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header'; 

describe('Header ', () => {

  it('preusmeritev na stran moja evidenca po kliku na gumb "Moja evidenca"', () => {
    const mockNavigate = jest.fn();
    render(<Header onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByText('Moja evidenca'));

    expect(mockNavigate).toHaveBeenCalledWith('mojaEvidenca');
  });

  it('preusmeritev na stran za vnos ur ob kliku na gumb "Vnesi ure"', () => {
    const mockNavigate = jest.fn();
    render(<Header onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByText('Vnesi ure'));

    expect(mockNavigate).toHaveBeenCalledWith('vnesiUre');
  });

  it('preusmeritev na stran pregled ob kliku na gumb "Pregled"', () => {
    const mockNavigate = jest.fn();
    render(<Header onNavigate={mockNavigate} />);

    fireEvent.click(screen.getByText('Pregled'));

    expect(mockNavigate).toHaveBeenCalledWith('pregled');
  });

  

});
