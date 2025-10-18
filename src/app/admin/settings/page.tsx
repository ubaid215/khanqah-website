// src/app/admin/settings/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { Label } from '@/components/ui/Label'
import { 
  Save,
  Loader2,
  Bell,
  Shield,
  Globe,
  Mail,
  User,
  Database
} from 'lucide-react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'LMS Platform',
    siteDescription: 'Learn, Grow, Succeed - Your journey starts here',
    siteUrl: 'https://lms-platform.com',
    contactEmail: 'support@lms-platform.com',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    newMessages: true,
    weeklyDigest: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    
    // System Settings
    maintenanceMode: false,
    userRegistration: true,
    maxFileSize: 50,
    backupFrequency: 'daily'
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Settings saved:', settings)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database },
    { id: 'users', name: 'Users', icon: User },
    { id: 'email', name: 'Email', icon: Mail }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="siteName" className="text-sm font-medium text-gray-700">
            Site Name
          </Label>
          <Input
            id="siteName"
            value={settings.siteName}
            onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="siteUrl" className="text-sm font-medium text-gray-700">
            Site URL
          </Label>
          <Input
            id="siteUrl"
            value={settings.siteUrl}
            onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="siteDescription" className="text-sm font-medium text-gray-700">
          Site Description
        </Label>
        <Textarea
          id="siteDescription"
          value={settings.siteDescription}
          onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
          rows={3}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
          Contact Email
        </Label>
        <Input
          id="contactEmail"
          type="email"
          value={settings.contactEmail}
          onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
          className="mt-1"
        />
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="emailNotifications" className="text-sm font-medium text-gray-900">
              Email Notifications
            </Label>
            <p className="text-sm text-gray-500">
              Receive email notifications for important updates
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="pushNotifications" className="text-sm font-medium text-gray-900">
              Push Notifications
            </Label>
            <p className="text-sm text-gray-500">
              Receive browser push notifications
            </p>
          </div>
          <Switch
            id="pushNotifications"
            checked={settings.pushNotifications}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="courseUpdates" className="text-sm font-medium text-gray-900">
              Course Updates
            </Label>
            <p className="text-sm text-gray-500">
              Notify about new courses and updates
            </p>
          </div>
          <Switch
            id="courseUpdates"
            checked={settings.courseUpdates}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, courseUpdates: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="newMessages" className="text-sm font-medium text-gray-900">
              New Messages
            </Label>
            <p className="text-sm text-gray-500">
              Notify when you receive new messages
            </p>
          </div>
          <Switch
            id="newMessages"
            checked={settings.newMessages}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, newMessages: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="weeklyDigest" className="text-sm font-medium text-gray-900">
              Weekly Digest
            </Label>
            <p className="text-sm text-gray-500">
              Receive weekly summary emails
            </p>
          </div>
          <Switch
            id="weeklyDigest"
            checked={settings.weeklyDigest}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, weeklyDigest: checked }))}
          />
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="twoFactorAuth" className="text-sm font-medium text-gray-900">
              Two-Factor Authentication
            </Label>
            <p className="text-sm text-gray-500">
              Require 2FA for all admin accounts
            </p>
          </div>
          <Switch
            id="twoFactorAuth"
            checked={settings.twoFactorAuth}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
          />
        </div>

        <div>
          <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">
            Session Timeout (minutes)
          </Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
            min="5"
            max="1440"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="passwordExpiry" className="text-sm font-medium text-gray-700">
            Password Expiry (days)
          </Label>
          <Input
            id="passwordExpiry"
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
            min="1"
            max="365"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-900">
              Maintenance Mode
            </Label>
            <p className="text-sm text-gray-500">
              Put the site in maintenance mode
            </p>
          </div>
          <Switch
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="userRegistration" className="text-sm font-medium text-gray-900">
              User Registration
            </Label>
            <p className="text-sm text-gray-500">
              Allow new users to register
            </p>
          </div>
          <Switch
            id="userRegistration"
            checked={settings.userRegistration}
            onChange={(checked: any) => setSettings(prev => ({ ...prev, userRegistration: checked }))}
          />
        </div>

        <div>
          <Label htmlFor="maxFileSize" className="text-sm font-medium text-gray-700">
            Maximum File Size (MB)
          </Label>
          <Input
            id="maxFileSize"
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
            min="1"
            max="100"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="backupFrequency" className="text-sm font-medium text-gray-700">
            Backup Frequency
          </Label>
          <select
            id="backupFrequency"
            value={settings.backupFrequency}
            onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'system':
        return renderSystemSettings()
      case 'users':
        return <div className="text-center py-8 text-gray-500">User settings coming soon...</div>
      case 'email':
        return <div className="text-center py-8 text-gray-500">Email settings coming soon...</div>
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your platform settings and preferences
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.name}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold capitalize">
                  {activeTab} Settings
                </CardTitle>
                <CardDescription>
                  Configure your platform {activeTab.toLowerCase()} settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderContent()}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}