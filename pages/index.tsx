import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import AppContext from "../context/AppContext";
import AuthContext from "../context/AuthContext";
import styles from "../styles/Home.module.scss";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { authResponseText } from "../utils/config";

export default function Home() {
  const { ref, inView } = useInView();
  const { verifyUser, loginWithOtp, authMode, setAuthMode, user, addUser } =
    useContext(AuthContext);
  const [verifyStatus, setVerifyStatus] = useState<any>(null);
  const { setIsHeaderSearchVisible, servicesList, setIsVerifyOtpPopupVisible } =
    useContext(AppContext);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    getValues,
    control,
    setValue,
  } = useForm({
    mode: "onBlur",
  });
  const [mobileNo, setMobileNo] = useState("");

  useEffect(() => {
    if (user) {
      console.log(user);
      if (authMode == "register") {
        addUser(
          getValues("registerForm.email"),
          mobileNo.slice(2),
          getValues("registerForm.service"),
          getValues("registerForm.name")
        );
      }
    }
  }, [user]);

  useEffect(() => {
    setIsHeaderSearchVisible(!inView);
  }, [inView]);

  const onSubmit = async () => {
    setAuthMode("register");
    const verifyRes = await verifyUser(
      getValues("registerForm.email"),
      mobileNo.slice(2),
      getValues("registerForm.service"),
      getValues("registerForm.name")
    );
    setVerifyStatus(verifyRes);

    if (verifyRes == authResponseText.provider_not_exists) {
      await loginWithOtp(mobileNo.slice(2));
      setIsVerifyOtpPopupVisible(true);
    } else if (verifyRes == authResponseText.provider_exists) {
    }
  };

  return (
    <div id="main">
      <Head>
        <title>Partner | InCity</title>
        <meta name="description" content="Services at your doorstep." />
      </Head>
      {!user && (
        <div ref={ref} className={styles.herobanner}>
          <div className="grid grid-cols-12 gap-4 mx-auto max-w-screen-xl px-4">
            <div className="col-span-8 relative">
              <div className={styles.img}>
                <Image
                  layout="fill"
                  objectFit="cover"
                  alt=""
                  src="/images/hero-banner.png"
                />
              </div>

              <div className={styles.herotext}>
                <div>
                  <h1>We believe in service.</h1>
                  <p>
                    We are passionate group of people who believe in providing
                    quality on demand services. Our service providers are a part
                    of our family, their respect and dignity is our priority.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <form
                className={styles.registerform}
                onSubmit={handleSubmit(onSubmit)}
              >
                <h2>Join as a Partner</h2>

                <div className={styles.formgroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-input"
                    {...register("registerForm.name", {
                      required: "Name is required",
                    })}
                  />
                  {errors.registerForm?.name && (
                    <div className={styles.errors}>
                      <span className="mdi mdi-alert-circle-outline"></span>{" "}
                      {errors.registerForm?.name.message}
                    </div>
                  )}
                </div>

                <div className={styles.formgroup}>
                  <label>Services</label>
                  <Controller
                    name="registerForm.service"
                    control={control}
                    rules={{ required: "Service is required" }}
                    render={(field) => (
                      <Select
                        id="service-select"
                        instanceId="service-select"
                        isSearchable={true}
                        options={servicesList.map((service: any) => ({
                          label: service.category,
                          value: service.id,
                        }))}
                        onChange={(value) => {
                          setValue("registerForm.service", value, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    )}
                  />
                  {errors.registerForm?.service && (
                    <div className={styles.errors}>
                      <span className="mdi mdi-alert-circle-outline"></span>{" "}
                      {errors.registerForm?.service.message}
                    </div>
                  )}
                </div>

                <div className={styles.formgroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-input"
                    {...register("registerForm.email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                        message: "Invalid Email",
                      },
                    })}
                    onChange={() => {
                      if (verifyStatus) {
                        setVerifyStatus(null);
                      }
                    }}
                  />
                  {errors.registerForm?.email && (
                    <div className={styles.errors}>
                      <span className="mdi mdi-alert-circle-outline"></span>{" "}
                      {errors.registerForm?.email.message}
                    </div>
                  )}
                </div>

                <div className={styles.formgroup}>
                  <label>Mobile</label>
                  <PhoneInput
                    inputClass={styles.phoneinput}
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
                </div>

                <div className={styles.buttongroup}>
                  <button
                    type="submit"
                    disabled={mobileNo.length < 12 || !isValid}
                    className="button-one"
                  >
                    Register
                  </button>
                </div>
                {verifyStatus == authResponseText.provider_exists && (
                  <div className={styles.errormsg}>
                    <span className="mdi mdi-alert-circle-outline"></span>{" "}
                    Partner with the above email / mobile already exists.
                  </div>
                )}
                {verifyStatus ==
                  authResponseText.user_with_email_mobile_exists && (
                  <div className={styles.errormsg}>
                    <span className="mdi mdi-alert-circle-outline"></span> The
                    above email / mobile is registered as Customer.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: "1000px" }}></div>
    </div>
  );
}
