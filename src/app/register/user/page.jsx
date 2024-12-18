"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Redirecting from "../../redirecting";
import { BASE_API } from "@/utilities/environtment";
import fetchWithAuth from "@/utilities/fetchWIthAuth";
import Cookies from "js-cookie";

import AOS from "aos";
import "aos/dist/aos.css";

import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { CompassRose } from "@phosphor-icons/react";
import { Bounce, toast } from "react-toastify";

const Page = () => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [inputData, setInputData] = useState({
    gender: "",
    number: "",
    country: "",
    province: "",
    city: "",
    zip_code: "",
    complete_address: "",
  });

  const [isAnyFieldEmpty, setIsAnyFieldEmpty] = useState(false);
  useEffect(() => {
    const checkIfAnyFieldIsEmpty = () => {
      for (let key in inputData) {
        if (inputData[key] === null || inputData[key] === "") {
          return true;
        }
      }
      return false;
    };

    setIsAnyFieldEmpty(checkIfAnyFieldIsEmpty());
  }, [inputData]);

  const user_token = Cookies.get("user_token");

  if (!user_token) {
    push("/");
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    console.log({ inputData });
    console.log({ user_token });
    e.preventDefault();
    try {
      const formData1 = new FormData();
      formData1.append("country", inputData.country);
      formData1.append("province", inputData.province);
      formData1.append("city", inputData.city);
      formData1.append("zip_code", inputData.zip_code);
      formData1.append("complete_address", inputData.complete_address);

      const response = await fetchWithAuth(`${BASE_API}/profile/address`, {
        method: "POST",
        body: formData1,
      });

      const formData2 = new FormData();
      formData2.append("gender", inputData.gender);
      formData2.append("phone_number", inputData.number);

      const response2 = await fetchWithAuth(`${BASE_API}/profile/user-detail`, {
        method: "POST",
        body: formData2,
      });

      if (response && response2) {
        setIsRedirecting(true);
        console.log("send data success", await response.json());
        console.log("send data success", await response2.json());
        location.replace("/");
      } else {
        toast.success("Send register data failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log({ inputData });
  }, [inputData]);

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <>
      <div className="text-neutral-700 pt-12">
        <div className="w-3/5 mx-auto" data-aos="fade-up">
          <div className="flex flex-row gap-4 items-center justify-center">
            <h1 className="text-4xl font-semibold">You're almost done</h1>
            <CompassRose size={64} className="rotating-item" />
          </div>
          <div className="mt-20 p-8 bg-white rounded-lg shadow-lg shadow-neutral-600/50">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              <div className="flex flex-row gap-4">
                <Select
                  required
                  color="default"
                  variant="bordered"
                  label="Select your gender"
                  classNames={{
                    innerWrapper: ["text-neutral-700"],
                  }}
                  value={inputData.gender}
                  onChange={(event) =>
                    setInputData((prevData) => ({
                      ...prevData,
                      gender: event.target.value,
                    }))
                  }
                >
                  <SelectItem
                    className="text-neutral-700"
                    value="male"
                    key="male"
                  >
                    Male
                  </SelectItem>
                  <SelectItem
                    className="text-neutral-700"
                    value="female"
                    key="female"
                  >
                    Female
                  </SelectItem>
                </Select>
                <Input
                  required
                  name="number"
                  value={inputData.number}
                  variant="bordered"
                  type="text"
                  label="Phone number"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row gap-4">
                <Input
                  required
                  name="province"
                  value={inputData.province}
                  variant="bordered"
                  type="text"
                  label="Province"
                  onChange={handleInputChange}
                />
                <Input
                  required
                  name="city"
                  value={inputData.city}
                  variant="bordered"
                  type="text"
                  label="City"
                  onChange={handleInputChange}
                />
                <Input
                  required
                  name="zip_code"
                  value={inputData.zip_code}
                  variant="bordered"
                  type="number"
                  label="Zip Code"
                  onChange={handleInputChange}
                />
                <Input
                  required
                  name="country"
                  value={inputData.country}
                  variant="bordered"
                  type="text"
                  label="Country"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row gap-4">
                <Textarea
                  required
                  name="complete_address"
                  value={inputData.complete_address}
                  variant="bordered"
                  type="text"
                  label="Complete Address"
                  disableAutosize
                  classNames={{
                    input: "resize-y min-h-[40px]",
                  }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={isAnyFieldEmpty}
                  type="submit"
                  className="bg-sky-600 text-white"
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isRedirecting && <Redirecting />}
    </>
  );
};

export default Page;
