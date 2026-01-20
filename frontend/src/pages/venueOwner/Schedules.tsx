import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdAccessTime,
  MdDateRange,
  MdClose,
  MdSave,
  MdBlock,
  MdCheckCircle,
} from 'react-icons/md'
import type { StateType } from '@/redux/slices'
import {
  FETCH_SCHEDULES_ACTION,
  CREATE_SCHEDULE_ACTION,
  UPDATE_SCHEDULE_ACTION,
  DELETE_SCHEDULE_ACTION,
  BLOCK_DATE_ACTION,
  UNBLOCK_SCHEDULE_ACTION,
  GENERATE_SCHEDULES_ACTION,
} from '@/redux/actions/venueOwner/schedule.actions'
import { FETCH_MY_VENUES_ACTION } from '@/redux/actions/venue/venue.actions'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { Schedule, CreateSchedulePayload, ScheduleType } from '@/types/venueOwner/schedule.types'

const Schedules = () => {
  const { schedules, loading, error } = useSelector(
    (state: StateType) => state.scheduleSlice
  )
  const { venues = [] } = useSelector(
    (state: StateType) => state.venueSlice
  )

  const [showModal, setShowModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedVenue, setSelectedVenue] = useState<number | 'all'>('all')
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState<CreateSchedulePayload>({
    venueId: 0,
    date: '',
    startTime: '',
    endTime: '',
    type: 'NORMAL',
    isBlocked: false,
    reason: '',
    notes: '',
  })

  const [blockData, setBlockData] = useState({
    venueId: 0,
    date: '',
    reason: '',
  })

  const [generateData, setGenerateData] = useState({
    venueId: 0,
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchSchedules()
    if (venues.length === 0) {
      FETCH_MY_VENUES_ACTION({ page: 1, perPage: 100 }).catch((err) => {
        console.error('Failed to fetch venues:', err)
      })
    }
  }, [])

  const fetchSchedules = async () => {
    try {
      const params: any = {}
      if (selectedVenue !== 'all') {
        params.venueId = selectedVenue
      }
      await FETCH_SCHEDULES_ACTION(params)
    } catch (err: any) {
      console.error('Failed to fetch schedules:', err)
      toast.error(err?.response?.data?.message || 'Failed to load schedules')
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [selectedVenue])

  const handleAddSchedule = () => {
    setEditingSchedule(null)
    setFormData({
      venueId: venues.length > 0 ? venues[0].id : 0,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'NORMAL',
      isBlocked: false,
      reason: '',
      notes: '',
    })
    setShowModal(true)
  }

  const handleBlockDate = () => {
    setBlockData({
      venueId: venues.length > 0 ? venues[0].id : 0,
      date: new Date().toISOString().split('T')[0],
      reason: '',
    })
    setShowBlockModal(true)
  }

  const handleGenerateSchedules = () => {
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)

    setGenerateData({
      venueId: venues.length > 0 ? venues[0].id : 0,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
    })
    setShowGenerateModal(true)
  }

  const handleDeleteSchedule = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return
    }
    setIsProcessing(true)
    try {
      await DELETE_SCHEDULE_ACTION(id)
      toast.success('Schedule deleted successfully')
      fetchSchedules()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete schedule')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveSchedule = async () => {
    if (!formData.venueId || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.isBlocked) {
      if (!formData.startTime || !formData.endTime) {
        toast.error('Start time and end time are required for available schedules')
        return
      }
      if (formData.startTime >= formData.endTime) {
        toast.error('End time must be after start time')
        return
      }
    }

    setIsProcessing(true)
    try {
      // Construct payload with required fields
      const payload = {
        venueId: formData.venueId,
        date: formData.date,
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        type: formData.type,
        isBlocked: formData.isBlocked ?? false,
        reason: formData.reason,
        notes: formData.notes,
      }
      
      if (editingSchedule) {
        await UPDATE_SCHEDULE_ACTION(editingSchedule.id, payload)
        toast.success('Schedule updated successfully')
      } else {
        await CREATE_SCHEDULE_ACTION(payload)
        toast.success('Schedule created successfully')
      }
      setShowModal(false)
      fetchSchedules()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save schedule')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveBlockDate = async () => {
    if (!blockData.venueId || !blockData.date || !blockData.reason) {
      toast.error('Please fill in all fields')
      return
    }

    setIsProcessing(true)
    try {
      await BLOCK_DATE_ACTION(blockData)
      toast.success('Date blocked successfully')
      setShowBlockModal(false)
      fetchSchedules()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to block date')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnblockSchedule = async (id: number) => {
    if (!window.confirm('Are you sure you want to unblock this date?')) {
      return
    }

    setIsProcessing(true)
    try {
      await UNBLOCK_SCHEDULE_ACTION(id)
      toast.success('Date unblocked successfully')
      fetchSchedules()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to unblock date')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerate = async () => {
    if (!generateData.venueId || !generateData.startDate || !generateData.endDate) {
      toast.error('Please fill in all fields')
      return
    }

    setIsProcessing(true)
    try {
      const result = await GENERATE_SCHEDULES_ACTION(
        generateData.venueId,
        generateData.startDate,
        generateData.endDate
      )
      toast.success(`${result.length} schedules generated successfully`)
      setShowGenerateModal(false)
      fetchSchedules()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate schedules')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[date.getMonth()]} ${date.getDate()}`
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A'
    return timeString
  }

  const getWeekDates = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(today.setDate(diff))
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates()

  // ✅ FIX: Create a copy before sorting
  const filteredSchedules = useMemo(() => {
    let filtered = schedules
    if (selectedVenue !== 'all') {
      filtered = schedules.filter(s => s.venueId === selectedVenue)
    }
    // Create a copy before sorting (Redux arrays are immutable)
    return [...filtered].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      const aTime = formatTime(a.startTime) || ''
      const bTime = formatTime(b.startTime) || ''
      return aTime.localeCompare(bTime)
    })
  }, [schedules, selectedVenue])

  const getSchedulesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredSchedules.filter(s => s.date === dateStr)
  }

  if (loading && schedules.length === 0) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Venue Schedules</h2>
          <p className="text-gray-600">Manage your venue availability and schedules</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateSchedules}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MdAdd className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={handleBlockDate}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MdBlock className="w-4 h-4" />
            Block Date
          </button>
          <button
            onClick={handleAddSchedule}
            className="bg-primary/90 text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 cursor-pointer"
          >
            <MdAdd className="w-4 h-4" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Venue</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0]/20 focus:border-[#2c5aa0]"
            >
              <option value="all">All Venues</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  viewMode === 'week'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  viewMode === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Week Calendar View */}
      {/* {viewMode === 'week' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-600 py-2">{day}</div>
                <div className="text-xs text-gray-500 mb-2">
                  {formatDate(weekDates[index].toISOString().split('T')[0])}
                </div>
                <div className="min-h-[120px] border border-gray-200 rounded-lg p-2 space-y-1">
                  {getSchedulesForDate(weekDates[index]).map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`text-xs p-1 rounded ${
                        schedule.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                      title={schedule.isBlocked ? schedule.reason || 'Blocked' : `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`}
                    >
                      <div className="font-medium truncate">
                        {schedule.isBlocked ? '🚫 Blocked' : schedule.type}
                      </div>
                      {!schedule.isBlocked && (
                        <div className="text-xs truncate">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Schedule List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {selectedVenue === 'all' ? 'All Schedules' : `Schedules for ${venues.find(v => v.id === selectedVenue)?.name || 'Venue'}`}
        </h3>
        
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No schedules found</p>
            <button
              onClick={handleAddSchedule}
              className="mt-4 text-[#2c5aa0] hover:text-[#1e3d6f] font-medium cursor-pointer"
            >
              Create your first schedule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`border rounded-lg p-4 transition-colors ${
                  schedule.isBlocked
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      schedule.isBlocked
                        ? 'bg-red-500'
                        : 'bg-gradient-to-br from-[#2c5aa0] to-[#1e3d6f]'
                    }`}>
                      {schedule.isBlocked ? (
                        <MdBlock className="w-6 h-6 text-white" />
                      ) : (
                        <MdDateRange className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{schedule.venueName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <MdDateRange className="w-4 h-4" />
                          {formatDate(schedule.date)}
                        </div>
                        {!schedule.isBlocked && (
                          <div className="flex items-center gap-1">
                            <MdAccessTime className="w-4 h-4" />
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </div>
                        )}
                        {schedule.isBlocked && schedule.reason && (
                          <div className="text-red-600">
                            {schedule.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {schedule.isBlocked ? 'Blocked' : schedule.type}
                    </span>
                    <div className="flex gap-2">
                      {schedule.isBlocked ? (
                        <button
                          onClick={() => handleUnblockSchedule(schedule.id)}
                          disabled={isProcessing}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          title="Unblock date"
                        >
                          <MdCheckCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          disabled={isProcessing}
                          className="p-2 text-gray-600 hover:text-[#2c5aa0] hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          title="Edit schedule"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        disabled={isProcessing}
                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete schedule"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add Schedule</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                <select
                  value={formData.venueId}
                  onChange={(e) => setFormData({ ...formData, venueId: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={0}>Select venue</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={formData.isBlocked}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={formData.isBlocked}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#2c5aa0] text-white rounded-lg hover:bg-[#1e3d6f] cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Saving...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Block Date</h3>
                <button onClick={() => setShowBlockModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                <select
                  value={blockData.venueId}
                  onChange={(e) => setBlockData({ ...blockData, venueId: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={0}>Select venue</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={blockData.date}
                  onChange={(e) => setBlockData({ ...blockData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <input
                  type="text"
                  value={blockData.reason}
                  onChange={(e) => setBlockData({ ...blockData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Holiday, Maintenance"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowBlockModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlockDate}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                {isProcessing ? 'Blocking...' : 'Block Date'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Schedules Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Generate Schedules</h3>
                <button onClick={() => setShowGenerateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                <select
                  value={generateData.venueId}
                  onChange={(e) => setGenerateData({ ...generateData, venueId: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={0}>Select venue</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={generateData.startDate}
                  onChange={(e) => setGenerateData({ ...generateData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={generateData.endDate}
                  onChange={(e) => setGenerateData({ ...generateData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  This will auto-generate schedules from your venue's operating hours for the selected date range.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function handleEditSchedule(schedule: Schedule): void {
  toast.info('Edit functionality coming soon!')
}

export default Schedules