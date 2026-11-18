// Jarvis's holographic face for the Workspace home: a scanned human head
// (Lee Perry-Smith, CC BY 3.0, see THIRD_PARTY_NOTICES.md) drawn as a glowing
// wireframe hologram with Three.js, in a neural-network field. The jaw follows the loudness of his voice. Tap it once to wake him;
// he then listens until "go to sleep, Jarvis".
import { useEffect, useRef, useSyncExternalStore } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import headUrl from '../assets/jarvis-head.glb?url'
import { talkMode } from './talk'
import { talkLabels, type TalkStatus } from '../lib/talk'

interface Mood { color: THREE.Color; glow: number; scan: number }
const moods: Record<TalkStatus, Mood> = {
  off: { color: new THREE.Color('#2f7fd6'), glow: 0.55, scan: 0.25 },
  error: { color: new THREE.Color('#e0727f'), glow: 0.7, scan: 0.3 },
  starting: { color: new THREE.Color('#44a6ff'), glow: 0.85, scan: 0.8 },
  sleeping: { color: new THREE.Color('#6d5cf0'), glow: 0.55, scan: 0.2 },
  listening: { color: new THREE.Color('#3fb6ff'), glow: 1.0, scan: 0.5 },
  hearing: { color: new THREE.Color('#5cc8ff'), glow: 1.1, scan: 0.7 },
  thinking: { color: new THREE.Color('#3fe0ff'), glow: 1.05, scan: 1.8 },
  speaking: { color: new THREE.Color('#62c6ff'), glow: 1.15, scan: 0.9 },
}

const smooth = (edge0: number, edge1: number, x: number) => { const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0))); return t * t * (3 - 2 * t) }
const WHITE = new THREE.Color('#ffffff')

// The scan's own units: chin near y=-1, crown at 4, nose tip forward on +z.
// Scale it to about two units tall, centred on the face, and mark the jaw
// (between the lips and the chin, at the front) that drops when he speaks.
const HEAD_SCALE = 0.4, HEAD_LIFT = -1.5
function prepareHead(source: THREE.BufferGeometry) {
  const geometry = source.clone()
  geometry.deleteAttribute('uv')
  geometry.translate(0, HEAD_LIFT, 0); geometry.scale(HEAD_SCALE, HEAD_SCALE, HEAD_SCALE)
  const position = geometry.attributes.position as THREE.BufferAttribute
  const jaw = new Float32Array(position.count)
  for (let index = 0; index < position.count; index++) {
    const y = position.getY(index) / HEAD_SCALE - HEAD_LIFT, z = position.getZ(index) / HEAD_SCALE
    jaw[index] = smooth(0.43, 0.3, y) * smooth(-1.6, -0.95, y) * smooth(0.6, 1.5, z)
  }
  geometry.setAttribute('jaw', new THREE.BufferAttribute(jaw, 1))
  return geometry
}
const facePoint = (x: number, y: number, z: number) => new THREE.Vector3(x * HEAD_SCALE, (y + HEAD_LIFT) * HEAD_SCALE, z * HEAD_SCALE)

let glowMap: THREE.Texture | null = null
function glowTexture() {
  if (glowMap) return glowMap
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')!
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)'); gradient.addColorStop(0.25, 'rgba(255,255,255,0.55)'); gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient; context.fillRect(0, 0, 64, 64)
  glowMap = new THREE.CanvasTexture(canvas)
  return glowMap
}

const uniforms = () => ({ uColor: { value: new THREE.Color() }, uGlow: { value: 1 }, uTime: { value: 0 }, uScan: { value: 0.5 }, uMouth: { value: 0 } })
type Uniforms = ReturnType<typeof uniforms>

const surfaceVertex = `
  attribute float jaw;
  uniform float uMouth;
  varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
  void main() {
    vec3 p = position;
    p.y -= jaw * uMouth * 0.11;
    p.z -= jaw * uMouth * 0.015;
    vec4 world = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-world.xyz);
    vPos = position;
    gl_Position = projectionMatrix * world;
  }`
// A dark, solid surface with a fine glowing grid, soft key light to show the
// features, a bright silhouette and a passing scan band.
const surfaceFragment = `
  uniform vec3 uColor; uniform float uGlow; uniform float uTime; uniform float uScan;
  varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
  float line(float value) { float width = fwidth(value); float d = abs(fract(value - 0.5) - 0.5); return 1.0 - smoothstep(0.0, width * 1.2, d); }
  void main() {
    vec3 n = normalize(vNormal);
    float facing = max(dot(n, vView), 0.0);
    float rim = pow(1.0 - facing, 3.0);
    float light = max(dot(n, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
    float angle = atan(vPos.x, vPos.z) * 15.0;
    float grid = max(line(vPos.y * 34.0), line(angle));
    float band = exp(-pow((vPos.y - (1.4 - mod(uTime * uScan, 5.0))) * 6.0, 2.0));
    float flicker = 0.95 + 0.05 * sin(uTime * 31.0) * sin(uTime * 7.0);
    float fade = smoothstep(-1.55, -0.55, vPos.y); // shoulders melt into the dark
    vec3 fill = vec3(0.003, 0.01, 0.026) + uColor * (0.015 + 0.13 * light * light) * fade;
    vec3 glow = uColor * (grid * (0.12 + 0.7 * light * light + 0.25 * rim) + rim * 0.6 + band * 0.22) * uGlow * flicker * fade;
    gl_FragColor = vec4(fill + glow, 1.0);
  }`

