import UpcomingList from './UpcomingList';
import SpendingChart from './SpendingChart';
import OnboardingWizard from './OnboardingWizard';
import StatCard from './StatCard';

export default function Dashboard({ 
  records, loading, error, onMarkDone, onLogSample,
  setActiveTab, formattedSpent, totalCount, actionItems, providerCount
}) {
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
      <section className="flex gap-sm overflow-x-auto pb-sm hide-scrollbar -mx-md px-md sm:mx-0 sm:px-0">
        <StatCard 
          label="Spent This Year" 
          value={formattedSpent} 
          onClick={() => setActiveTab('History')}
        />
        <StatCard 
          label="Services Logged" 
          value={totalCount.toString()} 
          onClick={() => setActiveTab('History')}
        />
        <StatCard 
          label="Action Items" 
          value={actionItems.toString()} 
          highlight={actionItems > 0} 
          onClick={() => setActiveTab('Dashboard')}
        />
        <StatCard 
          label="Providers" 
          value={providerCount.toString()} 
          onClick={() => setActiveTab('Providers')}
        />
      </section>

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
