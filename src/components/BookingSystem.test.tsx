import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BookingSystem from './BookingSystem';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('BookingSystem', () => {
  beforeEach(() => {
    // Mock window.open
    vi.stubGlobal('open', vi.fn());
  });

  it('renders the initial login step', () => {
    render(<BookingSystem />);
    expect(screen.getByText('예약 시작하기')).toBeInTheDocument();
    expect(screen.getByText('Google로 계속하기')).toBeInTheDocument();
  });

  it('completes the booking flow', async () => {
    render(<BookingSystem />);

    // 1. Login Step
    const loginButton = screen.getByText('Google로 계속하기');
    fireEvent.click(loginButton);

    // Wait for login simulation (800ms)
    await waitFor(() => {
      expect(screen.getByText('날짜 선택')).toBeInTheDocument();
    }, { timeout: 2000 });

    // 2. Date Selection Step
    // Find available date buttons (excluding navigation buttons)
    const allButtons = screen.getAllByRole('button');
    const dateButtons = allButtons.filter(
      btn =>
        !btn.disabled &&
        !btn.textContent?.includes('←') &&
        !btn.textContent?.includes('→') &&
        !isNaN(Number(btn.textContent))
    );

    // Select the last available date to ensure it's in the future
    const targetDateBtn = dateButtons[dateButtons.length - 1];
    fireEvent.click(targetDateBtn);

    await waitFor(() => {
      expect(screen.getByText('시간 선택')).toBeInTheDocument();
    });

    // 3. Time Selection Step
    const timeButton = screen.getByText('10:00');
    fireEvent.click(timeButton);

    await waitFor(() => {
      expect(screen.getByText('예약 정보 입력')).toBeInTheDocument();
    });

    // 4. Details Form Step
    fireEvent.change(screen.getByPlaceholderText('예: 김철수'), { target: { value: '테스트유저' } });
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('010-0000-0000'), { target: { value: '010-1234-5678' } });

    const submitButton = screen.getByText('예약 확정하기');
    fireEvent.click(submitButton);

    // Wait for submission simulation (1500ms)
    await waitFor(() => {
      expect(screen.getByText('예약이 완료되었습니다!')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check success state
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
    expect(screen.getByText('구글 캘린더에 추가')).toBeInTheDocument();
  });
});
