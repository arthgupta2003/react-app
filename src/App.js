import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';
import "video.js/dist/video-js.css";
import { useVideoJS } from "react-hook-videojs";
import Timestamps from './timestamps';

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState('');
  const [message, setMessage] = useState('Click Start to trimming');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const { Video, player, ready } = useVideoJS(
    { sources: [{ src: videoSrc ,type:'video/mp4'}] }
  );
  const VideoJSPlayer = Video

  const handleDownloadVideo = async () => {
    try {
      const videoUrl = trimmedVideoSrc;
      const videoRequest = new Request(videoUrl);
      fetch(videoRequest)
        .then(() => {
          const link = document.createElement('a');
          link.href = videoUrl;
          link.setAttribute('download', 'waterfall.mp4');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const createMP4 = async (inputURL) => {
    setMessage('Loading ffmpeg-core.js');
    if (!ffmpeg.isLoaded()){
        await ffmpeg.load();
    }
    console.log("1");
    console.log(inputURL);
    ffmpeg.FS('writeFile', 'input.webm', await fetchFile(inputURL));
    await ffmpeg.run('-i', 'input.webm' , 'output.mp4');
    console.log("3");
    const data = ffmpeg.FS('readFile', 'output.mp4');
    console.log("4");
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4'})));
    console.log("5");
    setMessage('Created MP4');
  }
  
  const doTrim = async () => {
    setMessage('Loading ffmpeg-core.js');
    if (!ffmpeg.isLoaded()){
      await ffmpeg.load();
    }
    console.log("1");
    ffmpeg.FS('writeFile', 'manifest.mp4', await fetchFile(videoSrc));
    console.log(startTime);
    await ffmpeg.run('-ss', startTime , '-to', endTime, '-i', 'manifest.mp4', '-c', 'copy', 'output.mp4');
    console.log("3");
    const data = ffmpeg.FS('readFile', 'output.mp4');
    console.log("4");
    setTrimmedVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4'})));
    console.log("5");
    setMessage('Completed trimming');
  };
  
  return (
    <div className="App">
      <p/>
      <p>Status: {message}</p>
      <h1 > Enter URL of .webm asset: </h1>
      <label>
        <input
          onChange={e => createMP4(e.target.value)}
        />
      </label>
      <div className='video-player'>
      <VideoJSPlayer controls autoPlay/> 
      </div>
      
      <Timestamps
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />
      <label>
      <button onClick={() => doTrim()}>Trim</button>
      <button onClick={() => handleDownloadVideo()}>Download Trimmed Video</button>
      </label>
      <h1>Trimmed Video Preview:</h1>
      <video width= '400' className='video-player' controls autoplay src= {trimmedVideoSrc}></video>
    </div>
  );
}

export default App;
