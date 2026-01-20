import logo from "@/assets/landing/final_logo-removebg-preview.png";

const Footer = () => {
  return (
   <section id="contact">
     <footer className="bg-[#2755b9] text-white py-16 sm:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src={logo} 
                alt="Athletix Logo" 
                className="h-16 object-contain"
              />
            </div>

            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Play more. Plan less. Book your next game with Athletix. The ultimate platform for sports venue booking and community building.
            </p>

            {/* <div className="flex items-center space-x-4">
                <a
                  href="#"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-[#00425b] transition-colors duration-300 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
            </div> */}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">hello@athletix.com</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">+977 9876543210</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">123 Sports Street<br />City, State 12345</a></li>
            </ul>
          </div>
          </div>

        <div className="border-t border-white mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Athletix. All rights reserved.
            </p>
            {/* <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Cookies</a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
   </section>
  );
};

export default Footer;
