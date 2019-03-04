
class Core {

    constructor(gui = true, controls = true){

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000)
        this.camera.position.set(7, 4, 2)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById('canvasWrapper').appendChild(this.renderer.domElement)

        this.scene = new THREE.Scene()

        this.origin = new THREE.Mesh(
            new THREE.BoxBufferGeometry(.1, .1, .1),
            new THREE.MeshBasicMaterial({color: 'red'})
        )
        this.origin.visible = false
        this.scene.add(this.origin)

        if(controls === true) this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

        // public variables
        this.renderChild = function(){}
        // Methods 
        this.bindEvents()
    }

    addScript(src, callback){

        console.log(typeof src)
        if(typeof src == 'string'){
            console.log('BBBB')
            let newTag = document.createElement('script')
            newTag.addEventListener('load', function(){
                console.log(src + ' has been loaded')
                callback()
            })
            newTag.src = src
            document.body.insertBefore(
                newTag, 
                document.getElementsByTagName('script')[0]
            )
        }
        else if(Array.isArray(src)){

            let arrayVerif = Array(src.length).fill(false)

            src.forEach(function(item, idx){

                let newTag = document.createElement('script')
                newTag.addEventListener('load', function(){
                    arrayVerif[idx] = true
                    if(arrayVerif.every(function(x){
                        return x === true
                    })){
                        callback();
                    }
    
                })
                newTag.src = item
                document.body.insertBefore(
                    newTag, 
                    document.getElementsByTagName('script')[0]
                )
            })

        }


    }

    add(el){
        this.scene.add(el)
        return this
    }

    render(){
        requestAnimationFrame(this.render.bind(this))
        this.camera.lookAt(this.origin.position)
        this.renderChild.call(this)
        this.renderer.render(this.scene, this.camera)
    }

    bindEvents(){

        window.addEventListener('resize', () => {

            let aspect = window.innerWidth / window.innerHeight,
                dpr = this.renderer.getPixelRatio()

            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);


        })

    }
}