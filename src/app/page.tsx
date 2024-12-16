import Header from '@/components/shared/header/Header'
import { ChartLine, Code, Users } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
    const features = [
        {
            icon: <Code className="text-4xl text-blue-500" />,
            title: 'Comprehensive Problem Set',
            description: 'Practice coding challenges across multiple difficulty levels and programming languages.'
        },
        {
            icon: <ChartLine className="text-4xl text-green-500" />,
            title: 'Detailed Performance Tracking',
            description: 'Monitor your progress, track solving streaks, and visualize your skill improvement.'
        },
        {
            icon: <Users className="text-4xl text-purple-500" />,
            title: 'Community Driven',
            description: 'Engage with a vibrant community, discuss solutions, and learn from peers.'
        }
    ]

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-5xl font-bold p-6 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        CodePulse: Your Coding Interview Companion
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Master coding interviews, enhance your problem-solving skills, and unlock your potential with our comprehensive coding challenge platform.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link 
                        href="/problems" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                        >
                        Start Solving
                        </Link>
                        <Link 
                        href="/learn" 
                        className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-full transition duration-300"
                        >
                        Learn More
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <div className='flex justify-center items-center w-full'>
                    <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full max-w-5xl">
                        {features.map((feature, index) => (
                            <div 
                            key={index} 
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition duration-300"
                            >
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </section>
                </div>

                {/* Call to Action */}
                <section className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Coding Skills?</h2>
                <p className="text-xl text-gray-300 mb-8">
                    Join thousands of developers who are transforming their coding interview preparation.
                </p>
                <Link 
                    href="/signup" 
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
                >
                    Create Free Account
                </Link>
                </section>
            </div>
        </main>
    )
}
