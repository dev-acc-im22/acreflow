'use client';

import { useState, useMemo } from 'react';
import type { PriceTrend, LocalityInsight } from '@/types';
import { useAcreFlowStore } from '@/lib/store';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Shield,
  Bus,
  Hospital,
  GraduationCap,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ── City Data ──────────────────────────────────────────────────────────────

interface CityData {
  trends: PriceTrend[];
  insights: LocalityInsight;
  localities: string[];
  avgPrice: number;
  yoyGrowth: number;
}

const generateTrend = (start: number, end: number): PriceTrend[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const step = (end - start) / 11;
  return months.map((month, i) => ({
    month,
    price: Math.round(start + step * i + (Math.random() * step * 0.4 - step * 0.2)),
  }));
};

const CITY_DATA: Record<string, CityData> = {
  Chennai: {
    trends: [
      { month: 'Jan', price: 6200 },
      { month: 'Feb', price: 6350 },
      { month: 'Mar', price: 6400 },
      { month: 'Apr', price: 6500 },
      { month: 'May', price: 6450 },
      { month: 'Jun', price: 6600 },
      { month: 'Jul', price: 6800 },
      { month: 'Aug', price: 6900 },
      { month: 'Sep', price: 7000 },
      { month: 'Oct', price: 7150 },
      { month: 'Nov', price: 7200 },
      { month: 'Dec', price: 7350 },
    ],
    insights: {
      safety: 4.5,
      connectivity: 4.0,
      infrastructure: 4.5,
      airQuality: 3.5,
      nightlife: 3.5,
      restaurants: 4.5,
    },
    localities: ['Anna Nagar', 'OMR', 'Velachery'],
    avgPrice: 7350,
    yoyGrowth: 18.5,
  },
  Mumbai: {
    trends: generateTrend(12000, 14200),
    insights: {
      safety: 4,
      connectivity: 5,
      infrastructure: 5,
      airQuality: 3,
      nightlife: 5,
      restaurants: 5,
    },
    localities: ['Andheri', 'Bandra', 'Powai'],
    avgPrice: 14200,
    yoyGrowth: 15.2,
  },
  Delhi: {
    trends: generateTrend(8500, 10200),
    insights: {
      safety: 3,
      connectivity: 4,
      infrastructure: 4,
      airQuality: 2,
      nightlife: 4,
      restaurants: 4,
    },
    localities: ['Dwarka', 'Rohini', 'Saket'],
    avgPrice: 10200,
    yoyGrowth: 12.8,
  },
  Bangalore: {
    trends: generateTrend(7500, 9800),
    insights: {
      safety: 4,
      connectivity: 4,
      infrastructure: 5,
      airQuality: 4,
      nightlife: 4,
      restaurants: 5,
    },
    localities: ['Whitefield', 'Electronic City', 'HSR Layout'],
    avgPrice: 9800,
    yoyGrowth: 22.1,
  },
  Hyderabad: {
    trends: generateTrend(5500, 7200),
    insights: {
      safety: 4,
      connectivity: 4,
      infrastructure: 4,
      airQuality: 4,
      nightlife: 3,
      restaurants: 4,
    },
    localities: ['Gachibowli', 'Kondapur', 'Madhapur'],
    avgPrice: 7200,
    yoyGrowth: 25.3,
  },
};

// Fallback is Chennai
const DEFAULT_CITY_DATA = CITY_DATA['Chennai'];

// Locality-specific trend data for each city
interface LocalityTrendData {
  data: PriceTrend[];
  avg: number;
  yoy: string;
  insights: LocalityInsight;
  nearbyPlaces: { name: string; time: string }[];
}

