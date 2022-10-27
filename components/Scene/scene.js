import usePeepsStore from '_stores/peep.store'

async function addTheModel(callback) {
	const { default: loadModel } = await import('./model')
	const [model, gltf] = await loadModel({ onLoading: callback })
	return [model, gltf]
}

const defaults = ['eye', 'Scene', 'body', 'nose', 'Eyebrow001', 'LEGS_1', 'root']

const critical = ['Scene', 'male_rig']

async function scene(canvas) {
	const { default: webglStuff } = await import('./webgl')
	const { default: assetMaps } = await import('./assetsMap')


	const { scene } = await webglStuff(canvas)

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
			// if (child?.parent?.name === 'male_rig') {
			// 	names.push(child.name)
			// 	objMaps[child.name] = child
			// }
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
				// if (child.children.length > 0) {
				// 	child.children.forEach((grandChild) => {
				// 		grandChild.visible = ev.value
				// 	})
				// }
			})
		}
	}

	const { Clock } = await import('three')
	const clock = new Clock()
	scene.add(model)

	function animate() {
		const delta = clock.getDelta()
		mixer.update(delta)
		requestAnimationFrame(animate)
	}

	animate()


	if (process.env.NODE_ENV === 'development') {
		const { default: stats } = await import('./stats')
		await stats()
	}

	return () => {
		scene.remove(scene.children[0])
	}
}

export default scene
