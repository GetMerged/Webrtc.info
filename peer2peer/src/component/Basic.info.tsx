import React, { useEffect, useRef, useState } from 'react'
import "./css/Basic.info.css"

const BasicInfo: React.FC = () => {
    const [stream,setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoTrack,setVideoTrack] = useState<MediaStreamTrack | null>(null);

    const startVideo = async (): Promise<void> => {
       try {
        const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true,
        })
        setStream(mediaStream);
        if (videoRef.current){
            videoRef.current.srcObject = mediaStream;
        }
        const tracks = mediaStream.getTracks();
        const videoTrack = tracks.find((track) => track.kind === 'video');
        if (videoTrack){
            setVideoTrack(videoTrack);
            console.log('Video Track Details:', {
                kind: videoTrack.kind,
                id: videoTrack.id,
                label: videoTrack.label,
                enabled: videoTrack.enabled,
                muted: videoTrack.muted,
                readyState: videoTrack.readyState,
              });

              const mockStats = {
                deliveredFrames: 1463,
                totalFrames: 1463,
              };
              console.log('Mock vide stats:', mockStats);
        }
       } catch (error) {
        console.log("Error while stream video",error);
       }
    }

    const stopVideo = (): void =>{
        if (stream){
            stream.getTracks().forEach((track: MediaStreamTrack) => track.stop);
            setStream(null);
            if(videoRef.current){
                videoRef.current.srcObject = null;
            }
        }
    };

    const toggleVideo = (): void => {
        if(videoTrack){
            videoTrack.enabled = !videoTrack.enabled;
            console.log("video track enabled", videoTrack.enabled);
        }
    }

    const listDevices = async (): Promise<void> => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            console.log("Availabe devices", devices);
        } catch (error) {
            console.error('Error listing devices:', error);
        }
    }

    useEffect(() => {
     listDevices();
    },[]);

  return (
    <div className='container'>
        <h1>Basic Video with Track Details</h1>
      <video ref={videoRef} autoPlay muted className="video" />
      <div className="controls">
        <button onClick={startVideo} disabled={!!stream}>
          Start Video
        </button>
        <button onClick={stopVideo} disabled={!stream}>
          Stop Video
        </button>
        <button onClick={toggleVideo} disabled={!videoTrack}>
          {videoTrack?.enabled ? 'Disable Video' : 'Enable Video'}
        </button>
      </div>
      {videoTrack && (
        <div className="track-info">
          <h3>Video Track Info:</h3>
          <p>Kind: {videoTrack.kind}</p>
          <p>ID: {videoTrack.id}</p>
          <p>Label: {videoTrack.label}</p>
          <p>Enabled: {videoTrack.enabled ? 'Yes' : 'No'}</p>
          <p>Muted: {videoTrack.muted ? 'Yes' : 'No'}</p>
          <p>Ready State: {videoTrack.readyState}</p>
        </div>
      )}
    </div>
  );
};

export default BasicInfo
