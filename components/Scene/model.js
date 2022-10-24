import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default async function loadModel({ onLoading = () => { } }) {
	const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath('/draco/')

	const loader = new GLTFLoader()
	loader.setDRACOLoader(dracoLoader)

	return new Promise((resolve, reject) => {
		loader.load(
			'/model/male.glb',
			(gltf) => {
				const box = gltf.scene

				box.traverse((child) => {
					if (child.isMesh) {
						child.castShadow = true
						child.receiveShadow = true
					}
				})
				resolve([box, gltf])
			},
			// called while loading is progressing
			function (xhr) {
				onLoading(Math.ceil(xhr.loaded / xhr.total * 100))
			},
			(e) => reject(e),
		)
	})
}

export function resizeModel(modelSize) {
	const proportion = modelSize.y * 20

	const y = modelSize.y / proportion
	const x = modelSize.x / proportion
	const z = modelSize.z / proportion

	return { x, y, z }
}

export async function getModelCenterAndSize(model) {
	const { Vector3, Box3 } = await import('three')

	const box = new Box3().setFromObject(model)
	const modelCenter = box.getCenter(new Vector3())
	const modelSize = box.getSize(new Vector3())

	return { center: modelCenter, size: modelSize }
}
