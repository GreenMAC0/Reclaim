import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function EnergyModel({ cutaway, stage, heat }: { cutaway: boolean; stage: number; heat: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const options = useRef({ cutaway, stage, heat });
  options.current = { cutaway, stage, heat };
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setFailed(true); return; }
    const element = host.current;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0xecefe8);
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "3D digester, gas treatment, generator and community center. Drag to rotate; use the zoom buttons below.");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(9, 7, 11);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0); controls.enablePan = false; controls.enableDamping = true;
    controls.minDistance = 8; controls.maxDistance = 21; controls.maxPolarAngle = Math.PI / 2.1;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x57655d, 3));
    const sun = new THREE.DirectionalLight(0xffffff, 4); sun.position.set(-4, 8, 5); scene.add(sun);
    const material = (color: number, metalness = 0) => new THREE.MeshStandardMaterial({color, metalness, roughness: .45});
    const steel = material(0xa9b8b9, .65), dark = material(0x334c48), green = material(0x71936a), amber = material(0xeac069), orange = material(0xc97747), blue = material(0x65a8ca);
    const add = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => { const mesh = new THREE.Mesh(g,m); mesh.position.set(x,y,z); scene.add(mesh); return mesh; };
    const box = (w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number) => add(new THREE.BoxGeometry(w,h,d),m,x,y,z);
    const cylinder = (r:number,h:number,m:THREE.Material,x:number,y:number,z:number) => add(new THREE.CylinderGeometry(r,r,h,40),m,x,y,z);
    box(9,.18,5,material(0xd9ded4),0,-.1,0);
    const grid = new THREE.GridHelper(9,18,0xbfcbbd,0xd2dacd); grid.position.y=.005; scene.add(grid);
    // Conceptual equipment layout: feed -> reactor -> gas treatment -> CHP.
    cylinder(1.12,.18,steel,-2, .2,0);
    const shell = cylinder(1.06,2.5,steel,-2,1.5,0);
    const lid = add(new THREE.SphereGeometry(1.06,40,20,0,Math.PI*2,0,Math.PI/2),steel,-2,2.75,0); lid.scale.y=.48;
    cylinder(.97,1.5,material(0x64734c),-2,1.05,0);
    cylinder(.06,2.6,dark,-2,1.6,0);
    const paddle = box(1.5,.08,.25,steel,-2,1.3,0);
    const paddle2 = box(.25,.08,1.5,steel,-2,.7,0);
    box(.55,.35,.55,dark,-2,3.25,0);
    for (const z of [-.8,.8]) for(const x of [-2.8,-1.2]) cylinder(.06,.4,steel,x,.15,z);
    box(.8,.8,.8,green,-3.6,.5,1.3);
    cylinder(.3,1.6,steel,.05,.9,0); cylinder(.3,1.6,steel,.8,.9,0);
    box(1.1,.85,1.05,dark,2, .55,0);
    cylinder(.32,.8,steel,2,.95,0);
    for(let i=0;i<5;i++) box(.85,.035,.04,steel,2,.35+i*.1,.54);
    box(1.2,1.05,1.1,material(0xbca98d),3.25,.65,-1.65);
    const roof = add(new THREE.ConeGeometry(1, .6,4),dark,3.25,1.5,-1.65); roof.rotation.y=Math.PI/4;
    const windows = [2.94,3.52].map(x=>box(.28,.35,.03,blue,x,.8,-1.085));
    box(1,.45,.7,green,-.2,.3,1.8);
    const pipe = (points: number[][], m:THREE.Material) => {
      const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number])),false,"catmullrom",.05);
      add(new THREE.TubeGeometry(curve,40,.045,8,false),m,0,0,0); return curve;
    };
    const feed = pipe([[-3.6,.8,1.3],[-2.9,.8,1.3],[-2.9,1,0]],green);
    const gas = pipe([[-2,3,0],[-2,3.65,0],[.05,3.65,0],[.05,1.8,0],[.8,1.8,0],[2,1.8,0],[2,1,0]],amber);
    const power = pipe([[2,.8,0],[3.25,.8,0],[3.25,.8,-1.1]],blue);
    const warmth = pipe([[2,.6,.6],[2,.6,1.1],[3.6,.6,1.1],[3.6,.6,-1.1]],orange);
    pipe([[-2,.4,.8],[-2,.4,1.8],[-.2,.4,1.8]],green);
    const dots = [feed,gas,power,warmth].map((curve,i)=>({curve, mesh:add(new THREE.SphereGeometry(.09,10,8),[green,amber,blue,orange][i]!,0,0,0)}));
    const bubbles = Array.from({length:9},(_,i)=>add(new THREE.SphereGeometry(.04+(i%3)*.015,8,8),amber,-2+Math.sin(i*3)*.7,1,Math.cos(i*3)*.7));
    const resize = () => { const w=element.clientWidth; renderer.setSize(w,340); camera.aspect=w/340;camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    const zoom = (event:Event) => {camera.position.sub(controls.target).multiplyScalar((event as CustomEvent).detail).add(controls.target);controls.update();};
    element.addEventListener("model-zoom",zoom);
    let frame=0; const start=performance.now(); const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const render = () => {
      const {cutaway,stage,heat}=options.current; const t=(performance.now()-start)/1000;
      shell.visible=!cutaway; lid.position.y=cutaway?3.9:2.75;
      paddle.rotation.y=paddle2.rotation.y=reduced?0:t*.4;
      bubbles.forEach((b,i)=>{b.visible=cutaway;b.position.y=.7+((reduced?i/9:(t*.18+i/9))%1)*1.8;});
      dots.forEach(({curve,mesh},i)=>{mesh.visible=i<=stage && (i!==3||heat);mesh.position.copy(curve.getPoint(reduced?.5:(t*.15)%1));});
      windows.forEach(w=>w.material=stage>=2?amber:blue);
      controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(render);
    };render();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();element.removeEventListener("model-zoom",zoom);controls.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(v=>v.dispose());}});renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div><div ref={host} className="min-h-[340px] overflow-hidden rounded-2xl bg-[#ecefe8]" />{failed?<p className="p-3 text-sm">3D isn’t available on this device. The guided steps and experiment below still work.</p>:<div className="flex items-center justify-between py-2 text-xs text-[#53655c]"><span>Drag to orbit · pinch to zoom</span><div className="flex gap-2">{([[-1,"−",1.15],[1,"+",.87]] as const).map(([id,label,factor])=><button key={id} aria-label={id===1?"Zoom in":"Zoom out"} className="h-10 w-10 rounded-lg border border-[#b4c5b6] bg-white text-lg" onClick={()=>host.current?.dispatchEvent(new CustomEvent("model-zoom",{detail:factor}))}>{label}</button>)}</div></div>}</div>;
}
