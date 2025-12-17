import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../../components/ui/Card.jsx'
import api from '../../../../lib/axios.js'

function PreviewSection({ title, icon, restaurantId, endpoint, detailsPath }) {
  const navigate = useNavigate()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCount()
  }, [restaurantId])

  const loadCount = async () => {
    try {
      setLoading(true)
      const response = await api.get(endpoint)
      const data = response.data?.data || response.data || []
      setCount(Array.isArray(data) ? data.length : 0)
    } catch (error) {
      console.error(`Failed to load ${title}:`, error)
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card 
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} 
      className="border cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(detailsPath)}
    >
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-4xl mb-2">{icon}</p>
          <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg">{title}</p>
          <p style={{ color: 'var(--primary-red)' }} className="text-3xl font-bold mt-2">{loading ? '-' : count}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PreviewSection
