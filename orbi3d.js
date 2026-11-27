import * as THREE from 'https://esm.sh/three@0.170.0';

const canvas = document.querySelector('#orbi3d');
const sceneHost = document.querySelector('.intro-stage');
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
  robot.scale.setScalar(.055);
  robot.position.set(-1.6, -.15, -5.5);

  // ORBI — proportions and welcoming pose based on the supplied character reference.
  const ceramic = new THREE.MeshPhysicalMaterial({color:0xf2f6ff,metalness:.28,roughness:.22,clearcoat:1,clearcoatRoughness:.12});
  const ceramicShade = new THREE.MeshPhysicalMaterial({color:0xcbd8ec,metalness:.42,roughness:.25,clearcoat:1});
  const joint = new THREE.MeshStandardMaterial({color:0x071326,metalness:.82,roughness:.2});
  const jointMid = new THREE.MeshStandardMaterial({color:0x182b48,metalness:.8,roughness:.24});
  const visor = new THREE.MeshPhysicalMaterial({color:0x010714,metalness:.7,roughness:.09,clearcoat:1,clearcoatRoughness:.03});
  const neon = new THREE.MeshStandardMaterial({color:0x168fff,emissive:0x087dff,emissiveIntensity:2.8,metalness:.5,roughness:.18});
  const neonLine = new THREE.MeshBasicMaterial({color:0x59d5ff});
  const softGlow = new THREE.MeshBasicMaterial({color:0x087dff,transparent:true,opacity:.22});

  function orb(parent,mat,pos,size,segments=40){
    const m=new THREE.Mesh(new THREE.SphereGeometry(1,segments,Math.max(16,segments/2)),mat);
    m.position.set(...pos);m.scale.set(...size);parent.add(m);return m;
  }
  function link(parent,mat,a,b,r1,r2=r1){
    const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,d.length(),32,1),mat);
    m.position.copy(A).add(B).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());parent.add(m);return m;
  }
  function ring(parent,mat,pos,r,tube,rotation=[Math.PI/2,0,0]){
    const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,12,64),mat);
    m.position.set(...pos);m.rotation.set(...rotation);parent.add(m);return m;
  }
  function eyeArc(parent,x,y,z){
    const pts=[];
    for(let i=0;i<=24;i++){const a=Math.PI*(.08+i/24*.84);pts.push(new THREE.Vector3(x+Math.cos(a)*.19,y+Math.sin(a)*.19,z));}
    const curve=new THREE.CatmullRomCurve3(pts);
    const m=new THREE.Mesh(new THREE.TubeGeometry(curve,32,.035,10,false),neonLine);parent.add(m);
    const halo=m.clone();halo.material=softGlow;halo.scale.set(1.7,1.7,1.7);parent.add(halo);
  }

  // Helmet: broad rounded white shell, inset panoramic black visor and blue side hardware.
  orb(robot,ceramic,[0,2.02,0],[.88,.78,.68],64);
  orb(robot,ceramicShade,[0,2.68,-.02],[.48,.13,.43],40);
  orb(robot,visor,[0,2.04,.535],[.735,.49,.205],64);
  orb(robot,joint,[0,2.04,.49],[.76,.515,.19],64);
  orb(robot,visor,[0,2.04,.56],[.72,.47,.19],64);
  eyeArc(robot,-.29,2.08,.738);eyeArc(robot,.29,2.08,.738);
  // Tiny friendly smile.
  const smileCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.10,1.78,.735),new THREE.Vector3(0,1.75,.75),new THREE.Vector3(.10,1.78,.735)]);
  robot.add(new THREE.Mesh(new THREE.TubeGeometry(smileCurve,16,.009,8,false),neonLine));
  // Helmet crown details and ear modules.
  orb(robot,joint,[0,2.69,-.02],[.34,.055,.34],32);
  orb(robot,ceramic,[0,2.70,-.02],[.30,.07,.30],32);
  for(const s of [-1,1]){
    orb(robot,joint,[s*.83,2.05,0],[.19,.39,.30],32);
    orb(robot,ceramic,[s*.91,2.05,.02],[.15,.34,.29],32);
    orb(robot,neon,[s*.99,2.05,.04],[.055,.27,.235],32);
    orb(robot,neonLine,[s*1.025,2.05,.05],[.018,.20,.17],24);
    ring(robot,joint,[s*.75,2.05,.01],.30,.035,[0,0,0]);
  }
  // Neck and articulated collar.
  link(robot,joint,[0,1.17,0],[0,1.48,0],.22,.19);
  ring(robot,neon,[0,1.48,0],.22,.035);
  // Chest armour, layered shoulder plates and dark flexible abdomen.
  orb(robot,joint,[0,.28,-.015],[.59,.66,.42],48);
  orb(robot,ceramic,[0,.48,.06],[.69,.75,.49],56);
  orb(robot,ceramicShade,[0,.08,.20],[.59,.38,.38],48);
  orb(robot,ceramic,[0,.91,.02],[.50,.19,.40],40);
  // Glowing clavicle strip.
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.36,.025,10,64,Math.PI),neon);
  collar.position.set(0,.98,.30);collar.rotation.set(Math.PI/2,0,Math.PI);robot.add(collar);
  // Orbitoile planet-and-ring insignia.
  const badge=new THREE.Group();badge.position.set(0,.43,.515);badge.rotation.x=-.08;robot.add(badge);
  orb(badge,neon,[0,0,0],[.075,.075,.025],24);
  ring(badge,neon,[0,0,.005],.25,.025,[.15,.12,0]);
  const orbit2=ring(badge,neonLine,[0,0,.01],.31,.014,[.15,.12,-.55]);orbit2.scale.y=.48;
  // Shoulder caps and dark rotary sockets.
  for(const s of [-1,1]){
    orb(robot,joint,[s*.72,.80,0],[.29,.34,.34],36);
    orb(robot,ceramic,[s*.78,.87,.02],[.32,.30,.34],40);
    orb(robot,ceramicShade,[s*.80,.91,.22],[.23,.20,.17],32);
  }
  // Waist and pelvis.
  orb(robot,joint,[0,-.28,0],[.48,.42,.37],40);
  orb(robot,jointMid,[0,-.38,.02],[.43,.30,.35],36);
  orb(robot,ceramic,[0,-.58,.015],[.53,.39,.39],48);
  // Arms are intentionally posed asymmetrically: one raised in greeting, one open.
  function makeArm(points, raised){
    const [shoulder,elbow,wrist]=points;
    orb(robot,joint,shoulder,[.22,.23,.22],32);
    ring(robot,joint,shoulder,.19,.045,[Math.PI/2,0,0]);
    link(robot,ceramic,shoulder,elbow,.19,.145);
    orb(robot,ceramic,[ (shoulder[0]+elbow[0])/2,(shoulder[1]+elbow[1])/2,(shoulder[2]+elbow[2])/2 ],[.19,.28,.19],32);
    orb(robot,joint,elbow,[.16,.16,.16],28);
    orb(robot,jointMid,elbow,[.12,.12,.12],24);
    link(robot,ceramic,elbow,wrist,.145,.12);
    orb(robot,ceramic,wrist,[.14,.19,.14],32);
    ring(robot,neon,wrist,.145,.035,[Math.PI/2,0,0]);
    // Palm plate and five individually segmented fingers.
    const palm=[wrist[0],wrist[1]-.17,wrist[2]+.08];
    orb(robot,ceramic,palm,[.22,.19,.105],32);
    const dir=raised?1:-.12;
    for(let i=0;i<4;i++){
      const spread=(i-1.5)*.105;
      const base=[palm[0]+spread,palm[1]+(raised?.08:-.02),palm[2]+.01];
      const tip=[base[0]+spread*.22,base[1]+(raised?.34:.17)+Math.abs(i-1.5)*-.035,base[2]+.015];
      link(robot,ceramic,base,tip,.045,.032);
      orb(robot,jointMid,base,[.052,.052,.052],16);
      orb(robot,ceramic,tip,[.037,.045,.038],16);
      ring(robot,jointMid,[(base[0]+tip[0])/2,(base[1]+tip[1])/2,(base[2]+tip[2])/2],.035,.012,[Math.PI/2,0,0]);
    }
    const thumbBase=[palm[0]+(raised?.18:-.18),palm[1]-.01,palm[2]+.01];
    const thumbTip=[thumbBase[0]+(raised?.22:-.20),thumbBase[1]+.17,thumbBase[2]+.015];
    link(robot,ceramic,thumbBase,thumbTip,.052,.035);
    orb(robot,jointMid,thumbBase,[.06,.06,.06],16);
    orb(robot,ceramic,thumbTip,[.04,.05,.04],16);
  }
  makeArm([[-.72,.80,0],[-1.02,1.25,.02],[-1.08,1.68,.10]],true);
  makeArm([[.72,.80,0],[1.04,.35,.02],[1.52,.34,.10]],false);
  // Legs: dark rotary hips/knees beneath sculpted white shin and thigh shells.
  for(const s of [-1,1]){
    const hip=[s*.34,-.67,0],knee=[s*.40,-1.42,.02],ankle=[s*.43,-2.12,.04];
    orb(robot,joint,hip,[.23,.27,.25],32);
    link(robot,joint,hip,knee,.18,.16);
    link(robot,ceramic, [s*.34,-.78,.02],[s*.39,-1.35,.10],.24,.20);
    orb(robot,ceramic,[s*.37,-1.08,.09],[.25,.43,.25],40);
    orb(robot,joint,knee,[.17,.17,.18],28);
    orb(robot,neon,[s*.40,-1.10,.315],[.035,.20,.018],24);
    link(robot,joint,knee,ankle,.14,.12);
    link(robot,ceramic,[s*.40,-1.52,.02],ankle,.20,.16);
    orb(robot,ceramic,[s*.42,-1.82,.09],[.21,.39,.23],40);
    orb(robot,joint,ankle,[.16,.15,.17],24);
    ring(robot,neon,[s*.43,-2.10,.04],.14,.025);
    // White boot with dark sole and luminous blue perimeter.
    orb(robot,joint,[s*.43,-2.20,.20],[.29,.13,.43],32);
    orb(robot,ceramic,[s*.43,-2.16,.27],[.30,.18,.43],40);
    orb(robot,ceramicShade,[s*.43,-2.25,.34],[.27,.08,.36],32);
    const sole=ring(robot,neon,[s*.43,-2.28,.22],.29,.025);
    sole.scale.set(1,.62,1);
  }
  // Subtle orbital accents behind the character, not around the silhouette.
  const halo=new THREE.Mesh(new THREE.TorusGeometry(1.72,.008,8,128),new THREE.MeshBasicMaterial({color:0x238fff,transparent:true,opacity:.42}));
  halo.position.set(0,.25,-.62);halo.rotation.set(.85,.2,-.4);robot.add(halo);
  const halo2=new THREE.Mesh(new THREE.TorusGeometry(1.95,.005,8,128),new THREE.MeshBasicMaterial({color:0x68d9ff,transparent:true,opacity:.18}));
  halo2.position.set(0,.25,-.72);halo2.rotation.set(1.2,-.35,.2);robot.add(halo2);

  // Photorealistic Earth layers, illuminated by a distant sun.
  const textureLoader = new THREE.TextureLoader();
  const earthGroup = new THREE.Group();
  earthGroup.position.set(1.65,-.35,-7.2);
  scene.add(earthGroup);
  const earthGeo = new THREE.SphereGeometry(3.05,96,96);
  // Dark ocean fallback prevents the untextured sphere flashing pure white while maps load.
  const earthMat = new THREE.MeshPhongMaterial({color:0x092b4d,specular:new THREE.Color(0x244b70),shininess:18});
  const earth = new THREE.Mesh(earthGeo,earthMat);
  earth.rotation.y = -1.25;
  earthGroup.add(earth);
  textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    t=>{t.colorSpace=THREE.SRGBColorSpace;earthMat.map=t;earthMat.color.set(0xffffff);earthMat.needsUpdate=true;},
    undefined,
    ()=>{earthMat.color.set(0x061b34);earthMat.needsUpdate=true;}
  );
  textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg', t=>{earthMat.normalMap=t;earthMat.normalScale.set(.55,.55);earthMat.needsUpdate=true;});
  const cloudMat = new THREE.MeshPhongMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false});
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(3.085,80,80),cloudMat);
  earthGroup.add(clouds);
  textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
    t=>{cloudMat.map=t;cloudMat.alphaMap=t;cloudMat.opacity=.42;cloudMat.needsUpdate=true;},
    undefined,
    ()=>{cloudMat.opacity=0;cloudMat.needsUpdate=true;}
  );
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(3.19,80,80),new THREE.ShaderMaterial({
    vertexShader:`varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`varying vec3 vNormal; void main(){float rim=pow(1.0-max(dot(normalize(vNormal),vec3(0.0,0.0,1.0)),0.0),3.0);gl_FragColor=vec4(0.12,0.52,1.0,rim*.72);}`,
    transparent:true,blending:THREE.AdditiveBlending,side:THREE.BackSide,depthWrite:false
  }));
  earthGroup.add(atmosphere);
  const sun = new THREE.DirectionalLight(0xffe6c2,4.2); sun.position.set(-8,5,7); scene.add(sun);
  const sunGlow = new THREE.PointLight(0x4caeff,38,28); sunGlow.position.set(-7,2,1); scene.add(sunGlow);

  // Deep star field with subtle depth parallax.
  const starCount = 2200, starPositions = new Float32Array(starCount*3), starSizes = new Float32Array(starCount);
  for(let i=0;i<starCount;i++){starPositions[i*3]=(Math.random()-.5)*42;starPositions[i*3+1]=(Math.random()-.5)*25;starPositions[i*3+2]=-Math.random()*34-2;starSizes[i]=Math.random()*.8+.2;}
  const starGeo = new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPositions,3));
  const starField = new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xc9e7ff,size:.035,transparent:true,opacity:.9,sizeAttenuation:true}));
  scene.add(starField);
  const dustGeo = new THREE.BufferGeometry(), dustPos=[];
  for(let i=0;i<520;i++){dustPos.push((Math.random()-.5)*24,(Math.random()-.5)*14,-Math.random()*24);}
  dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPos,3));
  const dust = new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0x238fff,size:.055,transparent:true,opacity:.55}));
  scene.add(dust);

  const pointer = {x:0,y:0};
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      const r=sceneHost.getBoundingClientRect();
      pointer.x=((e.clientX-r.left)/r.width-.5)*2;
      pointer.y=((e.clientY-r.top)/r.height-.5)*2;
    },{passive:true});
  }
  let frame=0, running=true;
  const introStart = performance.now();
  const duration = 10800;
  function resize(){
    const w=sceneHost.clientWidth,h=sceneHost.clientHeight;
    if(!w||!h)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(sceneHost);
  function animate(){
    if(!running)return;
    frame=requestAnimationFrame(animate);
    const elapsed=performance.now()-introStart;
    const p=Math.min(1,elapsed/duration);
    const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
    const travel=ease(Math.min(1,p/.96));
    const reveal=Math.max(0,Math.min(1,(p-.12)/.5));
    // ORBI begins as a distant silhouette, then travels beside the camera toward Earth.
    const robotScale=.018+(.42-.018)*ease(Math.min(1,p/.72));
    robot.scale.setScalar(robotScale);
    robot.position.set(-2.2+.9*travel,-.15+.12*Math.sin(p*8),-5.8+1.0*travel);
    robot.rotation.y+=(pointer.x*.12-robot.rotation.y)*.025;
    robot.rotation.x+=(-pointer.y*.06-robot.rotation.x)*.025;
    halo.rotation.z=elapsed*.00012;
    // One continuous camera flight: the final frame is close enough for Earth to fill the view.
    const cameraEnd = new THREE.Vector3(1.42,-.30,-3.48);
    const cameraStart = new THREE.Vector3(0,0,9.5);
    camera.position.copy(cameraStart).lerp(cameraEnd,travel);
    const targetStart = new THREE.Vector3(0,0,-2.4);
    camera.lookAt(targetStart.lerp(earthGroup.position,travel));
    earthGroup.rotation.y=-1.25+elapsed*.000035;
    clouds.rotation.y=elapsed*.000047;
    starField.rotation.y=elapsed*.000006;
    dust.rotation.z=elapsed*.000012;
    sun.intensity=2.0+2.2*reveal;
    renderer.render(scene,camera);
    if(p>=1){cancelAnimationFrame(frame);}
  }
  if(reduced){camera.position.set(0,0,7);robot.scale.setScalar(.52);robot.position.set(-1.5,0,1);renderer.render(scene,camera);}
  else animate();
  document.addEventListener('visibilitychange',()=>{running=!document.hidden;if(running&&!reduced)animate();});
}
