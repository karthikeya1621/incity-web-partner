import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "reactfire";
import firebase from "firebase";
import AppContext from "./AppContext";
import { useRouter } from "next/dist/client/router";
import { authResponseText } from "../utils/config";

const AuthContext = createContext<any>({});

export const AuthProvider = (props: any) => {
  const auth = useAuth();
  const router = useRouter();
  const { setIsLoginPopupVisible, setIsVerifyOtpPopupVisible, setUserData } =
    useContext(AppContext);
  const { data: user } = useUser();
  const [authMode, setAuthMode] = useState(null);
  const [recaptchaVerfied, setRecaptchaVerified] = useState(false);
  const [otpConfirmResult, setOtpConfirmResult] =
    useState<firebase.auth.ConfirmationResult | null>(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const { user } = await auth.signInWithPopup(provider);
      setIsLoginPopupVisible(false);
    } catch (err) {
      console.log("Google Login Error", err);
    }
  };

  const loginWithOtp = async (mobileNumber: string) => {
    try {
      (document.getElementById("otp-signin") as any).innerHTML = "";
      console.log("OTP Request", mobileNumber);
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "otp-signin",
        {
          size: "invisible",
          callback: (response: any) => {
            setRecaptchaVerified(true);
          },
        }
      );
      const result = await auth.signInWithPhoneNumber(
        mobileNumber,
        recaptchaVerifier
      );
      setOtpConfirmResult(result);
    } catch (err) {
      console.log("OTP Login Error", err);
    }
  };

  const confirmOtpCode = async (otpCode: string) => {
    try {
      if (otpConfirmResult) {
        const { user } = await otpConfirmResult.confirm(otpCode);
        if (user) {
          setOtpConfirmResult(null);
          setIsLoginPopupVisible(false);
          setIsVerifyOtpPopupVisible(false);
        }
      }
    } catch (err) {
      console.log("OTP Confirm Error", err);
      setOtpConfirmResult(null);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (err) {
      console.log("Sign out Error", err);
    }
  };

  const verifyUser = async (
    email: string,
    mobileNo: string,
    service?: any,
    name?: string
  ) => {
    try {
      const response = await fetch(
        `https://pochieshomeservices.com/RestApi/api/provider/checkProvider`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, mobile: mobileNo }),
        }
      );
      const result = await response.json();
      console.log(result);

      if (result.message == authResponseText.provider_exists && result.data) {
        setUserData(result.data[0]);
      } else {
        setUserData(null);
      }

      if (result.message) {
        return result.message;
      } else {
        return null;
      }
    } catch (err) {
      console.log("Verfiy user Error", err);
      return null;
    }
  };

  const addUser = async (
    email: string,
    mobile: string,
    service?: any,
    name?: string
  ) => {
    try {
      const response = await fetch(
        "https://pochieshomeservices.com/RestApi/api/provider/insertProvider",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            mobile,
            services: service.value,
            name,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      if (result.message) {
        if (result.message == authResponseText.registered_success) {
          setAuthMode(null);
        }
      }
    } catch (err) {
      console.log("Provider Add Error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        recaptchaVerfied,
        loginWithGoogle,
        loginWithOtp,
        confirmOtpCode,
        otpConfirmResult,
        logout,
        addUser,
        verifyUser,
        authMode,
        setAuthMode,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
