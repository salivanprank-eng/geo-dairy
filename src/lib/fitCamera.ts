import * as THREE from 'three';

/**
 * Frame a perspective camera to a box, exactly.
 *
 * The obvious approach — fit the box's bounding *sphere* — is badly wrong for a
 * wide, flat subject. A value chain 12 units across but 1.7 tall has a sphere of
 * radius ~6, and fitting that radius to a 30° vertical FOV pushes the camera far
 * enough back that the diagram renders at a quarter of the space it was given.
 *
 * This projects the box's eight corners onto the camera's own right/up/forward
 * axes and solves for the distance at which every corner is inside both the
 * horizontal and vertical frustum. Wide content fills the width, tall content
 * fills the height, and neither is cropped.
 */
export function fitPerspectiveToBox(
  cam: THREE.PerspectiveCamera,
  box: THREE.Box3,
  /** Direction from the target to the camera; normalised internally. */
  viewDir: THREE.Vector3,
  /** >1 leaves breathing room, <1 crops in. */
  padding = 1.06,
) {
  const center = box.getCenter(new THREE.Vector3());
  const dir = viewDir.clone().normalize();

  // Camera basis. Guard the degenerate case of looking straight down.
  const worldUp = Math.abs(dir.y) > 0.999 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(dir, worldUp).normalize();
  const up = new THREE.Vector3().crossVectors(right, dir).normalize();

  const tanV = Math.tan((cam.fov * Math.PI) / 180 / 2);
  const tanH = tanV * cam.aspect;

  const min = box.min;
  const max = box.max;
  let dist = 0;
  for (let i = 0; i < 8; i++) {
    const corner = new THREE.Vector3(
      i & 1 ? max.x : min.x,
      i & 2 ? max.y : min.y,
      i & 4 ? max.z : min.z,
    ).sub(center);
    // Depth along the view axis matters: a corner nearer the camera needs more
    // distance to stay inside the frustum than one further away.
    const depth = corner.dot(dir);
    dist = Math.max(
      dist,
      Math.abs(corner.dot(right)) / tanH + depth,
      Math.abs(corner.dot(up)) / tanV + depth,
    );
  }
  dist *= padding;

  cam.position.copy(center.clone().add(dir.multiplyScalar(dist)));
  cam.lookAt(center);
  cam.near = Math.max(0.05, dist / 200);
  cam.far = dist * 12;
  cam.updateProjectionMatrix();
}
