import Navigation from '@/components/Navigation'
import { FileText, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Walk Reports
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View detailed walk reports, track progress, and analyze walk data with GPS routes.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="text-center py-12">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Walk reports and analytics will be available soon. 
              This will include detailed walk logs, GPS routes, photos, and performance metrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 