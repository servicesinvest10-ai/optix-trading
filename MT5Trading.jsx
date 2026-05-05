import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  RefreshCw,
  Activity,
  BarChart3,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

export const MT5Trading = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [positions, setPositions] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [orderForm, setOrderForm] = useState({
    volume: '0.01',
    stopLoss: '',
    takeProfit: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch MT5 status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await api.get('/mt5/status');
      setConnectionStatus(response.data);
    } catch (error) {
      console.error('Error fetching MT5 status:', error);
    }
  }, []);

  // Fetch account info
  const fetchAccountInfo = useCallback(async () => {
    try {
      const response = await api.get('/mt5/account');
      setAccountInfo(response.data);
    } catch (error) {
      console.error('Error fetching account info:', error);
    }
  }, []);

  // Fetch positions
  const fetchPositions = useCallback(async () => {
    try {
      const response = await api.get('/mt5/positions');
      setPositions(response.data.positions || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  }, []);

  // Fetch symbols
  const fetchSymbols = useCallback(async () => {
    try {
      const response = await api.get('/mt5/symbols');
      setSymbols(response.data.symbols || []);
    } catch (error) {
      console.error('Error fetching symbols:', error);
    }
  }, []);

  // Fetch current price
  const fetchPrice = useCallback(async () => {
    if (!selectedSymbol) return;
    try {
      const response = await api.get(`/mt5/price/${selectedSymbol}`);
      setCurrentPrice(response.data);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  }, [selectedSymbol]);

  // Connect to MT5
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await api.post('/mt5/connect');
      setConnectionStatus({ ...connectionStatus, is_connected: true });
      toast.success('Connecté au serveur MT5');
      fetchAccountInfo();
      fetchSymbols();
    } catch (error) {
      toast.error('Erreur de connexion MT5');
    } finally {
      setIsConnecting(false);
    }
  };

  // Execute trade
  const handleTrade = async (orderType) => {
    if (!orderForm.volume || parseFloat(orderForm.volume) <= 0) {
      toast.error('Veuillez entrer un volume valide');
      return;
    }

    setIsLoading(true);
    try {
      const tradeData = {
        symbol: selectedSymbol,
        order_type: orderType,
        volume: parseFloat(orderForm.volume),
        stop_loss: orderForm.stopLoss ? parseFloat(orderForm.stopLoss) : null,
        take_profit: orderForm.takeProfit ? parseFloat(orderForm.takeProfit) : null
      };

      const response = await api.post('/mt5/trade', tradeData);
      
      if (response.data.success) {
        toast.success(`Ordre ${orderType === 'ORDER_TYPE_BUY' ? 'd\'achat' : 'de vente'} exécuté!`);
        fetchPositions();
        fetchAccountInfo();
      } else {
        toast.error(response.data.error || 'Erreur lors de l\'exécution');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'exécution');
    } finally {
      setIsLoading(false);
    }
  };

  // Close position
  const handleClosePosition = async (positionId) => {
    try {
      await api.post(`/mt5/close/${positionId}`);
      toast.success('Position fermée');
      fetchPositions();
      fetchAccountInfo();
    } catch (error) {
      toast.error('Erreur lors de la fermeture');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStatus();
    fetchAccountInfo();
    fetchSymbols();
    fetchPositions();
  }, []);

  // Price update interval
  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 2000);
    return () => clearInterval(interval);
  }, [selectedSymbol, fetchPrice]);

  // Data refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAccountInfo();
      fetchPositions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value, decimals = 2) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value || 0);
  };

  const formatPrice = (price, digits = 5) => {
    return price?.toFixed(digits) || '0.00000';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Banner */}
      <Card className={`border-l-4 ${
        connectionStatus?.simulation_mode 
          ? 'border-l-yellow-500 bg-yellow-500/10' 
          : connectionStatus?.is_connected 
            ? 'border-l-green-500 bg-green-500/10' 
            : 'border-l-red-500 bg-red-500/10'
      }`}>
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {connectionStatus?.simulation_mode ? (
                <AlertCircle className="w-6 h-6 text-yellow-500 mt-0.5" />
              ) : connectionStatus?.is_connected ? (
                <Wifi className="w-6 h-6 text-green-500 mt-0.5" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-white text-lg">
                  {connectionStatus?.simulation_mode 
                    ? 'Mode Simulation MT5 (Données virtuelles)' 
                    : connectionStatus?.is_connected 
                      ? 'Connecté à MT5 (IC Markets Demo)' 
                      : 'Déconnecté de MT5'}
                </p>
                {connectionStatus?.simulation_mode && (
                  <div className="text-sm text-gray-300 mt-2 space-y-1">
                    <p className="text-yellow-400">Pour connecter votre compte MT5 réel :</p>
                    <ol className="list-decimal list-inside text-gray-400 space-y-1 ml-2">
                      <li>Créez un compte sur <span className="text-[#d4af37]">metaapi.cloud</span></li>
                      <li>Ajoutez votre compte MT5 IC Markets Demo</li>
                      <li>Copiez votre Token et Account ID</li>
                      <li>Configurez dans <code className="bg-[#1a1a1a] px-1 rounded">.env</code></li>
                    </ol>
                  </div>
                )}
                {connectionStatus?.is_connected && (
                  <p className="text-sm text-green-400 mt-1">
                    Trading en temps réel activé - Données live depuis votre compte
                  </p>
                )}
              </div>
            </div>
            {!connectionStatus?.is_connected && !connectionStatus?.simulation_mode && (
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="bg-[#d4af37] hover:bg-[#aa8a2e] text-black"
              >
                {isConnecting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connexion...</>
                ) : (
                  <><Wifi className="w-4 h-4 mr-2" /> Connecter</>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Info Cards */}
      {accountInfo && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#111] border-[#1a1a1a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Balance MT5</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(accountInfo.balance)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#d4af37]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#1a1a1a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Équité</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(accountInfo.equity)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#1a1a1a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Marge Libre</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(accountInfo.free_margin)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-[#1a1a1a]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Levier</p>
                  <p className="text-2xl font-bold text-white">1:{accountInfo.leverage}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Symbol Selection & Price */}
          <Card className="bg-[#111] border-[#1a1a1a]">
            <CardHeader className="border-b border-[#1a1a1a]">
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#d4af37]" />
                Trading MT5 - {selectedSymbol}
              </CardTitle>
              {accountInfo?.simulation_mode && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-500 w-fit">
                  Mode Simulation
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Symbol Selection */}
                <div>
                  <Label className="text-gray-400 mb-2 block">Symbole</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD', 'US30'].map(sym => (
                      <Button
                        key={sym}
                        variant={selectedSymbol === sym ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSymbol(sym)}
                        className={selectedSymbol === sym 
                          ? 'bg-[#d4af37] text-black hover:bg-[#aa8a2e]' 
                          : 'border-[#333] text-gray-400 hover:text-white'}
                      >
                        {sym}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Price */}
                <div className="text-center">
                  <Label className="text-gray-400 mb-2 block">Prix Actuel</Label>
                  {currentPrice && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-500/10 rounded-lg p-3">
                          <p className="text-xs text-gray-400">BID</p>
                          <p className="text-xl font-mono font-bold text-red-400">
                            {formatPrice(currentPrice.bid)}
                          </p>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-3">
                          <p className="text-xs text-gray-400">ASK</p>
                          <p className="text-xl font-mono font-bold text-green-400">
                            {formatPrice(currentPrice.ask)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Spread: {((currentPrice.ask - currentPrice.bid) * 100000).toFixed(1)} points
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MT5 Positions */}
          <Card className="bg-[#111] border-[#1a1a1a]">
            <CardHeader className="border-b border-[#1a1a1a]">
              <CardTitle className="text-white">Positions MT5 ({positions.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {positions.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  Aucune position MT5 ouverte
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0a]">
                      <tr>
                        <th className="text-left p-4 text-xs text-gray-400">Symbole</th>
                        <th className="text-left p-4 text-xs text-gray-400">Type</th>
                        <th className="text-right p-4 text-xs text-gray-400">Volume</th>
                        <th className="text-right p-4 text-xs text-gray-400">Prix Ouv.</th>
                        <th className="text-right p-4 text-xs text-gray-400">Prix Act.</th>
                        <th className="text-right p-4 text-xs text-gray-400">Profit</th>
                        <th className="text-right p-4 text-xs text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      {positions.map((pos, idx) => (
                        <tr key={pos.id || idx} className="hover:bg-[#1a1a1a]">
                          <td className="p-4 font-medium text-white">{pos.symbol}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              pos.type?.includes('BUY') 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {pos.type?.includes('BUY') ? 'BUY' : 'SELL'}
                            </span>
                          </td>
                          <td className="p-4 text-right text-white font-mono">{pos.volume}</td>
                          <td className="p-4 text-right text-white font-mono">{formatPrice(pos.open_price)}</td>
                          <td className="p-4 text-right text-white font-mono">{formatPrice(pos.current_price)}</td>
                          <td className={`p-4 text-right font-mono ${pos.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatCurrency(pos.profit)}
                          </td>
                          <td className="p-4 text-right">
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleClosePosition(pos.id)}
                            >
                              Fermer
                            </Button>
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

        {/* Order Form */}
        <div>
          <Card className="bg-[#111] border-[#1a1a1a] sticky top-24">
            <CardHeader className="border-b border-[#1a1a1a]">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#d4af37]" />
                Nouveau Trade MT5
              </CardTitle>
              <CardDescription className="text-gray-400">
                {selectedSymbol}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Volume */}
              <div>
                <Label className="text-gray-400">Volume (Lots)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={orderForm.volume}
                  onChange={(e) => setOrderForm({ ...orderForm, volume: e.target.value })}
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <Label className="text-gray-400">Stop Loss (Optionnel)</Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={orderForm.stopLoss}
                  onChange={(e) => setOrderForm({ ...orderForm, stopLoss: e.target.value })}
                  placeholder="0.00000"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                />
              </div>

              {/* Take Profit */}
              <div>
                <Label className="text-gray-400">Take Profit (Optionnel)</Label>
                <Input
                  type="number"
                  step="0.00001"
                  value={orderForm.takeProfit}
                  onChange={(e) => setOrderForm({ ...orderForm, takeProfit: e.target.value })}
                  placeholder="0.00000"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                />
              </div>

              {/* Trade Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => handleTrade('ORDER_TYPE_BUY')}
                  disabled={isLoading}
                  className="h-14 bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      ACHETER
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleTrade('ORDER_TYPE_SELL')}
                  disabled={isLoading}
                  className="h-14 bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <TrendingDown className="w-5 h-5 mr-2" />
                      VENDRE
                    </>
                  )}
                </Button>
              </div>

              {/* Warning */}
              <div className="p-3 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20">
                <p className="text-xs text-[#d4af37]">
                  {accountInfo?.simulation_mode 
                    ? '⚠️ Mode Simulation - Pas de vraies transactions'
                    : '⚠️ Trading Démo IC Markets - Capital virtuel uniquement'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MT5Trading;
