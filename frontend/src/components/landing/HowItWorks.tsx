import { MdSearch, MdCompare, MdPayment } from 'react-icons/md'

type HowItWorksProps = { onSignup: () => void }

const HowItWorks = ({ onSignup }: HowItWorksProps) => {
  const steps = [
    { 
      step: '1', 
      title: 'Search', 
      desc: 'Choose sport, time, and location',
      icon: MdSearch,
      gradient: 'from-[#00425b] to-[#006885]'
    },
    { 
      step: '2', 
      title: 'Compare', 
      desc: 'See live availability and pricing',
      icon: MdCompare,
      gradient: 'from-[#00B44E] to-[#00903e]'
    },
    { 
      step: '3', 
      title: 'Book', 
      desc: 'Pay securely and play!',
      icon: MdPayment,
      gradient: 'from-[#006885] to-[#00425b]'
    },
  ]
  
  return (
    <section id="how" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-[#00425b]/5 to-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#00B44E] uppercase tracking-wider bg-[#00B44E]/10 px-4 py-2 rounded-full">
              Process
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            How it <span className="bg-gradient-to-r from-[#00425b] to-[#00B44E] bg-clip-text text-transparent">works</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get started in just three simple steps and book your next game in minutes.
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center group">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-[#00425b]/20 via-[#00B44E]/20 to-[#00425b]/20 transform translate-x-1/2 z-0">
                  <div className="absolute top-0 left-0 w-0 h-full bg-gradient-to-r from-[#00425b] to-[#00B44E] group-hover:w-full transition-all duration-1000"></div>
                </div>
              )}
              
              <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-[#00425b]/20 transform group-hover:-translate-y-2">
                {/* Decorative background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative`}>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>
                    <step.icon className="w-12 h-12 text-white relative z-10" />
                  </div>
                  
                  {/* Step Number */}
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#00425b] to-[#00B44E] bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#00425b] transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-20">
          <button 
            onClick={onSignup} 
            className="group px-12 py-6 bg-gradient-to-r from-[#00425b] to-[#006885] text-white font-bold rounded-2xl hover:from-[#006885] hover:to-[#00425b] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer active:scale-95 text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              Create your free account
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <p className="text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B44E]"></span>
            No credit card required • Get started in 30 seconds
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