function build(scene: THREE.Scene) {
  const shared = uniforms()
  // Solid, so the face hides the neck and the network behind it.
  const surface = () => new THREE.ShaderMaterial({ uniforms: shared, vertexShader: surfaceVertex, fragmentShader: surfaceFragment })
  const figure = new THREE.Group(), head = new THREE.Group()
  figure.add(head); scene.add(figure)
  const sprite = (opacity: number) => new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffffff', transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false })
  // Glowing eyes: a soft halo and a hot core.
  const eyes: THREE.Group[] = []
  const eyeMaterials: THREE.SpriteMaterial[] = []
  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    const halo = new THREE.Sprite(sprite(0.4)); halo.scale.set(0.3, 0.16, 1); halo.renderOrder = 5
    const core = new THREE.Sprite(sprite(1)); core.scale.set(0.09, 0.06, 1); core.renderOrder = 6
    eye.add(halo, core); eye.position.copy(facePoint(side * 0.72, 1.74, 2.05))
    eyeMaterials.push(halo.material, core.material)
    head.add(eye); eyes.push(eye)
  }
  // Mouth glow between the lips, brighter as he speaks.
  const mouth = new THREE.Sprite(sprite(0.4)); mouth.position.copy(facePoint(0, 0.4, 2.3)); mouth.renderOrder = 5
  head.add(mouth)
  const sparkleMaterial = new THREE.PointsMaterial({ map: glowTexture(), color: '#ffffff', size: 0.06, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })
  // The head arrives once the model has loaded; light points twinkle across it.
  const attachHead = (source: THREE.BufferGeometry) => {
    const geometry = prepareHead(source)
    head.add(new THREE.Mesh(geometry, surface()))
    const position = geometry.attributes.position as THREE.BufferAttribute, normal = geometry.attributes.normal as THREE.BufferAttribute
    const points: number[] = []
    for (let added = 0, tries = 0; added < 650 && tries < 20000; tries++) {
      const at = Math.floor(Math.random() * position.count)
      if (position.getY(at) < -0.9) continue
      points.push(position.getX(at) + normal.getX(at) * 0.01, position.getY(at) + normal.getY(at) * 0.01, position.getZ(at) + normal.getZ(at) * 0.01); added++
    }
    head.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3)), sparkleMaterial))
  }
  // The neural-network field behind him: nodes, links and soft bokeh.
  const network = new THREE.Group(); scene.add(network)
  const nodes: THREE.Vector3[] = []
  for (let index = 0; index < 150; index++) nodes.push(new THREE.Vector3((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 9, -2.5 - Math.random() * 6))
  const links: number[] = []
  for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) if (nodes[a].distanceTo(nodes[b]) < 1.9) links.push(...nodes[a].toArray(), ...nodes[b].toArray())
  const lineMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
  network.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(links, 3)), lineMaterial))
  const nodeMaterial = new THREE.PointsMaterial({ map: glowTexture(), color: '#ffffff', size: 0.16, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
  network.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(nodes), nodeMaterial))
  const bokeh: number[] = []
  for (let index = 0; index < 60; index++) bokeh.push((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8, -1 - Math.random() * 7)
  const bokehMaterial = new THREE.PointsMaterial({ map: glowTexture(), color: '#ffffff', size: 0.9, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false })
  network.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(bokeh, 3)), bokehMaterial))
  return { figure, head, eyes, eyeMaterials, mouth, sparkleMaterial, attachHead, network, shared, tinted: [lineMaterial, nodeMaterial, bokehMaterial, sparkleMaterial] }
}

