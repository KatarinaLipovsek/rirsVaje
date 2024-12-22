import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeDetailsDialog from '../components/EmployeeDetailsDialog';


describe('EmployeeDetailsDialog', () => {

  const employee = {
    name: 'John Doe',
    id: '123',
    email: 'john.doe@example.com',
    total_hours: 120,
  };

  
  it('ne sme odpreti dialog okna ko je open false', () => {
    render(<EmployeeDetailsDialog open={false} onClose={() => {}} employee={employee} />);
    const dialogTitle = screen.queryByText('Podrobnosti zaposlenega');
    expect(dialogTitle).toBeNull();
  });

  it('ne sme prikazovati podrobnosti zaposlenega, ko ta ni dolocen', () => {
    render(<EmployeeDetailsDialog open={true} onClose={() => {}} employee={null} />);
    
    expect(screen.queryByText('Ime:')).toBeNull();
    expect(screen.queryByText('ID zaposlenega:')).toBeNull();
    expect(screen.queryByText('Email:')).toBeNull();
    expect(screen.queryByText('Št. oddelanih ur:')).toBeNull();
  });
  
 
  

  

  

 
  
  
  
  
  
  
});
