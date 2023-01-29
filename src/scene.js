import { is_promise } from "svelte/internal";
import * as THREE from "three";
import { CylinderGeometry, MathUtils } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import getIssPosition from "./getCoordinates";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let renderer;

const ambientLight = new THREE.AmbientLight(0xcecece, 0.25);
scene.add(ambientLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
frontLight.position.set(5, 0, 0);
const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
backLight.position.set(-5, 0, 0);
scene.add(frontLight, backLight);

const earth = new THREE.Group();
const sphereMesh = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load(
    "../img/world.topo.bathy.200408.3x5400x2700.jpg"
  ),
  side: THREE.DoubleSide,
});

const sphereMaterial = new THREE.SphereGeometry(10, 50, 50);

const sphere = new THREE.Mesh(sphereMaterial, sphereMesh);

const cloudGeometry = new THREE.SphereGeometry(10.05, 200, 200);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load("../img/cloud_combined_2048.jpg"),
  side: THREE.DoubleSide,
  opacity: 0.4,
  transparent: true,
});
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(sphere, cloudMesh);

sphere.geometry.rotateY(-Math.PI * 0.5);
scene.add(earth);

const ISS = new THREE.Group();

const panelsMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#bc9739"),
  map: new THREE.TextureLoader().load("../img/panelsTexture.png"),
  reflectivity: 1,
  shininess: 150,
  side: THREE.DoubleSide,
});
const panelsGeometry = new THREE.BoxGeometry(0.075, 0.35, 0.005);
const panelsMesh = new THREE.Mesh(panelsGeometry, panelsMaterial);

let amountOfPanels = 16;
let panelsX = [
  -0.285, -0.3675, -0.4775, -0.56, 0.285, 0.3675, 0.4775, 0.56, -0.285, -0.3675,
  -0.4775, -0.56, 0.285, 0.3675, 0.4775, 0.56,
];
let panelsY = [
  0.0375, 0.0375, 0.0375, 0.0375, 0.0375, 0.0375, 0.0375, 0.0375, -0.425,
  -0.425, -0.425, -0.425, -0.425, -0.425, -0.425, -0.425,
];
for (let i = 0; i < amountOfPanels; i++) {
  let newPanel = panelsMesh.clone();
  newPanel.position.x = panelsX[i];
  newPanel.position.y = panelsY[i];

  ISS.add(newPanel);
}

const shinySilver = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#707070"),
  reflectivity: 0.25,
  shininess: 100,
  side: THREE.DoubleSide,
});

const panelsWireframeMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#888"),
  wireframe: true,
});
const panelsWireframeGeometry = new THREE.BoxGeometry(
  1.05,
  0.06,
  0.06,
  2,
  2,
  2
);
const panelsWireframeMesh = new THREE.Mesh(
  panelsWireframeGeometry,
  panelsWireframeMaterial
);
panelsWireframeMesh.position.set(0, -0.19375, 0);
ISS.add(panelsWireframeMesh);

const squareHolderMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#D0C7B6"),
  map: new THREE.TextureLoader().load("../img/panelsHolderTexture.png"),
  reflectivity: 1,
  shininess: 150,
  side: THREE.DoubleSide,
});
const squareHolder = new THREE.BoxGeometry(0.4, 0.075, 0.075);
const mainSquare = new THREE.Mesh(squareHolder, squareHolderMaterial);
mainSquare.position.set(0.45, -0.19375, 0);

const panelsHolder2 = new THREE.Mesh(squareHolder, squareHolderMaterial);
panelsHolder2.position.set(-0.45, -0.19375, 0);
ISS.add(mainSquare, panelsHolder2);

const verticalCylinderGeommetry = new THREE.CylinderGeometry(
  0.005,
  0.005,
  0.035,
  50,
  50
);
const verticalCylinder = new THREE.Mesh(verticalCylinderGeommetry, shinySilver);
verticalCylinder.position.set(0.325, -0.15, 0);

const verticalCylinder2 = verticalCylinder.clone();
verticalCylinder2.position.set(0.5175, -0.15, 0);

const verticalCylinder3 = verticalCylinder.clone();
verticalCylinder3.position.set(0.5175, -0.23, 0);

const verticalCylinder4 = verticalCylinder.clone();
verticalCylinder4.position.set(0.325, -0.23, 0);

const verticalCylinder5 = verticalCylinder.clone();
verticalCylinder5.position.set(-0.325, -0.23, 0);

const verticalCylinder6 = verticalCylinder.clone();
verticalCylinder6.position.set(-0.325, -0.15, 0);

