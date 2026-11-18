// Jarvis's holographic face for the Workspace home. An original alien head
// built in code with Three.js; its jaw follows the loudness of his voice.
// Tap it once to wake him; after that he listens until "go to sleep, Jarvis".
import { useEffect, useRef, useSyncExternalStore } from 'react'
import * as THREE from 'three'
import { talkMode } from './talk'
import { talkLabels, type TalkStatus } from '../lib/talk'

interface Mood { color: THREE.Color; glow: number; scan: number }
const moods: Record<TalkStatus, Mood> = {
  off: { color: new THREE.Color('#4bb8c9'), glow: 0.35, scan: 0.25 },
  error: { color: new THREE.Color('#e0727f'), glow: 0.5, scan: 0.3 },
  starting: { color: new THREE.Color('#62e0f0'), glow: 0.7, scan: 0.8 },
  sleeping: { color: new THREE.Color('#8f7cf0'), glow: 0.45, scan: 0.2 },
  listening: { color: new THREE.Color('#5ee8ff'), glow: 0.9, scan: 0.5 },
  hearing: { color: new THREE.Color('#7ef0ff'), glow: 1.0, scan: 0.7 },
  thinking: { color: new THREE.Color('#5fffd0'), glow: 1.0, scan: 1.8 },
  speaking: { color: new THREE.Color('#8ff0ff'), glow: 1.05, scan: 0.9 },
}

const smooth = (edge0: number, edge1: number, x: number) => { const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0))); return t * t * (3 - 2 * t) }

// A tall alien cranium: wide brow, deep eye sockets, long narrow chin.
// The "jaw" attribute marks the vertices that drop when he speaks.
function headGeometry(segments = 120) {
  const geometry = new THREE.SphereGeometry(1, segments, segments)
  const position = geometry.attributes.position as THREE.BufferAttribute
  const jaw = new Float32Array(position.count)
  const vertex = new THREE.Vector3()
  for (let index = 0; index < position.count; index++) {
    vertex.fromBufferAttribute(position, index)
    let { x, y, z } = vertex
    if (y > 0) { const k = 1 + 0.22 * y; x *= k; z *= 1 + 0.12 * y; y *= 1.32 }
    else { const d = -y; x *= 1 - 0.5 * Math.pow(d, 1.25); z *= 1 - 0.28 * d; y *= 1.18 }
    if (z > 0) z *= 0.86
    // Eye sockets.
    for (const side of [-1, 1]) {
      const dx = x - side * 0.36, dy = y - 0.02
      const socket = Math.exp(-(dx * dx) / 0.035 - (dy * dy) / 0.02) * smooth(0, 0.5, z)
      z -= socket * 0.13
    }
    // Cheek hollows and a faint brow ridge.
    z -= Math.exp(-((Math.abs(x) - 0.42) ** 2) / 0.02 - ((y + 0.35) ** 2) / 0.04) * smooth(0, 0.5, z) * 0.06
    z += Math.exp(-((y - 0.22) ** 2) / 0.006) * smooth(0.2, 0.7, z) * 0.03 * (1 - Math.abs(x))
    position.setXYZ(index, x, y, z)
    jaw[index] = smooth(-0.62, -0.78, y) * smooth(-0.2, 0.25, z)
  }
  geometry.setAttribute('jaw', new THREE.BufferAttribute(jaw, 1))
  geometry.computeVertexNormals()
  return geometry
}

const uniforms = () => ({ uColor: { value: new THREE.Color() }, uGlow: { value: 1 }, uTime: { value: 0 }, uScan: { value: 0.5 }, uMouth: { value: 0 } })
type Uniforms = ReturnType<typeof uniforms>

const vertexShader = `
  attribute float jaw;
  uniform float uMouth;
  varying vec3 vNormal; varying vec3 vView; varying float vY;
  void main() {
    vec3 p = position;
    p.y -= jaw * uMouth * 0.2;
    p.z += jaw * uMouth * 0.03;
    vec4 world = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-world.xyz);
    vY = p.y;
    gl_Position = projectionMatrix * world;
  }`
const fragmentShader = `
  uniform vec3 uColor; uniform float uGlow; uniform float uTime; uniform float uScan;
  varying vec3 vNormal; varying vec3 vView; varying float vY;
  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
    float lines = 0.55 + 0.45 * sin(vY * 140.0 - uTime * 6.0);
    float band = exp(-pow((vY - (1.6 - mod(uTime * uScan, 3.4))) * 7.0, 2.0));
    float flicker = 0.92 + 0.08 * sin(uTime * 37.0) * sin(uTime * 11.0);
    float alpha = (0.035 + rim * 0.62) * lines * flicker * uGlow + band * 0.22 * uGlow;
    gl_FragColor = vec4(uColor * (0.45 + rim * 0.7 + band * 0.6), alpha);
  }`
