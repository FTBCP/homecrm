import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useServiceRecords, useServiceStats } from './hooks/useServiceRecords';
import { useProviders } from './hooks/useProviders';
import AuthPage from './components/AuthPage';
import StatCard from './components/StatCard';
import ServiceHistory from './components/ServiceHistory';
import ProviderList from './components/ProviderList';
import UpcomingList from './components/UpcomingList';
import LogServiceModal from './components/LogServiceModal';
import EditProviderModal from './components/EditProviderModal';

const TABS = ['History', 'Upcoming', 'Providers'];

function App() {
  const auth = useAuth();

  // Show loading while checking session
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  // Not logged in → show auth page
  if (!auth.user) {
    return <AuthPage onAuth={auth} />;
  }

  // Logged in → show main app
  return <MainApp auth={auth} />;
}

function MainApp({ auth }) {
  const [activeTab, setActiveTab] = useState('History');
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  // Data hooks — homeId for service records, userId for providers
  const { records, loading, error, refresh, addRecord } = useServiceRecords(auth.homeId);
  const {
    providers, loading: providersLoading, error: providersError,
    refresh: refreshProviders, findOrCreateProvider, updateProvider,
  } = useProviders(auth.user.id);
  const { spentThisYear, totalCount } = useServiceStats(records);

  // Count upcoming/overdue items
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const actionItems = records.filter((r) => {
    if (!r.next_recommended_date) return false;
    const due = new Date(r.next_recommended_date);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24)) <= 30;
  }).length;

  const formattedSpent = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(spentThisYear);

  const handleSaveService = async (formData) => {
    let providerId = null;
    if (formData.providerName) {
      providerId = await findOrCreateProvider(formData.providerName, formData.category);
    }

    const result = await addRecord({
      category: formData.category,
      description: formData.description,
      cost: formData.cost,
      date: formData.date,
      provider_id: providerId,
      notes: formData.notes,
      next_recommended_date: formData.next_recommended_date,
    });

    if (result.success) refreshProviders();
    return result;
  };

  const handleLogAgain = (record) => {
    setPrefillData({
      category: record.category,
      description: record.description,
      providerName: record.providers?.name || '',
    });
    setShowLogModal(true);
  };

  const handleSaveProvider = async (id, updates) => {
    return await updateProvider(id, updates);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="app-container">
        {/* Header */}
        <header className="px-md pt-xl pb-md animate-fade-in flex items-start justify-between">
          <div>
            <h1
              className="font-display text-[28px] font-bold tracking-[-0.02em]"
              style={{ color: 'var(--color-primary)' }}
            >
              HomeBase
            </h1>
            <p className="text-sm mt-xs" style={{ color: 'var(--color-muted)' }}>
              Your home&apos;s command center
            </p>
          </div>
          <button
            id="btn-sign-out"
            onClick={auth.signOut}
            className="mt-xs text-[12px] font-medium cursor-pointer px-sm py-[6px] rounded-[8px]
              transition-colors duration-200"
            style={{ color: 'var(--color-muted)' }}
          >
            Sign Out
          </button>
        </header>

        {/* Stat Cards */}
        <section className="px-md flex gap-sm overflow-x-auto pb-sm hide-scrollbar">
          <StatCard label="Spent This Year" value={formattedSpent} />
          <StatCard label="Services Logged" value={totalCount.toString()} />
          <StatCard label="Action Items" value={actionItems.toString()} highlight={actionItems > 0} />
        </section>

        {/* Tab Bar */}
        <nav className="px-md mt-md">
          <div className="flex rounded-full p-[3px]" style={{ backgroundColor: 'var(--color-border)' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-[10px] text-sm font-semibold rounded-full
                  transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : 'var(--color-muted)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <main className="px-md pt-lg pb-[100px]" key={activeTab}>
          <div className="animate-fade-in">
            {activeTab === 'History' && (
              <ServiceHistory records={records} loading={loading} error={error} />
            )}
            {activeTab === 'Upcoming' && (
              <UpcomingList records={records} loading={loading} error={error} onMarkDone={handleLogAgain} />
            )}
            {activeTab === 'Providers' && (
              <ProviderList
                providers={providers} loading={providersLoading} error={providersError}
                serviceRecords={records} onEdit={(p) => setEditingProvider(p)}
              />
            )}
          </div>
        </main>
      </div>

      {/* FAB */}
      <button
        id="btn-log-service"
        onClick={() => { setPrefillData(null); setShowLogModal(true); }}
        className="fixed bottom-xl right-md w-[56px] h-[56px] rounded-full
          flex items-center justify-center text-2xl font-bold
          shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer btn-fab"
        style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF' }}
        aria-label="Log a service"
      >
        +
      </button>

      {/* Modals */}
      {showLogModal && (
        <LogServiceModal
          onClose={() => { setShowLogModal(false); setPrefillData(null); }}
          onSave={handleSaveService} providers={providers} prefill={prefillData}
        />
      )}
      {editingProvider && (
        <EditProviderModal
          provider={editingProvider}
          onClose={() => setEditingProvider(null)}
          onSave={handleSaveProvider}
        />
      )}
    </div>
  );
}

export default App;
