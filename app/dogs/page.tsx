import Navigation from '@/components/Navigation'
import { Users, Plus } from 'lucide-react'

export default function DogsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dog Profiles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your dog profiles, view walk history, and track their progress.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="text-center py-12">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Dog profiles and management features will be available soon. 
              This will include individual dog profiles, walk history, and detailed tracking.
            </p>
            <button className="btn-primary flex items-center justify-center space-x-2 mx-auto">
              <Plus className="h-4 w-4" />
              <span>Add Dog Profile</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 