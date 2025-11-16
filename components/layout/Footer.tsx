export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Schools
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <span className="text-base text-gray-500">Harvest Preparatory School</span>
              </li>
              <li>
                <span className="text-base text-gray-500">Wakanda School</span>
              </li>
              <li>
                <span className="text-base text-gray-500">Sankofa School</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/careers" className="text-base text-gray-500 hover:text-gray-900">
                  View Open Positions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact
            </h3>
            <p className="mt-4 text-base text-gray-500">
              For questions about applications, please contact HR.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} HBA Jobs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

