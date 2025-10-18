// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Loader2,
  UserX,
  UserCheck
} from 'lucide-react'
import { AuthUser, UserRole, AccountStatus } from '@/types'

export default function UsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

const fetchUsers = async () => {
  try {
    const response = await apiClient.getUsers()
    if (response.success) {
      // response.data should be the array of users directly
      setUsers(Array.isArray(response.data) ? response.data : [])
    } else {
      setUsers([])
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    setUsers([])
  } finally {
    setIsLoading(false)
  }
}

  const handleUpdateStatus = async (userId: string, status: AccountStatus) => {
    try {
      await apiClient.updateUserStatus(userId, status)
      await fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Failed to update user status:', error)
      alert('Failed to update user status')
    }
  }

  const handleUpdateRole = async (userId: string, role: UserRole) => {
    try {
      await apiClient.updateUserRole(userId, role)
      await fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Failed to update user role:', error)
      alert('Failed to update user role')
    }
  }

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case AccountStatus.ACTIVE: return 'bg-green-100 text-green-800'
      case AccountStatus.SUSPENDED: return 'bg-yellow-100 text-yellow-800'
      case AccountStatus.DELETED: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-purple-100 text-purple-800'
      case UserRole.ADMIN: return 'bg-blue-100 text-blue-800'
      case UserRole.USER: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         false
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage platform users and their permissions
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
            <Button variant="outline" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.name || 'No Name'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.toLowerCase().replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      {user.lastLoginAt && (
                        <span>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.status === AccountStatus.ACTIVE ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-yellow-600 hover:text-yellow-700"
                      onClick={() => handleUpdateStatus(user.id, AccountStatus.SUSPENDED)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-green-600 hover:text-green-700"
                      onClick={() => handleUpdateStatus(user.id, AccountStatus.ACTIVE)}
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}