const wireShader = `
  uniform vec3 uColor; uniform float uGlow; uniform float uTime;
  varying vec3 vNormal; varying vec3 vView; varying float vY;
  void main() {
    float facing = abs(dot(vNormal, vView));
    gl_FragColor = vec4(uColor, (0.06 + 0.12 * facing) * uGlow * (0.8 + 0.2 * sin(uTime * 2.0 + vY * 4.0)));
  }`

function build(scene: THREE.Scene) {
  const head = new THREE.Group()
  scene.add(head)
  const shared = uniforms()
  const material = (fragment: string, extra: Partial<THREE.ShaderMaterialParameters> = {}) => new THREE.ShaderMaterial({ uniforms: shared, vertexShader, fragmentShader: fragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, ...extra })
  const geometry = headGeometry()
  head.add(new THREE.Mesh(geometry, material(fragmentShader)))
  // A sparser mesh for the wireframe, so the features stay readable.
  const wire = new THREE.Mesh(headGeometry(44), material(wireShader, { wireframe: true }))
  wire.scale.setScalar(1.004)
  head.add(wire)

  // Almond eyes with a bright core.
  const eyes: THREE.Group[] = []
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
  const irisMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), eyeMaterial)
    shell.scale.set(0.2, 0.085, 0.06)
    const core = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), irisMaterial)
    core.scale.set(0.05, 0.04, 0.03); core.position.z = 0.04
    eye.add(shell, core)
    eye.position.set(side * 0.35, 0.03, 0.66)
    eye.rotation.z = side * -0.38
    head.add(eye); eyes.push(eye)
  }

  // Mouth: a glowing slit that opens with his voice.
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }))
  mouth.position.set(0, -0.84, 0.43)
  head.add(mouth)

  // Projector: beam, rings and rising particles.
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.15, 1.6, 48, 1, true), new THREE.ShaderMaterial({
    uniforms: shared, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: 'varying float vY; void main(){ vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 uColor; uniform float uGlow; varying float vY; void main(){ gl_FragColor = vec4(uColor, (0.5 - vY * 0.3) * 0.18 * uGlow); }',
  }))
  beam.position.y = -2.15
  beam.rotation.x = Math.PI
  scene.add(beam)
  const rings: THREE.Mesh[] = []
  for (const [radius, y] of [[1.15, -2.95], [0.85, -2.9], [1.45, -3.0]]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.025, 96), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
    ring.rotation.x = -Math.PI / 2; ring.position.y = y
    scene.add(ring); rings.push(ring)
  }
  const count = 260, dots = new Float32Array(count * 3), speeds = new Float32Array(count)
  for (let index = 0; index < count; index++) {
    const angle = Math.random() * Math.PI * 2, radius = Math.random() * 1.3
    dots.set([Math.cos(angle) * radius, -3 + Math.random() * 4.6, Math.sin(angle) * radius], index * 3)
    speeds[index] = 0.15 + Math.random() * 0.45
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(dots, 3))
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: '#ffffff', size: 0.025, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }))
  scene.add(particles)
  return { head, eyes, mouth, rings, particles, speeds, shared, materials: [eyeMaterial, irisMaterial, mouth.material as THREE.MeshBasicMaterial, ...rings.map(ring => ring.material as THREE.MeshBasicMaterial), particles.material as THREE.PointsMaterial] }
}

