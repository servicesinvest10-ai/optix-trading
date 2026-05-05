import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Search,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  RefreshCw,
  LogOut,
  LayoutDashboard,
  UserCheck,
  Clock,
  ChevronRight,
  Plus,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

export const AdminCRM = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newLead, setNewLead] = useState({ full_name: '', email: '', phone: '', country: '' });
  const [newNote, setNewNote] = useState('');

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      const response = await api.get(`/admin/clients?search=${searchTerm}`);
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await api.get(`/admin/leads?search=${searchTerm}`);
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/admin/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch client details
  const fetchClientDetails = async (clientId) => {
    try {
      const response = await api.get(`/admin/clients/${clientId}`);
      setSelectedClient(response.data);
      setShowClientModal(true);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails');
    }
  };

  // Update client status
  const updateClientStatus = async (clientId, status) => {
    try {
      await api.put(`/admin/clients/${clientId}/status?status=${status}`);
      toast.success('Statut mis à jour');
      fetchClients();
      if (selectedClient) {
        fetchClientDetails(clientId);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Add note to client
  const addNote = async () => {
    if (!newNote.trim() || !selectedClient) return;
    try {
      await api.post(`/admin/clients/${selectedClient.client._id}/notes`, { note_text: newNote });
      toast.success('Note ajoutée');
      setNewNote('');
      setShowNoteModal(false);
      fetchClientDetails(selectedClient.client._id);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la note');
    }
  };

  // Create lead
  const createLead = async () => {
    if (!newLead.full_name || !newLead.email) {
      toast.error('Nom et email requis');
      return;
    }
    try {
      await api.post('/admin/leads', newLead);
      toast.success('Lead créé avec succès');
      setShowAddLeadModal(false);
      setNewLead({ full_name: '', email: '', phone: '', country: '' });
      fetchLeads();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la création');
    }
  };

  // Update lead status
  const updateLeadStatus = async (leadId, status) => {
    try {
      await api.put(`/admin/leads/${leadId}`, { status });
      toast.success('Statut du lead mis à jour');
      fetchLeads();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Convert lead to client
  const convertLead = async (leadId) => {
    try {
      const response = await api.post(`/admin/leads/${leadId}/convert`);
      toast.success(`Lead converti! Mot de passe temporaire: ${response.data.temp_password}`);
      fetchLeads();
      fetchClients();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la conversion');
    }
  };

  // Delete lead
  const deleteLead = async (leadId) => {
    if (!confirm('Supprimer ce lead ?')) return;
    try {
      await api.delete(`/admin/leads/${leadId}`);
      toast.success('Lead supprimé');
      fetchLeads();
      fetchStats();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchClients();
    fetchLeads();
    fetchTransactions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients();
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      qualified: 'bg-purple-500',
      converted: 'bg-green-500',
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      suspended: 'bg-red-500',
      pending_kyc: 'bg-orange-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'leads', icon: UserPlus, label: 'Leads' },
    { id: 'transactions', icon: Activity, label: 'Transactions' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f5a623] min-h-screen fixed left-0 top-0">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#f5a623]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">OPTIX ROYAL</h1>
              <p className="text-white/70 text-xs">Admin CRM</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id 
                    ? 'bg-white text-[#f5a623]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find(m => m.id === activeSection)?.label}
            </h2>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => { fetchStats(); fetchClients(); fetchLeads(); }} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </header>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Clients</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.total_clients}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Clients Actifs</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.active_clients}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Nouveaux Leads</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.new_leads}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Trades</p>
                      <p className="text-3xl font-bold text-gray-800">{stats.total_trades}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Total Balances Démo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(stats.total_demo_balance)}</p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Derniers Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{lead.full_name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dernières Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map(tx => (
                      <div key={tx._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{tx.symbol}</p>
                          <p className="text-sm text-gray-500">{tx.user_email || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs text-white ${tx.order_type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {tx.order_type === 'buy' ? 'ACHAT' : 'VENTE'}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{formatCurrency(tx.price * tx.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Clients Section */}
        {activeSection === 'clients' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Liste des Clients</CardTitle>
              <span className="text-sm text-gray-500">{clients.length} clients</span>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Nom</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Téléphone</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Balance Démo</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Statut</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {clients.map(client => (
                      <tr key={client._id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium">{client.full_name}</td>
                        <td className="p-4 text-gray-600">{client.email}</td>
                        <td className="p-4 text-gray-600">{client.phone || '-'}</td>
                        <td className="p-4 font-mono">{formatCurrency(client.demo_balance)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(client.status || 'active')}`}>
                            {client.status || 'active'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => fetchClientDetails(client._id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads Section */}
        {activeSection === 'leads' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowAddLeadModal(true)} className="bg-[#f5a623] hover:bg-[#e09612]">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Lead
              </Button>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Liste des Leads</CardTitle>
                <span className="text-sm text-gray-500">{leads.length} leads</span>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Nom</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Email</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Téléphone</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Pays</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Source</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Statut</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {leads.map(lead => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium">{lead.full_name}</td>
                          <td className="p-4 text-gray-600">{lead.email}</td>
                          <td className="p-4 text-gray-600">{lead.phone || '-'}</td>
                          <td className="p-4 text-gray-600">{lead.country || '-'}</td>
                          <td className="p-4 text-gray-600">{lead.source || '-'}</td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                              className={`px-2 py-1 rounded text-xs text-white border-0 ${getStatusColor(lead.status)}`}
                            >
                              <option value="new">Nouveau</option>
                              <option value="contacted">Contacté</option>
                              <option value="qualified">Qualifié</option>
                              <option value="converted">Converti</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {lead.status !== 'converted' && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => convertLead(lead._id)}
                                >
                                  <ArrowUpRight className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteLead(lead._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions Section */}
        {activeSection === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Historique des Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Client</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Symbole</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-right p-4 text-sm font-medium text-gray-600">Quantité</th>
                      <th className="text-right p-4 text-sm font-medium text-gray-600">Prix</th>
                      <th className="text-right p-4 text-sm font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transactions.map(tx => (
                      <tr key={tx._id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-600">{formatDate(tx.created_at)}</td>
                        <td className="p-4">
                          <p className="font-medium">{tx.user_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{tx.user_email}</p>
                        </td>
                        <td className="p-4 font-medium">{tx.symbol}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs text-white ${tx.order_type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {tx.order_type === 'buy' ? 'ACHAT' : 'VENTE'}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono">{tx.quantity}</td>
                        <td className="p-4 text-right font-mono">{formatCurrency(tx.price)}</td>
                        <td className="p-4 text-right font-mono font-medium">{formatCurrency(tx.price * tx.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add Lead Modal */}
      <Dialog open={showAddLeadModal} onOpenChange={setShowAddLeadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom complet *</Label>
              <Input 
                value={newLead.full_name} 
                onChange={(e) => setNewLead({...newLead, full_name: e.target.value})}
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input 
                type="email"
                value={newLead.email} 
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input 
                value={newLead.phone} 
                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
              />
            </div>
            <div>
              <Label>Pays</Label>
              <Input 
                value={newLead.country} 
                onChange={(e) => setNewLead({...newLead, country: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLeadModal(false)}>Annuler</Button>
            <Button onClick={createLead} className="bg-[#f5a623] hover:bg-[#e09612]">Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Detail Modal */}
      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du Client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{selectedClient.client.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedClient.client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{selectedClient.client.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance Démo</p>
                  <p className="font-medium text-green-600">{formatCurrency(selectedClient.client.demo_balance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <select
                    value={selectedClient.client.status || 'active'}
                    onChange={(e) => updateClientStatus(selectedClient.client._id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(selectedClient.client.status || 'active')}`}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                    <option value="pending_kyc">KYC en attente</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inscrit le</p>
                  <p className="font-medium">{formatDate(selectedClient.client.created_at)}</p>
                </div>
              </div>

              {/* Positions */}
              <div>
                <h4 className="font-semibold mb-2">Positions Ouvertes ({selectedClient.positions.length})</h4>
                {selectedClient.positions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedClient.positions.map(pos => (
                      <div key={pos._id} className="flex justify-between p-3 bg-gray-50 rounded">
                        <span>{pos.symbol}</span>
                        <span>{pos.quantity} @ {formatCurrency(pos.entry_price)}</span>
                        <span className={pos.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {formatCurrency(pos.profit_loss)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">Aucune position</p>}
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Notes</h4>
                  <Button size="sm" onClick={() => setShowNoteModal(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Ajouter
                  </Button>
                </div>
                {selectedClient.notes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedClient.notes.map(note => (
                      <div key={note._id} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <p className="text-sm">{note.note_text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Par {note.admin_name} - {formatDate(note.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">Aucune note</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une Note</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Note</Label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-3 border rounded-lg min-h-[100px]"
              placeholder="Écrivez votre note..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteModal(false)}>Annuler</Button>
            <Button onClick={addNote} className="bg-[#f5a623] hover:bg-[#e09612]">Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCRM;
