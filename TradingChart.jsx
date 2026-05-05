import { useEffect, useRef, memo, useState } from 'react';

/**
 * TradingView Advanced Chart Component
 * Professional trading chart with full customization
 */
export const TradingChart = memo(({ 
  symbol = "BINANCE:BTCUSDT",
  interval = "D",
  theme = "dark",
  height = 500,
  autosize = true,
  showToolbar = true,
  showDrawingToolbar = true
}) => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Clean up previous widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = autosize ? '100%' : `${height}px`;
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    containerRef.current.appendChild(widgetContainer);

    // Create and load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: autosize,
      height: autosize ? "100%" : height,
      symbol: symbol,
      interval: interval,
      timezone: "Europe/Paris",
      theme: theme,
      style: "1",
      locale: "fr",
      enable_publishing: false,
      backgroundColor: theme === "dark" ? "rgba(10, 10, 10, 1)" : "rgba(255, 255, 255, 1)",
      gridColor: theme === "dark" ? "rgba(42, 42, 42, 0.5)" : "rgba(200, 200, 200, 0.5)",
      hide_top_toolbar: !showToolbar,
      hide_legend: false,
      save_image: true,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      allow_symbol_change: true,
      details: true,
      hotlist: false,
      calendar: false,
      studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
      withdateranges: true,
      hide_side_toolbar: !showDrawingToolbar,
      container_id: widgetDiv.id
    });

    // Handle load event
    script.onload = () => {
      setTimeout(() => setIsLoading(false), 1000);
    };

    widgetContainer.appendChild(script);
    scriptRef.current = script;

    // Fallback timeout to hide loading after 3 seconds
    const timeout = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      clearTimeout(timeout);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, theme, height, autosize, showToolbar, showDrawingToolbar]);

  return (
    <div 
      style={{ 
        height: autosize ? '100%' : `${height}px`,
        width: '100%',
        minHeight: '400px',
        position: 'relative'
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-[#d4af37] text-sm">Chargement du graphique...</p>
            <p className="text-gray-500 text-xs mt-1">{symbol}</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        style={{ 
          height: '100%',
          width: '100%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
});

TradingChart.displayName = 'TradingChart';

export default TradingChart;
