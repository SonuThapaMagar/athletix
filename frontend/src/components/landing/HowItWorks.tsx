import { MdSearch, MdCompare, MdPayment } from 'react-icons/md'

type HowItWorksProps = { onSignup: () => void }

const HowItWorks = ({ onSignup }: HowItWorksProps) => {
  const steps = [
    { 
      step: '1', 
      title: 'Search', 
      desc: 'Choose sport, time, and location',
      icon: MdSearch,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      step: '2', 
      title: 'Compare', 
      desc: 'See live availability and pricing',
      icon: MdCompare,
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      step: '3', 
      title: 'Book', 
      desc: 'Pay securely and play!',
      icon: MdPayment,
      color: 'from-purple-500 to-purple-600'
    },
  ]
  
  return (
    <section id="how" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in just three simple steps and book your next game in minutes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center group">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-200 transform translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button 
            onClick={onSignup} 
            className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create your free account
          </button>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Get started in 30 seconds</p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks







