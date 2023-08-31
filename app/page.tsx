"use client"

import { useRef, useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import clsx from "clsx";
import axios from "axios";
import { YoutubeParser } from "./utils/YtParser";
import Image from "next/image";
import Download from "./components/Download";


export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);


  const [firstUrl, setFirstUrl] = useState<string | null>(null)
  const [firstUrlQuality, setFirstUrlQuality] = useState<string | null>(null)
  const [firstUrlDefinition, setFirstUrlDefinition] = useState<string | null>(null)

  const [secondUrl, setSecondUrl] = useState<string | null>(null)
  const [secondUrlQuality, setSecondUrlQuality] = useState<string | null>(null)
  const [secondUrlDefinition, setSecondUrlDefinition] = useState<string | null>(null)

  const [thirdUrl, setThirdUrl] = useState<string | null>(null)
  const [thirdUrlQuality, setThirdUrlQuality] = useState<string | null>(null)
  const [thirdUrlDefinition, setThirdUrlDefinition] = useState<string | null>(null)

  const [fourthUrl, setFourthUrl] = useState<string | null>(null)
  const [fourthUrlQuality, setFourthUrlQuality] = useState<string | null>(null)
  const [fourthUrlDefinition, setFourthUrlDefinition] = useState<string | null>(null)

  const [urlResult, setUrlResult] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // State for thumbnail URL
  const [videoTitle, setVideoTitle] = useState<string | null>(null); // State

  // updates the input value everytime the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // What happens when the user presses on search button
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputUrlRef.current !== null) {
      const youtubeId = YoutubeParser(inputUrlRef.current.value)
      console.log(youtubeId);
      setLoading(true);

      // Code to connect to rapid api
      const options = {
        method: 'GET',
        url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
        headers: {
          'X-RapidAPI-Key': '6497078ea8mshfd1b258df6bd89fp16b9d4jsnd7e9317bcf12',
          'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        },
        params: {
          id: youtubeId
        }
      }

      // What to do after connected to api
      axios(options)
      .then(response => {
        const formatsArray = response.data.adaptiveFormats;
        console.log('the length of the array:' + formatsArray.length)
        const videotitle = response.data.title;
        const thumbnail = response.data.thumbnail[3].url;

        setVideoTitle(videotitle)
        setThumbnailUrl(thumbnail)
        setUrlResult(formatsArray)

        if (formatsArray.length >= 1) {
            
          const first_url = formatsArray[0].url
          let first_url_quality = formatsArray[0].height
          let first_url_definition = "SD"

          
          if (first_url_quality === 2160) {
            first_url_quality = "4" + 'K';
            first_url_definition = "UHD"
          } else if (first_url_quality === 1440) {
            first_url_quality = "2" + 'K';
            first_url_definition = "UHD"
          } else if (first_url_quality <= 1080) {
            first_url_quality = `${first_url_quality}P`;
            first_url_definition = "HD"
          } else if (first_url_quality <= 480) {
            first_url_quality = `${first_url_quality}P`;
            first_url_definition = "SD"
          } else {
            first_url_quality = "Unknown"
            first_url_definition = "?"
          }

          setFirstUrl(first_url);
          setFirstUrlQuality(first_url_quality);
          setFirstUrlDefinition(first_url_definition);

        } 
        
        let secondFormatIndex = -1;

        for (let i = 1; i < formatsArray.length; i++) {
          if (formatsArray[i].height !== formatsArray[0].height) {
            secondFormatIndex = i;
            break;
          }
        }

        if (secondFormatIndex !== -1) {
          const second_url = formatsArray[secondFormatIndex].url;
          let second_url_quality = formatsArray[secondFormatIndex].height;
          let second_url_definition = "SD";


          
          if (second_url_quality === 2160) {
            second_url_quality = "4" + 'K';
            second_url_definition = "UHD"
          } else if (second_url_quality === 1440) {
            second_url_quality = "2" + 'K';
            second_url_definition = "UHD"
          } else if (second_url_quality <= 1080) {
            second_url_quality = `${second_url_quality}P`;
            second_url_definition = "HD"
          } else if (second_url_quality <= 480) {
            second_url_quality = `${second_url_quality}P`;
            second_url_definition = "SD"
          } else {
            second_url_quality = "Unknown"
            second_url_definition = "?"
          }

          setSecondUrl(second_url);
          setSecondUrlQuality(second_url_quality);
          setSecondUrlDefinition(second_url_definition);
        }})
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false); // Reset loading after the API call completes
      })
      inputUrlRef.current.value = "";
    }
  };


  const placeholderImageUrl = "/placeholder"
  return (
    <main className="flex flex-col justify-center items-center w-full h-screen text-center gap-4 p-8">
      <h1 className="text-5xl font-semibold">
        Stoic<span className="text-blue-400">Converter</span>
      </h1>
      <section className="sm:w-[50rem] gap-4 flex flex-col">
        <p className="text-xl">
          Transform YouTube videos into MP4 in just a few clicks
        </p>

        <form onSubmit={handleSubmit} className="gap-3 flex">
          <Input
            ref={inputUrlRef}
            type="text"
            placeholder="Enter the link of the desired audio"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button
            className={clsx("!w-36", {
              "text-gray-500 hover:ring-0 hover:bg-transparent hover:border-[--border] hover:ring-offset-0": inputValue === "",
            })}
            type="submit"
            disabled={inputValue === ""}
          >
            {inputValue === "" ? "Empty" : "Search"}
          </Button>
        </form>

            
        {isLoading ? (
          <p>Loading...</p>
        ) : urlResult ? (
          <>
            <div className="md:items-start md:justify-start md:flex-row flex flex-col gap-4 items-center justify-center">
              <div className="md:w-[32rem] flex flex-col gap-3 w-80">
                <Image
                  alt="Video Thumbnail"
                  src={thumbnailUrl || placeholderImageUrl} // Use placeholder if thumbnail is not available
                  width={640}
                  height={480}
                  className="w-[32rem] h-[24rem]"
                />
                <h1 className="md:text-2xl font-semibold text-lgflex items-center justify-center">{videoTitle}</h1>
              </div>
              
              <div className="flex flex-col gap-4 w-72 p-4">

              {firstUrl ? (
                <Download downloadUrl={firstUrl} quality={firstUrlQuality} definition={firstUrlDefinition} />
              ) : null}

              {secondUrl ? (
                <Download downloadUrl={secondUrl} quality={secondUrlQuality} definition={secondUrlDefinition} />
              ) : null}

              </div>
            </div>
          </>
        ) : null}


      </section>
    </main>
  );
}
