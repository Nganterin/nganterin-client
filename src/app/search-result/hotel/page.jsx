"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import Link from "next/link";
import { BASE_API } from "@/utilities/environtment";
import fetchWithAuth from "@/utilities/fetchWIthAuth";
import { Card, CardBody, Button, Input, Image } from "@nextui-org/react";
import { MagnifyingGlass } from "@phosphor-icons/react";

const Page = () => {
  const searchValue = useSearchParams().get("search");
  const dateStart = useSearchParams().get("dateStart");
  const dateEnd = useSearchParams().get("dateEnd");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchValue || "");
  const [result, setResult] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(
        `${BASE_API}/hotels?search=${searchValue}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(
      `/search-result/hotel?search=${search}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    );
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-orange-100 pt-14">
          <div className="relative w-3/5 mx-auto">
            <div className="sticky top-20 z-40 w-96 mx-auto mb-8 bg-background/50 h-max shadow shadow-black/30 text-neutral-700 hover:shadow-lg hover:shadow-black/30 transition-all duration-500 rounded-2xl p-4">
              <form className="flex flex-row gap-1" onSubmit={handleSearch}>
                <Input
                  placeholder="Search"
                  variant="faded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="bg-sky-700" isIconOnly type="submit">
                  <MagnifyingGlass size={24} color="#fff" />
                </Button>
              </form>
            </div>
            {result.length != 0 && (
              <div className="grid grid-cols-2 gap-4 justify-center items-center">
                {result.map((item, index) => {
                  const image_array = item.hotel_photos;
                  const imageUrl = JSON.parse(image_array);
                  const price = parseInt(item.overnight_prices);

                  return (
                    <div
                      className="shadow shadow-black/30 hover:shadow-lg hover:shadow-black/30 transition-all duration-500 rounded-2xl"
                      key={index}
                    >
                      <Card
                        as={Link}
                        href={`/detail/hotel/${item.id}`}
                        isBlurred
                        className="border-none bg-background/50"
                        shadow="sm"
                      >
                        <CardBody>
                          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                            <div className="relative col-span-6 md:col-span-4">
                              <Image
                                alt="Hotel image"
                                className="object-cover w-64 h-36"
                                height={200}
                                shadow="md"
                                src={imageUrl[0]}
                                width={200}
                              />
                            </div>

                            <div className="flex flex-col col-span-6 md:col-span-8">
                              <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-0 w-full">
                                  <h3 className="font-semibold text-foreground/90">
                                    {item.name}
                                  </h3>
                                  <p className="text-small text-foreground/80">
                                    {item.city}, {item.state}
                                  </p>
                                  <h1 className="text-large text-right font-medium mt-2">
                                    <span className="text-sm mr-2">from</span>
                                    <span>Rp. {price.toLocaleString()}</span>
                                  </h1>
                                </div>
                                <Button
                                  isIconOnly
                                  className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                                  radius="full"
                                  variant="light"
                                ></Button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="bg-gradient-to-b from-orange-100 to-orange-50 h-40"></div>
        </div>
      )}
    </>
  );
};

export default Page;
