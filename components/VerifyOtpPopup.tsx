import React, { useState, useContext } from "react";
import OtpInput from "react-otp-input";
import styles from "../styles/VerifyOtpPopup.module.scss";
import AuthContext from "../context/AuthContext";

const VerifyOtpPopup = () => {
  const { confirmOtpCode } = useContext(AuthContext);
  const [otpCode, setOtpCode] = useState("");

  return (
    <div className={styles.verifyotppopup}>
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
          onClick={async () => {
            await confirmOtpCode(`${otpCode}`);
            setOtpCode("");
          }}
          className="verifyotp button-one mt-8 w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPopup;
