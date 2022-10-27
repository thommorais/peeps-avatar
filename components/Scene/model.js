import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import usePeepsStore from '_stores/peep.store'

export async function loadModel({ onLoading = () => { } }) {
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
				box.castShadow = true
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


async function addTheModel(callback) {
	const [model, gltf] = await loadModel({ onLoading: callback })
	return [model, gltf]
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


const defaults = ['eye', 'Scene', 'body', 'nose', 'Eyebrow001', 'LEGS_1', 'Shirt']

const critical = ['Scene', 'male_rig']

export default async function handleModel() {
	const [model, modelScene] = await addTheModel(console.log)

	model.traverse((child) => {
		if (child?.parent?.name === 'Scene') {
			child.visible = false
		}

		if ([...critical, ...defaults].includes(child.name)) {
			child.visible = true
		} else if (child?.parent?.name === 'male_rig') {
			child.visible = false
		}
	})


	const { default: assetMaps } = await import('./assetsMap')

	const hairUpdate = usePeepsStore.subscribe(
		(state) => state.hair,
		(hair) => {
			const hairs = Object.values(assetMaps.hair).flat()
			model.traverse((child) => {
				if (hairs.includes(child.name)) {
					if (assetMaps.hair[hair].includes(child.name)) {
						child.visible = true
					} else {
						child.visible = false
					}
				}
			})
		},
	)

	const { AnimationMixer } = await import('three')
	const mixer = new AnimationMixer(model)

	const gui = true

	if (gui) {
		const names = []
		const objMaps = {}

		model.traverse((child) => {
			//&& child.name.toLowerCase().includes('hair')
			if (child?.parent?.name === 'male_rig') {

			}
			names.push(child.name)
			objMaps[child.name] = child
		})

		const { Pane } = await import('tweakpane')
		const pane = new Pane()
		const modelFolder = pane.addFolder({ title: 'Modelo', open: false })
		const animationFoleder = pane.addFolder({ title: 'Animations' })

		const { animations = [] } = modelScene

		let lastAnimation = null

		for (let i = 0; i < animations.length; i++) {
			const clip = animations[i]
			const action = mixer.clipAction(clip)

			const btn = animationFoleder.addButton({
				title: clip.name,
			})

			btn.on('click', () => {
				if (lastAnimation) {
					lastAnimation.stop()
				}
				action.reset().play()
				lastAnimation = action
			})
		}

		function sortAlphaNum(a, b) {
			return a.localeCompare(b, 'en', { numeric: true })
		}

		for (const name of names.sort(sortAlphaNum)) {
			const child = objMaps[name]

			const PARAMS = { [name]: child.visible }
			const btn = modelFolder.addInput(PARAMS, name, { label: name })

			btn.on('change', (ev) => {
				child.visible = ev.value
				if (child.children.length > 0) {
					child.children.forEach((grandChild) => {
						grandChild.visible = ev.value
					})
				}
			})
		}
	}

	function modelAnimation(delta) {
		mixer.update(delta)
	}


	return { model, modelAnimation, hairUpdate }

}