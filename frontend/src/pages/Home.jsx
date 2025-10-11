import React from 'react'
import Header from '../components/Header'
import ServiceMenu from '../components/ServiceMenu'
import TopServicers from '../components/TopServicers'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <ServiceMenu/>
      <TopServicers/>
      <Banner/>
    </div>
  )
}

export default Home
