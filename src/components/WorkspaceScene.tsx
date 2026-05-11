'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WorkspaceScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100)
    camera.position.set(0, 4.2, 9)
    camera.lookAt(0, 1.2, 0)

    const gold    = new THREE.MeshBasicMaterial({ color: 0xc8a96e, wireframe: true })
    const dim     = new THREE.MeshBasicMaterial({ color: 0x2e2a1e, wireframe: true })
    const mid     = new THREE.MeshBasicMaterial({ color: 0x4a4030, wireframe: true })

    const pwrMat  = new THREE.MeshBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 1.0 })

    const group = new THREE.Group()
    scene.add(group)

    // ── FLOOR ──────────────────────────────────────────────
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 8, 12, 10), dim)
    floor.rotation.x = -Math.PI / 2
    group.add(floor)

    // ── DESK ───────────────────────────────────────────────
    const tabletop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.1, 1.8), gold)
    tabletop.position.set(0, 1.22, 0)
    group.add(tabletop)

    const apron = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.06, 0.04), mid)
    apron.position.set(0, 1.16, 0.92)
    group.add(apron)

    const legGeo = new THREE.BoxGeometry(0.07, 1.17, 0.07)
    const legXZ: [number, number][] = [[-2.05, -0.82], [2.05, -0.82], [-2.05, 0.82], [2.05, 0.82]]
    legXZ.forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, mid)
      leg.position.set(x, 0.585, z)
      group.add(leg)
    })

    const brace = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.04, 0.04), dim)
    brace.position.set(0, 0.5, 0)
    group.add(brace)

    // ── DESK MAT ───────────────────────────────────────────
    const mat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.012, 1.3), mid)
    mat.position.set(-0.1, 1.278, 0.1)
    group.add(mat)

    // ── ULTRAWIDE CURVED MONITOR ───────────────────────────
    // True arc: arc centre is IN FRONT of the monitor so segments bow inward (concave toward viewer)
    const segCount  = 14
    const monitorH  = 1.1
    const R         = 3.8           // curve radius (larger = flatter)
    const totalArc  = 0.72          // total arc in radians (~41°)
    const monCX     = 0
    const monCZ     = -0.68 + R     // centre in FRONT — produces inward curve
    const monY      = 2.44

    const segW = (R * totalArc) / segCount + 0.01

    for (let i = 0; i < segCount; i++) {
      const t     = (i + 0.5) / segCount - 0.5
      const angle = t * totalArc

      // Segments sit on the far side of the circle (away from viewer)
      const sx = monCX + Math.sin(angle) * R
      const sz = monCZ - Math.cos(angle) * R  // subtract to place behind centre

      // Bezel segment — faces inward (toward arc centre, i.e. toward viewer)
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(segW, monitorH + 0.07, 0.035), gold)
      bezel.position.set(sx, monY, sz)
      bezel.rotation.y = angle   // flip rotation so face points toward viewer
      group.add(bezel)

      // Screen face (slightly toward viewer from bezel)
      const screenFace = new THREE.Mesh(new THREE.BoxGeometry(segW - 0.01, monitorH - 0.04, 0.01), dim)
      screenFace.position.set(sx - Math.sin(angle) * 0.022, monY, sz + Math.cos(angle) * 0.022)
      screenFace.rotation.y = angle
      group.add(screenFace)
    }

    // Monitor neck + base
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.42, 0.07), mid)
    neck.position.set(0, 1.73, -0.68)
    group.add(neck)

    const monBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.3), mid)
    monBase.position.set(0, 1.275, -0.68)
    group.add(monBase)

