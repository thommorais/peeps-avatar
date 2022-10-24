export default async function setRectAreaLight() {
    const { RectAreaLight } = await import('three')

	const softboxLeft = new RectAreaLight(0x777777, 20, 20, 20)
	softboxLeft.position.set(15, 10, 20)

	const softBoxRight = new RectAreaLight(0x777777, 20, 20, 20)
	softBoxRight.position.set(-15, 10, 20)

	const softBoxBack = new RectAreaLight(0x777777, 20, 40, 20)
    softBoxBack.position.set(0, 15, -20)

    return [softBoxBack, softBoxRight, softboxLeft]
}