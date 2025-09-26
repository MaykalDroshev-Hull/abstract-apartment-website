import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
  const [isLoading, setIsLoading] = useState(false);
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
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  useEffect(() => {
    checkAuthentication();
    loadBookings();
  }, []);
  const [showAll, setShowAll] = useState(false);

  const checkAuthentication = async () => {
    try {
      const res = await fetch('/api/auth/verify');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

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
  const requiredFields = [
    'CheckInDT',
    'CheckOutDT',
    'FirstName',
    'LastName',
    'Telephone',
    'FullPrice',
    'PaidPrice',
  ];

  const computeErrors = () => {
    const newErrors = {};
    for (const field of requiredFields) {
      const value = formData[field];
      const isEmpty = value === undefined || value === null || String(value).trim() === '';
      if (isEmpty) newErrors[field] = 'задължително';
    }
    return newErrors;
  };

  useEffect(() => {
    setErrors(computeErrors());
  }, [formData.CheckInDT, formData.CheckOutDT, formData.FirstName, formData.LastName, formData.Telephone, formData.FullPrice, formData.PaidPrice]);
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
    setErrors({});
    setShowErrors(false);
  };

  const handleAdd = async () => {
    const currentErrors = computeErrors();
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setShowErrors(true);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/add-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await loadBookings();
        setFormData({ CheckInDT: '', CheckOutDT: '', FirstName: '', LastName: '', Telephone: '', FullPrice: '', PaidPrice: '', Comments: '' });
        toast.success('Добавено успешно', { position: 'top-center', style: { background: '#16a34a' } });
        setErrors({});
        setShowErrors(false);
      }
    } finally {
      setIsLoading(false);
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
    // Show errors immediately if required fields in the loaded booking are missing
    setShowErrors(true);
  };

  const handleSaveEdit = async () => {
    const currentErrors = computeErrors();
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setShowErrors(true);
      return;
    }
    setIsLoading(true);
    try {
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
        toast.success('Редактирано успешно', { position: 'top-center', style: { background: '#16a34a' } });
        setErrors({});
        setShowErrors(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (BookingID) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/delete-booking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BookingID }),
      });
      if (res.ok) {
        await loadBookings();
        toast.success('Изтрито успешно', { position: 'top-center', style: { background: '#16a34a' } });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsAuthenticated(true);
        setUsernameInput('');
        setPasswordInput('');
        toast.success('Вход успешен', { position: 'top-center', style: { background: '#16a34a' } });
      } else {
        toast.error(data.error || 'Грешен вход', { position: 'top-center', style: { background: '#dc2626' } });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Грешка при вход', { position: 'top-center', style: { background: '#dc2626' } });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      toast.success('Изход успешен', { position: 'top-center', style: { background: '#16a34a' } });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const formRef = useRef(null);

  if (isCheckingAuth) {
    return (
      <div className={styles.loginContainer}>
        <h1>Проверка на достъп...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <h1>Вход за Настройване</h1>
        <input
          type="text"
          placeholder="Потребителско Име"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <input
          type="password"
          placeholder="Парола"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <button onClick={handleLogin}>Вход</button>
      </div>
    );
  }
const filteredBookings = showAll
  ? bookings
  : bookings.filter(b => isAfter(parseISO(b.CheckOutDT), new Date()));

  return (
    <div className={styles.adminPage}>
      {isLoading && (
        <div className={styles.loadingOverlay} role="status" aria-live="polite" aria-busy="true">
          <span className={styles.loader}></span>
        </div>
      )}
      <div className={styles.headerSection}>
        <h1 className={styles.heading}>Управление на резервации</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Изход
        </button>
      </div>
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
          Настаняване<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="date"
            name="CheckInDT"
            value={formData.CheckInDT}
            onChange={handleChange}
            className={`${showErrors && errors.CheckInDT ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.CheckInDT && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Освобождаване<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="date"
            name="CheckOutDT"
            value={formData.CheckOutDT}
            onChange={handleChange}
            className={`${showErrors && errors.CheckOutDT ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.CheckOutDT && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Име<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="text"
            name="FirstName"
            placeholder="Име"
            value={formData.FirstName}
            onChange={handleChange}
            disabled={isEditing}
            className={`${showErrors && errors.FirstName ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.FirstName && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Фамилия<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="text"
            name="LastName"
            placeholder="Фамилия"
            value={formData.LastName}
            onChange={handleChange}
            disabled={isEditing}
            className={`${showErrors && errors.LastName ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.LastName && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Телефон<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="text"
            name="Telephone"
            placeholder="Телефон"
            value={formData.Telephone}
            onChange={handleChange}
            disabled={isEditing}
            className={`${showErrors && errors.Telephone ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.Telephone && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Обща Сума (€)<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="number"
            name="FullPrice"
            value={formData.FullPrice}
            onChange={handleChange}
            className={`${showErrors && errors.FullPrice ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.FullPrice && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Платено (€)<span className={styles.requiredAsterisk}>*</span>:
          <input
            type="number"
            name="PaidPrice"
            value={formData.PaidPrice}
            onChange={handleChange}
            className={`${showErrors && errors.PaidPrice ? styles.invalidInput : ''}`}
          />
          {showErrors && errors.PaidPrice && (
            <div className={styles.errorText}>задължително</div>
          )}
        </label>
        <label>
          Коментари:
          <input
            name="Comments"
            value={formData.Comments}
            onChange={handleChange}
          />
        </label>
        <button onClick={isEditing ? handleSaveEdit : handleAdd} disabled={isLoading || (isEditing && Object.keys(errors).length > 0)}>
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
                <button onClick={() => setShowAll(!showAll)}>
  {showAll ? 'Покажи само бъдещи резервации' : 'Покажи всички резервации'}
</button><br></br><br></br>
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
            {
            filteredBookings.map((b) => (
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