import React, { useState } from 'react';
import axios from 'axios';
import styles from './RightSideBar.module.css';

const servers = {
  csir: ['time.nplindia.org', 'time.nplindia.in', '14.139.60.103', '14.139.60.106', '14.139.60.107'],
  nic: ['samay1.nic.in', 'samay2.nic.in'],
  doca: ['157.20.67.8']
};

const RightSidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [packetDetails, setPacketDetails] = useState(null);

  const toggleDropdown = () => {
    if (dropdownOpen) {
      // If the dropdown is already open, close both the dropdown and packet details
      setDropdownOpen(false);
      setPacketDetails(null);
    } else {
      // Otherwise, just toggle the dropdown open state
      setDropdownOpen(true);
    }
  };

  const fetchPacketDetails = async (server) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/search/',
        { search_input: server },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setPacketDetails(response.data);
    } catch (error) {
      console.error('Error fetching packet details:', error.response ? error.response.data : error);
      setPacketDetails({ error: 'Failed to fetch packet details' });
    }
  };

  return (
    <div>
      <button className={styles.toggleButton} onClick={toggleDropdown}>
        {dropdownOpen ? '✖' : '⋮'} {/* Three-dot button or close button */}
        {!dropdownOpen && <span className={styles.toolTip}>Want to know more about packet-details? Click Here</span>}
      </button>
      <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.show : ''}`}>
        <div className={styles.tab} onClick={() => fetchPacketDetails(servers.csir[0])}>
          CSIR_NPL SERVERS
        </div>
        <div className={styles.tab} onClick={() => fetchPacketDetails(servers.nic[0])}>
          NIC SERVERS
        </div>
        <div className={styles.tab} onClick={() => fetchPacketDetails(servers.doca[0])}>
          DOCA SERVERS
        </div>
      </div>
      {packetDetails && (
        <div className={`${styles.packetDetails} ${dropdownOpen ? styles.show : ''}`}>
          {Object.entries(packetDetails).map(([key, value]) => (
            <div key={key} className={styles.packetDetail}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
