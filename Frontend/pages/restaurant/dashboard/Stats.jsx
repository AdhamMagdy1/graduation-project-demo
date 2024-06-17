import SideBar from './SideBar';
import LineChartComponent from './charts/LineChartComponent';
import PieChartComponent from './charts/PieChartComponent';
const Stats = () => {
  return (
    <div className="page-container">
      <SideBar />
      <div className="side-page">
        <div className="side-page-nav">
          <h1 className='side-page-heading' >Sentiment Analysis Visualizations</h1>
        </div>
        <div className="AppChart">
          <div className="charts">
            <LineChartComponent />
            <PieChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
