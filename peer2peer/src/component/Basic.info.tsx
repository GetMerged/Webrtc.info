import React, { useRef, useState } from 'react'
import "./css/Basic.info.css"

const BasicInfo: React.FC = () => {
    const [stream,setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const startVideo = async (): Promise<void> => {
       try {
        const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })
        setStream(mediaStream);
        if (videoRef.current){
            videoRef.current.srcObject = mediaStream;
        }

        console.log(mediaStream.getTracks());
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

  return (
    <div className='container'>
        <h1>Basic Video</h1>
        <video ref={videoRef} autoPlay muted className='video' />
        <div className="controls">
            <button onClick={startVideo} disabled={!!stream}>
                start video
            </button>
            <button onClick={stopVideo} disabled={!stream}>
                stop video
            </button>
        </div>
      
    </div>
  )
}

export default BasicInfo
