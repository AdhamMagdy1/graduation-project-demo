import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from 'chart.js';
import fetchSentimentData from '../../../../src/hooks/service';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

const LineChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Positive',
        data: [],
        borderColor: '#00C49F',
        backgroundColor: 'rgba(0, 196, 159, 0.2)',
        fill: false,
        pointRadius: 6,
        hoverRadius: 8,
      },
      {
        label: 'Negative',
        data: [],
        borderColor: '#FF8042',
        backgroundColor: 'rgba(255, 128, 66, 0.2)',
        pointRadius: 6,
        hoverRadius: 8,
        fill: false,
      },
      {
        label: 'Neutral',
        data: [],
        borderColor: '#FFBB28',
        backgroundColor: 'rgba(255, 187, 40, 0.2)',
        fill: false,
        pointRadius: 6,
        hoverRadius: 8,
      },
    ],
  });
  const options = {
    scales: {
      x: {
        stacked: true,
      },
    },
  };
  useEffect(() => {
    fetchSentimentData().then((data) => {
      if (data) {
        const dates = Object.keys(data);
        const positiveData = [];
        const negativeData = [];
        const neutralData = [];

        dates.forEach((date) => {
          positiveData.push((data[date].pos * 100).toFixed(2));
          negativeData.push((data[date].neg * 100).toFixed(2));
          neutralData.push((data[date].nat * 100).toFixed(2));
        });

        setChartData({
          labels: dates,
          datasets: [
            { ...chartData.datasets[0], data: positiveData },
            { ...chartData.datasets[1], data: negativeData },
            { ...chartData.datasets[2], data: neutralData },
          ],
        });
      }
    });
  }, []);

  return (
    <div className="line">
      <h2 className='side-page-heading' style={{ fontSize: '26px' }}>Sentiment Over Time</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartComponent;
