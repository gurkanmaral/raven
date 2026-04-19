import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function HeroThree() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return
    if (startedRef.current) return
    startedRef.current = true

    const container = containerRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Renderer ───────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x03050d, 0.032)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(1.2, 1.1, 9.5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Disposal tracking
    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[] = []
    const addGeo = <T extends THREE.BufferGeometry>(g: T): T => { geos.push(g); return g }
    const addMat = <T extends THREE.Material>(m: T): T => { mats.push(m); return m }

    const root = new THREE.Group()
    scene.add(root)

    // ── Materials ──────────────────────────────────────────────────────
    // Semi-transparent dark pipe — lets the glowing coolant inside show through
    const pipeMat = addMat(new THREE.MeshPhysicalMaterial({
      color: '#1c2d3e',
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.7,
    }))

    const pipeMatThick = addMat(new THREE.MeshPhysicalMaterial({
      color: '#162030',
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.5,
      transparent: true,
      opacity: 0.62,
    }))

    // Orange accent — hot side / industrial fittings
    const goldMat = addMat(new THREE.MeshPhysicalMaterial({
      color: '#ff6b1a',
      metalness: 0.9,
      roughness: 0.18,
      clearcoat: 1.0,
    }))

    const steelMat = addMat(new THREE.MeshPhysicalMaterial({
      color: '#2e404e',
      metalness: 0.85,
      roughness: 0.3,
      clearcoat: 0.4,
    }))

    const hxBodyMat = addMat(new THREE.MeshPhysicalMaterial({
      color: '#090f18',
      metalness: 0.78,
      roughness: 0.25,
      clearcoat: 0.55,
    }))

    const finMat = addMat(new THREE.MeshStandardMaterial({
      color: '#0d1820',
      metalness: 0.68,
      roughness: 0.42,
    }))

    const glowCoreMat = addMat(new THREE.MeshStandardMaterial({
      color: '#001a14',
      emissive: '#00cc99',
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.72,
    }))

    // ── Main Coolant Loop (closed circuit) ─────────────────────────────
    // Traces the full refrigerant circuit — top supply rail → right riser →
    // bottom return rail → left riser → back to heat exchanger
    const mainLoop = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.52, 1.05, 0),      // out of HX top-right
      new THREE.Vector3(2.1, 1.05, 0.25),    // top rail right
      new THREE.Vector3(3.05, 0.55, 0.38),   // upper-right corner
      new THREE.Vector3(3.2, 0, 0.35),       // right vertical mid
      new THREE.Vector3(3.05, -0.58, 0.28),  // lower-right corner
      new THREE.Vector3(2.1, -1.05, 0.18),   // bottom rail right
      new THREE.Vector3(0, -1.15, 0.08),     // bottom center
      new THREE.Vector3(-2.1, -1.05, -0.02), // bottom rail left
      new THREE.Vector3(-3.05, -0.58, -0.1), // lower-left corner
      new THREE.Vector3(-3.2, 0, -0.15),     // left vertical mid
      new THREE.Vector3(-3.05, 0.55, -0.08), // upper-left corner
      new THREE.Vector3(-2.1, 1.05, 0),      // top rail left
      new THREE.Vector3(-0.52, 1.05, 0),     // into HX top-left
    ], true)

    root.add(new THREE.Mesh(
      addGeo(new THREE.TubeGeometry(mainLoop, 220, 0.1, 14, true)),
      pipeMat,
    ))

    // ── Secondary branch loop (closer to camera, smaller pipes) ────────
    const branchLoop = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, 0.65, 0.7),
      new THREE.Vector3(1.7, 0.65, 0.9),
      new THREE.Vector3(2.35, 0.2, 1.0),
      new THREE.Vector3(2.35, -0.38, 0.95),
      new THREE.Vector3(1.7, -0.78, 0.82),
      new THREE.Vector3(0, -0.95, 0.72),
      new THREE.Vector3(-1.7, -0.78, 0.62),
      new THREE.Vector3(-2.35, -0.38, 0.62),
      new THREE.Vector3(-2.35, 0.2, 0.68),
      new THREE.Vector3(-1.7, 0.65, 0.78),
      new THREE.Vector3(-0.3, 0.65, 0.72),
    ], true)

    root.add(new THREE.Mesh(
      addGeo(new THREE.TubeGeometry(branchLoop, 160, 0.065, 10, true)),
      pipeMatThick,
    ))

    // ── Heat Exchanger (center) ────────────────────────────────────────
    const hxGroup = new THREE.Group()
    root.add(hxGroup)

    // Main cylindrical body
    hxGroup.add(new THREE.Mesh(addGeo(new THREE.CylinderGeometry(0.46, 0.46, 2.5, 32)), hxBodyMat))

    // Top & bottom end caps
    const capGeo = addGeo(new THREE.CylinderGeometry(0.52, 0.52, 0.09, 32))
    ;[1.3, -1.3].forEach(y => {
      const cap = new THREE.Mesh(capGeo, steelMat)
      cap.position.y = y
      hxGroup.add(cap)
    })

    // Cooling fin rings (torus)
    for (let i = 0; i < 16; i++) {
      const fin = new THREE.Mesh(
        addGeo(new THREE.TorusGeometry(0.54, 0.019, 8, 48)),
        finMat,
      )
      fin.rotation.x = Math.PI / 2
      fin.position.y = -1.08 + i * 0.148
      hxGroup.add(fin)
    }

    // Gold accent bands
    ;[-1.1, 0, 1.1].forEach(y => {
      const band = new THREE.Mesh(addGeo(new THREE.TorusGeometry(0.48, 0.03, 8, 40)), goldMat)
      band.rotation.x = Math.PI / 2
      band.position.y = y
      hxGroup.add(band)
    })

    // Glowing inner core (visible through semi-transparent pipe)
    hxGroup.add(new THREE.Mesh(addGeo(new THREE.CylinderGeometry(0.31, 0.31, 2.3, 24)), glowCoreMat))

    // ── Pipe Flanges (gold collars on main loop) ───────────────────────
    const flangeTPositions = [0.06, 0.17, 0.31, 0.44, 0.56, 0.69, 0.82, 0.94]
    flangeTPositions.forEach(t => {
      const pos = mainLoop.getPoint(t)
      const tangent = mainLoop.getTangent(t).normalize()
      const flange = new THREE.Mesh(addGeo(new THREE.TorusGeometry(0.145, 0.03, 8, 28)), goldMat)
      flange.position.copy(pos)
      flange.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
      root.add(flange)
    })

    // ── Industrial Valves at two points on main loop ───────────────────
    ;[0.25, 0.75].forEach(t => {
      const pos = mainLoop.getPoint(t)
      const tangent = mainLoop.getTangent(t).normalize()
      const vGroup = new THREE.Group()
      vGroup.position.copy(pos)
      vGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
      root.add(vGroup)

      // Body block
      vGroup.add(new THREE.Mesh(
        addGeo(new THREE.BoxGeometry(0.19, 0.3, 0.19)),
        hxBodyMat,
      ))

      // Handwheel
      const wheel = new THREE.Mesh(addGeo(new THREE.TorusGeometry(0.15, 0.023, 8, 24)), goldMat)
      wheel.position.y = 0.24
      vGroup.add(wheel)

      // Wheel spokes
      for (let s = 0; s < 4; s++) {
        const spoke = new THREE.Mesh(addGeo(new THREE.BoxGeometry(0.29, 0.022, 0.022)), goldMat)
        spoke.position.y = 0.24
        spoke.rotation.z = (s / 4) * Math.PI
        vGroup.add(spoke)
      }

      // Stem
      const stem = new THREE.Mesh(addGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.12, 10)), steelMat)
      stem.position.y = 0.15
      vGroup.add(stem)
    })

    // ── Pump unit (right side, on main loop) ──────────────────────────
    const pumpG = new THREE.Group()
    const pumpPos = mainLoop.getPoint(0.12)
    pumpG.position.copy(pumpPos)
    root.add(pumpG)

    const pumpBody = new THREE.Mesh(addGeo(new THREE.CylinderGeometry(0.28, 0.3, 0.5, 24)), hxBodyMat)
    pumpBody.rotation.z = Math.PI / 2
    pumpG.add(pumpBody)

    ;[-0.28, 0.28].forEach(x => {
      const end = new THREE.Mesh(addGeo(new THREE.CylinderGeometry(0.31, 0.31, 0.055, 24)), steelMat)
      end.rotation.z = Math.PI / 2
      end.position.x = x
      pumpG.add(end)
    })

    const pumpRing = new THREE.Mesh(addGeo(new THREE.TorusGeometry(0.3, 0.026, 8, 26)), goldMat)
    pumpRing.rotation.z = Math.PI / 2
    pumpG.add(pumpRing)

    // ── Floor Grid ─────────────────────────────────────────────────────
    const grid = new THREE.GridHelper(28, 44, 0x0c1c2a, 0x091018)
    grid.position.y = -1.9
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.55
    scene.add(grid)

    // ── Coolant Flow Particles — Main Loop ────────────────────────────
    // Particles travel along the exact curve path, visible through
    // the semi-transparent pipe as glowing blue coolant
    const MF_N = 450
    const mfGeo = addGeo(new THREE.BufferGeometry())
    const mfPos = new Float32Array(MF_N * 3)
    const mfT = new Float32Array(MF_N)   // position along curve (0-1)
    const mfSpd = new Float32Array(MF_N)
    for (let i = 0; i < MF_N; i++) {
      mfT[i] = i / MF_N
      mfSpd[i] = 0.052 + Math.random() * 0.038
      const pt = mainLoop.getPoint(mfT[i])
      mfPos[i * 3] = pt.x; mfPos[i * 3 + 1] = pt.y; mfPos[i * 3 + 2] = pt.z
    }
    mfGeo.setAttribute('position', new THREE.BufferAttribute(mfPos, 3))
    const mfMat = addMat(new THREE.PointsMaterial({
      color: '#00ffcc',
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
    root.add(new THREE.Points(mfGeo, mfMat))

    // ── Coolant Flow Particles — Branch Loop ──────────────────────────
    const BF_N = 220
    const bfGeo = addGeo(new THREE.BufferGeometry())
    const bfPos = new Float32Array(BF_N * 3)
    const bfT = new Float32Array(BF_N)
    const bfSpd = new Float32Array(BF_N)
    for (let i = 0; i < BF_N; i++) {
      bfT[i] = i / BF_N
      bfSpd[i] = 0.038 + Math.random() * 0.028
      const pt = branchLoop.getPoint(bfT[i])
      bfPos[i * 3] = pt.x; bfPos[i * 3 + 1] = pt.y; bfPos[i * 3 + 2] = pt.z
    }
    bfGeo.setAttribute('position', new THREE.BufferAttribute(bfPos, 3))
    const bfMat = addMat(new THREE.PointsMaterial({
      color: '#55ffdd',
      size: 0.045,
      transparent: true,
      opacity: 0.62,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
    root.add(new THREE.Points(bfGeo, bfMat))

    // ── Cold Vapor Rising from HX Top ─────────────────────────────────
    const V_N = 280
    const vGeo = addGeo(new THREE.BufferGeometry())
    const vPos = new Float32Array(V_N * 3)
    const vVel = new Float32Array(V_N)
    const vPhase = new Float32Array(V_N)
    for (let i = 0; i < V_N; i++) {
      const ix = i * 3
      vPos[ix] = (Math.random() - 0.5) * 0.65
      vPos[ix + 1] = 1.35 + Math.random() * 1.9
      vPos[ix + 2] = (Math.random() - 0.5) * 0.65
      vVel[i] = 0.1 + Math.random() * 0.18
      vPhase[i] = Math.random() * Math.PI * 2
    }
    vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3))
    const vMat = addMat(new THREE.PointsMaterial({
      color: '#aaffee',
      size: 0.042,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
    root.add(new THREE.Points(vGeo, vMat))

    // ── Lights ─────────────────────────────────────────────────────────
    // Teal core inside heat exchanger (pulsing)
    const hxLight = new THREE.PointLight(0x00cc99, 4.2, 14)
    hxLight.position.set(0, 0, 0)
    root.add(hxLight)

    // Moving teal light that rides along the main pipe loop
    const riderLight = new THREE.PointLight(0x00ffcc, 2.4, 7)
    root.add(riderLight)

    // Warm orange key from upper-right
    const keyLight = new THREE.PointLight(0xff7722, 3.6, 60)
    keyLight.position.set(6, 4.5, 9)
    scene.add(keyLight)

    // Deep teal fill from left
    const fillBlue = new THREE.PointLight(0x0088aa, 2.6, 50)
    fillBlue.position.set(-8, 2, 5)
    scene.add(fillBlue)

    // Dark teal rim from behind
    const rimLight = new THREE.PointLight(0x004433, 2.2, 40)
    rimLight.position.set(0, 3.5, -8)
    scene.add(rimLight)

    // Soft white fill
    const softFill = new THREE.PointLight(0xffffff, 0.65, 50)
    softFill.position.set(-3, -4, 7)
    scene.add(softFill)

    scene.add(new THREE.AmbientLight(0x44aa88, 0.18))

    // ── Resize ─────────────────────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Pointer ─────────────────────────────────────────────────────────
    const ptr = new THREE.Vector2()
    const onPtr = (e: PointerEvent) => {
      const r = container.getBoundingClientRect()
      ptr.set(
        ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2,
        (0.5 - (e.clientY - r.top) / Math.max(r.height, 1)) * 2,
      )
    }
    if (!prefersReducedMotion) window.addEventListener('pointermove', onPtr, { passive: true })

    // ── Animation ──────────────────────────────────────────────────────
    let raf = 0
    const clock = new THREE.Clock()
    let lastT = 0
    let riderT = 0 // position on main loop for the light

    const render = () => {
      const t = clock.getElapsedTime()
      const dt = Math.min(t - lastT, 0.04)
      lastT = t

      // Gentle float + pointer tilt
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, ptr.y * 0.1 + Math.sin(t * 0.36) * 0.02, 0.05)
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, ptr.x * 0.15 + Math.cos(t * 0.29) * 0.025, 0.05)
      root.position.y = 0.6 + Math.sin(t * 0.46) * 0.06

      // HX pulse
      hxLight.intensity = 3.2 + Math.sin(t * 1.55) * 0.95
      glowCoreMat.emissiveIntensity = 0.55 + Math.sin(t * 1.15) * 0.18

      // Rider light travels the pipe loop
      riderT = (riderT + dt * 0.07) % 1
      const rp = mainLoop.getPoint(riderT)
      riderLight.position.copy(rp)

      // Advance main loop flow particles
      const mfAttr = mfGeo.getAttribute('position') as THREE.BufferAttribute
      const mfArr = mfAttr.array as Float32Array
      for (let i = 0; i < MF_N; i++) {
        mfT[i] = (mfT[i] + mfSpd[i] * dt) % 1
        const p = mainLoop.getPoint(mfT[i])
        mfArr[i * 3] = p.x; mfArr[i * 3 + 1] = p.y; mfArr[i * 3 + 2] = p.z
      }
      mfAttr.needsUpdate = true
      mfMat.opacity = 0.72 + Math.sin(t * 1.1) * 0.12

      // Advance branch loop flow particles
      const bfAttr = bfGeo.getAttribute('position') as THREE.BufferAttribute
      const bfArr = bfAttr.array as Float32Array
      for (let i = 0; i < BF_N; i++) {
        bfT[i] = (bfT[i] + bfSpd[i] * dt) % 1
        const p = branchLoop.getPoint(bfT[i])
        bfArr[i * 3] = p.x; bfArr[i * 3 + 1] = p.y; bfArr[i * 3 + 2] = p.z
      }
      bfAttr.needsUpdate = true

      // Cold vapor rises and drifts
      const vAttr = vGeo.getAttribute('position') as THREE.BufferAttribute
      const vArr = vAttr.array as Float32Array
      for (let i = 0; i < V_N; i++) {
        const ix = i * 3
        vArr[ix + 1] += vVel[i] * dt
        vArr[ix] += Math.sin(t * 0.5 + vPhase[i]) * dt * 0.03
        if (vArr[ix + 1] > 3.4) {
          vArr[ix + 1] = 1.38
          vArr[ix] = (Math.random() - 0.5) * 0.65
          vArr[ix + 2] = (Math.random() - 0.5) * 0.65
        }
      }
      vAttr.needsUpdate = true
      vMat.opacity = 0.16 + Math.sin(t * 0.82) * 0.06

      // Camera parallax
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 1.2 + ptr.x * 0.42, 0.04)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.1 + ptr.y * 0.26, 0.04)
      camera.lookAt(0, -0.3, 0)

      renderer.render(scene, camera)
      raf = window.requestAnimationFrame(render)
    }

    if (prefersReducedMotion) {
      camera.lookAt(0, -0.3, 0)
      renderer.render(scene, camera)
    } else {
      render()
    }

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPtr)
      geos.forEach(g => g.dispose())
      mats.forEach(m => m.dispose())
      ;(grid.material as THREE.Material).dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement)
      startedRef.current = false
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 opacity-100" />
}
