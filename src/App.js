import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';
import ShakaPlayer from 'shaka-player-react';
import 'shaka-player/dist/controls.css';
import VideoPlayer from './videoplayer';
import Timestamps from './timestamps';

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click Start to trimming');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const ffmpeg = createFFmpeg({
    log: true,
  });

  const createMP4 = async (inputURL) => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    console.log("1");
    ffmpeg.FS('writeFile', 'manifest.m3u8', await fetchFile(inputURL));
    await ffmpeg.run('-i', 'manifest.m3u8' , '-bsf:a', 'aac_adtstoasc', '-vcodec', 'copy', '-c', 'copy','-crf','50', 'output.mp4');
    console.log("3");
    const data = ffmpeg.FS('readFile', 'output.mp4');
    console.log("4");
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4'})));
    console.log("5");
    setMessage('Completed trimming');
  }
  
  const doTrim = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    console.log("1");
    ffmpeg.FS('writeFile', 'manifest.mp4', await fetchFile(videoSrc));
    console.log(startTime);
    await ffmpeg.run('-ss', startTime , '-to', endTime, '-i', 'manifest.mp4', '-c', 'copy', 'output.mp4');
    console.log("3");
    const data = ffmpeg.FS('readFile', 'output.mp4');
    console.log("4");
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4'})));
    console.log("5");
    setMessage('Completed trimming');
  };
  
  return (
    <div className="App">
      <p/>
      <h1 > Enter URL of MPEG-DASH or HLS media asset: </h1>
      <label>
        <input
          onChange={e => createMP4(e.target.value)}
        />
      </label>
      {/* <video controls autoPlay src= {videoSrc}> </video> */}
      {/* <VideoPlayer source  = {videoSrc} key={videoSrc}/> */}
      <ShakaPlayer autoPlay src={videoSrc} />;
      <Timestamps
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />
      <button onClick={() => doTrim()}>Trim</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
