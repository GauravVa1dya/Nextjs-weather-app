// components/Navbar.js
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun, faCity, faMap, faCog, faUmbrella } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

const Navbar = () => {
  return (
    <nav className="align-items-center p-2">
      <FontAwesomeIcon icon={faUmbrella} className="me-2" />
      <Link href="/" legacyBehavior>
        <a className="align-items-center navbar-link">
          <FontAwesomeIcon icon={faCloudSun} className="me-2 navbarIcon" />
          <span className="iconname"><br></br>Weather</span>
        </a>
      </Link>
      <Link href="/cities" legacyBehavior>
        <a className="align-items-center navbar-link">
          <FontAwesomeIcon icon={faCity} className="me-2 navbarIcon" />
          <span className="iconname"><br></br>Cities</span>
        </a>
      </Link>
      <Link href="/map" legacyBehavior>
        <a className="align-items-center navbar-link">
          <FontAwesomeIcon icon={faMap} className="me-2 navbarIcon" />
          <span className="iconname"><br></br>Map</span>
        </a>
      </Link>
      <Link href="/settings" legacyBehavior>
        <a className="align-items-center navbar-link">
          <FontAwesomeIcon icon={faCog} className="me-2 navbarIcon" />
          <span className="iconname"><br></br>Settings</span>
        </a>
      </Link>
    </nav>
  );
};

export default Navbar;
