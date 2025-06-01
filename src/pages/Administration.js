import { useEffect, useState } from 'react';
import styles from '../styles/Page Styles/Administration.module.css';
import { format, parseISO } from 'date-fns';
import { isAfter, isBefore, isEqual } from 'date-fns';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRef } from 'react';


const fetchBookings = async () => {
  const res = await fetch('/api/get-bookings');
  const data = await res.json();
  return data.bookings || [];
};

const Administration = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    CheckInDT: '',
    CheckOutDT: '',
    FirstName: '',
    LastName: '',
    Telephone: '',
    FullPrice: '',
    PaidPrice: '',
    Comments: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBookingID, setEditBookingID] = useState(null);
  const [dates, setDates] = useState([]);
  const [bookedDates, setBookedDates] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await fetchBookings();
    setBookings(data);
  };

  const getOverlappingBookingIDs = () => {
    const overlappingIDs = new Set();
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        const a = bookings[i];
        const b = bookings[j];

        const aStart = parseISO(a.CheckInDT);
        const aEnd = parseISO(a.CheckOutDT);
        const bStart = parseISO(b.CheckInDT);
        const bEnd = parseISO(b.CheckOutDT);

        const overlaps =
          aStart < bEnd && aEnd > bStart; // excludes edge-case same-day turnover

        if (overlaps) {
          overlappingIDs.add(a.BookingID);
          overlappingIDs.add(b.BookingID);
        }
      }
    }
    return overlappingIDs;
  };

  const overlappingIDs = getOverlappingBookingIDs();
  const getCurrentBooking = () => {
    const today = new Date();
    return bookings.find(b => {
      const checkIn = parseISO(b.CheckInDT);
      const checkOut = parseISO(b.CheckOutDT);
      return (
        (isBefore(checkIn, today) || isEqual(checkIn, today)) &&
        (isAfter(checkOut, today) || isEqual(checkOut, today))
      );
    });
  };

  const currentBooking = getCurrentBooking();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditBookingID(null);
    setEditCustomerID(null);
    setFormData({ CheckInDT: '', CheckOutDT: '', FirstName: '', LastName: '', Telephone: '', FullPrice: '', PaidPrice: '', Comments: '' });
  };

  const handleAdd = async () => {
    // Add a new booking + customer
    const res = await fetch('/api/add-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      await loadBookings();
      setFormData({ CheckInDT: '', CheckOutDT: '', FirstName: '', LastName: '', Telephone: '', FullPrice: '', PaidPrice: '', Comments: '' });
    }
  };
  const [editCustomerID, setEditCustomerID] = useState(null);

  const handleEdit = (booking) => {
    setIsEditing(true);
    setEditBookingID(booking.BookingID);
    setEditCustomerID(booking.CustomerID);

    setFormData({
      CheckInDT: booking.CheckInDT
        ? format(parseISO(booking.CheckInDT), 'yyyy-MM-dd')
        : '',
      CheckOutDT: booking.CheckOutDT
        ? format(parseISO(booking.CheckOutDT), 'yyyy-MM-dd')
        : '',
      FirstName: booking.Customer?.FirstName || '',
      LastName: booking.Customer?.LastName || '',
      Telephone: booking.Customer?.Telephone || '',
      FullPrice: booking.FullPrice || '',
      PaidPrice: booking.PaidPrice || '',
      Comments: booking.Comments || '',
    });

    // Scroll to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveEdit = async () => {
    const res = await fetch('/api/edit-booking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BookingID: editBookingID,
        newCheckInDT: formData.CheckInDT,
        newCheckOutDT: formData.CheckOutDT,
        FullPrice: formData.FullPrice,
        PaidPrice: formData.PaidPrice,
        Comments: formData.Comments,
      }),
    });
    if (res.ok) {
      setIsEditing(false);
      setEditBookingID(null);
      setFormData({ CheckInDT: '', CheckOutDT: '', FirstName: '', LastName: '', Telephone: '', FullPrice: '', PaidPrice: '', Comments: '' });
      await loadBookings();
    }
  };

  const handleDelete = async (BookingID) => {
    const res = await fetch('/api/delete-booking', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ BookingID }),
    });
    if (res.ok) await loadBookings();
  };
  const handleLogin = () => {
    const envUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (usernameInput === envUsername && passwordInput === envPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect credentials');
    }
  };
  const formRef = useRef(null);

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <h1>Вход за Настройване</h1>
        <input
          type="text"
          placeholder="Потребителско Име"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Парола"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.heading}>Управление на резервации</h1>
      {/* {currentBooking && (
  <div className={styles.currentBookingBox}>
    <h2>Текуща резервация</h2>
    <p><strong>Име:</strong> {currentBooking.Customer?.FirstName}</p>
    <p><strong>Фамилия:</strong> {currentBooking.Customer?.LastName}</p>
    <p><strong>Телефон:</strong> {currentBooking.Customer?.Telephone}</p>
    <p><strong>Настаняване:</strong> {format(parseISO(currentBooking.CheckInDT), 'yyyy-MM-dd')}</p>
    <p><strong>Освобождаване:</strong> {format(parseISO(currentBooking.CheckOutDT), 'yyyy-MM-dd')}</p>
  </div>
)} */}

