const scene = new THREE.Scene();

const origin = new THREE.Vector3( 0, 0, 0 );

// light
light1 = new THREE.DirectionalLight( 0xffffff );
light1.position.set( 20, 20, 20 );
light1.lookAt(origin)

light2 = new THREE.DirectionalLight( 0xffffff );
light2.position.set( -20, 20, 20 );
light2.lookAt(origin)

scene.add( light2 );

// camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 7;
camera.lookAt( origin );

// action
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const DIRECTIONS = ["posx", "negx", "posy", "negy", "posz", "negz"];
const MAX_COLOR = 16777215;

function createSphere(x, y, z, color) {
    const radius = 0.1;
    const widthSegments = 6;
    const heightSegments = 4;
    const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);

    const material = new THREE.MeshPhongMaterial( { color: color } );
    const sphere = new THREE.Mesh( geometry, material );

    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;

    return sphere;
}

class Pipe {
    constructor() {
        const MAX_DIM = 7;
        const x = Math.floor(Math.random() * MAX_DIM) - (MAX_DIM / 2)
        const y = Math.floor(Math.random() * MAX_DIM) - (MAX_DIM / 2)
        const z = Math.floor(Math.random() * MAX_DIM) - (MAX_DIM / 2)
        this.head = {x: x, y: y, z: z};
        this.direction = "posx";
        this.color = Math.floor(Math.random() * MAX_COLOR)
    }

    advance() {
        const {x, y, z} = this.head;
        const s = createSphere(x, y, z, this.color);
        scene.add( s );
        this.updateHead();
        if (renderer.info.render.frame % 120 == 0) {
            this.updateDirection();
        }
    }

    updateHead() {
        const d = 0.01;
        const {x, y, z} = this.head;

        switch (this.direction) {
            case "posx": 
                this.head = {x: x + d, y: y, z: z};
                break;
            case "negx": 
                this.head = {x: x - d, y: y, z: z};
                break;
            case "posy": 
                this.head = {x: x , y: y + d, z: z};
                break;
            case "negy": 
                this.head = {x: x , y: y - d, z: z};
                break;
            case "posz": 
                this.head = {x: x , y: y, z: z + d};
                break;
            case "negz": 
                this.head = {x: x , y: y, z: z - d};
                break;
            default:
                throw this.direction + " is not a legal direction"
        }
    }

    updateDirection() {
        let newDirection = this.direction;
    
        while (newDirection[3] === this.direction[3]) {
            const idx = Math.floor(Math.random() * DIRECTIONS.length);
            newDirection = DIRECTIONS[idx];
        }
    
        this.direction = newDirection;
    }
}

const pipes = [];

function animate() {
    requestAnimationFrame(animate);
    
    if (renderer.info.render.frame % 300 == 0) {
        pipes.push(new Pipe());
    }

    pipes.forEach(pipe => pipe.advance());

    renderer.render(scene, camera);
}

animate();