const LOCALITY_DATA: Record<string, Record<string, LocalityTrendData>> = {
  Chennai: {
    'Anna Nagar': {
      data: [
        { month: 'Jan', price: 6200 },
        { month: 'Feb', price: 6350 },
        { month: 'Mar', price: 6400 },
        { month: 'Apr', price: 6500 },
        { month: 'May', price: 6450 },
        { month: 'Jun', price: 6600 },
        { month: 'Jul', price: 6800 },
        { month: 'Aug', price: 6900 },
        { month: 'Sep', price: 7000 },
        { month: 'Oct', price: 7150 },
        { month: 'Nov', price: 7200 },
        { month: 'Dec', price: 7350 },
      ],
      avg: 7350,
      yoy: '18.5%',
      insights: {
        safety: 4.5,
        connectivity: 4.0,
        infrastructure: 4.5,
        airQuality: 3.5,
        nightlife: 3.5,
        restaurants: 4.5,
      },
      nearbyPlaces: [
        { name: 'Chennai Metro - Anna Nagar Tower', time: '5 min walk' },
        { name: 'KCG Hospital', time: '10 min drive' },
        { name: 'Chennai Public School', time: '8 min drive' },
        { name: 'Forum Vijaya Mall', time: '12 min drive' },
        { name: 'Anna Nagar Roundabout', time: '2 min walk' },
      ],
    },
    OMR: {
      data: [
        { month: 'Jan', price: 5500 },
        { month: 'Feb', price: 5550 },
        { month: 'Mar', price: 5600 },
        { month: 'Apr', price: 5650 },
        { month: 'May', price: 5700 },
        { month: 'Jun', price: 5750 },
        { month: 'Jul', price: 5800 },
        { month: 'Aug', price: 5850 },
        { month: 'Sep', price: 5900 },
        { month: 'Oct', price: 5950 },
        { month: 'Nov', price: 6000 },
        { month: 'Dec', price: 6100 },
      ],
      avg: 6100,
      yoy: '10.9%',
      insights: {
        safety: 3.5,
        connectivity: 4.5,
        infrastructure: 4.0,
        airQuality: 4.0,
        nightlife: 3.0,
        restaurants: 3.5,
      },
      nearbyPlaces: [
        { name: 'Thoraipakkam Signal', time: '3 min walk' },
        { name: 'Chettinad Health City', time: '8 min drive' },
        { name: 'SRM University', time: '12 min drive' },
        { name: 'Phoenix Marketcity', time: '15 min drive' },
        { name: 'Siruseri IT Park', time: '10 min drive' },
      ],
    },
    Velachery: {
      data: [
        { month: 'Jan', price: 5800 },
        { month: 'Feb', price: 5850 },
        { month: 'Mar', price: 5900 },
        { month: 'Apr', price: 6000 },
        { month: 'May', price: 5950 },
        { month: 'Jun', price: 6050 },
        { month: 'Jul', price: 6100 },
        { month: 'Aug', price: 6150 },
        { month: 'Sep', price: 6200 },
        { month: 'Oct', price: 6250 },
        { month: 'Nov', price: 6300 },
        { month: 'Dec', price: 6400 },
      ],
      avg: 6400,
      yoy: '10.3%',
      insights: {
        safety: 4.0,
        connectivity: 4.5,
        infrastructure: 4.0,
        airQuality: 3.5,
        nightlife: 4.0,
        restaurants: 4.5,
      },
      nearbyPlaces: [
        { name: 'Velachery MRTS Station', time: '5 min walk' },
        { name: 'Chromepet Hospital', time: '8 min drive' },
        { name: 'PSBB School', time: '6 min drive' },
        { name: 'Phoenix Marketcity', time: '10 min drive' },
        { name: 'Velachery Lake', time: '3 min walk' },
      ],
    },
  },
  Mumbai: {
    Andheri: {
      data: generateTrend(11500, 13500),
      avg: 13500,
      yoy: '14.8%',
      insights: { safety: 3.5, connectivity: 5, infrastructure: 5, airQuality: 3, nightlife: 5, restaurants: 5 },
      nearbyPlaces: [
        { name: 'Andheri Metro Station', time: '3 min walk' },
        { name: 'Kokilaben Hospital', time: '8 min drive' },
        { name: 'Bombay Cambridge School', time: '10 min drive' },
        { name: 'Infiniti Mall', time: '5 min drive' },
        { name: 'Versova Beach', time: '12 min drive' },
      ],
    },
    Bandra: {
      data: generateTrend(14000, 16800),
      avg: 16800,
      yoy: '16.5%',
      insights: { safety: 4, connectivity: 5, infrastructure: 5, airQuality: 3.5, nightlife: 5, restaurants: 5 },
      nearbyPlaces: [
        { name: 'Bandra Terminus', time: '5 min walk' },
        { name: 'Lilavati Hospital', time: '10 min drive' },
        { name: 'St. Andrews College', time: '7 min drive' },
        { name: 'Linking Road', time: '3 min walk' },
        { name: 'Bandra Fort', time: '8 min drive' },
      ],
    },
    Powai: {
      data: generateTrend(10500, 12800),
      avg: 12800,
      yoy: '13.2%',
      insights: { safety: 4.5, connectivity: 4, infrastructure: 4.5, airQuality: 4, nightlife: 4, restaurants: 4.5 },
      nearbyPlaces: [
        { name: 'Powai Lake', time: '3 min walk' },
        { name: 'Hiranandani Hospital', time: '5 min drive' },
        { name: 'IIT Bombay', time: '8 min drive' },
        { name: 'Galleria Market', time: '4 min drive' },
        { name: 'Renaissance Convention Center', time: '6 min drive' },
      ],
    },
  },
  Delhi: {
    Dwarka: {
      data: generateTrend(7800, 9200),
      avg: 9200,
      yoy: '11.5%',
      insights: { safety: 3.5, connectivity: 4.5, infrastructure: 4, airQuality: 2, nightlife: 3, restaurants: 3.5 },
      nearbyPlaces: [
        { name: 'Dwarka Sector 21 Metro', time: '5 min walk' },
        { name: 'Ayushman Hospital', time: '10 min drive' },
        { name: 'Delhi Public School', time: '8 min drive' },
        { name: 'Sector 6 Market', time: '4 min drive' },
        { name: 'IGI Airport', time: '15 min drive' },
      ],
    },
    Rohini: {
      data: generateTrend(7000, 8400),
      avg: 8400,
      yoy: '10.8%',
      insights: { safety: 3.5, connectivity: 4, infrastructure: 3.5, airQuality: 2.5, nightlife: 3.5, restaurants: 4 },
      nearbyPlaces: [
        { name: 'Rohini Sector 18 Metro', time: '4 min walk' },
        { name: 'Bansal Hospital', time: '7 min drive' },
        { name: 'GD Goenka School', time: '6 min drive' },
        { name: 'Pitampura Market', time: '10 min drive' },
        { name: 'Japanese Park', time: '5 min drive' },
      ],
    },
    Saket: {
      data: generateTrend(9500, 11800),
      avg: 11800,
      yoy: '15.2%',
      insights: { safety: 4, connectivity: 4.5, infrastructure: 4.5, airQuality: 2, nightlife: 4.5, restaurants: 4.5 },
      nearbyPlaces: [
        { name: 'Saket Metro Station', time: '3 min walk' },
        { name: 'Max Hospital Saket', time: '5 min drive' },
        { name: 'Apeejay School', time: '7 min drive' },
        { name: 'Select Citywalk Mall', time: '4 min drive' },
        { name: 'Qutub Minar', time: '10 min drive' },
      ],
    },
  },
  Bangalore: {
    Whitefield: {
      data: generateTrend(6800, 8800),
      avg: 8800,
      yoy: '20.5%',
      insights: { safety: 4, connectivity: 4, infrastructure: 4.5, airQuality: 4, nightlife: 3.5, restaurants: 4.5 },
      nearbyPlaces: [
        { name: 'Whitefield Metro', time: '5 min walk' },
        { name: 'Sakra Hospital', time: '8 min drive' },
        { name: 'Delhi Public School', time: '10 min drive' },
        { name: 'Phoenix Mall', time: '7 min drive' },
        { name: 'ITPL Tech Park', time: '5 min drive' },
      ],
    },
    'Electronic City': {
      data: generateTrend(5500, 7200),
      avg: 7200,
      yoy: '23.8%',
      insights: { safety: 3.5, connectivity: 3.5, infrastructure: 4.5, airQuality: 4, nightlife: 3, restaurants: 4 },
      nearbyPlaces: [
        { name: 'Electronic City Metro', time: '5 min walk' },
        { name: 'Akhil Hospital', time: '10 min drive' },
        { name: 'Treamis School', time: '8 min drive' },
        { name: 'Neo Mall', time: '6 min drive' },
        { name: 'Infosys Campus', time: '4 min drive' },
      ],
    },
    'HSR Layout': {
      data: generateTrend(8200, 10500),
      avg: 10500,
      yoy: '22.5%',
      insights: { safety: 4.5, connectivity: 4.5, infrastructure: 4, airQuality: 4, nightlife: 4.5, restaurants: 5 },
      nearbyPlaces: [
        { name: 'HSR Layout BDA Complex', time: '3 min walk' },
        { name: 'Apollo Hospital', time: '8 min drive' },
        { name: 'NPS School', time: '6 min drive' },
        { name: 'Forum Mall Koramangala', time: '10 min drive' },
        { name: 'Agara Lake', time: '5 min drive' },
      ],
    },
  },
  Hyderabad: {
    Gachibowli: {
      data: generateTrend(6500, 8500),
      avg: 8500,
      yoy: '24.5%',
      insights: { safety: 4, connectivity: 4, infrastructure: 4.5, airQuality: 4, nightlife: 3.5, restaurants: 4 },
      nearbyPlaces: [
        { name: 'Gachibowli Metro', time: '4 min walk' },
        { name: ' Continental Hospital', time: '8 min drive' },
        { name: 'Oakridge School', time: '7 min drive' },
        { name: 'Inorbit Mall', time: '5 min drive' },
        { name: 'IT Hub Hi-Tech City', time: '10 min drive' },
      ],
    },
    Kondapur: {
      data: generateTrend(5200, 6800),
      avg: 6800,
      yoy: '26.2%',
      insights: { safety: 4, connectivity: 4, infrastructure: 4, airQuality: 4, nightlife: 3, restaurants: 4 },
      nearbyPlaces: [
        { name: 'Kondapur Junction', time: '3 min walk' },
        { name: 'KIMS Hospital', time: '10 min drive' },
        { name: 'Chirec School', time: '8 min drive' },
        { name: 'Mantri Mall', time: '6 min drive' },
        { name: 'Microsoft Campus', time: '12 min drive' },
      ],
    },
    Madhapur: {
      data: generateTrend(5800, 7500),
      avg: 7500,
      yoy: '25.0%',
      insights: { safety: 4, connectivity: 4.5, infrastructure: 4.5, airQuality: 4, nightlife: 4, restaurants: 4.5 },
      nearbyPlaces: [
        { name: 'Madhapur Circle', time: '2 min walk' },
        { name: 'Care Hospital', time: '7 min drive' },
        { name: 'Meridian School', time: '6 min drive' },
        { name: 'Jubilee Hills', time: '10 min drive' },
        { name: 'Shilparamam', time: '5 min drive' },
      ],
    },
  },
};

