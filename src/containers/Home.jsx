import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import Search from '../components/Search'
import Categories from '../components/Categories'
import Carousel from '../components/Carousel'
import CarouselItem from '../components/CarouselItem'
import '../assets/styles/App.scss'



const Home = ({ myList, search, trends, originals }) => {
        return (
        <>
            <Header />
            <Search isHome />

            {search.length > 0 ?
                <Categories title="Resultados">
                    <Carousel>
                        {search.map(item =>
                            <CarouselItem 
                                key={item.id} 
                                {...item}
                            />
                        )}
                    </Carousel>
            </Categories> : 
            <>
            {myList.length > 0 &&
                <Categories title="Mi lista">
                    <Carousel>
                    {myList.map(item =>
                        <CarouselItem 
                        key={item.id} 
                        {...item} 
                        isList
                        />
                    )}
                    </Carousel>
                </Categories>     
            }
                <Categories title="Tendencias">
                    <Carousel>
                        {trends.map(item =>
                            <CarouselItem key={item.id} {...item} />
                        )}
                    </Carousel>
                </Categories>

                <Categories title="Originales de YourV-deo">
                    <Carousel>
                        {originals.map(item =>
                            <CarouselItem key={item.id} {...item} />
                        )}
                    </Carousel>
                </Categories>

            </>           
            }           
        </>
    )
}
const mapStateToProps = state => {
    return {
        myList: state.myList,
        trends: state.trends,
        originals: state.originals,
        search: state.search,
    }

}

export default connect(mapStateToProps, null)(Home)