"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";

const colorMap: Record<string, string> = {
  PENDING: "#f59e0b", // Amber
  ACCEPTED: "#3b82f6", // Blue
  RIDER_ASSIGNED: "#6366f1", // Indigo
  PREPARING: "#f97316", // Orange
  READY: "#a855f7", // Purple
  PICKED: "#06b6d4", // Cyan
  DELIVERED: "#10b981", // Emerald
  CANCELLED: "#f43f5e", // Rose
};

export default function OrderStatusDistribution() {
  const [data, setData] = useState([["Status", "Count"]]);
  const [options, setOptions] = useState({
    title: "Order Status Distribution",
    pieHole: 0.4,
    colors: data.slice(1).map((d) => {
      return colorMap[d[0]];
    }),
    chartArea: { width: "90%", height: "80%" },
    legend: { position: "bottom" },
  });

  const fetchOrderStatusCount = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/status_count`,
        {
          withCredentials: true,
        },
      );

      setData([["Status", "Count"], ...res.data.data]);
      setOptions({
        title: "Order Status Distribution",
        pieHole: 0.4,
        colors: res.data.data.map((d: any) => {
          return colorMap[d[0]];
        }),
        chartArea: { width: "90%", height: "80%" },
        legend: { position: "bottom" },
      });

      console.log("here", data);
    } catch (err) {
      //   console.log(err.message);
    }
  };

  useEffect(() => {
    fetchOrderStatusCount();
  }, []);

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"100%"}
        className="rounded-xl"
      />
    </div>
  );
}
