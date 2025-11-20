export function MeetingDetail() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Weekly Sync - Engineering</h2>
        <p className="text-muted-foreground">Attendees: Alex, Sarah, Mike</p>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <h3>Transcript</h3>
        <p>Placeholder for transcript text...</p>
        <h3>Action Items</h3>
        <ul>
          <li>Review PR #123</li>
          <li>Update documentation</li>
        </ul>
      </div>
    </div>
  );
}
