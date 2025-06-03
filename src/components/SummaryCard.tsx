interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  changePercentage?: number;
  loading?: boolean;
}

export default function SummaryCard({ 
  title, 
  value, 
  icon, 
  trend = 'neutral', 
  changePercentage, 
  loading = false 
}: SummaryCardProps) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    )
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex-1 min-w-[150px] max-w-full mx-1 my-2 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          {loading ? (
            <div className="h-8 w-3/4 mt-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
            {icon}
          </div>
        )}
      </div>

      {(trend !== 'neutral' || changePercentage) && !loading && (
        <div className="mt-3 flex items-center">
          <span className={`text-sm font-medium ${trendColors[trend]} flex items-center`}>
            {trendIcons[trend]}
            {changePercentage && (
              <span className="ml-1">
                {Math.abs(changePercentage)}%
              </span>
            )}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            vs previous period
          </span>
        </div>
      )}
    </div>
  );
}