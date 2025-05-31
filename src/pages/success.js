import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Meta from '@/components/Page Components/Meta'

const Success = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { checkIn, checkOut, firstName, lastName, telephone } = router.query;

  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (checkIn && checkOut && firstName && lastName && telephone) {
      const postBooking = async () => {
        try {
          const res = await fetch('/api/add-booking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              CheckInDT: checkIn,
              CheckOutDT: checkOut,
              FirstName: firstName,
              LastName: lastName,
              Telephone: telephone,
            }),
          });

          if (!res.ok) throw new Error('Failed to save booking');
          setStatus('success');
        } catch (err) {
          console.error(err);
          setStatus('error');
        }
      };

      postBooking();
    }
  }, [checkIn, checkOut, firstName, lastName, telephone]);
  const successColor = { color: '#2e7d32' }; // Green
  const errorColor = { color: '#c62828' };   // Red
  const loadingColor = { color: '#555' };    // Gray
  const containerStyle = {
    padding: '2rem',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  };

  const iconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };
  return (
<>
      <Meta title={t('metaTitle')} />
      <div style={containerStyle}>
        {status === 'success' ? (
          <>
            <div style={{ ...iconStyle, ...successColor }}>✅</div>
            <h1 style={successColor}>{t('successPage.title')}</h1>
            <p>{t('successPage.thankYou')}</p>
          </>
        ) : status === 'loading' ? (
          <>
            <div style={{ ...iconStyle, ...loadingColor }}>⏳</div>
            <p>{t('successPage.processing')}</p>
          </>
        ) : (
          <>
            <div style={{ ...iconStyle, ...errorColor }}>❌</div>
            <h1 style={errorColor}>{t('successPage.errorTitle')}</h1>
            <p>{t('successPage.errorMessage')}</p>
          </>
        )}
      </div>
    </>
  );
};

export default Success;

// i18n SSR support
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
