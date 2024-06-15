import SideBar from './SideBar';
import LineChartComponent from './charts/LineChartComponent';
import PieChartComponent from './charts/PieChartComponent';
const Stats = () => {
  return (
    <div className="page-container">
      <SideBar />
      <div className="AppChart">
        <h1>Sentiment Analysis Visualizations</h1>
        <div className="charts">
          <LineChartComponent />
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Stats;
