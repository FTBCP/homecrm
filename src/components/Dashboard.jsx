import UpcomingList from './UpcomingList';
import SpendingChart from './SpendingChart';
import OnboardingWizard from './OnboardingWizard';

export default function Dashboard({ records, loading, error, onMarkDone, onLogSample }) {
  if (loading) {
    return (
      <div className="text-center py-xl">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-lg text-danger">
        <p className="font-semibold text-sm">Failed to load dashboard data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-xl animate-fade-in">
      <OnboardingWizard onLogSample={onLogSample} defaultMinimized={records.length > 0} />
      
      {records.length > 0 && (
        <>
          <section>
            <UpcomingList records={records} loading={false} error={null} onMarkDone={onMarkDone} />
          </section>
          <section>
            <SpendingChart records={records} />
          </section>
        </>
      )}
    </div>
  );
}
