import { useState, useEffect, useRef } from 'react'
import { useProfileApi } from './api/useProfileApi.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import ProfileForm from './components/ProfileForm.jsx'

function RestaurantProfile() {
  const { getProfile, updateProfile, updateStatus } = useProfileApi()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const restaurantId = localStorage.getItem('restaurantId') ? parseInt(localStorage.getItem('restaurantId')) : 2
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await getProfile(restaurantId)
      console.log('Profile response:', response)
      const data = response.data?.data || response.data
      console.log('Profile data:', data)
      setProfile(data)
      if (data?.name) {
        localStorage.setItem('restaurantName', data.name)
      }
      if (data?.email) {
        localStorage.setItem('restaurantEmail', data.email)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data) => {
    try {
      await updateProfile(restaurantId, data)
      await loadProfile()
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    }
  }

  const handleStatusToggle = async (isActive) => {
    try {
      await updateStatus(restaurantId, isActive)
      await loadProfile()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading profile...</div>
  }

  if (!profile) {
    return <div className="text-center py-12 text-red-400">Failed to load profile</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Restaurant Profile</h1>
        <p className="text-slate-400">Manage your restaurant information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            onStatusToggle={handleStatusToggle}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default RestaurantProfile
