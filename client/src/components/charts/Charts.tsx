"use client";

import Chart from "react-apexcharts";

export function UploadsPerWeekChart({
  data,
}: {
  data: { day_of_week: number; count: number }[];
}) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const seriesData = Array(7).fill(0);

  data.forEach((d) => {
    seriesData[d.day_of_week] = Number(d.count);
  });

  const options = {
    chart: { type: "bar" as const },
    theme: { mode: "dark" as const },
    title: {
      text: "Uploads Per Week",
      align: "center" as const,
      style: {
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xaxis: {
      categories: days,
      labels: {
        style: {
          colors: Array(7).fill("#FFFFFF"),
        },
      },
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Uploads", data: seriesData }]}
      type="bar"
      height={300}
    />
  );
}

export function ChatActivityChart({
  data,
}: {
  data: { month: string; type: string; count: number }[];
}) {
  const grouped = data.reduce((acc, { month, type, count }) => {
    if (!acc[type]) acc[type] = [];
    acc[type].push({ x: month.slice(0, 7), y: Number(count) });
    return acc;
  }, {} as Record<string, { x: string; y: number }[]>);

  const series = Object.entries(grouped).map(([type, values]) => ({
    name: type,
    data: values,
  }));

  const options = {
    chart: { type: "area" as const, stacked: true },
    theme: { mode: "dark" as const },
    title: {
      text: "Chat Activity by Month",
      align: "center" as const,
      style: {
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    xaxis: { type: "category" as const },
  };

  return <Chart options={options} series={series} type="area" height={350} />;
}
