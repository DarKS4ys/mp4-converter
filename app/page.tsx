"use client"

import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import clsx from "clsx";
import axios from "axios";
import { YoutubeParser } from "./utils/YtParser";
import Image from "next/image";
import Download from "./components/Download";
import {SiTiktok } from 'react-icons/si'
import {FiExternalLink} from 'react-icons/fi'
import SocialLink from "./components/SocialLink";
import Link from "next/link";

interface AdaptiveFormat {
  url: string;
  audioQuality: string;
}


export default function Home() {
  const inputUrlRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [firstUrl, setFirstUrl] = useState<string | null>(null);
  const [firstUrlQuality, setFirstUrlQuality] = useState<string | null>(null);
  const [firstUrlDefinition, setFirstUrlDefinition] = useState<string | null>(null);
  const [firstUrlAudio, setFirstUrlAudio] = useState(false)

  const [secondUrl, setSecondUrl] = useState<string | null>(null);
  const [secondUrlQuality, setSecondUrlQuality] = useState<string | null>(null);
  const [secondUrlDefinition, setSecondUrlDefinition] = useState<string | null>(null);
  const [secondUrlAudio, setSecondUrlAudio] = useState(false)

  const [thirdUrl, setThirdUrl] = useState<string | null>(null);
  const [thirdUrlQuality, setThirdUrlQuality] = useState<string | null>(null);
  const [thirdUrlDefinition, setThirdUrlDefinition] = useState<string | null>(null);
  const [thirdUrlAudio, setThirdUrlAudio] = useState(false)

  const [fourthUrl, setFourthUrl] = useState<string | null>(null);
  const [fourthUrlQuality, setFourthUrlQuality] = useState<string | null>(null);
  const [fourthUrlDefinition, setFourthUrlDefinition] = useState<string | null>(null);
  const [fourthUrlAudio, setFourthUrlAudio] = useState(false)

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioQuality, setAudioQuality] = useState<string | null>(null);
  const [audioDefinition, setAudioDefinition] = useState<string | null>(null);

  const [urlResult, setUrlResult] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null); // State for thumbnail URL
  const [videoTitle, setVideoTitle] = useState<string | null>(null); // State

  // updates the input value everytime the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const RumbleIcon = 'RumbleIcon.svg'
  const YTMusicIcon = 'YtMusicIcon.svg'

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
          'X-RapidAPI-Key': '1f949f44e4msh3ac01ff09360032p1c79a0jsn7be4c4e83316',
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
        const otherFormatsArray = response.data.formats;

        console.log('the length of the array:' + formatsArray.length)
        console.log("the length of the other array: " + otherFormatsArray.length)

        const videotitle = response.data.title;
        const thumbnail = response.data.thumbnail[ 3 | 2 | 1 | 0].url;

        setVideoTitle(videotitle)
        setThumbnailUrl(thumbnail)

        if (formatsArray.length >= 1 && formatsArray[0].height >= 1080 || formatsArray[0].height < 600 ) {
          setFirstUrlAudio(false)
          const first_url = response.data.adaptiveFormats[0].url
          let first_url_quality = formatsArray[0].height
          let first_url_definition = "SD"
          setUrlResult(formatsArray)

          console.log(first_url_quality)

          if (first_url_quality === 2160) {
            first_url_quality = "4" + 'K';
            first_url_definition = "UHD"
          } else if (first_url_quality === 1440) {
            first_url_quality = "2" + 'K';
            first_url_definition = "UHD"
          } else if (first_url_quality > 700) {
            first_url_quality = `${first_url_quality}P`;
            first_url_definition = "HD"
          } else if (first_url_quality < 500) {
            first_url_quality = first_url_quality + 'P';
            first_url_definition = "SD"
          } else {
            first_url_quality = "Unknown"
            first_url_definition = "?"
          }

          setFirstUrl(first_url);
          setFirstUrlQuality(first_url_quality);
          setFirstUrlDefinition(first_url_definition);

        } else if (formatsArray[0].height < 1080 )  {
          setFirstUrlAudio(true)
          if (response.data.formats[2].url !== null){
            const first_url = response.data.formats[2].url
            setFirstUrl(first_url);

            const first_url_quality = response.data.formats[2].height
            setFirstUrlQuality(first_url_quality + "P");

    
            console.log("firstUrlQuality:", first_url_quality);
          } else if (response.data.formats[1].url !== null) {
            const first_url = response.data.formats[1].url
            setFirstUrl(first_url);

            const first_url_quality = response.data.formats[1].height
            setFirstUrlQuality(first_url_quality + "P");
          } else if (response.data.formats[0].url !== null) {
            const first_url = response.data.formats[0].url
            setFirstUrl(first_url);

            const first_url_quality = response.data.formats[0].height
            setFirstUrlQuality(first_url_quality + "P");
          } else {
            const first_url = null;
            setFirstUrl(first_url);

            const first_url_quality = null
            setFirstUrlQuality(first_url_quality + "P");
          }

          let first_url_quality = otherFormatsArray[1|0].height
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
          } else if (first_url_quality < 720) {
            first_url_quality = `${first_url_quality}P`;
            first_url_definition = "SD"
          } else {
            first_url_quality = "Unknown"
            first_url_definition = "?"
          }

          setUrlResult(otherFormatsArray)
          setFirstUrlDefinition(first_url_definition);
        }

        
        let secondFormatIndex = -1;

        for (let i = 1; i < formatsArray.length; i++) {
          if (formatsArray[i].height !== formatsArray[0].height) {
            secondFormatIndex = i;
            break;
          }
        }
        
        if (secondFormatIndex !== -1 && formatsArray[0].height > 1080 || formatsArray[0].height < 600) {
          setSecondUrlAudio(false)
          let second_url_quality = formatsArray[secondFormatIndex].height;
            const second_url = formatsArray[secondFormatIndex].url;
            let second_url_definition = "SD";
  
            if (second_url_quality === 2160) {
              second_url_quality = "4" + 'K';
              second_url_definition = "UHD"
            } else if (second_url_quality === 1440) {
              second_url_quality = "2" + 'K';
              second_url_definition = "UHD"
            } else if (second_url_quality === 1080 || second_url_quality > 544) {
              second_url_quality = `${second_url_quality}P`;
              second_url_definition = "HD"
            } else if (second_url_quality < 720) {
              second_url_quality = `${second_url_quality}P`;
              second_url_definition = "SD"
            } else {
              second_url_quality = "Unknown"
              second_url_definition = "?"
            }
  
            setSecondUrl(second_url);
            setSecondUrlQuality(second_url_quality);
            setSecondUrlDefinition(second_url_definition);
          
        } else if (formatsArray[0].height === 1080) {
          setSecondUrlAudio(true)
          if (response.data.formats[2].url !== null){
            const second_url = response.data.formats[2].url
            setSecondUrl(second_url);
  
            const second_url_quality = response.data.formats[2].height
            setSecondUrlQuality(second_url_quality + "P");

            console.log("secondUrlQuality:", second_url_quality);
          } else if (response.data.formats[1].url !== null) {
            const second_url = response.data.formats[1].url
            setSecondUrl(second_url);
  
            const second_url_quality = response.data.formats[1].height
            setSecondUrlQuality(second_url_quality + "P");
          } else if (response.data.formats[0].url !== null) {
            const second_url = response.data.formats[0].url
            setSecondUrl(second_url);
  
            const second_url_quality = response.data.formats[0].height
            setSecondUrlQuality(second_url_quality + "P");
          } else {
            const second_url = null;
            setSecondUrl(second_url);
  
            const second_url_quality = null
            setSecondUrlQuality(second_url_quality + "P");
          }
  
          let second_url_quality = otherFormatsArray[1|0].height
          let second_url_definition = "SD"
  
          if (second_url_quality === 2160) {
            second_url_quality = "4" + 'K';
            second_url_definition = "UHD"
          } else if (second_url_quality === 1440) {
            second_url_quality = "2" + 'K';
            second_url_definition = "UHD"
          } else if (second_url_quality <= 1080) {
            second_url_quality = `${second_url_quality}P`;
            second_url_definition = "HD"
          } else if (second_url_quality < 720) {
            second_url_quality = `${second_url_quality}P`;
            second_url_definition = "SD"
          } else {
            second_url_quality = "Unknown"
            second_url_definition = "?"
          }
  
          setUrlResult(otherFormatsArray)
          setSecondUrlDefinition(second_url_definition);
        }

        // Find the third format with a different quality than the second one
        let thirdFormatIndex = -1;

        for (let i = secondFormatIndex + 1; i < formatsArray.length; i++) {
          if (formatsArray[i].height !== formatsArray[secondFormatIndex].height) {
            thirdFormatIndex = i;
            break;
          }
        }

        if (thirdFormatIndex !== -1 && formatsArray[0].height > 1500 || formatsArray[0].height < 1200) {
          setThirdUrlAudio(false)
          const third_url = formatsArray[thirdFormatIndex].url;
          let third_url_quality = formatsArray[thirdFormatIndex].height;
          let third_url_definition = "SD";

          if (third_url_quality === 2160) {
            third_url_quality = "4" + 'K';
            third_url_definition = "UHD"
          } else if (third_url_quality === 1440) {
            third_url_quality = "2" + 'K';
            third_url_definition = "UHD"
          } else if (third_url_quality === 1080 || third_url_quality > 544) {
            third_url_quality = `${third_url_quality}P`;
            third_url_definition = "HD"
          } else if (third_url_quality < 720) {
            third_url_quality = `${third_url_quality}P`;
            third_url_definition = "SD"
          } else {
            third_url_quality = "Unknown"
            third_url_definition = "?"
          }

          setThirdUrl(third_url);
          setThirdUrlQuality(third_url_quality);
          setThirdUrlDefinition(third_url_definition);
        } else {
          setThirdUrlAudio(true)
          if (response.data.formats[2].url !== null){
            const third_url = response.data.formats[2].url
            setThirdUrl(third_url);
  
            const third_url_quality = response.data.formats[2].height
            setThirdUrlQuality(third_url_quality + "P");
            console.log("thirdUrlQuality:", third_url_quality);
          } else if (response.data.formats[1].url !== null) {
            const third_url = response.data.formats[1].url
            setThirdUrl(third_url);
  
            const third_url_quality = response.data.formats[1].height
            setThirdUrlQuality(third_url_quality + "P");
          } else if (response.data.formats[0].url !== null) {
            const third_url = response.data.formats[0].url
            setThirdUrl(third_url);
  
            const third_url_quality = response.data.formats[0].height
            setThirdUrlQuality(third_url_quality + "P");
          } else {
            const third_url = null;
            setThirdUrl(third_url);
  
            const third_url_quality = null
            setThirdUrlQuality(third_url_quality + "P");
          }
  
          let third_url_quality = otherFormatsArray[1|0].height
          let third_url_definition = "SD"
  
          if (third_url_quality === 2160) {
            third_url_quality = "4" + 'K';
            third_url_definition = "UHD"
          } else if (third_url_quality === 1440) {
            third_url_quality = "2" + 'K';
            third_url_definition = "UHD"
          } else if (third_url_quality <= 1080) {
            third_url_quality = `${third_url_quality}P`;
            third_url_definition = "HD"
          } else if (third_url_quality < 720) {
            third_url_quality = `${third_url_quality}P`;
            third_url_definition = "SD"
          } else {
            third_url_quality = "Unknown"
            third_url_definition = "?"
          }
  
          setUrlResult(otherFormatsArray)
          setThirdUrlDefinition(third_url_definition);
        
        }

        
      // Find the fourth format with a different quality than the third one
      let fourthFormatIndex = -1;

      for (let i = thirdFormatIndex + 1; i < formatsArray.length; i++) {
        if (formatsArray[i].height !== formatsArray[thirdFormatIndex].height) {
          fourthFormatIndex = i;
          break;
        }
      }

      if (fourthFormatIndex !== -1 && formatsArray[fourthFormatIndex].height >= 1080 ||  formatsArray[0].height <= 1080 || formatsArray[0].height === 1440 ) {
        setFourthUrlAudio(false)
        const fourth_url = formatsArray[fourthFormatIndex].url;
        let fourth_url_quality = formatsArray[fourthFormatIndex].height;
        let fourth_url_definition = "SD";

        console.log(formatsArray[fourthFormatIndex].height)

        if (fourth_url_quality === 2160) {
          fourth_url_quality = "4" + 'K';
          fourth_url_definition = "UHD"
        } else if (fourth_url_quality === 1440) {
          fourth_url_quality = "2" + 'K';
          fourth_url_definition = "UHD"
        } else if (fourth_url_quality === 1080 || fourth_url_quality > 544) {
          fourth_url_quality = `${fourth_url_quality}P`;
          fourth_url_definition = "HD"
        } else if (fourth_url_quality < 720) {
          fourth_url_quality = `${fourth_url_quality}P`;
          fourth_url_definition = "SD"
        } else {
          fourth_url_quality = "Unknown"
          fourth_url_definition = "?"
        }

        setFourthUrl(fourth_url);
        setFourthUrlQuality(fourth_url_quality);
        setFourthUrlDefinition(fourth_url_definition);
      } else if (formatsArray[fourthFormatIndex].height < 1080 ) {
        setFourthUrlAudio(true)
        if (response.data.formats[2].url !== null){
          const fourth_url = response.data.formats[2].url
          setFourthUrl(fourth_url);

          const fourth_url_quality = response.data.formats[2].height
          setFourthUrlQuality(fourth_url_quality + "P");
          console.log("fourthUrlQuality:", fourth_url_quality);
        } else if (response.data.formats[1].url !== null) {
          const fourth_url = response.data.formats[1].url
          setFourthUrl(fourth_url);

          const fourth_url_quality = response.data.formats[1].height
          setFourthUrlQuality(fourth_url_quality + "P");
        } else if (response.data.formats[0].url !== null) {
          const fourth_url = response.data.formats[0].url
          setFourthUrl(fourth_url);

          const fourth_url_quality = response.data.formats[0].height
          setFourthUrlQuality(fourth_url_quality + "P");

        } else {
          const fourth_url = null;
          setFourthUrl(fourth_url);

          const fourth_url_quality = null
          setFourthUrlQuality(fourth_url_quality + "P");

        }

        let fourth_url_quality = otherFormatsArray[1|0].height
        let fourth_url_definition = "SD"

        if (fourth_url_quality === 2160) {
          fourth_url_quality = "4" + 'K';
          fourth_url_definition = "UHD"
        } else if (fourth_url_quality === 1440) {
          fourth_url_quality = "2" + 'K';
          fourth_url_definition = "UHD"
        } else if (fourth_url_quality <= 1080) {
          fourth_url_quality = `${fourth_url_quality}P`;
          fourth_url_definition = "HD"
        } else if (fourth_url_quality < 720) {
          fourth_url_quality = `${fourth_url_quality}P`;
          fourth_url_definition = "SD"
        } else {
          fourth_url_quality = "Unknown"
          fourth_url_definition = "?"
        }

        setUrlResult(otherFormatsArray)
        setFourthUrlDefinition(fourth_url_definition);
      }

      const audioQualityToFind = "AUDIO_QUALITY_MEDIUM";

      const audioFormat: AdaptiveFormat | undefined = formatsArray.find(
        (format: AdaptiveFormat) => format.audioQuality === audioQualityToFind
      );
      

      if (audioFormat) {
        const audio_url = audioFormat.url;
        const audio_quality = audioFormat.audioQuality;
        const audio_definition = "Audio";

        setAudioUrl(audio_url);
        setAudioQuality(audio_quality);
        setAudioDefinition(audio_definition);
      }
      
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      })
      inputUrlRef.current.value = "";
    }
  };

  const placeholderImageUrl = "/placeholder.jpg";
  return (
    <main className="flex flex-col justify-center items-center w-full sm:h-screen h-full text-center gap-4 p-8">
      <h1 className="text-5xl font-semibold text-red-600">
        Youtube <span className="text-white">Converter</span>
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
              "cursor-not-allowed hover:bg-transparent text-[--border] hover:ring-offset-0 hover:ring-0": inputValue === "",
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
              <div className="group md:w-[32rem] flex flex-col gap-3 w-80">
              <Link target="_blank" href={inputValue || "cantfindvideo"}>
                  <div className="relative group">
                    <Image
                      alt="Video Thumbnail"
                      src={thumbnailUrl || placeholderImageUrl}
                      width={640}
                      height={480}
                      className="w-[32rem] h-[24rem] transition-opacity duration-300"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                      <FiExternalLink className="h-10 w-10 group-hover:text-white transition group-hover:opacity-100 opacity-0" />
                    </div>
                  </div>
                </Link>
                <h1 className="md:text-2xl font-semibold text-lgflex items-center justify-center">{videoTitle}</h1>
              </div>
              
              <div className="flex flex-col gap-4 w-72 p-2 py-8">
                {firstUrl ? (
                  <Download hasAudio={firstUrlAudio} downloadUrl={firstUrl} quality={firstUrlQuality} definition={firstUrlDefinition} />
                ) : null}

                {secondUrl ? (
                  <Download hasAudio={secondUrlAudio} downloadUrl={secondUrl} quality={secondUrlQuality} definition={secondUrlDefinition} />
                ) : null}

                {thirdUrl ? (
                  <Download hasAudio={thirdUrlAudio} downloadUrl={thirdUrl} quality={thirdUrlQuality} definition={thirdUrlDefinition} />
                ) : null}

                {fourthUrl ? (
                  <Download hasAudio={fourthUrlAudio} downloadUrl={fourthUrl} quality={fourthUrlQuality} definition={fourthUrlDefinition} />
                ) : null}

                {audioUrl ? (
                  <Download downloadUrl={audioUrl} quality="Audio" definition="M4A" />
                ) : null}
              </div>
            </div>
          </>
        ) : null}

          <hr className="border-[--border]"/>
        
        <div className="flex justify-center items-center gap-4">
          <SocialLink link="/tiktok" icon={SiTiktok}/>
          <SocialLink link="/rumble">
            <Image  width={36} height={36} src={RumbleIcon} alt="Rumble Icon"/>
          </SocialLink>
          <SocialLink link="/ytmp3">
          <Image width={48} height={48} src={YTMusicIcon} alt="Youtube Music Icon"/>
          </SocialLink>
        </div>
      </section>
    </main>
  );
}