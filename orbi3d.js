import * as THREE from 'https://esm.sh/three@0.170.0';

const canvas = document.querySelector('#orbi3d');
const sceneHost = document.querySelector('.orbit-scene');
if (canvas && sceneHost) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setSize(sceneHost.clientWidth, sceneHost.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, sceneHost.clientWidth / sceneHost.clientHeight, .1, 100);
  camera.position.set(0, 0, 9.5);

  scene.add(new THREE.HemisphereLight(0xc9e7ff, 0x07152a, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 5, 6); scene.add(key);
  const rim = new THREE.PointLight(0x168cff, 24, 12); rim.position.set(3, 1, -2); scene.add(rim);
  const fill = new THREE.PointLight(0x68d9ff, 9, 10); fill.position.set(-4, -2, 4); scene.add(fill);

  const robot = new THREE.Group(); scene.add(robot);
  const white = new THREE.MeshStandardMaterial({ color: 0xe7f0fb, metalness: .48, roughness: .27 });
  const whiteBright = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: .35, roughness: .2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x071326, metalness: .7, roughness: .2 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x168fff, emissive: 0x087dff, emissiveIntensity: 2.4, metalness: .4, roughness: .2 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x39baff });

  function sphere(parent, material, pos, scale, segments=32) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1,segments,Math.max(16,segments/2)), material);
    m.position.set(...pos); m.scale.set(...scale); parent.add(m); return m;
  }
  function cylinder(parent, material, a, b, radiusA, radiusB=radiusA, segments=24) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const dir = new THREE.Vector3().subVectors(end,start);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusB,radiusA,dir.length(),segments),material);
    mesh.position.copy(start).add(end).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()); parent.add(mesh); return mesh;
  }

  // Rounded helmet and deep glass visor.
  sphere(robot, white, [0,.95,0], [1.05,.88,.78], 48);
  sphere(robot, dark, [0,.94,.64], [.88,.57,.25], 48);
  const visorGlass = new THREE.MeshPhysicalMaterial({color:0x06172d,metalness:.65,roughness:.12,clearcoat:1,clearcoatRoughness:.05});
  sphere(robot, visorGlass, [0,.94,.70], [.82,.51,.19], 48);
  // Eye lights and subtle mouth indicator.
  sphere(robot, blue, [-.34,1.02,.87], [.105,.18,.045], 24);
  sphere(robot, blue, [.34,1.02,.87], [.105,.18,.045], 24);
  cylinder(robot, glow, [-.12,.66,.85],[.12,.66,.85],.012,.012,12);
  // Helmet crest.
  sphere(robot, whiteBright, [0,1.72,-.02], [.48,.12,.48], 32);
  // Blue illuminated side modules.
  for (const x of [-1.03,1.03]) {
    sphere(robot, white, [x,.98,0], [.2,.39,.27], 24);
    sphere(robot, blue, [x*1.12,.98,.08], [.075,.22,.21], 24);
    sphere(robot, glow, [x*1.16,.98,.1], [.025,.12,.13], 16);
  }
  // Neck, torso and shoulder shells.
  cylinder(robot,dark,[0,.15,0],[0,.48,0],.22,.25);
  sphere(robot, white, [0,-.55,0], [.78,.86,.52], 40);
  sphere(robot, whiteBright, [-.69,-.12,0], [.3,.34,.34], 24);
  sphere(robot, whiteBright, [.69,-.12,0], [.3,.34,.34], 24);
  // Chest orbital emblem: ring + central planet.
  const emblem = new THREE.Mesh(new THREE.TorusGeometry(.23,.025,10,64),blue);
  emblem.position.set(0,-.43,.49); robot.add(emblem);
  const emblem2 = new THREE.Mesh(new THREE.TorusGeometry(.32,.012,8,64),glow);
  emblem2.position.set(0,-.43,.49); emblem2.rotation.z=-.55; emblem2.scale.y=.48; robot.add(emblem2);
  sphere(robot, blue,[0,-.43,.51],[.075,.075,.035],20);

  // Articulated arms, visible dark joints and blue wrist rings.
  for (const side of [-1,1]) {
    const shoulder=[side*.72,-.15,0], elbow=[side*1.02,-.75,.02], wrist=[side*1.28,-1.23,.12];
    sphere(robot,dark,shoulder,[.22,.23,.22],24);
    cylinder(robot,white,shoulder,elbow,.14,.12);
    sphere(robot,dark,elbow,[.16,.16,.16],20);
    cylinder(robot,white,elbow,wrist,.12,.095);
    const cuff=new THREE.Mesh(new THREE.TorusGeometry(.115,.035,10,32),blue);
    cuff.position.set(...wrist); cuff.rotation.x=Math.PI/2; robot.add(cuff);
    sphere(robot,whiteBright,[side*1.31,-1.37,.15],[.16,.18,.13],20);
    for(let f=0;f<4;f++){
      const x=side*1.31+(f-1.5)*.065;
      cylinder(robot,white,[x,-1.46,.17],[x+side*.015,-1.58+(Math.abs(f-1.5)*.025),.2],.027,.018,10);
    }
    cylinder(robot,white,[side*.32,-1.18,0],[side*.34,-1.88,.03],.18,.15);
    sphere(robot,dark,[side*.34,-1.2,0],[.19,.15,.18],20);
    sphere(robot,whiteBright,[side*.36,-1.9,.12],[.2,.11,.29],20);
  }

  // Thin floating orbital halo behind ORBI.
  const haloMat = new THREE.MeshBasicMaterial({color:0x238fff,transparent:true,opacity:.65});
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.7,.009,8,128),haloMat);
  halo.position.set(0,.15,-.55); halo.rotation.set(.85,.2,-.4); robot.add(halo);
  const halo2 = new THREE.Mesh(new THREE.TorusGeometry(1.95,.005,8,128),new THREE.MeshBasicMaterial({color:0x68d9ff,transparent:true,opacity:.28}));
  halo2.position.set(0,.15,-.7); halo2.rotation.set(1.2,-.35,.2); robot.add(halo2);

  const pointer = {x:0,y:0};
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      const r=sceneHost.getBoundingClientRect();
      pointer.x=((e.clientX-r.left)/r.width-.5)*2;
      pointer.y=((e.clientY-r.top)/r.height-.5)*2;
    },{passive:true});
  }
  let frame=0, running=true;
  const observer = new IntersectionObserver(entries=>{running=entries[0].isIntersecting;if(running&&!reduced)animate();});
  observer.observe(sceneHost);
  function resize(){
    const w=sceneHost.clientWidth,h=sceneHost.clientHeight;
    if(!w||!h)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(sceneHost);
  function animate(){
    if(!running||reduced)return;
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(animate);
    const t=performance.now()*.001;
    robot.position.y=Math.sin(t*.8)*.07;
    robot.rotation.y+=(pointer.x*.28-robot.rotation.y)*.035;
    robot.rotation.x+=(-pointer.y*.12-robot.rotation.x)*.035;
    halo.rotation.z=t*.08;
    renderer.render(scene,camera);
  }
  if(reduced){renderer.render(scene,camera);}else{animate();}
  document.addEventListener('visibilitychange',()=>{running=!document.hidden;if(running&&!reduced)animate();});
}