// Fallback locality data generator for unknown cities/localities
function generateFallbackLocalityData(locality: string): LocalityTrendData {
  const base = 5000 + Math.round(Math.random() * 5000);
  return {
    data: generateTrend(base, Math.round(base * 1.15)),
    avg: Math.round(base * 1.15),
    yoy: `${(10 + Math.random() * 15).toFixed(1)}%`,
    insights: { safety: 4, connectivity: 4, infrastructure: 4, airQuality: 3.5, nightlife: 3.5, restaurants: 4 },
    nearbyPlaces: [
      { name: `${locality} Metro Station`, time: '5 min walk' },
      { name: 'City Hospital', time: '10 min drive' },
      { name: 'Public School', time: '8 min drive' },
      { name: 'Shopping Mall', time: '12 min drive' },
      { name: 'Central Park', time: '6 min drive' },
    ],
  };
}

const insightItems = [
  { key: 'safety' as const, label: 'Safety', icon: Shield, color: 'bg-emerald-50 dark:bg-[#1D3461] text-emerald-600' },
  { key: 'connectivity' as const, label: 'Connectivity', icon: Bus, color: 'bg-sky dark:bg-[#1D3461] text-royal dark:text-[#60A5FA]' },
  { key: 'infrastructure' as const, label: 'Healthcare', icon: Hospital, color: 'bg-red-50 dark:bg-[#1D3461] text-red-500' },
  { key: 'airQuality' as const, label: 'Education', icon: GraduationCap, color: 'bg-purple-50 dark:bg-[#1D3461] text-purple-600' },
  { key: 'restaurants' as const, label: 'Shopping', icon: ShoppingBag, color: 'bg-amber-50 dark:bg-[#1D3461] text-amber-600' },
  { key: 'nightlife' as const, label: 'Nightlife', icon: Star, color: 'bg-indigo-50 dark:bg-[#1D3461] text-indigo-600' },
];

