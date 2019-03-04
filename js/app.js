
console.log('Coded by Keny ZACHELIN\n\nhttp://kenyzachelin.fr\n\n')
var video = document.getElementById('video')
var btn = document.getElementById('play')

var pixels = null

var listener,
    sound,
    audioContext,
    analyser

var pixelsArray = []

function start(stream = null){

    // console.log('has start', stream)

    btn.style['display'] = 'none'
    document.getElementById('makesure').style['display'] = 'none'
    video.play()

    pixels = {  
        space: .5,
        xGrid: 16 * 1,
        yGrid: 9 * 1,
        varyingHeight: 10
    };
    pixels.size = {
        x: (video.videoWidth / pixels.xGrid) * .1,
        y: (video.videoHeight / pixels.yGrid) * .1
    };
    pixels.space = pixels.size.x * .3
    // pixels.space = pixels.varyingHeight * 2
    listener = new THREE.AudioListener()
    core.camera.add(listener)

    let audioContext = THREE.AudioContext

    sound = new THREE.Audio(listener)

    if(stream){
        let source = listener.context.createMediaStreamSource(stream)
        sound.setNodeSource(source)
        
    } else {
        sound.setMediaElementSource(video)
    }


    sound.setVolume(1)

    let nearest = Utils.nearestPow2(pixels.xGrid * pixels.yGrid)
    nearest = Math.min(nearest, Math.pow(2, 5))
    analyser = new THREE.AudioAnalyser(sound, nearest)


    init()


}




var core = new Core()
let light1 = new THREE.AmbientLight('#fff', .7)
core.add(light1)


let light2 = new THREE.DirectionalLight('#fff', 1)
core.add(light2)

function init(){

    
    core.camera.position.set(15, 13, 15)
core.camera.position.multiplyScalar(5)


    let texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    let offScreen = new THREE.MeshBasicMaterial({color: '#333', side: THREE.FrontSide, wireframe: true })
    let inScreen = new THREE.MeshPhongMaterial({
        color: '#fff', 
        side: THREE.FrontSide, 
        map: texture,
        // emissive: new THREE.Color('yellow'),
        // emissiveIntensity: .1
    })
    let commonMaterial = [
        offScreen,
        offScreen,
        offScreen,
        offScreen,
        inScreen,
        offScreen,
    ]
    // commonMaterial = inScreen


    for(let x = 0; x < pixels.xGrid; x++){
        for(let y = 0; y < pixels.yGrid; y++){

            let geo = new THREE.BoxBufferGeometry(pixels.size.x, pixels.size.y, pixels.size.x)
            Utils.change_uvs( geo, 1 / pixels.xGrid, 1 / pixels.yGrid, x, y );

            let pixel = new THREE.Mesh(
                geo,
                commonMaterial
            )

            pixel.userData.rotationDir = [
                Math.random(),
                Math.random(),
                Math.random(),
            ]

            pixel.position.set(
                x * (pixels.size.x + pixels.space),
                y * (pixels.size.y + pixels.space),
                0
            )
            core.add(pixel)

            pixelsArray.push(pixel)
        }
    }

    
    let randomIndex = Utils.allIndexTill(pixelsArray.length)
    randomIndex = Utils.shuffle(randomIndex)
    
    core.renderChild = function(){

        let time = Date.now() * .001

        let data = analyser.getFrequencyData()
        let average = analyser.getAverageFrequency() / 255
        data = Utils.averageIncreaseTo(data, pixels.xGrid * pixels.yGrid)

        inScreen.color = new THREE.Color().setHSL(.66, 0, Math.min(1, average + .05))


        if(pixels){
            core.camera.lookAt(new THREE.Vector3(
                (pixels.size.x + pixels.space) * pixels.xGrid * .5, 
                (pixels.size.y + pixels.space) * pixels.yGrid * .5,
                0, 
            ))
            
            // pixelsArray.map(function(item, i){
                
             
            //     let scaler = (data[i] || 0) / 255
            //     let modifier = scaler * pixels.varyingHeight
            //     item.scale.z = 1 + modifier

            // })

            for(let d = 0; d < randomIndex.length; d++){
                let scaler = (data[d] || 0) / 255
                scaler = Math.max(0, scaler - average)
                let modifier = scaler * pixels.varyingHeight
                
                pixelsArray[randomIndex[d]].scale.setZ(1 + average * pixels.varyingHeight * .7)
                pixelsArray[randomIndex[d]].scale.z += (1 + modifier)
                
                pixelsArray[randomIndex[d]].position.setZ(modifier)
            }

        }
    }

    core.render()
}




function getWebCam(){
    navigator.mediaDevices.getUserMedia({video:true, audio: true})
    .then(function (stream) {
        // console.log('access')

        video.srcObject = stream

        // console.log('can play')
        btn.addEventListener('click', function(){
            start(stream)
        })
    })
    .catch(function (error) {
        // console.log('deny', error)
        video.src = './instru1.mp4'

        video.addEventListener('canplay', function(){
            console.log('can play')
            btn.addEventListener('click', function(){
                start()
            })
        }, false);
        

       
    })

}







getWebCam()
