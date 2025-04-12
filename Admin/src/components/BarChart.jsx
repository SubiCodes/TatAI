import React, { useState, useRef, useEffect } from 'react';

function BarChart() {
    
    const currentYear = new Date().getFullYear();
    const [chartData] = useState([112, 10, 225, 400]);
    const [labels] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipX, setTooltipX] = useState(0);
    const [tooltipY, setTooltipY] = useState(0);
    const tooltipRef = useRef(null);

    // Add font to document head
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        // Clean up function
        return () => {
        document.head.removeChild(link);
        };
    }, []);

    const showTooltip = (e) => {
        setTooltipContent(e.target.textContent);
        setTooltipX(e.target.offsetLeft - e.target.clientWidth);
        setTooltipY(e.target.clientHeight + e.target.clientWidth);
        setTooltipOpen(true);
    };

    const hideTooltip = () => {
        setTooltipContent('');
        setTooltipOpen(false);
        setTooltipX(0);
        setTooltipY(0);
    };

    // CSS styles
    const styles = {
        body: {
        fontFamily: "'IBM Plex Mono', sans-serif"
        },
        line: {
        background: "repeating-linear-gradient(to bottom, #eee, #eee 1px, #fff 1px, #fff 8%)"
        },
        tick: {
        background: "repeating-linear-gradient(to right, #eee, #eee 1px, #fff 1px, #fff 5%)"
        }
    };

    const adjustedChartData = [...chartData];
    while (adjustedChartData.length < labels.length) {
        adjustedChartData.push(0); // Fill missing months with 0
    }

  return (
    <div className="w-3/4 h-56 rounded-b-full z-50 relative bg-white shadow-2xl"  style={styles.body}>
      <div className="max-w-screen mx-auto">
        <div className="shadow p-6 rounded-lg bg-white">
          <div className="md:flex md:justify-between md:items-center">
            <div>
              <h2 className="text-xl text-gray-800 font-bold leading-tight">App Visits</h2>
              <p className="mb-2 text-gray-600 text-sm">Monthly Visits {currentYear}</p>
            </div>

            {/* Legends */}
            <div className="mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 mr-2 rounded-full"></div>
                <div className="text-sm text-gray-700">Visits</div>
              </div>
            </div>
          </div>

          <div className="my-8 relative" style={styles.line}>
            {/* Tooltip */}
            {tooltipOpen && (
              <div 
                ref={tooltipRef} 
                className="p-0 m-0 z-10 shadow-lg rounded-lg absolute h-auto block" 
                style={{ bottom: `${tooltipY}px`, left: `${tooltipX}px` }}
              >
                <div className="shadow-xs rounded-lg bg-white p-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Visits:</div>
                    <div className="font-bold ml-2">
                      <span>{tooltipContent}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bar Chart */}
            <div className="flex items-end justify-between">
            {adjustedChartData.map((data, index) => {
            const widthPercent = 100 / adjustedChartData.length - 2; // 2% reserved for margin
            const maxBarHeight = 240;
            const maxValue = Math.max(...adjustedChartData);
            const barHeight = maxValue > 0 ? (data / maxValue) * maxBarHeight : 0;

            return (
                <div
                key={index}
                style={{ width: `${widthPercent}%`, margin: '0 1%' }}
                className="flex flex-col items-center"
                >
                {/* Bar */}
                <div
                    style={{ height: `${barHeight}px` }}
                    className="transition ease-in duration-200 bg-blue-600 hover:bg-blue-400 relative w-12"
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                >
                    <div className="text-center absolute top-0 left-0 right-0 -mt-6 text-gray-800 text-sm">
                    {data}
                    </div>
                </div>

                {/* Label */}
                <div className="w-full mt-4 text-gray-700 bg-white text-sm text-center font-extrabold">
                    {labels[index]}
                </div>
                </div>
            );
            })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BarChart;