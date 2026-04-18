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
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xffffff, 0.06)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 7)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const geometry = new THREE.TorusKnotGeometry(1.15, 0.32, 280, 40)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 1,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
    })

    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)

    const wire = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#D4AF37'),
        transparent: true,
        opacity: 0.16,
        wireframe: true,
        depthWrite: false,
      }),
    )
    group.add(wire)

    const particleCount = 1800
    const particlesGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const basePositions = new Float32Array(particleCount * 3)
    const seeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i += 1) {
      const r = 1.8 + Math.random() * 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const ix = i * 3

      positions[ix] = r * Math.sin(phi) * Math.cos(theta)
      positions[ix + 1] = r * Math.cos(phi)
      positions[ix + 2] = r * Math.sin(phi) * Math.sin(theta)

      basePositions[ix] = positions[ix]
      basePositions[ix + 1] = positions[ix + 1]
      basePositions[ix + 2] = positions[ix + 2]

      seeds[i] = Math.random()
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )

    const particlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#D4AF37'),
      transparent: true,
      opacity: 0.22,
      size: 0.015,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    group.add(particles)

    const keyLight = new THREE.PointLight(0xd4af37, 2.4, 30)
    keyLight.position.set(3, 2, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xffffff, 1.1, 30)
    fillLight.position.set(-4.5, -2.5, 7.5)
    scene.add(fillLight)

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize)

    const pointer = new THREE.Vector2(0, 0)
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1)
      const y = (e.clientY - rect.top) / Math.max(rect.height, 1)
      pointer.set((x - 0.5) * 2, (0.5 - y) * 2)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let raf = 0
    const clock = new THREE.Clock()

    const render = () => {
      const t = clock.getElapsedTime()
      const px = pointer.x
      const py = pointer.y

      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        t * 0.12 + py * 0.22,
        0.06,
      )
      group.rotation.y = THREE.MathUtils.lerp(
        group.rotation.y,
        t * 0.18 + px * 0.34,
        0.06,
      )
      group.position.y = Math.sin(t * 0.7) * 0.06

      particles.rotation.y = -t * 0.06
      particles.rotation.x = t * 0.03

      const pos = particlesGeometry.getAttribute('position') as THREE.BufferAttribute
      const arr = pos.array as Float32Array
      for (let i = 0; i < particleCount; i += 1) {
        const ix = i * 3
        arr[ix] =
          basePositions[ix] +
          Math.sin(t * (0.35 + seeds[i] * 0.8) + seeds[i] * 12) * 0.012
        arr[ix + 1] =
          basePositions[ix + 1] +
          Math.sin(t * (0.55 + seeds[i]) + seeds[i] * 10) * 0.02
        arr[ix + 2] =
          basePositions[ix + 2] +
          Math.cos(t * (0.45 + seeds[i] * 0.6) + seeds[i] * 8) * 0.012
      }
      pos.needsUpdate = true

      particlesMaterial.opacity = 0.18 + Math.sin(t * 0.8) * 0.04

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        px * 0.35,
        0.05,
      )
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        py * 0.2,
        0.05,
      )
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      raf = window.requestAnimationFrame(render)
    }

    if (prefersReducedMotion) {
      renderer.render(scene, camera)
    } else {
      render()
    }

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)

      geometry.dispose()
      particlesGeometry.dispose()
      material.dispose();
      (wire.material as THREE.Material).dispose()
      particlesMaterial.dispose()
      renderer.dispose()

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement)
      }

      startedRef.current = false
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 opacity-100" />
}
