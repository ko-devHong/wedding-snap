import confetti from "canvas-confetti";
import React, { useState } from "react";

// Types
interface BookingState {
  step: "login" | "date" | "time" | "details" | "success";
  selectedDate: Date | null;
  selectedTime: string | null;
  userInfo: {
    name: string;
    email: string;
    phone: string;
    note: string;
  };
  isLoggedIn: boolean;
}

const MOCK_TIME_SLOTS = [
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Simple helper to get days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function BookingSystem() {
  const [state, setState] = useState<BookingState>({
    step: "login",
    selectedDate: null,
    selectedTime: null,
    userInfo: { name: "", email: "", phone: "", note: "" },
    isLoggedIn: false,
  });

  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Simulate Google Login
  const handleLogin = () => {
    // In a real app, this would trigger Google OAuth
    setTimeout(() => {
      setState((prev) => ({ ...prev, isLoggedIn: true, step: "date" }));
    }, 800);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentCalendarDate.getFullYear(),
      currentCalendarDate.getMonth(),
      day,
    );
    // Prevent selecting past dates
    if (newDate < new Date(new Date().setHours(0, 0, 0, 0))) return;

    setState((prev) => ({ ...prev, selectedDate: newDate, step: "time" }));
  };

  const handleTimeSelect = (time: string) => {
    setState((prev) => ({ ...prev, selectedTime: time, step: "details" }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      userInfo: { ...prev.userInfo, [name]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to save booking and send email
    setTimeout(() => {
      // Trigger confetti or success animation here if integrated
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fb7185", "#f472b6", "#e11d48", "#ffe4e6", "#ffffff"],
      });
      setState((prev) => ({ ...prev, step: "success" }));
    }, 1500);
  };

  const handleAddToCalendar = () => {
    // Logic to open Google Calendar link
    const { selectedDate, selectedTime, userInfo } = state;
    if (!selectedDate || !selectedTime) return;

    const startTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    startTime.setHours(hours, minutes);

    const endTime = new Date(startTime);
    endTime.setHours(hours + 2); // Assume 2 hour session

    const text = encodeURIComponent("웨딩 스냅 촬영");
    const dates = `${startTime.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${endTime.toISOString().replace(/-|:|\.\d\d\d/g, "")}`;
    const details = encodeURIComponent(
      `예약자: ${userInfo.name}\n연락처: ${userInfo.phone}`,
    );
    const location = encodeURIComponent("스튜디오");

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;

    window.open(googleCalendarUrl, "_blank");
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty slots for days before start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateToCheck = new Date(year, month, d);
      const isPast = dateToCheck < today;
      const isSelected =
        state.selectedDate?.getDate() === d &&
        state.selectedDate?.getMonth() === month &&
        state.selectedDate?.getFullYear() === year;

      days.push(
        <button
          key={d}
          onClick={() => !isPast && handleDateSelect(d)}
          disabled={isPast}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200
            ${isSelected ? "bg-rose-400 text-white shadow-md scale-110" : ""}
            ${!isPast && !isSelected ? "hover:bg-rose-100 text-stone-700 cursor-pointer" : ""}
            ${isPast ? "text-stone-300 cursor-not-allowed" : ""}
          `}
        >
          {d}
        </button>,
      );
    }

    return days;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-stone-100">
      {/* Header / Progress */}
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-stone-800 mb-2">
          {state.step === "login" && "예약 시작하기"}
          {state.step === "date" && "날짜 선택"}
          {state.step === "time" && "시간 선택"}
          {state.step === "details" && "예약 정보 입력"}
          {state.step === "success" && "예약 완료"}
        </h2>
        <div className="flex justify-center gap-2">
          {["login", "date", "time", "details", "success"].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                ["login", "date", "time", "details", "success"].indexOf(
                  state.step,
                ) >= i
                  ? "bg-rose-400"
                  : "bg-stone-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px] flex flex-col items-center justify-center">
        {/* Step 0: Login */}
        {state.step === "login" && (
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-stone-600 mb-4">
              구글 계정으로 간편하게 예약하세요.
            </p>
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-3 w-full px-6 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors bg-white text-stone-700 font-medium shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google로 계속하기
            </button>
          </div>
        )}

        {/* Step 1: Date Selection */}
        {state.step === "date" && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4 px-2">
              <button
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(
                      currentCalendarDate.getFullYear(),
                      currentCalendarDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="p-1 hover:bg-stone-100 rounded-full"
              >
                ←
              </button>
              <span className="font-serif text-lg font-medium">
                {currentCalendarDate.getFullYear()}년{" "}
                {currentCalendarDate.getMonth() + 1}월
              </span>
              <button
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(
                      currentCalendarDate.getFullYear(),
                      currentCalendarDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="p-1 hover:bg-stone-100 rounded-full"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs text-stone-500 font-medium">
              <div>일</div>
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div>토</div>
            </div>
            <div className="grid grid-cols-7 gap-1 place-items-center">
              {renderCalendar()}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {state.step === "time" && (
          <div className="w-full animate-in slide-in-from-right-8 duration-300">
            <button
              onClick={() => setState((prev) => ({ ...prev, step: "date" }))}
              className="mb-4 text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              ← 날짜 다시 선택
            </button>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="py-3 px-4 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-700 font-medium transition-all"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Details Form */}
        {state.step === "details" && (
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 animate-in fade-in duration-300"
          >
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, step: "time" }))}
              className="mb-2 text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              ← 시간 다시 선택
            </button>

            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">이름</label>
              <input
                required
                type="text"
                name="name"
                value={state.userInfo.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all"
                placeholder="예: 김철수"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">
                이메일
              </label>
              <input
                required
                type="email"
                name="email"
                value={state.userInfo.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">
                연락처
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={state.userInfo.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all"
                placeholder="010-0000-0000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700">
                요청사항 (선택)
              </label>
              <textarea
                name="note"
                value={state.userInfo.note}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all min-h-20"
                placeholder="특별히 원하시는 컨셉이 있다면 적어주세요."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-rose-400 hover:bg-rose-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              예약 확정하기
            </button>
          </form>
        )}

        {/* Step 4: Success */}
        {state.step === "success" && (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-stone-800 mb-2">
              예약이 완료되었습니다!
            </h3>
            <p className="text-stone-600 mb-6">
              {state.selectedDate?.toLocaleDateString()} {state.selectedTime}
              <br />
              입력하신 이메일로 안내 메일이 발송되었습니다.
            </p>

            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 text-stone-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              구글 캘린더에 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
