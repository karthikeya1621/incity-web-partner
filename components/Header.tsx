import Link from "next/link";
import React, { useContext } from "react";
import { useRouter } from "next/dist/client/router";
import PopupOverlay from "./PopupOverlay";
import LoginPopup from "./LoginPopup";
import VerifyOtpPopup from "./VerifyOtpPopup";
import CitySelectionPopup from "./CitySelectionPopup";
import AppContext from "../context/AppContext";
import AuthContext from "../context/AuthContext";
import Image from "next/image";

function Header() {
  const router = useRouter();
  const {
    isLoginPopupVisible,
    setIsLoginPopupVisible,
    isVerifyOtpPopupVisible,
    setIsVerifyOtpPopupVisible,
    selectedCity,
    isHeaderSearchVisible,
  } = useContext(AppContext);
  const { user, logout } = useContext(AuthContext);

  const handleLoginButton = () => {
    setIsLoginPopupVisible(true);
  };

  return (
    <>
      <div className="header">
        <div className="w-full max-w-screen-xl grid grid-cols-12 gap-1 h-full mx-auto">
          <div className="col-span-4 h-full flex items-center">
            <Link href="/">
              <div className="logo">
                <Image
                  alt=""
                  width={150}
                  height={65}
                  src="/images/logo-small.png"
                  objectFit="contain"
                />{" "}
                <span>Partner</span>
              </div>
            </Link>
          </div>
          <div className="col-span-3 h-full flex items-center justify-center">
            {/* <div className="searchbox">
              <div
                className="citylocation"
                onClick={() => setIsCityPopupVisible(true)}
              >
                <span className="mdi mdi-map-marker-outline"></span>
                <h6>{selectedCity || "Select your city"}</h6>
              </div>
              {((router.route == "/" && isHeaderSearchVisible) ||
                router.route != "/") && (
                <div className="searchbar">
                  <input type="text" placeholder="Search a service" />
                  <span className="mdi mdi-magnify"></span>
                </div>
              )}
            </div> */}
          </div>
          <div className="col-span-5 h-full flex items-center justify-end">
            <div className="navmenu">
              {/* <div className="menuitem">
                <span>Services</span>
                <div className="submenu"></div>
              </div>
              <div className="menuitem">
                <span>Partner</span>
              </div> */}
              {!user && (
                <div className="actionitem login">
                  <button onClick={handleLoginButton} className="button-one">
                    Login
                  </button>
                </div>
              )}
              {user && (
                <>
                  <div className="actionitem cart">
                    <span className="mdi mdi-cart-outline"></span>
                  </div>
                  <div className="actionitem profile">
                    <span className="mdi mdi-account-circle-outline"></span>{" "}
                    Account
                    <div className="dropdown">
                      <ul>
                        <li className="font-semibold text-sm cursor-default my-3">
                          {user.displayName || user.phoneNumber}
                        </li>
                        <li className="border-b border-gray-300 my-3"></li>
                        <li>Bookings</li>
                        <li>Profile</li>
                        <li className="text-red-500" onClick={logout}>
                          Logout
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="headerplaceholder"></div>
      {/* <PopupOverlay
        visible={isCityPopupVisible}
        onClose={() => {
          setIsCityPopupVisible(false);
        }}
        enableClose={selectedCity != null}
      >
        <CitySelectionPopup />
      </PopupOverlay> */}
      <PopupOverlay
        visible={isLoginPopupVisible}
        onClose={() => {
          setIsLoginPopupVisible(false);
        }}
      >
        <LoginPopup />
      </PopupOverlay>

      <PopupOverlay
        visible={isVerifyOtpPopupVisible}
        onClose={() => {
          setIsVerifyOtpPopupVisible(false);
        }}
        enableClose={false}
      >
        <VerifyOtpPopup />
      </PopupOverlay>
    </>
  );
}

export default Header;