const verticalCylinder7 = verticalCylinder.clone();
verticalCylinder7.position.set(-0.5175, -0.15, 0);

const verticalCylinder8 = verticalCylinder.clone();
verticalCylinder8.position.set(-0.5175, -0.23, 0);

const horizontalCylinderGeometry = new THREE.CylinderGeometry(
  0.005,
  0.005,
  0.15,
  50,
  50
);
const horizontalCylinder = new THREE.Mesh(
  horizontalCylinderGeometry,
  shinySilver
);
horizontalCylinder.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder.position.set(0.325, -0.135, 0);

const horizontalCylinder2 = horizontalCylinder.clone();
horizontalCylinder2.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder2.position.set(0.5175, -0.135, 0);

const horizontalCylinder3 = horizontalCylinder.clone();
horizontalCylinder3.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder3.position.set(0.5175, -0.25, 0);

const horizontalCylinder4 = horizontalCylinder.clone();
horizontalCylinder4.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder4.position.set(0.325, -0.25, 0);

const horizontalCylinder5 = horizontalCylinder.clone();
horizontalCylinder5.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder5.position.set(-0.325, -0.25, 0);

const horizontalCylinder6 = horizontalCylinder.clone();
horizontalCylinder6.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder6.position.set(-0.325, -0.135, 0);

const horizontalCylinder7 = horizontalCylinder.clone();
horizontalCylinder7.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder7.position.set(-0.5175, -0.135, 0);

const horizontalCylinder8 = horizontalCylinder.clone();
horizontalCylinder8.rotation.set(0, 0, Math.PI / 2);
horizontalCylinder8.position.set(-0.5175, -0.25, 0);

ISS.add(
  verticalCylinder,
  verticalCylinder2,
  verticalCylinder3,
  verticalCylinder4,
  verticalCylinder5,
  verticalCylinder6,
  verticalCylinder7,
  verticalCylinder8,
  horizontalCylinder,
  horizontalCylinder2,
  horizontalCylinder3,
  horizontalCylinder4,
  horizontalCylinder5,
  horizontalCylinder6,
  horizontalCylinder7,
  horizontalCylinder8
);

const mainCylinderGeometry = new THREE.BoxGeometry(0.4, 0.075, 0.075);
const mainCylinderMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#CCCEC4"),
  map: new THREE.TextureLoader().load("../img/panelsHolderTexture.png"),
  reflectivity: 0.2,
  shininess: 50,
});
const mainCylinderMesh = new THREE.Mesh(
  mainCylinderGeometry,
  mainCylinderMaterial
);
mainCylinderMesh.position.set(0, -0.19375, 0);
ISS.add(mainCylinderMesh);

const mainVerticalPartGeometry = new THREE.CylinderGeometry(
  0.035,
  0.035,
  0.65,
  50,
  50
);
const mainVerticalPart = new THREE.Mesh(mainVerticalPartGeometry, shinySilver);
mainVerticalPart.position.set(0, -0.29375, 0);
ISS.add(mainVerticalPart);

const solarPanelsMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#88adcf"),
  map: new THREE.TextureLoader().load("../img/solarPanelsTexture.png"),
  reflectivity: 0.5,
  shininess: 100,
});

const bigSolarPanelGeometry = new THREE.BoxGeometry(0.045, 0.3, 0.001);
const bigSolarPanel = new THREE.Mesh(
  bigSolarPanelGeometry,
  solarPanelsMaterial
);
bigSolarPanel.position.set(-0.135, -0.35, 0);
ISS.add(bigSolarPanel);

const bigSolarPanel2 = bigSolarPanel.clone();
bigSolarPanel2.position.set(-0.075, -0.35, 0);
ISS.add(bigSolarPanel2);

const bigSolarPanel3 = bigSolarPanel.clone();
bigSolarPanel3.position.set(0.075, -0.35, 0);
ISS.add(bigSolarPanel3);

const bigSolarPanel4 = bigSolarPanel.clone();
bigSolarPanel4.position.set(0.135, -0.35, 0);
ISS.add(bigSolarPanel4);

const verticalCylinderTop = new THREE.CylinderGeometry(
  0.015,
  0.035,
  0.03,
  50,
  50
);
const verticalCylinderTopMesh = new THREE.Mesh(
  verticalCylinderTop,
  shinySilver
);
verticalCylinderTopMesh.position.set(0, 0.045, 0);
ISS.add(verticalCylinderTopMesh);

