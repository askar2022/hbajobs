'use client'

export function PrintButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <button
        onClick={handlePrint}
        className="print:hidden inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print / Export PDF
      </button>

      {/* Print-only header */}
      <style jsx global>{`
        @media print {
          /* Hide navigation and non-essential elements */
          nav, .print\\:hidden {
            display: none !important;
          }
          
          /* Print-specific header */
          body::before {
            content: "HBA Jobs - HR Report";
            display: block;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          
          /* Optimize for printing */
          body {
            background: white !important;
          }
          
          /* Ensure colors print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Page breaks */
          .page-break {
            page-break-before: always;
          }
          
          /* Better spacing for print */
          .bg-white {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </>
  )
}

