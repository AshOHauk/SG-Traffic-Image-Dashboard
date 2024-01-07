import Card from '../components/Card'
import { onCleanup, onMount } from "solid-js";
import { WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, DirectionalLight, AnimationMixer, Clock } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function About() {
    let divRef: HTMLDivElement;
    let gltfScene: any;
    let mixer: any; // Animation mixer for GLTF animations
    const clock: any = new Clock(); // Clock to keep track of time for animations

    const setDivRef = (el: HTMLDivElement) => {
        divRef = el;
    };

    // onMount(() => {

    //     // const loader = new GLTFLoader();
    //     var loader = new GLTFLoader();

    //     loader.load('../assets/simpleGlobe.glb', (gltf:any) => {
    //       scene.add(gltf.scene);
    //     }, undefined, function (error:any) {
    //       console.error(error);
    //     });



    //     const resize = () => {
    //         camera.aspect = divRef.clientWidth / divRef.clientHeight;
    //         camera.updateProjectionMatrix();
    //         renderer.setSize(divRef.clientWidth, divRef.clientHeight);
    //       };
    //     window.addEventListener('resize', resize);

    //     const scene = new Scene();
    //     const camera = new PerspectiveCamera(75, divRef.clientWidth / divRef.clientHeight, 0.1, 1000);
    //     const renderer = new WebGLRenderer({alpha:true});

    //     const geometry = new BoxGeometry();
    //     const material = new MeshBasicMaterial({ color: 0x00ff00 });
    //     const cube = new Mesh(geometry, material);

    //     scene.add(cube);

    //     camera.position.z = 5;

    //     const animate = function () {
    //         requestAnimationFrame(animate);

    //         cube.rotation.x += 0.01;
    //         cube.rotation.y += 0.01;

    //         renderer.render(scene, camera);
    //     };

    //     renderer.setSize(divRef.clientWidth, divRef.clientHeight);
    //     divRef.appendChild(renderer.domElement);

    //     animate();

    //     onCleanup(() => {
    //         renderer.dispose();
    //         geometry.dispose();
    //         material.dispose();
    //         window.removeEventListener('resize', resize);
    //     });
    // });
    onMount(() => {
        const scene = new Scene();
        const camera = new PerspectiveCamera(75, divRef.clientWidth / divRef.clientHeight, 0.1, 1000);
        const renderer = new WebGLRenderer({ alpha: true });
        const loader = new GLTFLoader();

        loader.load('/simpleGlobe.glb', (gltf: any) => {
            // Add the loaded GLTF scene to your Three.js scene
            gltfScene = gltf.scene;
            scene.add(gltfScene);
            // Check if the GLTF model has animations
            if (gltf.animations && gltf.animations.length) {
                mixer = new AnimationMixer(gltf.scene);
                gltf.animations.forEach((clip: any) => {
                    mixer.clipAction(clip).play(); // Play each animation clip
                });
            }
            // Add ambient light (global illumination)
            const ambientLight = new AmbientLight(0xffffff, 0.5); // soft white light
            scene.add(ambientLight);
            // Add directional light (like sunlight)
            const directionalLight = new DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 10, 5); // adjust the position as needed
            scene.add(directionalLight);

            // Optional: Adjust camera position and look at the GLTF object
            // This depends on the size and position of your object
            camera.position.set(0, 0, 2);
            camera.lookAt(gltf.scene.position);
            camera.rotateZ(Math.PI / 10);
        }, undefined, (error: any) => {
            console.error(error);
        });

        const resize = () => {
            camera.aspect = divRef.clientWidth / divRef.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(divRef.clientWidth, divRef.clientHeight);
        };
        window.addEventListener('resize', resize);

        renderer.setSize(divRef.clientWidth, divRef.clientHeight);
        divRef.appendChild(renderer.domElement);

        const animate = function () {
            requestAnimationFrame(animate);

  
            // Update the mixer on each frame
            if (mixer) {
                const delta = clock.getDelta();
                mixer.update(delta);
            }
            if (gltfScene) {
                // Apply rotation to the GLTF model's scene
                // gltfScene.rotation.x += 0.01;
                gltfScene.rotation.y += 0.005;
            }

            renderer.render(scene, camera);
        };

        animate();

        onCleanup(() => {
            renderer.dispose();
            window.removeEventListener('resize', resize);
        });
    });



    return (
        <div>
            <div ref={setDivRef} class="w-full h-[1000px]" />
            <div class="grid grid-cols-3 gap-10 my-4">
                <Card rounded={true} flat={false}>
                    <h2> Ninja Tee, Black</h2>
                    <button class="btn">View</button>
                    <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Ab ullam harum velit porro autem odio</p>
                </Card>

            </div>
        </div>

    )
}