// ── SPEAKERS ───────────────────────────────────────────
    const speakerDefs: [number, number, number, boolean][] = [
      [-1.6, 1.56, -0.55, false],
      [ 1.6, 1.56, -0.55, true],
    ]
    speakerDefs.forEach(([x, y, z, isRight]) => {
      const cab = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.62, 0.36), gold)
      cab.position.set(x, y, z)
      group.add(cab)

      const woofer = new THREE.Mesh(new THREE.CircleGeometry(0.13, 10), mid)
      woofer.position.set(x, y - 0.06, z + 0.185)
      group.add(woofer)

      const tweeter = new THREE.Mesh(new THREE.CircleGeometry(0.04, 8), dim)
      tweeter.position.set(x, y + 0.2, z + 0.185)
      group.add(tweeter)

      if (!isRight) {
        const amp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.1, 0.28), mid)
        amp.position.set(x, y + 0.37, z)
        group.add(amp)
      }
    })

    // ── KEYBOARD ───────────────────────────────────────────
    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.038, 0.42), gold)
    kb.position.set(-0.15, 1.304, 0.3)
    group.add(kb)

    const keyGeo = new THREE.BoxGeometry(0.068, 0.028, 0.068)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) {
        const key = new THREE.Mesh(keyGeo, col < 4 && row === 0 ? gold : dim)
        key.position.set(-0.72 + col * 0.077, 1.324, 0.13 + row * 0.08)
        group.add(key)
      }
    }

    // ── MOUSE ──────────────────────────────────────────────
    const mouse = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.1, 6, 10), gold)
    mouse.rotation.x = Math.PI / 2
    mouse.position.set(0.72, 1.31, 0.28)
    group.add(mouse)

    const scrollWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.04, 6), dim)
    scrollWheel.rotation.z = Math.PI / 2
    scrollWheel.position.set(0.72, 1.362, 0.18)
    group.add(scrollWheel)

    // ── PC TOWER ───────────────────────────────────────────
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.4, 0.56), gold)
    tower.position.set(2.6, 0.7, 0.1)
    group.add(tower)

    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.2, 0.02), mid)
    panel.position.set(2.6, 0.7, 0.39)
    group.add(panel)

    for (let i = 0; i < 3; i++) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.02), dim)
      bay.position.set(2.6, 1.1 - i * 0.12, 0.41)
      group.add(bay)
    }

    // Power button — uses animated pwrMat
    const pwrBtn = new THREE.Mesh(new THREE.CircleGeometry(0.028, 10), pwrMat)
    pwrBtn.position.set(2.62, 1.28, 0.41)
    group.add(pwrBtn)

    // Power button ring
    const pwrRing = new THREE.Mesh(new THREE.RingGeometry(0.028, 0.038, 10), mid)
    pwrRing.position.set(2.62, 1.28, 0.411)
    group.add(pwrRing)

    // ── CHAIR ──────────────────────────────────────────────
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.09, 0.95), gold)
    seat.position.set(-0.2, 0.82, 1.7)
    group.add(seat)

    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.04, 0.88), mid)
    cushion.position.set(-0.2, 0.875, 1.7)
    group.add(cushion)

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 0.09), gold)
    backrest.position.set(-0.2, 1.5, 2.17)
    backrest.rotation.x = 0.12
    group.add(backrest)

    const lumbar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.06), mid)
    lumbar.position.set(-0.2, 1.05, 2.18)
    lumbar.rotation.x = 0.12
    group.add(lumbar)

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.08), gold)
    headrest.position.set(-0.2, 2.12, 2.2)
    headrest.rotation.x = 0.18
    group.add(headrest)

    ;[-0.66, 0.26].forEach((x) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.52), mid)
      arm.position.set(x, 1.12, 1.72)
      group.add(arm)
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), dim)
      post.position.set(x, 0.97, 1.72)
      group.add(post)
    })

    const gasCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.52, 8), mid)
    gasCyl.position.set(-0.2, 0.555, 1.7)
    group.add(gasCyl)

    for (let i = 0; i < 5; i++) {
      const armAngle = (i / 5) * Math.PI * 2
      const baseArm = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.1), gold)
      baseArm.position.set(-0.2, 0.06, 1.7)
      baseArm.rotation.y = armAngle
      group.add(baseArm)

      const caster = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.06, 7), mid)
      caster.position.set(
        -0.2 + Math.sin(armAngle) * 0.34,
        0.055,
        1.7 + Math.cos(armAngle) * 0.34
      )
      group.add(caster)
    }

    // ── DUST PARTICLES ─────────────────────────────────────
    const particleCount = 120
    const positions = new Float32Array(particleCount * 3)
    const velocities: THREE.Vector3[] = []

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 5
      positions[i * 3 + 1] = Math.random() * 3.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        Math.random() * 0.003 + 0.001,
        (Math.random() - 0.5) * 0.002
      ))
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({ color: 0xc8a96e, size: 0.022, transparent: true, opacity: 0.55 })
    const particles = new THREE.Points(particleGeo, particleMat)
    group.add(particles)

    // ── LAMP LIGHT CONE ────────────────────────────────────
    const coneGeo = new THREE.ConeGeometry(0.55, 1.1, 12, 1, true)
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xc8a96e,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
    })
    const lampCone = new THREE.Mesh(coneGeo, coneMat)
    lampCone.position.set(1.08, 1.85, -0.5)
    group.add(lampCone)

    // Lamp objects (pole + shade reuse from original)
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 8), mid)
    lampBase.position.set(1.5, 1.24, -0.5)
    group.add(lampBase)

    const poleLower = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), dim)
    poleLower.position.set(1.5, 1.59, -0.5)
    group.add(poleLower)

    const poleArm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.55, 6), dim)
    poleArm.rotation.z = -Math.PI / 5
    poleArm.position.set(1.32, 2.14, -0.5)
    group.add(poleArm)

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 8, 1, true), gold)
    shade.position.set(1.08, 2.46, -0.5)
    group.add(shade)

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), gold)
    bulb.position.set(1.08, 2.36, -0.5)
    group.add(bulb)

    // ── DRAG — horizontal only ─────────────────────────────
    let isDragging = false
    let prevX = 0
    let targetRotY  = -0.3
    let currentRotY = -0.3
    // Idle auto-rotation — stops when user grabs, resumes after release
    let idleTimer = 0
    const IDLE_RESUME_DELAY = 2.5 // seconds before auto-rotation resumes

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      idleTimer  = 0
      prevX = e.clientX
      mount.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      targetRotY += (e.clientX - prevX) * 0.007
      prevX = e.clientX
    }
    const onPointerUp = (e: PointerEvent) => {
      isDragging = false
      mount.releasePointerCapture(e.pointerId)
    }

    mount.addEventListener('pointerdown', onPointerDown)
    mount.addEventListener('pointermove', onPointerMove)
    mount.addEventListener('pointerup', onPointerUp)
    mount.addEventListener('pointercancel', onPointerUp)

    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    // ── ANIMATE ────────────────────────────────────────────
    const clock = new THREE.Clock()
    let rafId = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      // ① Idle auto-rotation
      if (!isDragging) {
        idleTimer += delta
        if (idleTimer > IDLE_RESUME_DELAY) {
          targetRotY += delta * 0.12
        }
      }

      currentRotY += (targetRotY - currentRotY) * 0.07
      group.rotation.y = currentRotY

      // ② Power button pulse (2 s period)
      pwrMat.opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(elapsed * Math.PI))

      // ③ Lamp cone flicker (very subtle)
      coneMat.opacity = 0.035 + 0.018 * Math.sin(elapsed * 7.3) + 0.008 * Math.sin(elapsed * 13.1)

      // ④ Dust particles drift upward, wrap at ceiling
      const pos = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        pos.array[i * 3]     += velocities[i].x
        pos.array[i * 3 + 1] += velocities[i].y
        pos.array[i * 3 + 2] += velocities[i].z
        // Wrap particles that drift out of bounds
        if (pos.array[i * 3 + 1] > 3.8) pos.array[i * 3 + 1] = 0
        if (Math.abs(pos.array[i * 3] as number) > 2.8)     velocities[i].x *= -1
        if (Math.abs(pos.array[i * 3 + 2] as number) > 1.8) velocities[i].z *= -1
      }
      pos.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      mount.removeEventListener('pointerdown', onPointerDown)
      mount.removeEventListener('pointermove', onPointerMove)
      mount.removeEventListener('pointerup', onPointerUp)
      mount.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  )
}
