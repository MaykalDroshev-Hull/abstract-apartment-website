import styles from '../../styles/Component Styles/BookingBar.module.css';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { enUS, bg } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const BookingBar = ({ prefillCheckin }) => {
  const guestRef = useRef(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'bg' ? bg : enUS;
  const [calendarStartMonth, setCalendarStartMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const calendarRef = useRef(null);
  const [checkInError, setCheckInError] = useState(false);
  const [checkOutError, setCheckOutError] = useState(false);

  const scrollToCalendar = () => {
    if (window.innerWidth <= 600 && calendarRef.current) {
      setTimeout(() => {
        calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // Allow UI to update first
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setShowGuestOptions(false);
      }
    };

    if (showGuestOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGuestOptions]);
  useEffect(() => {
    fetch('/api/load-bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBookedDates(data.bookedDates);
      });
  }, []);

  useEffect(() => {
    if (prefillCheckin) {
      const parsedDate = new Date(prefillCheckin);
      if (!isNaN(parsedDate)) {
        setCheckIn(parsedDate);
      }
    }
  }, [prefillCheckin]);

  const { t } = useTranslation('common');

  const generateDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    return eachDayOfInterval({ start, end });
  };

  const monthsToShow = [currentMonth, addMonths(currentMonth, 1)];

  const handleDayClick = (date) => {
    if (isBooked(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (isAfter(date, checkIn)) {
      setCheckOut(date);
      setShowCalendar(false);
    }
  };


  const isInRange = (date) => {
    if (checkIn && hoveredDate && !checkOut) {
      return isAfter(date, checkIn) && isBefore(date, hoveredDate);
    }
    return false;
  };
  const router = useRouter();

const handleBookClick = () => {
  const hasCheckIn = !!checkIn;
  const hasCheckOut = !!checkOut;

  setCheckInError(!hasCheckIn);
  setCheckOutError(!hasCheckOut);

  if (!hasCheckIn || !hasCheckOut) {
    scrollToCalendar(); // Optional: scroll to calendar on error
    return; // Stop navigation
  }

  const locale = router.locale || 'en';
  const checkInStr = format(checkIn, 'yyyy-MM-dd');
  const checkOutStr = format(checkOut, 'yyyy-MM-dd');
  const guestDetails = `${guests.adults} ${t('booking.adults')}, ${guests.children} ${t('booking.children')}, ${guests.infants} ${t('booking.infants')}`;

  router.push({
    pathname: '/payment',
    query: {
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests: guestDetails,
    },
  });
};

  const isBooked = (date) => bookedDates[format(date, 'yyyy-MM-dd')];

  return (
    <div className={styles.bookingBarWrapper}>
      <div className={styles.bookingRow}>
        <div
  className={`${styles.field} ${checkInError ? styles.error : ''}`}
  onClick={() => {
    const shouldOpen = !showCalendar;
    setShowCalendar(shouldOpen);
    setShowGuestOptions(false);
    setCheckInError(false); // Clear error on interaction

    if (shouldOpen && window.innerWidth <= 600) {
      setTimeout(() => {
        calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }}
>
  <label>{t('booking.checkin')}</label>
  <div className={styles.dateValue}>
    {checkIn ? format(checkIn, 'dd MMM yyyy', { locale: currentLocale }) : t('booking.select')}
  </div>
</div>
<div
  className={`${styles.field} ${checkOutError ? styles.error : ''}`}
  onClick={() => {
    if (checkIn) {
      const shouldOpen = !showCalendar;
      setShowCalendar(shouldOpen);
      setShowGuestOptions(false);
      setCheckOutError(false); // Clear error on interaction

      if (shouldOpen && window.innerWidth <= 600) {
        setTimeout(() => {
          calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }}
>
  <label>{t('booking.checkout')}</label>
  <div className={styles.dateValue}>
    {checkOut ? format(checkOut, 'dd MMM yyyy', { locale: currentLocale }) : t('booking.select')}
  </div>
</div>

        <div className={styles.field} onClick={() => {
          setShowGuestOptions(!showGuestOptions);
          setShowCalendar(false); // 👈 close calendar when opening guests
        }}>
          <label>{t('booking.guests')}</label>
          <div>{guests.adults} {t('booking.adults')}, {guests.children} {t('booking.children')}</div>
        </div>
        <button className={styles.bookButton} onClick={handleBookClick}>{t('booking.book')}</button>
      </div>

      {showCalendar && (
        <div className={styles.calendarWrapper} ref={calendarRef}>
          <div className={styles.calendarNav}>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
              <ChevronLeft size={20} />
            </button>

            {monthsToShow.map((month, idx) => (
              <div className={styles.calendarMonth} key={idx}>
                <div className={styles.monthHeader}>{format(month, 'MMMM yyyy', { locale: currentLocale })}</div>
                <div className={styles.dayGrid}>
                  {generateDays(month).map((day) => {
                    const disabled = isBefore(day, startOfDay(new Date())) || isBooked(day);
                    return (
                      <div
                        key={day}
                        className={`
                  ${styles.dayCell}
                  ${isSameDay(day, checkIn) ? styles.checkIn : ''}
                  ${isSameDay(day, checkOut) ? styles.checkOut : ''}
                  ${isInRange(day) ? styles.inRange : ''}
                  ${disabled ? styles.disabled : ''}
                `}
                        onMouseEnter={() => !disabled && setHoveredDate(day)}
                        onClick={() => handleDayClick(day)}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}


      {showGuestOptions && (
        <div className={styles.guestOptions} ref={guestRef}>
          <div className={styles.guestRow}>
            <label>{t('booking.adults')}</label>
            <div className={styles.stepper}>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    adults: Math.max(1, prev.adults - 1),
                  }))
                }
              >
                -
              </button>
              <span>{guests.adults}</span>
              <button
                onClick={() =>
                  setGuests((prev) => {
                    const total = prev.adults + prev.children;
                    if (prev.adults < 6 && total < 6) {
                      return { ...prev, adults: prev.adults + 1 };
                    }
                    return prev;
                  })
                }
                disabled={guests.adults >= 6 || guests.adults + guests.children >= 6}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.guestRow}>
            <label>{t('booking.children')}</label>
            <div className={styles.stepper}>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    children: Math.max(0, prev.children - 1),
                  }))
                }
              >
                -
              </button>
              <span>{guests.children}</span>
              <button
                onClick={() =>
                  setGuests((prev) => {
                    const total = prev.adults + prev.children;
                    if (prev.children < 5 && total < 6) {
                      return { ...prev, children: prev.children + 1 };
                    }
                    return prev;
                  })
                }
                disabled={guests.children >= 5 || guests.adults + guests.children >= 6}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.guestRow}>
            <label>{t('booking.infants')}</label>
            <div className={styles.stepper}>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    infants: Math.max(0, prev.infants - 1),
                  }))
                }
              >
                -
              </button>
              <span>{guests.infants}</span>
              <button
                onClick={() =>
                  setGuests((prev) =>
                    prev.infants < 5
                      ? { ...prev, infants: prev.infants + 1 }
                      : prev
                  )
                }
                disabled={guests.infants >= 5}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.petsDisabled}>
            <input type="checkbox" disabled /> <label>{t('booking.pets')}</label>
            <div className={styles.infoText}>{t('booking.noPets')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingBar;