function animate(canvas: HTMLCanvasElement, status: () => TalkStatus) {
  let renderer: THREE.WebGLRenderer
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }) } catch { return () => {} }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.set(0, -0.35, 8.2)
  camera.lookAt(0, -0.65, 0)
  const parts = build(scene)
  const color = new THREE.Color(moods.off.color), dim = new THREE.Color()
  let glow = moods.off.glow, scan = moods.off.scan, mouth = 0, blink = 0, nextBlink = 2, frame = 0, last = performance.now(), time = 0
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height; camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize()
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    if (document.hidden) return
    const delta = Math.min(0.05, (now - last) / 1000); last = now; time += delta
    const state = status(), mood = moods[state]
    const ease = 1 - Math.exp(-delta * 4)
    color.lerp(mood.color, ease); glow += (mood.glow - glow) * ease; scan += (mood.scan - scan) * ease
    // Voice drives the jaw; the microphone makes him brighten while you talk.
    const target = state === 'speaking' ? talkMode.outputLevel() : 0
    mouth += (target - mouth) * (1 - Math.exp(-delta * (target > mouth ? 30 : 14)))
    const breathe = state === 'sleeping' || state === 'off' ? 0.12 * Math.sin(time * 1.3) : 0
    const hearing = state === 'listening' || state === 'hearing' ? talkMode.inputLevel() * 0.35 : 0
    const shared = parts.shared as Uniforms
    shared.uColor.value.copy(color); shared.uGlow.value = glow + breathe + hearing + mouth * 0.08; shared.uTime.value = time; shared.uScan.value = scan; shared.uMouth.value = mouth
    dim.copy(color).multiplyScalar(0.9)
    for (const material of parts.materials) material.color.copy(dim)
    // Head motion: slow drift, a nod while speaking, a tilt while thinking.
    parts.head.rotation.y = Math.sin(time * 0.35) * 0.22 + (state === 'thinking' ? Math.sin(time * 1.7) * 0.08 : 0)
    parts.head.rotation.x = -0.05 + Math.sin(time * 0.5) * 0.04 - mouth * 0.05
    parts.head.rotation.z = state === 'thinking' ? Math.sin(time * 0.9) * 0.05 : 0
    parts.head.position.y = Math.sin(time * 0.8) * 0.05
    // Eyes: blink now and then, close to slits while asleep.
    if (time > nextBlink) { blink = 1; nextBlink = time + 2.5 + Math.random() * 4 }
    blink = Math.max(0, blink - delta * 7)
    const open = (state === 'sleeping' || state === 'off' ? 0.18 : 1) * (1 - Math.sin(blink * Math.PI) * 0.92)
    for (const eye of parts.eyes) eye.scale.y += (open - eye.scale.y) * (1 - Math.exp(-delta * 18))
    ;(parts.materials[0] as THREE.MeshBasicMaterial).opacity = 0.35 + glow * 0.45
    parts.mouth.scale.set(0.16 + mouth * 0.05, 0.008 + mouth * 0.075, 0.03)
    ;(parts.mouth.material as THREE.MeshBasicMaterial).opacity = 0.4 + mouth * 0.6
    parts.rings.forEach((ring, index) => { ring.rotation.z += delta * (index % 2 ? -1 : 1) * (0.2 + scan * 0.4); ring.scale.setScalar(1 + Math.sin(time * 2 + index) * 0.02 + mouth * 0.04) })
    const positions = parts.particles.geometry.attributes.position as THREE.BufferAttribute
    for (let index = 0; index < positions.count; index++) {
      let y = positions.getY(index) + delta * parts.speeds[index] * (0.6 + scan)
      if (y > 1.8) y = -3
      positions.setY(index, y)
    }
    positions.needsUpdate = true
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame); observer.disconnect()
    scene.traverse(object => {
      const mesh = object as THREE.Mesh
      mesh.geometry?.dispose()
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined
      ;(Array.isArray(material) ? material : material ? [material] : []).forEach(item => item.dispose())
    })
    renderer.dispose()
  }
}

export default function JarvisFace() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const talk = useSyncExternalStore(talkMode.subscribe, talkMode.snapshot)
  useEffect(() => canvas.current ? animate(canvas.current, () => talkMode.snapshot().status) : undefined, [])
  const active = !['off', 'error'].includes(talk.status)
  const hint = talk.status === 'off' ? 'Tap the face to wake Jarvis' : talk.status === 'sleeping' ? 'Say “Hey Jarvis” or tap to wake him' : talk.status === 'speaking' ? 'Tap to interrupt · “Go to sleep, Jarvis” to rest' : 'Listening until you say “Go to sleep, Jarvis”'
  const last = [...talk.lines].reverse().find(line => line.role === 'assistant')
  // A tap wakes him or interrupts a reply; it never switches him off.
  const tap = () => { if (talk.status !== 'listening' && talk.status !== 'hearing') talkMode.tap() }
  return <section className={`jarvis-face is-${talk.status}`} aria-label="Jarvis">
    <button className="jarvis-face-stage" onClick={tap} aria-label={talk.status === 'off' ? 'Wake Jarvis' : talkLabels[talk.status]}>
      <canvas ref={canvas} />
    </button>
    <div className="jarvis-face-caption">
      <strong>JARVIS</strong>
      <span role="status">{talkLabels[talk.status] === 'Talk to Jarvis' ? 'Offline' : talkLabels[talk.status]}</span>
      <small>{hint}</small>
      {last && active && <p>{last.text}</p>}
      {talk.error && <p className="jarvis-face-error" role="alert">{talk.error}</p>}
      {active && <button className="jarvis-face-off" onClick={() => talkMode.stop()}>Turn off</button>}
    </div>
  </section>
}
