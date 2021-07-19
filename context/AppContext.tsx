import { useRouter } from "next/dist/client/router";
import { createContext, useEffect, useState } from "react";
import { NEXT_PUBLIC_GOOGLE_MAPS_API } from "../utils/config";

const AppContext = createContext<any>({});

export const AppProvider = (props: any) => {
  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
  const [isCityPopupVisible, setIsCityPopupVisible] = useState(false);
  const [isVerifyOtpPopupVisible, setIsVerifyOtpPopupVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isHeaderSearchVisible, setIsHeaderSearchVisible] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [userData, setUserData] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    // getCurrentLocation();
    getServicesList();
  }, []);

  useEffect(() => {
    if (document.body) {
      document.body.style.overflowY =
        isLoginPopupVisible || isCityPopupVisible ? "hidden" : "auto";
    }
  }, [isLoginPopupVisible, isCityPopupVisible]);

  const getCurrentLocation = () => {
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          getAddressFromCoords(position);
        },
        (error) => {
          console.log(error);
          setCurrentLocation(null);
        }
      );
    }
  };

  const getServicesList = async () => {
    try {
      const response = await fetch(
        "https://pochieshomeservices.com/RestApi/api/category/categoryList?key=incitykey!"
      );
      const services = await response.json();
      if (services.data && services.data.length) {
        setServicesList(
          services.data.filter((service: any) => service.status == "Enable")
        );
      }
    } catch (err) {
      console.log("Services List Error", err);
    }
  };

  const getAddressFromCoords = async (position: GeolocationPosition) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${NEXT_PUBLIC_GOOGLE_MAPS_API}`
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <AppContext.Provider
      value={{
        isLoginPopupVisible,
        setIsLoginPopupVisible,
        isCityPopupVisible,
        setIsCityPopupVisible,
        selectedCity,
        setSelectedCity,
        isHeaderSearchVisible,
        setIsHeaderSearchVisible,
        servicesList,
        isVerifyOtpPopupVisible,
        setIsVerifyOtpPopupVisible,
        userData,
        setUserData,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
