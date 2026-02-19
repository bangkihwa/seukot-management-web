import { useState } from 'react'
import { useSubjectRecords } from '../../hooks/useSubjectRecords'
import SubjectRecordList from '../../components/student/SubjectRecordList'
import SemesterOverview from '../../components/student/SemesterOverview'

type Tab = 'records' | 'overview'

export default function StudentMainPage() {
  const [activeTab, setActiveTab] = useState<Tab>('records')

  const { records, loading, addRecord, updateRecord, deleteRecord } = useSubjectRecords()

  const tabs: { key: Tab; label: string }[] = [
    { key: 'records', label: '세특 기록' },
    { key: 'overview', label: '학기 개요' },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 glass-card p-1.5 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'records' && (
          <SubjectRecordList
            records={records}
            loading={loading}
            onAdd={addRecord}
            onUpdate={updateRecord}
            onDelete={deleteRecord}
          />
        )}

        {activeTab === 'overview' && (
          <SemesterOverview records={records} />
        )}
      </div>
    </div>
  )
}