// ── SVG Chart Helpers ─────────────────────────────────────────────────────

function toSvgX(index: number, total: number, chartW: number, padLeft: number, padRight: number) {
  const plotW = chartW - padLeft - padRight;
  return padLeft + (index / (total - 1)) * plotW;
}

function toSvgY(price: number, chartH: number, padTop: number, padBottom: number, yMin: number, yMax: number) {
  const plotH = chartH - padTop - padBottom;
  return padTop + plotH - ((price - yMin) / (yMax - yMin)) * plotH;
}

// ── Sub-components ────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const halfFilled = !filled && i < rating;
        return (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              filled
                ? 'fill-amber-500 text-amber-500'
                : halfFilled
                  ? 'fill-amber-500/50 text-amber-500'
                  : 'fill-gray-300 dark:fill-[#334155] text-gray-300 dark:text-[#334155]'
            }`}
          />
        );
      })}
    </div>
  );
}

function PriceChart({ data }: { data: PriceTrend[] }) {
  const prices = data.map((d) => d.price);
  const yMin = Math.floor(Math.min(...prices) / 1000) * 1000 - 500;
  const yMax = Math.ceil(Math.max(...prices) / 1000) * 1000 + 500;

  const CHART_W = 400;
  const CHART_H = 200;
  const PAD_LEFT = 40;
  const PAD_RIGHT = 10;
  const PAD_TOP = 10;
  const PAD_BOTTOM = 28;

  const xFn = (i: number) => toSvgX(i, data.length, CHART_W, PAD_LEFT, PAD_RIGHT);
  const yFn = (p: number) => toSvgY(p, CHART_H, PAD_TOP, PAD_BOTTOM, yMin, yMax);

  const points = data.map((d, i) => `${xFn(i)},${yFn(d.price)}`);
  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${xFn(data.length - 1)},${CHART_H - PAD_BOTTOM} L${xFn(0)},${CHART_H - PAD_BOTTOM} Z`;

  const step = Math.round((yMax - yMin) / 3 / 500) * 500;
  const yTicks: number[] = [];
  for (let t = yMin + step; t < yMax; t += step) {
    yTicks.push(t);
  }

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="w-full h-48 md:h-56"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick) => {
        const y = yFn(tick);
        return (
          <line
            key={tick}
            x1={PAD_LEFT}
            y1={y}
            x2={CHART_W - PAD_RIGHT}
            y2={y}
            className="stroke-slate-200 dark:stroke-[#1D3461]"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Y-axis labels */}
      {yTicks.map((tick) => (
        <text
          key={tick}
          x={PAD_LEFT - 6}
          y={yFn(tick) + 4}
          textAnchor="end"
          className="fill-slate-accent dark:fill-[#94A3B8]"
          style={{ fontSize: '10px' }}
        >
          ₹{(tick / 1000).toFixed(0)}K
        </text>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="url(#chartGradient)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {data.map((d, i) => {
        const cx = xFn(i);
        const cy = yFn(d.price);
        return (
          <g key={d.month}>
            <circle
              cx={cx}
              cy={cy}
              r={6}
              fill="transparent"
              className="cursor-pointer"
            />
            <circle
              cx={cx}
              cy={cy}
              r={3.5}
              className="fill-white dark:fill-[#0A192F] stroke-blue-800 dark:stroke-[#60A5FA] transition-all hover:r-5 hover:fill-royal"
              strokeWidth={2}
            />
          </g>
        );
      })}

      {/* X-axis month labels */}
      {data.map((d, i) => (
        <text
          key={d.month}
          x={xFn(i)}
          y={CHART_H - 6}
          textAnchor="middle"
          className="fill-slate-accent dark:fill-[#94A3B8]"
          style={{ fontSize: '9px' }}
        >
          {d.month}
        </text>
      ))}
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function MarketIntel() {
  const { selectedCity } = useAcreFlowStore();
  const cityData = CITY_DATA[selectedCity] || DEFAULT_CITY_DATA;
  const [activeLocality, setActiveLocality] = useState(cityData.localities[0]);

  const localities = cityData.localities;
  const localityInfo = LOCALITY_DATA[selectedCity]?.[activeLocality] || generateFallbackLocalityData(activeLocality);
  const cityTrend = cityData.trends;
  const cityAvg = cityData.avgPrice;
  const cityYoy = cityData.yoyGrowth;

  // Reset locality when city changes
  const handleLocalityChange = (val: string) => {
    setActiveLocality(val);
  };

  const isCityPositive = cityYoy > 0;
  const isLocalPositive = parseFloat(localityInfo.yoy) > 0;

  return (
    <section className="py-16 bg-cream dark:bg-[#0A192F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-center mb-2">
          Market Intelligence
        </h2>
        <p className="text-slate-accent dark:text-[#94A3B8] text-center mb-2">
          Data-driven insights to help you make smarter property decisions
        </p>
        <p className="text-royal dark:text-[#60A5FA] text-center text-sm font-medium mb-10">
          <MapPin className="inline w-4 h-4 mr-1" />
          Showing data for {selectedCity}
        </p>

        {/* City-level summary */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-white dark:bg-[#112240] rounded-xl border dark:border-[#1D3461] px-5 py-3 text-center shadow-sm">
            <p className="text-xs text-slate-accent dark:text-[#94A3B8] mb-0.5">Avg. Price</p>
            <p className="text-lg font-bold text-navy dark:text-white">₹{cityAvg.toLocaleString('en-IN')}/sqft</p>
          </div>
          <div className="bg-white dark:bg-[#112240] rounded-xl border dark:border-[#1D3461] px-5 py-3 text-center shadow-sm">
            <p className="text-xs text-slate-accent dark:text-[#94A3B8] mb-0.5">YoY Growth</p>
            <p className={`text-lg font-bold ${isCityPositive ? 'text-success' : 'text-danger'}`}>
              {isCityPositive ? '↑' : '↓'} {cityYoy}%
            </p>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Price Trends ── */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-navy dark:text-white">
                Price Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={localities[0]}
                value={activeLocality}
                onValueChange={handleLocalityChange}
              >
                <TabsList className="mb-4">
                  {localities.map((loc) => (
                    <TabsTrigger key={loc} value={loc}>
                      {loc}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {localities.map((loc) => {
                  const locData = LOCALITY_DATA[selectedCity]?.[loc] || generateFallbackLocalityData(loc);
                  return (
                    <TabsContent key={loc} value={loc}>
                      <PriceChart data={locData.data} />
                    </TabsContent>
                  );
                })}
              </Tabs>

              {/* Summary */}
              <div className="flex justify-between text-sm mt-2">
                <span className="text-royal dark:text-[#60A5FA] font-semibold">
                  Avg. Price: ₹{localityInfo.avg.toLocaleString('en-IN')}/sqft
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isLocalPositive ? 'text-success' : 'text-danger'
                  }`}
                >
                  {isLocalPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isLocalPositive ? '↑' : '↓'} {localityInfo.yoy} YoY
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Right: Locality Insights ── */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-navy dark:text-white">
                Locality Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Locality selector */}
              <Tabs
                defaultValue={localities[0]}
                value={activeLocality}
                onValueChange={handleLocalityChange}
              >
                <TabsList className="mb-4">
                  {localities.map((loc) => (
                    <TabsTrigger key={loc} value={loc}>
                      {loc}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {localities.map((loc) => {
                  const locData = LOCALITY_DATA[selectedCity]?.[loc] || generateFallbackLocalityData(loc);
                  return (
                    <TabsContent key={loc} value={loc}>
                      {/* Ratings grid */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {insightItems.map((item) => {
                          const Icon = item.icon;
                          const score = locData.insights[item.key];
                          return (
                            <div
                              key={item.key}
                              className="flex items-center gap-3"
                            >
                              <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                <Icon className="h-5 w-5 text-royal dark:text-[#60A5FA]" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-navy dark:text-white">
                                  {item.label}
                                </p>
                                <StarRating rating={score} />
                                <p className="text-xs text-slate-accent dark:text-[#94A3B8] mt-0.5">
                                  {score}/5
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Nearby places */}
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-navy dark:text-white mb-3">
                          Nearby Essentials
                        </h4>
                        <div className="space-y-3">
                          {locData.nearbyPlaces.map((place) => (
                            <div
                              key={place.name}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="w-2 h-2 rounded-full bg-royal dark:bg-[#60A5FA] shrink-0" />
                              <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                                <span className="text-navy dark:text-white truncate">
                                  {place.name}
                                </span>
                                <span className="text-slate-accent dark:text-[#94A3B8] whitespace-nowrap text-xs">
                                  {place.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
