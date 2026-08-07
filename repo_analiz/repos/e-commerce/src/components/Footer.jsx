import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-[#0B1C36] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-5">
        {/* Contact Us */}
        <div>
          <h3 className="font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1" />
              <span>329 Queensberry Street, North Melbourne VIC 3051, Australia.</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone />
              <span>123 456 7890</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope />
              <span>support@houzing.com</span>
            </li>
          </ul>

          {/* Social icons */}
          <div className="flex gap-4 mt-6 text-sm">
            <a href="#" className="hover:text-gray-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-400"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-400 bg-gray-700 p-2 rounded"><FaInstagram /></a>
            <a href="#" className="hover:text-gray-400"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Discover */}
        <div>
          <h3 className="font-semibold mb-4">Discover</h3>
          <ul className="space-y-3 text-sm">
            <li>Chicago</li>
            <li>Los Angeles</li>
            <li>Miami</li>
            <li>New York</li>
          </ul>
        </div>

        {/* Lists by Category */}
        <div>
          <h3 className="font-semibold mb-4">Lists by Category</h3>
          <ul className="space-y-3 text-sm">
            <li>Apartments</li>
            <li>Condos</li>
            <li>Houses</li>
            <li>Offices</li>
            <li>Retail</li>
            <li>Villas</li>
          </ul>
        </div>

        {/* Lists by Category (2) */}
        <div>
          <h3 className="font-semibold mb-4">Lists by Category</h3>
          <ul className="space-y-3 text-sm">
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Support Center</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-700 mt-10 pt-5 flex items-center justify-between px-5 container mx-auto">
        <div className="flex items-center gap-3 text-sm">
          {/* Logo icon */}
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin">
            <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="font-semibold">Houzing</span>
        </div>

        <p className="text-sm">Copyright © 2021 CreativeLayers. All Right Reserved.</p>

        <a href='#head' className="bg-blue-600 px-2 rounded text-white">
          ↑
        </a>
      </div>
    </footer>
  );
}

export default Footer;
