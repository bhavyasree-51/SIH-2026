import { useEffect, useState } from 'react'
import { fetchCommunityReports, resolveReport, type CommunityReport } from '../services/communityService'

export function AdminCommunityReportsPage() {
  const [reports, setReports] = useState<CommunityReport[]>([])

  useEffect(() => {
    void fetchCommunityReports().then(setReports)
  }, [])

  return (
    <div className="admin-community-page">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">REPORT QUEUE</span>
          <h1>Community Reports</h1>
          <p>Review content flagged by farmers and resolve the issue.</p>
        </div>
      </div>

      <div className="admin-panels">
        {reports.map((report) => (
          <div className="admin-community-card" key={report.id}>
            <div className="community-card-head">
              <div>
                <strong>{report.reporter_name}</strong>
                <span>{report.reason}</span>
              </div>
              <span className={`status-pill status-${report.status.toLowerCase()}`}>{report.status}</span>
            </div>
            <p>{report.contentPreview}</p>
            <div className="community-actions">
              <button type="button" onClick={() => void resolveReport(report.id, 'REVIEWED')}>Review</button>
              <button type="button" onClick={() => void resolveReport(report.id, 'DISMISSED')}>Dismiss</button>
              <button type="button" onClick={() => void resolveReport(report.id, 'HIDDEN')}>Hide content</button>
              <button type="button" onClick={() => void resolveReport(report.id, 'RESOLVED')}>Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
