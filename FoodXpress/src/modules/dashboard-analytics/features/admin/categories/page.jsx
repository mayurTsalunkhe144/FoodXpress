import { useState, useEffect, useContext } from 'react'
import { useCategoriesApi } from './api/useCategoriesApi.js'
import { mockCategories } from '../../../lib/mockData.js'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card.jsx'
import Table from '../../../components/ui/Table.jsx'
import { CacheContext } from '../../../context/CacheContext.jsx'

function AdminCategories() {
  const { getAll } = useCategoriesApi()
  const { getCache, setCache } = useContext(CacheContext)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const cached = getCache('categories')
    if (cached) {
      setCategories(cached)
      setLoading(false)
    } else {
      loadCategories()
    }
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await getAll()
      const data = response.data?.data || response.data || []
      const categoryData = Array.isArray(data) ? data : []
      setCategories(categoryData)
      setCache('categories', categoryData)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setCategories(mockCategories)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = filter === 'all'
    ? categories
    : categories.filter(cat => cat.status?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Menu Categories</h1>
        <p className="text-slate-400">Manage all menu categories</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Categories ({categories.length})</CardTitle>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading categories...</div>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Category Name</Table.Head>
                  <Table.Head>Description</Table.Head>
                  <Table.Head>Items</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Created</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredCategories.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-8">No categories found</Table.Cell>
                  </Table.Row>
                ) : (
                  filteredCategories.map((category) => (
                    <Table.Row key={category.categoryId || category.id}>
                      <Table.Cell className="font-medium">{category.name}</Table.Cell>
                      <Table.Cell>{category.description || '-'}</Table.Cell>
                      <Table.Cell>{category.itemCount || 0}</Table.Cell>
                      <Table.Cell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400`}>
                          active
                        </span>
                      </Table.Cell>
                      <Table.Cell>{new Date().toLocaleDateString()}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminCategories
