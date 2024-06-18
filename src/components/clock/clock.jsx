//CLOCK.JSX FILE
import React, { useEffect, useState } from "react";
import styles from "./clock.module.css";

function Clock() {
  const [ntpTime, setNtpTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTime = () => {
      fetch('http://127.0.0.1:8000/api/get-ntp-time/')
        .then(response => response.json())
        .then(data => {
          if (data.ntp_time) {
            setNtpTime(data.ntp_time);
          } else {
            setError(data.error);
            console.error('Failed to fetch NTP time:', data.error);
          }
        })
        .catch(error => {
          setError('Error fetching time');
          console.error('Error fetching time:', error);
        });
    };

    fetchTime(); // Fetch time initially

    // Fetch time every second
    const interval = setInterval(fetchTime, 1000);

    return () => clearInterval(interval); // Cleanup function to clear interval
  }, []);

  const formatTime = timestamp => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const options = {
      timeZone: 'Asia/Kolkata', // Set time zone to IST
      hour12: false, // Use 24-hour format
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleString('en-IN', options);
  };

  return (
    <div className={styles.currentTime}>
      {error ? (
        <p>Error: {error}</p>
      ) : ntpTime ? (
        <p>IST: {formatTime(ntpTime)}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Clock;
