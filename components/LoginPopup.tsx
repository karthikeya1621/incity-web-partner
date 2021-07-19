import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/LoginPopup.module.scss";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import "react-phone-input-2/lib/style.css";
import AuthContext from "../context/AuthContext";
import AppContext from "../context/AppContext";
import { authResponseText } from "../utils/config";

const LoginPopup = () => {
  const emailPattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<any>(null);
  const {
    loginWithOtp,
    otpConfirmResult,
    confirmOtpCode,
    setAuthMode,
    verifyUser,
  } = useContext(AuthContext);
  const { userData, setUserData } = useContext(AppContext);

  useEffect(() => {
    if (!otpConfirmResult) {
      setOtpCode("");
    }
  }, [otpConfirmResult]);

  const handleLoginSubmit = async () => {
    setAuthMode("login");
    setUserData(null);
    const verifyRes = await verifyUser(email, mobileNo.slice(2));
    setVerifyStatus(verifyRes);

    if (verifyRes == authResponseText.provider_exists) {
      let mobile = `+${mobileNo}`;
      if (userData && userData.mobile) {
        mobile = `+91${userData.mobile}`;
      }
      await loginWithOtp(mobile);
    }
  };

  return (
    <div className={styles.loginpopup}>
      <div className="w-full flex flex-col items-center justify-between">
        {/* <button className={styles.googlesignin} onClick={loginWithGoogle}>
          <span className={styles.img}>
            <Image
              objectFit="contain"
              width={20}
              height={20}
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt=""
            />
          </span>{" "}
          Login with Google
        </button> */}
        <div id="otp-signin" style={{ display: "none" }}></div>
        {!otpConfirmResult && (
          <>
            <div className={styles.emailform}>
              <h3>Login with email</h3>
              <input
                placeholder="ex: john.doe@example.com"
                type="email"
                className="form-input"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (verifyStatus) {
                    setVerifyStatus(null);
                  }
                }}
              />
              {!emailPattern.test(email) && (
                <div className={styles.errormsg}>
                  <span className="mdi mdi-alert-circle-outline"></span> Email
                  is invalid.
                </div>
              )}
              {verifyStatus == authResponseText.provider_not_exists && (
                <div className={styles.errormsg}>
                  <span className="mdi mdi-alert-circle-outline"></span>
                  Partner with the above email / mobile does not exist.
                </div>
              )}
            </div>
            <div className={styles.divider}></div>
            <div className={styles.otpform}>
              <h3>Login with mobile</h3>
              <PhoneInput
                country={"in"}
                onlyCountries={["in"]}
                disableDropdown={true}
                countryCodeEditable={false}
                value={mobileNo}
                onChange={(phone) => {
                  setMobileNo(phone);
                  if (verifyStatus) {
                    setVerifyStatus(null);
                  }
                }}
              />
              <small>You will receive an OTP to this number.</small>
              <button
                disabled={mobileNo.length < 12 && !emailPattern.test(email)}
                onClick={handleLoginSubmit}
                className="sendotp button-one mt-8 w-full"
              >
                Login
              </button>
              {verifyStatus ==
                authResponseText.user_with_email_mobile_exists && (
                <div className={styles.errormsg}>
                  <span className="mdi mdi-alert-circle-outline"></span>
                  The above email / mobile is registered as Customer.
                </div>
              )}
            </div>
          </>
        )}

        {otpConfirmResult && (
          <>
            <div className={styles.otpform}>
              <h3>Enter your OTP</h3>
              <OtpInput
                value={otpCode}
                numInputs={6}
                separator={<span>-</span>}
                onChange={(otp: string) => {
                  setOtpCode(otp);
                }}
              />
              <button
                disabled={otpCode.length < 6}
                onClick={() => {
                  confirmOtpCode(`${otpCode}`);
                }}
                className="verifyotp button-one mt-8 w-full"
              >
                Verify &amp; Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