function animate(canvas: HTMLCanvasElement, status: () => TalkStatus) {
  let renderer: THREE.WebGLRenderer
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }) } catch { return () => {} }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor('#020611')
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60)
  camera.position.set(0, 0.05, 5.6)
  const parts = build(scene)
  let disposed = false
  new GLTFLoader().load(headUrl, gltf => {
    if (disposed) return
    gltf.scene.traverse(object => { const mesh = object as THREE.Mesh; if (mesh.isMesh) parts.attachHead(mesh.geometry) })
  })
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.32, 0.38)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())
  const color = new THREE.Color(moods.off.color), soft = new THREE.Color()
  let glow = moods.off.glow, scan = moods.off.scan, mouth = 0, blink = 0, nextBlink = 2, frame = 0, last = performance.now(), time = 0
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    if (!width || !height) return
    renderer.setSize(width, height, false); composer.setSize(width, height)
    camera.aspect = width / height; camera.updateProjectionMatrix()
    // Keep him in the left part of a wide panel, centred in a narrow one.
    const visible = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect
    parts.figure.position.x = camera.aspect > 1.3 ? -visible * 0.24 : 0
    camera.lookAt(0, -0.12, 0)
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize()
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    if (document.hidden) return
    const delta = Math.min(0.05, (now - last) / 1000); last = now; time += delta
    const state = status(), mood = moods[state]
    const ease = 1 - Math.exp(-delta * 4)
    color.lerp(mood.color, ease); glow += (mood.glow - glow) * ease; scan += (mood.scan - scan) * ease
    // His voice drives the jaw; your voice makes the hologram brighten.
    // Tests can hold the mouth open with window.jarvisMouth.
    const forced = (window as Window & { jarvisMouth?: number }).jarvisMouth
    const target = forced ?? (state === 'speaking' ? talkMode.outputLevel() : 0)
    mouth += (target - mouth) * (1 - Math.exp(-delta * (target > mouth ? 30 : 14)))
    const breathe = state === 'sleeping' || state === 'off' ? 0.1 * Math.sin(time * 1.3) : 0
    const hearing = state === 'listening' || state === 'hearing' ? talkMode.inputLevel() * 0.3 : 0
    const shared = parts.shared as Uniforms
    shared.uColor.value.copy(color); shared.uGlow.value = glow + breathe + hearing; shared.uTime.value = time; shared.uScan.value = scan; shared.uMouth.value = mouth
    soft.copy(color).lerp(WHITE, 0.25)
    for (const material of parts.tinted) material.color.copy(soft)
    for (const material of parts.eyeMaterials) material.color.copy(soft).lerp(WHITE, 0.5)
    bloom.strength = 0.45 + glow * 0.3 + mouth * 0.2
    // Gentle life: drift, a nod while speaking, a tilt while thinking.
    parts.head.rotation.y = -0.18 + Math.sin(time * 0.33) * 0.09 + (state === 'thinking' ? Math.sin(time * 1.6) * 0.07 : 0)
    parts.head.rotation.x = Math.sin(time * 0.5) * 0.03 - mouth * 0.04
    parts.head.rotation.z = state === 'thinking' ? Math.sin(time * 0.9) * 0.04 : 0
    parts.figure.rotation.y = -0.12 + Math.sin(time * 0.33) * 0.03
    parts.figure.position.y = Math.sin(time * 0.7) * 0.03
    // Eyes: blink now and then; dim slits while asleep or off.
    if (time > nextBlink) { blink = 1; nextBlink = time + 2.5 + Math.random() * 4 }
    blink = Math.max(0, blink - delta * 7)
    const resting = state === 'sleeping' || state === 'off'
    const open = (resting ? 0.25 : 1) * (1 - Math.sin(blink * Math.PI) * 0.9)
    for (const eye of parts.eyes) { eye.scale.y += (open - eye.scale.y) * (1 - Math.exp(-delta * 18)); eye.scale.x = resting ? 0.85 : 1 }
    parts.eyeMaterials.forEach((material, index) => { material.opacity = (index % 2 ? 0.95 : 0.4) * (resting ? 0.45 : 0.55 + glow * 0.35) })
    parts.mouth.scale.set(0.12 + mouth * 0.04, 0.01 + mouth * 0.05, 1)
    ;(parts.mouth.material as THREE.SpriteMaterial).opacity = mouth * 0.5
    parts.sparkleMaterial.opacity = 0.55 + 0.35 * Math.sin(time * 3.1) * Math.sin(time * 1.7)
    parts.network.rotation.y = Math.sin(time * 0.05) * 0.15
    parts.network.position.x = Math.sin(time * 0.08) * 0.3
    composer.render()
  }
  frame = requestAnimationFrame(tick)
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect()
    scene.traverse(object => {
      const mesh = object as THREE.Mesh
      mesh.geometry?.dispose()
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined
      ;(Array.isArray(material) ? material : material ? [material] : []).forEach(item => item.dispose())
    })
    composer.dispose(); renderer.dispose()
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
      <span role="status">{talk.status === 'off' || talk.status === 'error' ? 'Offline' : talkLabels[talk.status]}</span>
      <small>{hint}</small>
      {last && active && <p>{last.text}</p>}
      {talk.error && <p className="jarvis-face-error">{talk.error}</p>}
      {active && <button className="jarvis-face-off" onClick={() => talkMode.stop()}>Turn off</button>}
    </div>
  </section>
}
