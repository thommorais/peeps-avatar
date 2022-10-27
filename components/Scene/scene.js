async function scene(canvas) {
	const { default: webglStuff } = await import('./webgl')
	const { scene } = await webglStuff(canvas)

	const { default: handleModel } = await import('./model')
	const { model, modelAnimation } = await handleModel()
	scene.add(model)

	if (process.env.NODE_ENV === 'development') {
		const { default: stats } = await import('./stats')
		await stats()
	}

	const { Clock } = await import('three')
	const clock = new Clock()

	// const { MeshStandardMaterial, BoxGeometry, Mesh } = await import('three')
	// const boxGeometry = new BoxGeometry(4, 4, 4)

	// const cubeMat = new MeshStandardMaterial({
	// 	roughness: 0.7,
	// 	color: 0xffffff,
	// 	bumpScale: 0.002,
	// 	metalness: 0.2,
	// })

	// const cube = new Mesh(boxGeometry, cubeMat)
	// cube.castShadow = true
	// scene.add(cube)

	// const cube2 = cube.clone()
	// cube2.castShadow = true
	// cube2.receiveShadow = true
	// cube2.position.set(-1, -4.5, -1)
	// scene.add(cube2)


	function animate() {
		const delta = clock.getDelta()
		// modelAnimation(delta)
		requestAnimationFrame(animate)
	}

	animate()

	return () => {
		scene.remove(scene.children[0])
	}
}

export default scene
