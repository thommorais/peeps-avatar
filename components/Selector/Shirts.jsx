
import usePeepsStore from '_stores/peep.store'
import AssetsCarousel from './AssetsCarousel'

function Shirt() {
    const setShirt = usePeepsStore((store) => store.setShirt)

    function onClick(index) {
        setShirt(index)
    }

    return <AssetsCarousel type={'shirt'} imagesCount={12} handleClick={onClick} />
}


export default Shirt
