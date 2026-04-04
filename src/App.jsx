import { useState } from 'react';
import { useServiceRecords, useServiceStats } from './hooks/useServiceRecords';
import { useProviders } from './hooks/useProviders';
import StatCard from './components/StatCard';
import ServiceHistory from './components/ServiceHistory';
import ProviderList from './components/ProviderList';
import UpcomingList from './components/UpcomingList';
import LogServiceModal from './components/LogServiceModal';
import EditProviderModal from './components/EditProviderModal';

const TABS = ['History', 'Upcoming', 'Providers'];

function App() {
  const [activeTab, setActiveTab] = useState('History');
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  // Data hooks
  const { records, loading, error, refresh, addRecord } = useServiceRecords();
  const {
    providers, loading: providersLoading, error: providersError,
    refresh: refreshProviders, findOrCreateProvider, updateProvider,
  } = useProviders();
  const { spentThisYear, totalCount } = useServiceStats(records);

  // Count upcoming/overdue items for the stat card
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const actionItems = records.filter((r) => {
    if (!r.next_recommended_date) return false;
    const due = new Date(r.next_recommended_date);
    due.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  }).length;

  // Format spending as currency
  const formattedSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(spentThisYear);

  // Handle saving a new service record
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

    if (result.success) {
      refreshProviders();
    }

    return result;
  };

  // Handle "Log Again" from Upcoming tab — pre-fill the form
  const handleLogAgain = (record) => {
    setPrefillData({
      category: record.category,
      description: record.description,
      providerName: record.providers?.name || '',
    });
    setShowLogModal(true);
  };

  // Handle saving provider edits
  const handleSaveProvider = async (id, updates) => {
    const result = await updateProvider(id, updates);
    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-md pt-xl pb-md">
        <h1
          className="font-display text-[28px] font-bold tracking-[-0.02em]"
          style={{ color: 'var(--color-primary)' }}
        >
          HomeBase
        </h1>
        <p
          className="text-sm mt-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          Your home&apos;s command center
        </p>
      </header>

      {/* Stat Cards */}
      <section className="px-md flex gap-sm overflow-x-auto pb-sm">
        <StatCard label="Spent This Year" value={formattedSpent} />
        <StatCard label="Services Logged" value={totalCount.toString()} />
        <StatCard
          label="Action Items"
          value={actionItems.toString()}
          highlight={actionItems > 0}
        />
      </section>

      {/* Tab Bar */}
      <nav className="px-md mt-md">
        <div
          className="flex rounded-full p-[3px]"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-[10px] text-sm font-semibold rounded-full
                transition-all duration-200 cursor-pointer
              `}
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
      <main className="px-md pt-lg pb-xl">
        {activeTab === 'History' && (
          <ServiceHistory records={records} loading={loading} error={error} />
        )}
        {activeTab === 'Upcoming' && (
          <UpcomingList
            records={records}
            loading={loading}
            error={error}
            onMarkDone={handleLogAgain}
          />
        )}
        {activeTab === 'Providers' && (
          <ProviderList
            providers={providers}
            loading={providersLoading}
            error={providersError}
            serviceRecords={records}
            onEdit={(provider) => setEditingProvider(provider)}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <button
        id="btn-log-service"
        onClick={() => {
          setPrefillData(null);
          setShowLogModal(true);
        }}
        className="fixed bottom-xl right-md w-[56px] h-[56px] rounded-full
          flex items-center justify-center text-2xl font-bold
          shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
        }}
        aria-label="Log a service"
      >
        +
      </button>

      {/* Modals */}
      {showLogModal && (
        <LogServiceModal
          onClose={() => { setShowLogModal(false); setPrefillData(null); }}
          onSave={handleSaveService}
          providers={providers}
          prefill={prefillData}
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
