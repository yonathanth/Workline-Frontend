'use client'

import React from 'react'
import { AuroraBackground } from '@/features/LandingPage/presentation/components/aurora-background'
import Navbar from '@/features/LandingPage/presentation/components/Navbar'
import HeroSection from '@/features/LandingPage/presentation/components/HeroSection'
import TableShowcaseSection from '@/features/LandingPage/presentation/components/TableShowcaseSection'
import FeaturesSection from '@/features/LandingPage/presentation/components/FeaturesSection'
import VideoShowcaseSection from '@/features/LandingPage/presentation/components/VideoShowcaseSection'
import Footer from '@/features/LandingPage/presentation/components/Footer'

const HomeScreen = () => {
    return (
        <>
            <AuroraBackground>
                <Navbar />
                <div id="hero">
                    <HeroSection />
                </div>
            </AuroraBackground>
            <div id="features">
                <FeaturesSection />
            </div>
            <div id="showcase">
                <TableShowcaseSection />
            </div>
            <div id="videos">
                <VideoShowcaseSection />
            </div>
            <Footer />
        </>
    )
}

export default HomeScreen
