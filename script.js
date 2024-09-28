
const input = document.querySelector('input');
const audioElem = document.querySelector('audio');
const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
input.addEventListener('change',()=>{
    const file=input.files[0]
    if(!file){
        return ;
    }
    const url=URL.createObjectURL(file)
    // for any media elements if we want to createurl which comes from binary data ex:blob we use url.createObjectUrl method
    audioElem.src=url
    audioElem.play()
    // audiocontext will be created for analysing audios
    // three main parts will be there source,analyser,destination.
    // analyser:where we can analyse audio (we can draw audio waves in form of graph)
    // destination :it means where audio will reach in pc it will be computer speakers.
    const audioctx=new AudioContext()
    const audiosrc=audioctx.createMediaElementSource(audioElem)
    const analyser=audioctx.createAnalyser()
    audiosrc.connect(analyser)
    analyser.connect(audioctx.destination)
    // fftsize is number od audio samples we gonna analyse fftSize will be 2powern mostly 512,1045
    analyser.fftSize=512
    const bufferDatalength=analyser.frequencyBinCount
    // analyser.frequencyBinCount give halfway of fftsize because it  in fftsize  it is symmetric
    const bufferDataArr=new Uint8Array(bufferDatalength)
    // uni8Array is storage for bufferDatalength it stores in byte starting from 0 to 256
    let barWidth=canvas.width/bufferDatalength
    let barHeight;
    function draw(){
        let x=0
        analyser.getByteFrequencyData(bufferDataArr)
        // how much every sound bar has gone in vertical it will determined by getByteFrequencyData(param)
        context.clearRect(0,0,canvas.width,canvas.height)
        bufferDataArr.forEach((val)=>{
         barHeight=val
         context.fillStyle='red'
         context.fillRect(x,canvas.height-barHeight,barWidth,barHeight)
         x+=barWidth
        })
        if(!audioElem.ended)requestAnimationFrame(draw)
        // we are calling requestAnimationFrame recursvely everytime frequency changes it will called.
        // we are using requestAnimationFrame to perfom intense heavy tasks in animation
    }
    draw()
})
function pauseAudio(){
    audioElem.pause()
}


