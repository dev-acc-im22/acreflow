'use client';

import { useState, useMemo } from 'react';
import type { Lead, LeadStatus } from '@/types';
import { mockLeads } from '@/lib/mock-data';
import { useAcreFlowStore } from '@/lib/store';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Filter,
  Search,
  User,
  Flame,
  Sun,
  Snowflake,
  ChevronDown,
  Building2,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Users,
  Home,
  Star,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

const statusBadgeClasses: Record<LeadStatus, string> = {
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-amber-100 text-amber-700',
  cold: 'bg-blue-100 text-blue-700',
};

const statusIcons: Record<LeadStatus, typeof Flame> = {
  hot: Flame,
  warm: Sun,
  cold: Snowflake,
};

interface NewLeadForm {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  listingTitle: string;
  status: LeadStatus;
}

export default function LeadCenter() {
  const { goBack } = useAcreFlowStore();
  const [leads, setLeads] = useState<Lead[]>([...mockLeads]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const [newLead, setNewLead] = useState<NewLeadForm>({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    message: '',
    listingTitle: '',
    status: 'warm',
  });

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    toast.success(`Lead status updated to ${statusLabel}`);
  };

  const handleDeleteLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (window.confirm(`Are you sure you want to delete lead "${lead?.buyerName}"?`)) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      toast.success('Lead deleted');
    }
  };

  const handleEditLead = (leadId: string, updatedFields: { buyerName?: string; buyerPhone?: string }) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, ...updatedFields } : l
      )
    );
    toast.success('Lead updated successfully');
  };

  const handleStatCardClick = (tab: string) => {
    setActiveTab(tab);
  };

  // ── Computed ──────────────────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.buyerName.toLowerCase().includes(q) ||
          lead.listingTitle.toLowerCase().includes(q) ||
          lead.message.toLowerCase().includes(q) ||
          (lead.buyerEmail && lead.buyerEmail.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    // Also respect the tab filter
    if (activeTab !== 'all') {
      result = result.filter((lead) => lead.status === activeTab);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'oldest') {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return result;
  }, [leads, searchQuery, statusFilter, sortBy, activeTab]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter((l) => l.status === 'hot').length,
      warm: leads.filter((l) => l.status === 'warm').length,
      cold: leads.filter((l) => l.status === 'cold').length,
    };
  }, [leads]);

  const handleAddLead = () => {
    if (!newLead.buyerName.trim() || !newLead.buyerPhone.trim()) {
      toast.error('Please fill in at least the buyer name and phone number.');
      return;
    }

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      listingId: '',
      listingTitle: newLead.listingTitle || 'General Inquiry',
      buyerName: newLead.buyerName,
      buyerPhone: newLead.buyerPhone,
      buyerEmail: newLead.buyerEmail || undefined,
      message: newLead.message || 'No message provided.',
      status: newLead.status,
      createdAt: new Date().toISOString(),
    };

    setLeads((prev) => [lead, ...prev]);
    setNewLead({
      buyerName: '',
      buyerPhone: '',
      buyerEmail: '',
      message: '',
      listingTitle: '',
      status: 'warm',
    });
    setShowAddForm(false);
    toast.success(`Lead "${lead.buyerName}" added successfully!`);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl hover:bg-cream"
          onClick={goBack}
        >
          <ArrowLeft className="w-5 h-5 text-navy" />
        </Button>
        <h1 className="text-xl font-bold text-navy">Lead Center</h1>
      </div>

      {/* Stats Cards Row — click to filter */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeTab === 'all' ? 'ring-2 ring-royal/30 border-royal/30' : ''}`}
          onClick={() => handleStatCardClick('all')}
        >
          <CardContent className="p-0 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-royal/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-royal" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.total}</p>
              <p className="text-sm text-slate-accent">Total Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeTab === 'hot' ? 'ring-2 ring-red-300 border-red-300' : ''}`}
          onClick={() => handleStatCardClick('hot')}
        >
          <CardContent className="p-0 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.hot}</p>
              <p className="text-sm text-slate-accent">Hot Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeTab === 'warm' ? 'ring-2 ring-amber-300 border-amber-300' : ''}`}
          onClick={() => handleStatCardClick('warm')}
        >
          <CardContent className="p-0 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.warm}</p>
              <p className="text-sm text-slate-accent">Warm Leads</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`bg-white rounded-xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${activeTab === 'cold' ? 'ring-2 ring-blue-300 border-blue-300' : ''}`}
          onClick={() => handleStatCardClick('cold')}
        >
          <CardContent className="p-0 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats.cold}</p>
              <p className="text-sm text-slate-accent">Cold Leads</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-accent" />
          <Input
            placeholder="Search leads..."
            className="h-10 rounded-xl pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-10 rounded-xl">
            <Filter className="w-4 h-4 mr-1 text-slate-accent" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[140px] h-10 rounded-xl">
            <ChevronDown className="w-4 h-4 mr-1 text-slate-accent" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
        <Button
          className="bg-royal hover:bg-royal-dark text-white h-10 rounded-xl px-4"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Add Lead Inline Form */}
      {showAddForm && (
        <Card className="mb-6 border-2 border-royal/20 bg-sky/5 rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
                <User className="w-5 h-5 text-royal" />
                Add New Lead
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="text-slate-accent hover:text-navy"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">
                  Buyer Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter buyer name"
                  className="h-10 rounded-xl"
                  value={newLead.buyerName}
                  onChange={(e) =>
                    setNewLead((prev) => ({ ...prev, buyerName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="+91 XXXXX XXXXX"
                  className="h-10 rounded-xl"
                  value={newLead.buyerPhone}
                  onChange={(e) =>
                    setNewLead((prev) => ({ ...prev, buyerPhone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">Email</label>
                <Input
                  placeholder="buyer@email.com"
                  type="email"
                  className="h-10 rounded-xl"
                  value={newLead.buyerEmail}
                  onChange={(e) =>
                    setNewLead((prev) => ({ ...prev, buyerEmail: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">
                  Listing Title
                </label>
                <Input
                  placeholder="Interested property"
                  className="h-10 rounded-xl"
                  value={newLead.listingTitle}
                  onChange={(e) =>
                    setNewLead((prev) => ({
                      ...prev,
                      listingTitle: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-navy">Message</label>
                <textarea
                  placeholder="Lead message or notes..."
                  className="w-full min-h-[80px] rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  value={newLead.message}
                  onChange={(e) =>
                    setNewLead((prev) => ({ ...prev, message: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">Status</label>
                <Select
                  value={newLead.status}
                  onValueChange={(val) =>
                    setNewLead((prev) => ({
                      ...prev,
                      status: val as LeadStatus,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">
                      <span className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-red-600" /> Hot
                      </span>
                    </SelectItem>
                    <SelectItem value="warm">
                      <span className="flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5 text-amber-600" /> Warm
                      </span>
                    </SelectItem>
                    <SelectItem value="cold">
                      <span className="flex items-center gap-2">
                        <Snowflake className="w-3.5 h-3.5 text-blue-600" /> Cold
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  className="bg-royal hover:bg-royal-dark text-white h-10 rounded-xl px-6 w-full sm:w-auto"
                  onClick={handleAddLead}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for status filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-cream rounded-xl p-1">
          <TabsTrigger
            value="all"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm text-sm"
          >
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger
            value="hot"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm text-sm"
          >
            <Flame className="w-3.5 h-3.5 mr-1 text-red-500" />
            Hot ({stats.hot})
          </TabsTrigger>
          <TabsTrigger
            value="warm"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm text-sm"
          >
            <Sun className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Warm ({stats.warm})
          </TabsTrigger>
          <TabsTrigger
            value="cold"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm text-sm"
          >
            <Snowflake className="w-3.5 h-3.5 mr-1 text-blue-500" />
            Cold ({stats.cold})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <LeadList leads={filteredLeads} onStatusChange={handleStatusChange} onDeleteLead={handleDeleteLead} onEditLead={handleEditLead} />
        </TabsContent>
        <TabsContent value="hot">
          <LeadList leads={filteredLeads} onStatusChange={handleStatusChange} onDeleteLead={handleDeleteLead} onEditLead={handleEditLead} />
        </TabsContent>
        <TabsContent value="warm">
          <LeadList leads={filteredLeads} onStatusChange={handleStatusChange} onDeleteLead={handleDeleteLead} onEditLead={handleEditLead} />
        </TabsContent>
        <TabsContent value="cold">
          <LeadList leads={filteredLeads} onStatusChange={handleStatusChange} onDeleteLead={handleDeleteLead} onEditLead={handleEditLead} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

// ── Lead List ─────────────────────────────────────────────────────────────

function LeadList({
  leads,
  onStatusChange,
  onDeleteLead,
  onEditLead,
}: {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onEditLead: (id: string, fields: { buyerName?: string; buyerPhone?: string }) => void;
}) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-slate-accent" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-1">No leads found</h3>
        <p className="text-sm text-slate-accent">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onStatusChange={onStatusChange}
          onDeleteLead={onDeleteLead}
          onEditLead={onEditLead}
        />
      ))}
    </div>
  );
}

// ── Lead Card ─────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  onStatusChange,
  onDeleteLead,
  onEditLead,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onEditLead: (id: string, fields: { buyerName?: string; buyerPhone?: string }) => void;
}) {
  const StatusIcon = statusIcons[lead.status];
  const initial = lead.buyerName.charAt(0).toUpperCase();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lead.buyerName);
  const [editPhone, setEditPhone] = useState(lead.buyerPhone);

  const handleStartEdit = () => {
    setEditName(lead.buyerName);
    setEditPhone(lead.buyerPhone);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editPhone.trim()) {
      toast.error('Name and phone cannot be empty.');
      return;
    }
    onEditLead(lead.id, { buyerName: editName.trim(), buyerPhone: editPhone.trim() });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(lead.buyerName);
    setEditPhone(lead.buyerPhone);
    setIsEditing(false);
  };

  return (
    <Card className="mb-0 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-sky text-navy font-semibold flex items-center justify-center flex-shrink-0 text-sm">
            {initial}
          </div>

          {/* Middle content */}
          <div className="flex-1 min-w-0">
            {/* Top row: Name + Status + Time */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-7 w-40 text-sm rounded-lg px-2"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-semibold text-navy">
                  {lead.buyerName}
                </span>
              )}
              <Badge
                variant="secondary"
                className={`${statusBadgeClasses[lead.status]} text-xs font-medium px-2 py-0.5 rounded-full`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </Badge>
              <span className="text-xs text-slate-accent flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getTimeAgo(lead.createdAt)}
              </span>
            </div>

            {/* Phone (editable in edit mode) */}
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-accent flex-shrink-0" />
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="h-7 w-48 text-sm rounded-lg px-2"
                />
              </div>
            ) : (
              <>
                {/* Property */}
                <p className="text-sm text-slate-accent flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 flex-shrink-0" />
                  Interested in: {lead.listingTitle}
                </p>

                {/* Message preview */}
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {lead.message}
                </p>
              </>
            )}

            {/* Edit mode action buttons */}
            {isEditing && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs bg-royal hover:bg-royal-dark text-white rounded-lg"
                  onClick={handleSaveEdit}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs rounded-lg border-border text-slate-accent hover:bg-cream"
                  onClick={handleCancelEdit}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              className="w-9 h-9 rounded-lg bg-sky flex items-center justify-center text-royal hover:bg-sky/80 transition-colors"
              title="Call"
              onClick={() =>
                toast.success(`Calling ${lead.buyerName}...`)
              }
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center text-slate-accent hover:bg-cream/80 transition-colors"
              title="Email"
              onClick={() =>
                toast.success(
                  lead.buyerEmail
                    ? `Opening email to ${lead.buyerEmail}`
                    : 'No email available for this lead'
                )
              }
            >
              <Mail className="w-4 h-4" />
            </button>
            {/* Status change dropdown */}
            <Select
              value={lead.status}
              onValueChange={(val) => onStatusChange(lead.id, val as LeadStatus)}
            >
              <SelectTrigger
                className="w-9 h-9 p-0 rounded-lg bg-cream hover:bg-cream/80 transition-colors border-0 [&>span]:hidden"
                title="Change status"
              >
                <Filter className="w-4 h-4 text-slate-accent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">
                  <span className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-red-600" /> Hot
                  </span>
                </SelectItem>
                <SelectItem value="warm">
                  <span className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-600" /> Warm
                  </span>
                </SelectItem>
                <SelectItem value="cold">
                  <span className="flex items-center gap-2">
                    <Snowflake className="w-3.5 h-3.5 text-blue-600" /> Cold
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Edit button */}
            <button
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isEditing
                  ? 'bg-royal/10 text-royal'
                  : 'bg-cream text-slate-accent hover:bg-cream/80'
              }`}
              title="Edit lead"
              onClick={handleStartEdit}
            >
              <Pencil className="w-4 h-4" />
            </button>
            {/* Delete button */}
            <button
              className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete lead"
              onClick={() => onDeleteLead(lead.id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
