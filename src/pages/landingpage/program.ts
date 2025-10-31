import GUI from "lil-gui"
import * as THREE from "three"
import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"
import gsap from "gsap"
import normalizeWheel from "normalize-wheel"
import { Size } from "../../types/types"

interface Props {
  scene: THREE.Scene
  debug: GUI
  sizes: Size
  skipAnimation?: boolean
}

interface ImageInfo {
  width: number
  height: number
  aspectRatio: number
  uvs: {
    xStart: number
    xEnd: number
    yStart: number
    yEnd: number
  }
}

export default class Program {
  scene: THREE.Scene
  instancedMesh: THREE.InstancedMesh
  geometry: THREE.BoxGeometry
  material: THREE.ShaderMaterial
  meshCount: number = 29
  pageThickness: number = 0.01
  pageSpacing: number = 1
  debug: GUI
  animationTimeline: gsap.core.Timeline | null = null
  pageDimensions: {
    width: number
    height: number
  }
  scrollY: {
    target: number
    current: number
    direction: number
  }
  sizes: Size
  imageInfos: ImageInfo[] = []
  atlasTexture: THREE.Texture | null = null

  // Touch handling properties
  touch: {
    startX: number
    lastX: number
    isActive: boolean
  }


  constructor({ scene, debug, sizes, skipAnimation = false }: Props) {
    this.scene = scene
    this.debug = debug
    this.sizes = sizes

    // Check if we should skip animation (either from sessionStorage or prop)
    const isReturningFromPage = sessionStorage.getItem('returnedFromPage') === 'true'
    const shouldSkipAnimation = skipAnimation || isReturningFromPage

    if (isReturningFromPage) {
      console.log('Returning from page - will skip animation')
      sessionStorage.removeItem('returnedFromPage')
    }

    this.pageDimensions = {
      width: 2,
      height: 3,
    }
    this.scrollY = {
      target: 0,
      current: 0,
      direction: -1,
    }

    this.touch = {
      startX: 0,
      lastX: 0,
      isActive: false,
    }

    this.createGeometry()

    this.loadTextureAtlas().then(() => {
      this.createMaterial()
      this.createMeshes()

      let anim: gsap.core.Timeline | null = null

      if (shouldSkipAnimation) {
        this.material.uniforms.uProgress.value = 0.4
 
        console.log('Skipped animation - went directly to final state')
        console.log('Uniforms:', {
          uProgress: this.material.uniforms.uProgress.value,
         
        })
      } else {
        // ========================================
        // TIMELINE: ROTATION → FADE OUT → MENU
        // ========================================
        // EDIT THIS SECTION TO MODIFY THE ANIMATION TIMELINE
        // ========================================
        
        anim = gsap.timeline()
        this.animationTimeline = anim

        // STEP 1: ROTATION (uProgress 0 → 1)
        // Duration: 6.5 seconds
        // This animates the page flipping rotation
        anim.fromTo(
          this.material.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: 6.5,
            ease: "power3.inOut",
            onComplete: () => {
              // Rotation complete - WebGLProgram.tsx detects uProgress >= 1.0
              // and triggers fade out → menu transition
            }
          }
        )
        // ========================================
        // END TIMELINE EDIT SECTION
        // ========================================
      }

      if (anim) {
        anim.call(() => {
          window.addEventListener("wheel", this.onWheel.bind(this))
          this.addTouchListeners()
        })
      }
    })
  }

  createMenuPage(title: string): HTMLImageElement {
    // Create a canvas to draw the menu page
    // Aspect ratio matches page dimensions: width 2, height 3 (portrait, like A4)
    // Using 512px width gives us 768px height for 2:3 ratio
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 768  // 512 * (3/2) = 768 for 2:3 aspect ratio
    const ctx = canvas.getContext('2d')!

    // Set background
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, 512, 768)

    // Add border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, 508, 764)

    // // Add title - use Bungee font (bold, theatrical)
    // ctx.fillStyle = '#ffffff'
    // ctx.font = 'bold 48px Bungee'
    // ctx.textAlign = 'center'
    // ctx.textBaseline = 'middle'
    // ctx.fillText(title, 256, 180)

    // Add subtitle
    ctx.font = '20px Bungee'
    ctx.fillStyle = '#cccccc'
    ctx.textAlign = 'center'
    ctx.fillText('Props Theatre', 256, 400)

    // Add decorative elements
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(100, 500)
    ctx.lineTo(412, 500)
    ctx.stroke()

    // Convert canvas to image
    const img = new Image()
    img.src = canvas.toDataURL()
    return img
  }

  async loadTextureAtlas() {
    const imagePaths = [
      "/pages/p1.jpg",
      "/pages/p2.jpg",
      "/pages/p3.jpg",
      "/pages/p4.jpg",
      "/pages/p5.jpg",
      "/pages/p6.jpg",
      "/pages/p7.jpg",
      "/pages/p8.jpg",
      "/pages/p9.jpg",
      "/pages/p10.jpg",
      "/pages/p11.jpg",
      "/pages/p12.jpg",
      "/pages/p13.jpg",
    ]

    const menuPages = [
      "Opening Night",
      "Matinée Special",
      "Evening Gala",
      "Closing Night",
      "Student Showcase",
      "Behind the Scenes"
    ]

    const menuImages = menuPages.map((title) => {
      return this.createMenuPage(title)
    })

    const imagePromises = imagePaths.map((path) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = path
      })
    })

    const originalImages = await Promise.all(imagePromises)

    const images = [...menuImages, ...originalImages]

    const atlasWidth = Math.max(...images.map((img) => img.width))
    let totalHeight = 0

    images.forEach((img) => {
      totalHeight += img.height
    })

    const canvas = document.createElement("canvas")
    canvas.width = atlasWidth
    canvas.height = totalHeight
    const ctx = canvas.getContext("2d")!

    let currentY = 0
    this.imageInfos = images.map((img) => {
      const aspectRatio = img.width / img.height

      ctx.drawImage(img, 0, currentY)

      const info = {
        width: img.width,
        height: img.height,
        aspectRatio,
        uvs: {
          xStart: 0,
          xEnd: img.width / atlasWidth,
          yStart: 1 - currentY / totalHeight,
          yEnd: 1 - (currentY + img.height) / totalHeight,
        },
      }

      currentY += img.height
      return info
    })

    this.atlasTexture = new THREE.Texture(canvas)
    this.atlasTexture.needsUpdate = true
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uProgress: new THREE.Uniform(0),
        uSplitProgress: new THREE.Uniform(0),
        uPageThickness: new THREE.Uniform(this.pageThickness),
        uPageWidth: new THREE.Uniform(this.pageDimensions.width),
        uPageHeight: new THREE.Uniform(this.pageDimensions.height),
        uMeshCount: new THREE.Uniform(this.meshCount),
        uTime: new THREE.Uniform(0),
        uSlideProgress: new THREE.Uniform(0),
        uAtlas: new THREE.Uniform(this.atlasTexture),
        uScrollY: { value: 0 },
        uSpeedY: { value: 0 },
        uPageSpacing: new THREE.Uniform(this.pageSpacing),
        uFadeOut: new THREE.Uniform(0),
      },
    })
  }

  onWheel(event: MouseEvent) {
    const normalizedWheel = normalizeWheel(event)

    let scrollY =
      (normalizedWheel.pixelY * this.sizes.height) / window.innerHeight

    this.scrollY.target += scrollY

    this.material.uniforms.uSpeedY.value += scrollY
  }

  addTouchListeners() {
    window.addEventListener("touchstart", this.onTouchStart.bind(this), {
      passive: true,
    })
    window.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true,
    })
    window.addEventListener("touchend", this.onTouchEnd.bind(this), {
      passive: true,
    })
  }

  onTouchStart(event: TouchEvent) {
    // Don't prevent default - allow native scrolling
    const touch = event.touches[0]
    this.touch.startX = touch.clientX
    this.touch.lastX = touch.clientX
    this.touch.isActive = true
  }

  onTouchMove(event: TouchEvent) {
    if (!this.touch.isActive) return

    // Don't prevent default - allow native scrolling
    const touch = event.touches[0]
    const deltaX = this.touch.lastX - touch.clientX

    
    

    this.touch.lastX = touch.clientX
  }

  onTouchEnd(event: TouchEvent) {
    // Don't prevent default - allow native scrolling
    this.touch.isActive = false
  }


  createGeometry() {
    this.geometry = new THREE.BoxGeometry(
      this.pageDimensions.width,
      this.pageDimensions.height,
      this.pageThickness,
      50,
      50,
      1
    )
  }

  createMeshes() {
    this.instancedMesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.meshCount
    )

    const aTextureCoords = new Float32Array(this.meshCount * 4)
    const aIndex = new Float32Array(this.meshCount)

    // ========================================
    // TEXTURE ASSIGNMENT TO INSTANCES
    // ========================================
    // Instance 0 → imageInfos[0] (first menu page: "Opening Night")
    // Instance 1 → imageInfos[1] (second menu page: "Matinée Special")
    // Instance 2 → imageInfos[2] (third menu page: "Evening Gala")
    // Instance 3 → imageInfos[3] (fourth menu page: "Closing Night")
    // Instance 4 → imageInfos[4] (fifth menu page: "Student Showcase")
    // Instance 5 → imageInfos[5] (sixth menu page: "Behind the Scenes")
    // Instance 6 → imageInfos[6] (p1)
    // Instance 7 → imageInfos[7] (p2)
    // ...
    // Instance 15 → imageInfos[15] (p10) ← THIS IS WHAT YOU'RE SEEING
    // Instance 16 → imageInfos[16] (p11)
    // Instance 17 → imageInfos[17] (p12)
    // Instance 18 → imageInfos[18] (p13)
    // Instance 19 → imageInfos[0] (wraps back to first menu page)
    // ========================================
    
    for (let i = 0; i < this.meshCount; i++) {
      const imageIndex = i % this.imageInfos.length

      aTextureCoords[i * 4 + 0] = this.imageInfos[imageIndex].uvs.xStart
      aTextureCoords[i * 4 + 1] = this.imageInfos[imageIndex].uvs.xEnd
      aTextureCoords[i * 4 + 2] = this.imageInfos[imageIndex].uvs.yStart
      aTextureCoords[i * 4 + 3] = this.imageInfos[imageIndex].uvs.yEnd

      aIndex[i] = i
    }
    
    // ========================================
    // DEBUG: Log which texture instance 0 is using
    // ========================================
    console.log('[TEXTURE ASSIGNMENT] Instance 0 uses imageInfos[0]:', {
      imageIndex: 0,
      imagePath: 'First menu page ("Opening Night")',
      totalImages: this.imageInfos.length,
      instance15ImageIndex: 15 % this.imageInfos.length,
      instance15ImagePath: 'p10 (if instance 15 becomes visible)'
    })

    this.instancedMesh.geometry.setAttribute(
      "aTextureCoords",
      new THREE.InstancedBufferAttribute(aTextureCoords, 4)
    )



    this.instancedMesh.geometry.setAttribute(
      "aIndex",
      new THREE.InstancedBufferAttribute(aIndex, 1)
    )

    this.scene.add(this.instancedMesh)
  }

  onResize(sizes: Size) {
    this.sizes = sizes
    if (this.material) {
      // Viewport uniforms removed - no longer needed for grid logic
    }
  }

  updateScroll(scrollY: number) {
    this.scrollY.target += scrollY

    this.material.uniforms.uSpeedY.value += scrollY
  }

  render() {
    if (this.material) {
      this.scrollY.current = gsap.utils.interpolate(
        this.scrollY.current,
        this.scrollY.target,
        0.12
      )

      this.material.uniforms.uScrollY.value = this.scrollY.current

      this.material.uniforms.uSpeedY.value *= 0.835
    }
  }
}