import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DepartmentBarChartProps {
  data: Array<{
    id: string;
    nombre: string;
    count: number;
  }>;
}

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = data.map((d) => d.nombre);
    const values = data.map((d) => d.count);
    const colors = data.map((_, idx) =>
      idx === 0 ? '#4F46E5' : idx === 1 ? '#10B981' : idx === 2 ? '#6366F1' : '#818CF8'
    );

    chartRef.current = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Empleados',
            data: values,
            backgroundColor: colors,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.56,
            categoryPercentage: 0.72,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 200 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#E2E8F0',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} colaboradores`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: '#E2E8F0' },
            ticks: {
              color: '#475569',
              font: { family: 'Inter, system-ui, sans-serif', size: 12, weight: 500 },
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: 50,
            grid: { color: '#F1F5F9' },
            border: { display: false },
            ticks: {
              color: '#64748B',
              stepSize: 10,
              font: { family: 'Inter, system-ui, sans-serif', size: 12 },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative h-64 w-full">
      <canvas ref={canvasRef} aria-label="Gráfica de empleados por departamento" />
    </div>
  );
}

interface WeeklyAttendanceLineChartProps {
  series: Array<{ day: string; present: number }>;
}

export function WeeklyAttendanceLineChart({ series }: WeeklyAttendanceLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx
      ? ctx.createLinearGradient(0, 0, 0, 220)
      : undefined;
    if (gradient) {
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0.22)');
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
    }

    chartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: series.map((s) => s.day),
        datasets: [
          {
            label: 'Presentes',
            data: series.map((s) => s.present),
            borderColor: '#4F46E5',
            backgroundColor: gradient ?? 'rgba(79, 70, 229, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#4F46E5',
            pointBorderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 200 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.y} colaboradores presentes`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: '#E2E8F0' },
            ticks: {
              color: '#475569',
              font: { family: 'Inter, system-ui, sans-serif', size: 12, weight: 500 },
            },
          },
          y: {
            suggestedMin: 118,
            suggestedMax: 130,
            grid: { color: '#F1F5F9' },
            border: { display: false },
            ticks: {
              color: '#64748B',
              stepSize: 2,
              font: { family: 'Inter, system-ui, sans-serif', size: 12 },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [series]);

  return (
    <div className="relative h-64 w-full">
      <canvas ref={canvasRef} aria-label="Gráfica de asistencia semanal" />
    </div>
  );
}

interface NovedadesDoughnutChartProps {
  slices: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export function NovedadesDoughnutChart({ slices }: NovedadesDoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const activeSlices = slices.filter((s) => s.value > 0);
    const safeSlices =
      activeSlices.length > 0
        ? activeSlices
        : [{ label: 'Sin registros', value: 1, color: '#E2E8F0' }];

    chartRef.current = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: safeSlices.map((s) => s.label),
        datasets: [
          {
            data: safeSlices.map((s) => s.value),
            backgroundColor: safeSlices.map((s) => s.color),
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        cutout: '66%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 14,
              color: '#334155',
              font: { family: 'Inter, system-ui, sans-serif', size: 12, weight: 500 },
            },
          },
          tooltip: {
            backgroundColor: '#0F172A',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [slices]);

  return (
    <div className="relative h-64 w-full">
      <canvas ref={canvasRef} aria-label="Gráfica de distribución de novedades" />
    </div>
  );
}
