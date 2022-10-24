import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export async function createRenderer(canvas) {
	const { getDefaultSizes } = await import('./utils')
	const { width, height, pixelRatio } = getDefaultSizes()
	const { WebGLRenderer, PCFSoftShadowMap, sRGBEncoding, ACESFilmicToneMapping } = await import('three')

	const renderer = new WebGLRenderer({
		powerPreference: 'high-performance',
		antialias: true,
		stencil: true,
		canvas: canvas,
		depth: true,
	})

	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = PCFSoftShadowMap
	renderer.physicallyCorrectLights = true
	renderer.outputEncoding = sRGBEncoding
	renderer.toneMapping = ACESFilmicToneMapping
	renderer.setSize(width, height)
	renderer.setPixelRatio(pixelRatio)
	// renderer.setClearColor(0xEFEFEF, 1)
	renderer.setClearColor(0xFFFFFF, 1)

	return renderer
}

export async function createOrbitControls(camera, canvas) {
	const orbitControls = new OrbitControls(camera, canvas)
	orbitControls.enableDamping = true
	orbitControls.enableZoom = false
	orbitControls.enablePan = false
	orbitControls.maxPolarAngle = (Math.PI / 1.5)
	orbitControls.minPolarAngle = (Math.PI / 3)
	return orbitControls
}

export async function createScene() {
	const { Scene } = await import('three')
	const scene = new Scene()
	return scene
}

export async function creatPerspectiveCamera() {
	const { PerspectiveCamera } = await import('three')
	const { getDefaultSizes } = await import('./utils')

	const { aspect } = getDefaultSizes()
	const camera = new PerspectiveCamera(45, aspect, 0.01, 720)
	camera.position.set(0, 12, 36)

	return camera
}

export async function createAmbientLight() {
	const { AmbientLight } = await import('three')

	const ambientLight = new AmbientLight(0xffffff)
	ambientLight.intensity = 0.5
	return ambientLight
}

export async function createDirectionalLight() {
	const { DirectionalLight } = await import('three')

	const directionalLight = new DirectionalLight(0xffffff, 0.25)
	directionalLight.position.set(-100, 0, 230)
	//Set up shadow properties for the light
	directionalLight.shadow.mapSize.width = 746 // default
	directionalLight.shadow.mapSize.height = 746 // default
	directionalLight.shadow.camera.near = 0.01 // default
	directionalLight.shadow.camera.far = 500 // default
	return directionalLight
}

export async function createHemisphereLight() {
	const { HemisphereLight } = await import('three')
	const hemisphereLight = new HemisphereLight(0xFFFFFF, 0x262626, 1)
	return hemisphereLight
}

export async function createSpotLight() {
	const { SpotLight } = await import('three')

	const spotLight = new SpotLight(0xff0000, 2, 2, Math.PI, 1, 1)
	spotLight.position.set(0, 0, 4)
	spotLight.shadow.bias = -0.001

	return spotLight
}

export default async function webglStuff(canvas) {
	const { getDefaultSizes } = await import('./utils')

	const renderer = await createRenderer(canvas)
	const scene = await createScene()
	const camera = await creatPerspectiveCamera()
	const orbitControls = await createOrbitControls(camera, renderer.domElement)
	const ambientLight = await createAmbientLight()
	const directionalLight = await createDirectionalLight()

	const hemisphereLight = await createHemisphereLight()
	const spotLight = await createSpotLight()

	scene.add(ambientLight)
	scene.add(directionalLight)
	scene.add(hemisphereLight)
	scene.add(spotLight)

	const renderFunc = () => renderer.render(scene, camera)

	renderFunc()

	renderer.setAnimationLoop(() => {
		orbitControls.update()
		renderFunc()
	})

	window.addEventListener('resize', () => {
		const { width, height } = getDefaultSizes()
		camera.aspect = width / height
		camera.updateProjectionMatrix()
		renderer.setSize(width, height)
	})

	return { renderer, renderFunc, scene, camera, directionalLight }
}
