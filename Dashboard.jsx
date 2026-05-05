import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  LineChart, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  LogOut,
  BarChart3,
  History,
  PieChart,
  DollarSign,
  Activity,
  Briefcase,
  Zap,
  CandlestickChart,
  X,
  Clock,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Building2,
  Banknote,
  Plus,
  Minus
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import MT5Trading from '@/components/MT5Trading';
import ChartSection from '@/components/ChartSection';

// Helper: format time elapsed
const formatDuration = (dateStr) => {
  if (!dateStr) return '-';
  const opened = new Date(dateStr);
  const now = new Date();
  const diffMs = now - opened;
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}j ${hrs % 24}h`;
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
};

// Wallet Tab Component
const WalletTab = ({ balance, onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  const methods = [
    { id: 'bank_transfer', label: 'Virement', icon: Building2 },
    { id: 'credit_card', label: 'Carte', icon: CreditCard },
    { id: 'crypto', label: 'Crypto', icon: Banknote },
  ];

  const quickAmounts = [500, 1000, 5000, 10000, 25000, 50000];

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/wallet/transactions');
      setTransactions(res.data.transactions || []);
    } catch { /* empty */ } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleTransaction = async (type) => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/wallet/${type}`, {
        amount: val,
        transaction_type: type,
        method
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAmount('');
        onBalanceUpdate();
        fetchTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Wallet Balance + Actions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Balance Card */}
        <Card className="bg-[#111] border-[#1a1a1a]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Solde du Portefeuille</p>
                <p className="text-4xl font-bold text-white" data-testid="wallet-balance">
                  {formatCurrency(balance.demo_balance)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Compte Démo</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-[#d4af37]" />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Montant rapide</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickAmounts.map(qa => (
                  <Button
                    key={qa}
                    size="sm"
                    variant="outline"
                    onClick={() => setAmount(String(qa))}
                    data-testid={`quick-amount-${qa}`}
                    className={`text-xs h-9 ${amount === String(qa) ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-[#333] text-gray-400 hover:border-[#d4af37]/50'}`}
                  >
                    ${qa.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <Label className="text-gray-400 text-xs">Montant personnalisé ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                data-testid="wallet-amount-input"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white text-lg h-12 font-mono mt-1"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Méthode de paiement</p>
              <div className="grid grid-cols-3 gap-2">
                {methods.map(m => {
                  const Icon = m.icon;
                  return (
                    <Button
                      key={m.id}
                      size="sm"
                      variant="outline"
                      onClick={() => setMethod(m.id)}
                      data-testid={`method-${m.id}`}
                      className={`h-10 text-xs ${method === m.id ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-[#333] text-gray-400 hover:border-[#d4af37]/50'}`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5" />
                      {m.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleTransaction('deposit')}
                disabled={isLoading || !amount}
                data-testid="deposit-btn"
                className="h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Déposer
              </Button>
              <Button
                onClick={() => handleTransaction('withdraw')}
                disabled={isLoading || !amount}
                data-testid="withdraw-btn"
                className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
                Retirer
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20">
              <p className="text-xs text-[#d4af37]">Mode Démo - Les transactions sont simulées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Transaction History */}
      <div>
        <Card className="bg-[#111] border-[#1a1a1a]">
          <CardHeader className="border-b border-[#1a1a1a] pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-[#d4af37]" />
              Historique
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {txLoading ? (
              <div className="p-6 text-center">
                <RefreshCw className="w-5 h-5 text-gray-500 animate-spin mx-auto" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-6 text-center">
                <Wallet className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Aucune transaction</p>
              </div>
            ) : (
              <div className="divide-y divide-[#1a1a1a] max-h-[500px] overflow-y-auto">
                {transactions.map((txn) => (
                  <div key={txn._id} className="flex items-center justify-between p-3 hover:bg-[#1a1a1a]/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.type === 'deposit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {txn.type === 'deposit' ? <ArrowDown className="w-4 h-4 text-green-500" /> : <ArrowUp className="w-4 h-4 text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{txn.type === 'deposit' ? 'Dépôt' : 'Retrait'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(txn.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-mono font-medium ${txn.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                        {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{txn.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Dashboard = ({ onLogout }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState({ demo_balance: 10000, real_balance: 0, total_profit_loss: 0 });
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [markets, setMarkets] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [orderForm, setOrderForm] = useState({ quantity: '', orderType: 'buy' });
  const [isLoading, setIsLoading] = useState(false);
  const [isClosingPosition, setIsClosingPosition] = useState(false);
  const [closingPositionId, setClosingPositionId] = useState(null);
  const prevPnlRef = useRef(0);
  const [pnlFlash, setPnlFlash] = useState(null); // 'up' | 'down' | null

  // Fetch all data
  const fetchData = async () => {
    try {
      const [balanceRes, positionsRes, ordersRes, marketsRes] = await Promise.all([
        api.get('/trading/balance'),
        api.get('/trading/positions'),
        api.get('/trading/orders'),
        api.get('/markets/')
      ]);
      
      // Flash P&L animation
      const newPnl = balanceRes.data.total_profit_loss;
      if (newPnl !== prevPnlRef.current) {
        setPnlFlash(newPnl > prevPnlRef.current ? 'up' : 'down');
        setTimeout(() => setPnlFlash(null), 600);
        prevPnlRef.current = newPnl;
      }
      
      setBalance(balanceRes.data);
      setPositions(positionsRes.data);
      setOrders(ordersRes.data);
      setMarkets(marketsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Close a single position
  const handleClosePosition = async (positionId, symbol) => {
    if (!positionId) {
      toast.error('ID de position invalide');
      return;
    }
    setIsClosingPosition(true);
    setClosingPositionId(positionId);
    try {
      const response = await api.post(`/trading/positions/${positionId}/close`);
      const result = response.data;
      if (result.success) {
        toast.success(
          `Position ${symbol} fermée | P&L: ${result.profit_loss >= 0 ? '+' : ''}$${result.profit_loss.toFixed(2)}`
        );
        await fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la fermeture');
    } finally {
      setIsClosingPosition(false);
      setClosingPositionId(null);
    }
  };

  // Close all positions
  const handleCloseAllPositions = async () => {
    if (positions.length === 0) return;
    if (!confirm(`Fermer toutes les ${positions.length} positions ?`)) return;
    setIsClosingPosition(true);
    try {
      const response = await api.post('/trading/positions/close-all');
      const result = response.data;
      if (result.success) {
        toast.success(
          `${result.closed_count} positions fermées | P&L Total: ${result.total_profit_loss >= 0 ? '+' : ''}$${result.total_profit_loss.toFixed(2)}`
        );
        await fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la fermeture');
    } finally {
      setIsClosingPosition(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get all instruments as flat array
  const getAllInstruments = () => {
    const all = [];
    Object.values(markets).forEach(category => {
      if (Array.isArray(category)) all.push(...category);
    });
    return all;
  };

  const currentInstrument = getAllInstruments().find(i => i.symbol === selectedSymbol);

  // Quick quantity presets based on instrument
  const getQuickQuantities = () => {
    if (!currentInstrument) return [0.1, 0.5, 1, 5, 10];
    const price = currentInstrument.price;
    if (price > 10000) return [0.001, 0.01, 0.05, 0.1, 0.5];
    if (price > 100) return [0.01, 0.1, 0.5, 1, 5];
    if (price > 1) return [1, 5, 10, 50, 100];
    return [100, 500, 1000, 5000, 10000];
  };

  // Place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.quantity || parseFloat(orderForm.quantity) <= 0) {
      toast.error('Veuillez entrer une quantité valide');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/trading/order', {
        symbol: selectedSymbol,
        order_type: orderForm.orderType,
        quantity: parseFloat(orderForm.quantity),
        account_type: 'demo'
      });
      toast.success(`Ordre ${orderForm.orderType === 'buy' ? 'd\'achat (LONG)' : 'de vente (SHORT)'} exécuté !`);
      setOrderForm({ ...orderForm, quantity: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'exécution de l\'ordre');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value, decimals = 2) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Calculate equity and margin
  const totalEquity = balance.demo_balance + balance.total_profit_loss;
  const marginUsed = positions.reduce((sum, p) => sum + (p.entry_price * p.quantity), 0);
  const marginLevel = marginUsed > 0 ? ((totalEquity / marginUsed) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0d0d0d]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#aa8a2e] flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white" data-testid="dashboard-title">OPTIX ROYAL</h1>
                  <p className="text-xs text-[#d4af37]">Tableau de Bord</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Équité</p>
                  <p className="text-lg font-bold text-[#d4af37]" data-testid="header-equity">{formatCurrency(totalEquity)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">P&L</p>
                  <p 
                    data-testid="header-pnl"
                    className={`text-lg font-bold transition-colors duration-300 ${
                      pnlFlash === 'up' ? 'text-green-300' : 
                      pnlFlash === 'down' ? 'text-red-300' : 
                      balance.total_profit_loss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {balance.total_profit_loss >= 0 ? '+' : ''}{formatCurrency(balance.total_profit_loss)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-400">Bienvenue,</p>
                  <p className="text-white font-medium">{user?.full_name || 'Trader'}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onLogout}
                  data-testid="logout-btn"
                  className="border-[#333] hover:bg-[#1a1a1a] hover:border-[#d4af37]"
                >
                  <LogOut className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="bg-[#111] border-[#1a1a1a] hover:border-[#d4af37]/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Solde</p>
                  <p className="text-xl lg:text-2xl font-bold text-white" data-testid="stat-balance">{formatCurrency(balance.demo_balance)}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-[#d4af37]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#1a1a1a] hover:border-[#d4af37]/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">P&L</p>
                  <p 
                    data-testid="stat-pnl"
                    className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                      pnlFlash === 'up' ? 'text-green-300' : 
                      pnlFlash === 'down' ? 'text-red-300' :
                      balance.total_profit_loss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {balance.total_profit_loss >= 0 ? '+' : ''}{formatCurrency(balance.total_profit_loss)}
                  </p>
                </div>
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${balance.total_profit_loss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  {balance.total_profit_loss >= 0 ? 
                    <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" /> : 
                    <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#1a1a1a] hover:border-[#d4af37]/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Positions</p>
                  <p className="text-xl lg:text-2xl font-bold text-white" data-testid="stat-positions">{positions.length}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#1a1a1a] hover:border-[#d4af37]/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Ordres</p>
                  <p className="text-xl lg:text-2xl font-bold text-white" data-testid="stat-orders">{orders.length}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <History className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="trading" className="mb-6">
          <TabsList className="bg-[#111] border border-[#1a1a1a] p-1">
            <TabsTrigger 
              value="trading" 
              data-testid="tab-trading"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black px-4 sm:px-6"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger 
              value="charts" 
              data-testid="tab-charts"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black px-4 sm:px-6"
            >
              <CandlestickChart className="w-4 h-4 mr-2" />
              Graphiques
            </TabsTrigger>
            <TabsTrigger 
              value="wallet" 
              data-testid="tab-wallet"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black px-4 sm:px-6"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Portefeuille
            </TabsTrigger>
            <TabsTrigger 
              value="mt5" 
              data-testid="tab-mt5"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black px-4 sm:px-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              MT5
            </TabsTrigger>
          </TabsList>

          {/* Charts Tab */}
          <TabsContent value="charts" className="mt-6">
            <ChartSection 
              selectedSymbol={selectedSymbol}
              onSymbolChange={setSelectedSymbol}
              height={550}
              showSymbolSelector={true}
            />
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="mt-6">
            <WalletTab balance={balance} onBalanceUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="trading" className="mt-6">
            {/* Main Content - Internal Trading */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Markets + Positions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Market Watch */}
                <Card className="bg-[#111] border-[#1a1a1a]">
                  <CardHeader className="border-b border-[#1a1a1a] pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2 text-base">
                        <Activity className="w-5 h-5 text-[#d4af37]" />
                        Marchés en Direct
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={fetchData}
                        data-testid="refresh-btn"
                        className="text-gray-400 hover:text-white"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="crypto" className="w-full">
                      <TabsList className="w-full justify-start bg-[#0a0a0a] border-b border-[#1a1a1a] rounded-none px-4">
                        <TabsTrigger value="crypto" data-testid="market-tab-crypto" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#d4af37]">Crypto</TabsTrigger>
                        <TabsTrigger value="forex" data-testid="market-tab-forex" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#d4af37]">Forex</TabsTrigger>
                        <TabsTrigger value="indices" data-testid="market-tab-indices" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#d4af37]">Indices</TabsTrigger>
                        <TabsTrigger value="commodities" data-testid="market-tab-commodities" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#d4af37]">Matières</TabsTrigger>
                      </TabsList>
                      
                      {['crypto', 'forex', 'indices', 'commodities'].map(category => (
                        <TabsContent key={category} value={category} className="m-0">
                          <div className="divide-y divide-[#1a1a1a]">
                            {(markets[category] || []).map((instrument) => (
                              <div 
                                key={instrument.symbol}
                                onClick={() => setSelectedSymbol(instrument.symbol)}
                                data-testid={`market-row-${instrument.symbol.replace('/', '-')}`}
                                className={`flex items-center justify-between p-3 hover:bg-[#1a1a1a] cursor-pointer transition-colors ${selectedSymbol === instrument.symbol ? 'bg-[#1a1a1a] border-l-2 border-[#d4af37]' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${instrument.change_percent >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <div>
                                    <p className="font-medium text-white text-sm">{instrument.symbol}</p>
                                    <p className="text-xs text-gray-500">{instrument.name}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-mono font-medium text-white text-sm">
                                    {instrument.price < 10 ? instrument.price.toFixed(4) : formatCurrency(instrument.price).replace('US', '')}
                                  </p>
                                  <p className={`text-xs font-medium ${instrument.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatPercent(instrument.change_percent)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Positions Table */}
                <Card className="bg-[#111] border-[#1a1a1a]">
                  <CardHeader className="border-b border-[#1a1a1a] pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2 text-base">
                        <PieChart className="w-5 h-5 text-[#d4af37]" />
                        Positions Ouvertes ({positions.length})
                      </CardTitle>
                      {positions.length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCloseAllPositions}
                          disabled={isClosingPosition}
                          data-testid="close-all-btn"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8"
                        >
                          {isClosingPosition ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <X className="w-3 h-3 mr-1" />}
                          Tout Fermer
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {positions.length === 0 ? (
                      <div className="p-8 text-center">
                        <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Aucune position ouverte</p>
                        <p className="text-xs text-gray-500 mt-1">Passez un ordre pour commencer</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                            <tr>
                              <th className="text-left p-3 text-xs font-medium text-gray-400">Symbole</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-400">Type</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Qté</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Entrée</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Actuel</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">P&L</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">ROI%</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Durée</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a1a1a]">
                            {positions.map((position, index) => {
                              const roi = position.entry_price > 0 
                                ? (position.profit_loss / (position.entry_price * position.quantity)) * 100 
                                : 0;
                              return (
                                <tr key={position._id || index} className="hover:bg-[#1a1a1a] transition-colors" data-testid={`position-row-${index}`}>
                                  <td className="p-3">
                                    <p className="font-medium text-white text-sm">{position.symbol}</p>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${position.position_type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                      {position.position_type === 'long' ? 'LONG' : 'SHORT'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right text-white font-mono text-sm">{position.quantity}</td>
                                  <td className="p-3 text-right text-gray-300 font-mono text-sm">{formatCurrency(position.entry_price)}</td>
                                  <td className="p-3 text-right text-white font-mono text-sm">{formatCurrency(position.current_price)}</td>
                                  <td className="p-3 text-right">
                                    <span className={`font-mono text-sm font-medium ${position.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {position.profit_loss >= 0 ? '+' : ''}{formatCurrency(position.profit_loss)}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <span className={`font-mono text-xs font-medium px-1.5 py-0.5 rounded ${roi >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                      {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDuration(position.opened_at)}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <Button
                                      size="sm"
                                      onClick={() => handleClosePosition(position._id, position.symbol)}
                                      disabled={isClosingPosition}
                                      data-testid={`close-position-${index}`}
                                      className="h-7 px-3 bg-red-600/80 hover:bg-red-600 text-white text-xs"
                                    >
                                      {closingPositionId === position._id ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : (
                                        'Fermer'
                                      )}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {/* Positions Summary Bar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0a] border-t border-[#1a1a1a]">
                          <span className="text-xs text-gray-400">
                            Marge: {formatCurrency(marginUsed)}
                          </span>
                          <span className={`text-xs font-medium ${balance.total_profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            P&L Total: {balance.total_profit_loss >= 0 ? '+' : ''}{formatCurrency(balance.total_profit_loss)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Orders History */}
                <Card className="bg-[#111] border-[#1a1a1a]">
                  <CardHeader className="border-b border-[#1a1a1a] pb-3">
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                      <History className="w-5 h-5 text-[#d4af37]" />
                      Historique des Ordres
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {orders.length === 0 ? (
                      <div className="p-8 text-center">
                        <History className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Aucun ordre exécuté</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                            <tr>
                              <th className="text-left p-3 text-xs font-medium text-gray-400">Date</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-400">Symbole</th>
                              <th className="text-left p-3 text-xs font-medium text-gray-400">Type</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Qté</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Prix</th>
                              <th className="text-right p-3 text-xs font-medium text-gray-400">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1a1a1a]">
                            {orders.slice(0, 10).map((order, index) => (
                              <tr key={index} className="hover:bg-[#1a1a1a]" data-testid={`order-row-${index}`}>
                                <td className="p-3 text-gray-400 text-xs">
                                  {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                  })}
                                </td>
                                <td className="p-3 font-medium text-white text-sm">{order.symbol}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.order_type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {order.order_type === 'buy' ? 'ACHAT' : 'VENTE'}
                                  </span>
                                </td>
                                <td className="p-3 text-right text-white font-mono text-sm">{order.quantity}</td>
                                <td className="p-3 text-right text-white font-mono text-sm">{formatCurrency(order.price)}</td>
                                <td className="p-3 text-right">
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#d4af37]/20 text-[#d4af37]">
                                    {order.status.toUpperCase()}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Form */}
              <div className="space-y-6">
                {/* Selected Instrument */}
                <Card className="bg-[#111] border-[#1a1a1a]">
                  <CardContent className="p-4">
                    {currentInstrument ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-lg font-bold text-white">{selectedSymbol}</p>
                            <p className="text-xs text-gray-400">{currentInstrument.name}</p>
                          </div>
                          <div className={`px-2 py-1 rounded ${currentInstrument.change_percent >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <p className={`text-xs font-bold ${currentInstrument.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatPercent(currentInstrument.change_percent)}
                            </p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-white text-center mb-3" data-testid="instrument-price">
                          {currentInstrument.price < 10 ? currentInstrument.price.toFixed(4) : formatCurrency(currentInstrument.price)}
                        </p>
                        <div className="grid grid-cols-2 gap-3 border-t border-[#1a1a1a] pt-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Spread</p>
                            <p className="text-white text-sm font-medium">{currentInstrument.spread}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Cat.</p>
                            <p className="text-white text-sm font-medium capitalize">{currentInstrument.category}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">Sélectionnez un instrument</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Form */}
                <Card className="bg-[#111] border-[#1a1a1a]">
                  <CardHeader className="border-b border-[#1a1a1a] pb-3">
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                      <DollarSign className="w-5 h-5 text-[#d4af37]" />
                      Passer un Ordre
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                      {/* Buy/Sell Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, orderType: 'buy' })}
                          data-testid="order-buy-btn"
                          className={`h-12 font-bold text-sm ${orderForm.orderType === 'buy' 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-[#1a1a1a] hover:bg-[#222] text-gray-400'}`}
                        >
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          LONG
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, orderType: 'sell' })}
                          data-testid="order-sell-btn"
                          className={`h-12 font-bold text-sm ${orderForm.orderType === 'sell' 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-[#1a1a1a] hover:bg-[#222] text-gray-400'}`}
                        >
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                          SHORT
                        </Button>
                      </div>

                      {/* Quick Quantity Buttons */}
                      <div>
                        <Label className="text-gray-400 text-xs">Quantité rapide</Label>
                        <div className="grid grid-cols-5 gap-1 mt-1">
                          {getQuickQuantities().map(q => (
                            <Button
                              key={q}
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setOrderForm({ ...orderForm, quantity: String(q) })}
                              data-testid={`quick-qty-${q}`}
                              className={`h-8 text-xs ${orderForm.quantity === String(q) ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-[#333] text-gray-400'}`}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div>
                        <Label className="text-gray-400 text-xs">Quantité</Label>
                        <Input
                          type="number"
                          step="0.001"
                          min="0.001"
                          value={orderForm.quantity}
                          onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                          placeholder="0.00"
                          data-testid="order-quantity-input"
                          className="bg-[#0a0a0a] border-[#1a1a1a] text-white text-lg h-11 font-mono mt-1"
                        />
                      </div>

                      {/* Order Summary */}
                      {currentInstrument && orderForm.quantity && parseFloat(orderForm.quantity) > 0 && (
                        <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Marge requise:</span>
                            <span className="text-white font-mono">
                              {formatCurrency(currentInstrument.price * parseFloat(orderForm.quantity))}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Solde après:</span>
                            <span className="text-white font-mono">
                              {formatCurrency(balance.demo_balance - (currentInstrument.price * parseFloat(orderForm.quantity)))}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        disabled={isLoading || !orderForm.quantity}
                        data-testid="place-order-btn"
                        className={`w-full h-12 font-bold text-white ${orderForm.orderType === 'buy' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'}`}
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {orderForm.orderType === 'buy' ? 'OUVRIR LONG' : 'OUVRIR SHORT'} {selectedSymbol}
                      </Button>
                    </form>

                    <div className="mt-3 p-2 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20">
                      <p className="text-xs text-[#d4af37]">Mode Démo - Pas de vraies transactions</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Summary */}
                <Card className="bg-[#111] border-[#1a1a1a]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">Résumé</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Solde</span>
                      <span className="text-white font-mono text-sm">{formatCurrency(balance.demo_balance)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Équité</span>
                      <span className="text-[#d4af37] font-mono text-sm">{formatCurrency(totalEquity)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">Marge utilisée</span>
                      <span className="text-white font-mono text-sm">{formatCurrency(marginUsed)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-xs">P&L non réalisé</span>
                      <span className={`font-mono text-sm ${balance.total_profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {balance.total_profit_loss >= 0 ? '+' : ''}{formatCurrency(balance.total_profit_loss)}
                      </span>
                    </div>
                    {marginLevel > 0 && (
                      <div className="flex justify-between items-center pt-1 border-t border-[#1a1a1a]">
                        <span className="text-gray-400 text-xs">Niveau de marge</span>
                        <span className={`font-mono text-sm font-medium ${marginLevel > 200 ? 'text-green-400' : marginLevel > 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {marginLevel.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* MT5 Trading Tab */}
          <TabsContent value="mt5" className="mt-6">
            <MT5Trading />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