const horizontalTopGeometry = new CylinderGeometry(0.025, 0.025, 0.225, 50, 50);
const horizontalTopMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#525252"),
  reflectivity: 0.5,
  shininess: 100,
});
const horizontalTop = new THREE.Mesh(
  horizontalTopGeometry,
  horizontalTopMaterial
);
horizontalTop.rotation.set(0, 0, Math.PI / 2);
horizontalTop.position.set(-0.01, 0, 0);
ISS.add(horizontalTop);

const solarPanelGeometry = new THREE.BoxGeometry(0.035, 0.4, 0.001);
const solarPanelMesh = new THREE.Mesh(solarPanelGeometry, solarPanelsMaterial);
solarPanelMesh.position.set(0, -0.575, 0);
solarPanelMesh.rotation.set(0, 0, Math.PI / 2);
ISS.add(solarPanelMesh);

const cylinderBottomGeometry = new THREE.CylinderGeometry(
  0.015,
  0.015,
  0.055,
  50,
  50
);
const cylinderBottomMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#1a1a1a"),
  reflectivity: 0.01,
  shininess: 20,
});
const cylinderBottom = new THREE.Mesh(
  cylinderBottomGeometry,
  cylinderBottomMaterial
);
cylinderBottom.position.set(0, -0.635, 0);
ISS.add(cylinderBottom);

const capsuleBottomGeometry = new THREE.CylinderGeometry(
  0.02,
  0.02,
  0.1,
  50,
  50
);
const capsuleBottomMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color("#525252"),
  reflectivity: 0.5,
  shininess: 100,
});
const capsuleBottom = new THREE.Mesh(
  capsuleBottomGeometry,
  capsuleBottomMaterial
);
capsuleBottom.position.set(0, -0.5, 0.05);
capsuleBottom.rotation.set(Math.PI / 2, 0, 0);
ISS.add(capsuleBottom);

const IssLight = new THREE.DirectionalLight(0xffffff, 0.8);
IssLight.position.set(0, 0, 1);
ISS.add(IssLight);

ISS.rotation.set(-(Math.PI / 6), 0, 0);
let IssHeight = 11;
ISS.position.set(0, 0, IssHeight);
ISS.scale.set(0.15, 0.15, 0.15);

ISS.lookAt(earth.position);
scene.add(ISS);

const calculatePositionFromLatLong = (radius, lat, long) => {
  var coordinates = {
    lat: lat,
    lon: long,
  };

  var coordinatesSpherical = {
    lat: MathUtils.degToRad(90 - coordinates.lat),
    lon: MathUtils.degToRad(coordinates.lon),
  };

  var coordinatesVector = new THREE.Vector3().setFromSphericalCoords(
    radius,
    coordinatesSpherical.lat,
    coordinatesSpherical.lon
  );

  return coordinatesVector;
};

let latitude = 0;
let longitude = 0;
let radius = 11;
let lerp = 1;
const setIssPosition = () => {
  getIssPosition().then((value) => {
    latitude = value.latitude;
    longitude = value.longitude;
  });
};
setIssPosition();
ISS.position.set(
  calculatePositionFromLatLong(radius, latitude, longitude).x,
  calculatePositionFromLatLong(radius, latitude, longitude).y,
  calculatePositionFromLatLong(radius, latitude, longitude).z
);
ISS.lookAt(earth.position);

const initPosition = () => {
  camera.position.set(
    calculatePositionFromLatLong(radius + 1, latitude, longitude).x,
    calculatePositionFromLatLong(radius + 1, latitude, longitude).y,
    calculatePositionFromLatLong(radius + 1, latitude, longitude).z
  );
  ISS.lookAt(earth.position);
  camera.lookAt(earth.position);
};
setTimeout(initPosition, 500);


setInterval(() => {
  setIssPosition();
  lerp = 0.001;
}, 2500);

const animate = () => {
  requestAnimationFrame(animate);
  cloudMesh.rotation.x += 0.0001;
  cloudMesh.rotation.y += 0.00005;

  ISS.position.lerp(
    calculatePositionFromLatLong(radius, latitude, longitude),
    lerp
  );

  renderer.render(scene, camera);
};

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

export const createScene = (el) => {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });

  const controls = new OrbitControls(camera, el);
  controls.rotateSpeed = 0.1; 
  controls.update();

  resize();
  animate();
};

export const focusOnIss = () => {
  camera.position.set(
    calculatePositionFromLatLong(radius + 1, latitude, longitude).x,
    calculatePositionFromLatLong(radius + 1, latitude, longitude).y,
    calculatePositionFromLatLong(radius + 1, latitude, longitude).z
  );
  camera.lookAt(earth.position);
}

window.addEventListener("resize", resize);
