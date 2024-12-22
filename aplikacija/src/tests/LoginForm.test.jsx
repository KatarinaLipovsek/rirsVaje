import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm'; // Adjust the import path if necessary
import axios from 'axios';



jest.mock('axios');

describe('LoginForm ', () => {

  it('submit obrazec in klic onLogin ob uspesni prijavi', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    const mockResponse = { data: { success: true, user: mockUser } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const onLoginMock = jest.fn();
    render(<LoginForm onLogin={onLoginMock} />);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/login', {
        username: 'johndoe',
        password: 'password123',
      });
      expect(onLoginMock).toHaveBeenCalledWith(mockUser);
    });
  });
});
