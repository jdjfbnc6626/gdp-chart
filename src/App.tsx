import { useEffect, useState } from "react";
// antd is 'enterprise-class UI design language and React UI library' - think material UI
import { Button, Layout, Result, Spin, Typography } from "antd";
// recharts is 'to help you to write charts in React applications'
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchObservations, Observation } from "./components/Observation";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [data, setData] = useState<Observation[]>([]);

  const fetchData = async () => {
    try {
      setState("loading");
      const observations = await fetchObservations("GDPCA", {
        frequency: "a",
        // Change these to see re-render
        observationStart: "1979-05-01",
        observationEnd: "2019-05-01",
      });
      setData(observations);
      setState("success");
    } catch (_) {
      setState("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderChart = () => {
    return (
      <Typography>
        <Title level={3}>This is the JJ Real GDP Displayer</Title>
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84d8ab" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#84d8ab" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#84d8ab"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
              <XAxis dataKey="date" />
              <YAxis dataKey="value" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Typography>
    );
  };

  const renderContent = () => {
    switch (state) {
      case "success":
        return renderChart();
      case "loading":
        return (
          <div className="spinner">
            <Spin />
          </div>
        );
      case "error":
      default:
        return (
          <div>
            <Result
              status="500"
              title="Oh no!"
              subTitle="Sorry, something went wrong."
              extra={
                <Button type="primary" onClick={fetchData}>
                  Try again
                </Button>
              }
            />
          </div>
        );
    }
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
      </Header>
      <Content className="content">{renderContent()}</Content>
    </Layout>
  );
}

export default App;
