import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import fetchSentimentData from '../../../../src/hooks/service';


ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = () => {
  const [data, setData] = useState({
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Sentiment Analysis',
        data: [0, 0, 0],
        backgroundColor: ['#00C49F', '#FF8042', '#FFBB28'],
        cutout: '40%',
      },
    ],
  });

  useEffect(() => {
    fetchSentimentData().then((data) => {
      const sentiments = { positive: 0, negative: 0, neutral: 0 };
      const totalDays = Object.keys(data).length;

      Object.values(data).forEach((entry) => {
        sentiments.positive += entry.pos;
        sentiments.negative += entry.neg;
        sentiments.neutral += entry.nat;
      });

      const formattedData = [
        ((sentiments.positive / totalDays) * 100).toFixed(2),
        ((sentiments.negative / totalDays) * 100).toFixed(2),
        ((sentiments.neutral / totalDays) * 100).toFixed(2),
      ];

      setData((prevState) => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: formattedData,
          },
        ],
      }));
    });
  }, []);

  return (
    <div className='pie'>
      <h2 className='side-page-heading' style={{ fontSize: '26px' }} >Overall opinion</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default PieChartComponent;