<div className={styles.formSection} ref={formRef}>
        <h2>{isEditing ? 'Редактирай Резервация' : 'Добави Нова Резервация'}</h2>
        <label>
          Настаняване:
          <input
            type="date"
            name="CheckInDT"
            value={formData.CheckInDT}
            onChange={handleChange}
          />
        </label>
        <label>
          Освобождаване:
          <input
            type="date"
            name="CheckOutDT"
            value={formData.CheckOutDT}
            onChange={handleChange}
          />
        </label>
        <label>
          Име:
          <input
            type="text"
            name="FirstName"
            placeholder="Име"
            value={formData.FirstName}
            onChange={handleChange}
            disabled={isEditing}
          />
        </label>
        <label>
          Фамилия:
          <input
            type="text"
            name="LastName"
            placeholder="Фамилия"
            value={formData.LastName}
            onChange={handleChange}
            disabled={isEditing}
          />
        </label>
        <label>
          Телефон:
          <input
            type="text"
            name="Telephone"
            placeholder="Телефон"
            value={formData.Telephone}
            onChange={handleChange}
            disabled={isEditing}
          />
        </label>
        <label>
          Обща Сума (€):
          <input
            type="number"
            name="FullPrice"
            value={formData.FullPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          Платено (€):
          <input
            type="number"
            name="PaidPrice"
            value={formData.PaidPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          Коментари:
          <input
            name="Comments"
            value={formData.Comments}
            onChange={handleChange}
          />
        </label>
        <button onClick={isEditing ? handleSaveEdit : handleAdd}>
          {isEditing ? 'Запази' : 'Добави'}
        </button>

        {isEditing && (
          <button onClick={handleCancelEdit} className={styles.cancelButton}>
            Отказ
          </button>
        )}
      </div>

      <div className={styles.bookingsList}>
        <h2>Бъдещи Резервации</h2>
        <table>
          <thead>
            <tr>
              <th>Име</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Настаняване</th>
              <th>Освобождаване</th>
              <th>Обща Сума</th>
              <th>Платено</th>
              <th>Коментари</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.BookingID}
                className={overlappingIDs.has(b.BookingID) ? styles.overlappingRow : ''}
              >
                <td data-label="Име" className={styles.overlappingRowData}>{b.Customer?.FirstName || ''}</td>
                <td data-label="Фамилия" className={styles.overlappingRowData}>{b.Customer?.LastName || ''}</td>
                <td data-label="Телефон" className={styles.overlappingRowData}>{b.Customer?.Telephone || ''}</td>
                <td data-label="Настаняване" className={styles.overlappingRowData}>{format(parseISO(b.CheckInDT), 'yyyy-MM-dd')}</td>
                <td data-label="Освобождаване" className={styles.overlappingRowData}>{format(parseISO(b.CheckOutDT), 'yyyy-MM-dd')}</td>
                <td data-label="Обща Сума" className={styles.overlappingRowData}>{b.FullPrice != null && b.FullPrice !== '' ? '€' + b.FullPrice : ''}</td>
                <td data-label="Платено" className={styles.overlappingRowData}>{b.PaidPrice != null && b.PaidPrice !== '' ? '€' + b.PaidPrice : ''}</td>
                <td data-label="Коментари" className={styles.overlappingRowData}>{b.Comments || ''}</td>
                <td data-label="Действия">
                  <button onClick={() => handleEdit(b)}>Редактирай</button>
                  <button onClick={() => handleDelete(b.BookingID)}>Изтрий</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Administration;
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}