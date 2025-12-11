'use client'

import React from 'react'
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <footer className="bg-background border-t border-border/40 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4 group cursor-pointer">
                        <div className="bg-white/90 dark:bg-white/95 rounded-xl p-2 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                            <img
                                src="https://res.cloudinary.com/dr2h8zmll/image/upload/v1764316308/logo-workline_xievif.svg"
                                alt="Workline Logo"
                                className="w-5 h-5"
                            />
                        </div>
                        <span className="text-xl font-bold transition-all duration-300 group-hover:translate-x-1">Workline</span>
                    </div>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Streamline your content creation workflow with collaborative outline management, team coordination, and quality tracking.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="#"
                            className="glassmorphic p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                        >
                            <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                        <a
                            href="#"
                            className="glassmorphic p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                        >
                            <Github className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                        <a
                            href="#"
                            className="glassmorphic p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                        >
                            <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                        <a
                            href="#"
                            className="glassmorphic p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group"
                        >
                            <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </a>
                    </div>
                </div>

                <div className="group md:ml-auto">
                    <h3 className="font-semibold mb-4 transition-all duration-300 group-hover:translate-x-1">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => scrollToSection('hero')}
                                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 inline-block cursor-pointer"
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 inline-block cursor-pointer"
                            >
                                Features
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection('showcase')}
                                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 inline-block cursor-pointer"
                            >
                                Showcase
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => scrollToSection('videos')}
                                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-2 inline-block cursor-pointer"
                            >
                                Videos
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Workline. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-all duration-300 hover:scale-105 inline-block">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-foreground transition-all duration-300 hover:scale-105 inline-block">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
