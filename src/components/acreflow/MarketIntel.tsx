'use client';

import { useState, useMemo } from 'react';
import type { PriceTrend, LocalityInsight } from '@/types';
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

// ── Data ──────────────────────────────────────────────────────────────────

const annaNagarTrend: PriceTrend[] = [
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
];

const omrTrend: PriceTrend[] = [
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
];

const velacheryTrend: PriceTrend[] = [
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
];

const trendData: Record<string, { data: PriceTrend[]; avg: number; yoy: string }> = {
  'Anna Nagar': { data: annaNagarTrend, avg: 7350, yoy: '18.5%' },
  OMR: { data: omrTrend, avg: 6100, yoy: '10.9%' },
  Velachery: { data: velacheryTrend, avg: 6400, yoy: '10.3%' },
};

const annaNagarInsights: LocalityInsight = {
  safety: 4.5,
  connectivity: 4.0,
  infrastructure: 4.5,
  airQuality: 3.5,
  nightlife: 3.5,
  restaurants: 4.5,
};

const nearbyPlaces = [
  { name: 'Chennai Metro - Anna Nagar Tower', time: '5 min walk' },
  { name: 'KCG Hospital', time: '10 min drive' },
  { name: 'Chennai Public School', time: '8 min drive' },
  { name: 'Forum Vijaya Mall', time: '12 min drive' },
  { name: 'Anna Nagar Roundabout', time: '2 min walk' },
];

const insightItems = [
  { key: 'safety' as const, label: 'Safety', icon: Shield, color: 'bg-emerald-50 text-emerald-600' },
  { key: 'connectivity' as const, label: 'Connectivity', icon: Bus, color: 'bg-sky text-royal' },
  { key: 'infrastructure' as const, label: 'Healthcare', icon: Hospital, color: 'bg-red-50 text-red-500' },
  { key: 'airQuality' as const, label: 'Education', icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
  { key: 'restaurants' as const, label: 'Shopping', icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
  { key: 'nightlife' as const, label: 'Nightlife', icon: Star, color: 'bg-indigo-50 text-indigo-600' },
];

// ── SVG Chart Helpers ─────────────────────────────────────────────────────

const CHART_W = 400;
const CHART_H = 200;
const PAD_LEFT = 40;
const PAD_RIGHT = 10;
const PAD_TOP = 10;
const PAD_BOTTOM = 28;
const Y_MIN = 5000;
const Y_MAX = 7500;

function toSvgX(index: number, total: number) {
  const plotW = CHART_W - PAD_LEFT - PAD_RIGHT;
  return PAD_LEFT + (index / (total - 1)) * plotW;
}

function toSvgY(price: number) {
  const plotH = CHART_H - PAD_TOP - PAD_BOTTOM;
  return PAD_TOP + plotH - ((price - Y_MIN) / (Y_MAX - Y_MIN)) * plotH;
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
                  : 'fill-gray-300 text-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
}

function PriceChart({ data }: { data: PriceTrend[] }) {
  const points = data.map((d, i) => `${toSvgX(i, data.length)},${toSvgY(d.price)}`);
  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${toSvgX(data.length - 1, data.length)},${CHART_H - PAD_BOTTOM} L${toSvgX(0, data.length)},${CHART_H - PAD_BOTTOM} Z`;

  const yTicks = [5000, 6000, 7000];

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
        const y = toSvgY(tick);
        return (
          <line
            key={tick}
            x1={PAD_LEFT}
            y1={y}
            x2={CHART_W - PAD_RIGHT}
            y2={y}
            stroke="#E2E8F0"
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
          y={toSvgY(tick) + 4}
          textAnchor="end"
          className="fill-slate-accent"
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
        const cx = toSvgX(i, data.length);
        const cy = toSvgY(d.price);
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
              fill="#FFFFFF"
              stroke="#1E40AF"
              strokeWidth={2}
              className="transition-all hover:r-5 hover:fill-royal"
            />
          </g>
        );
      })}

      {/* X-axis month labels */}
      {data.map((d, i) => (
        <text
          key={d.month}
          x={toSvgX(i, data.length)}
          y={CHART_H - 6}
          textAnchor="middle"
          className="fill-slate-accent"
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
  const [activeLocality, setActiveLocality] = useState('Anna Nagar');

  const currentTrend = trendData[activeLocality];
  const isPositive = parseFloat(currentTrend.yoy) > 0;

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-2">
          Market Intelligence
        </h2>
        <p className="text-slate-accent text-center mb-10">
          Data-driven insights to help you make smarter property decisions
        </p>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Price Trends ── */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-navy">
                Price Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="Anna Nagar"
                onValueChange={(val) => setActiveLocality(val)}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="Anna Nagar">Anna Nagar</TabsTrigger>
                  <TabsTrigger value="OMR">OMR</TabsTrigger>
                  <TabsTrigger value="Velachery">Velachery</TabsTrigger>
                </TabsList>

                {Object.entries(trendData).map(([locality, { data }]) => (
                  <TabsContent key={locality} value={locality}>
                    <PriceChart data={data} />
                  </TabsContent>
                ))}
              </Tabs>

              {/* Summary */}
              <div className="flex justify-between text-sm mt-2">
                <span className="text-royal font-semibold">
                  Avg. Price: ₹{currentTrend.avg.toLocaleString('en-IN')}/sqft
                </span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isPositive ? 'text-success' : 'text-danger'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive ? '↑' : '↓'} {currentTrend.yoy} YoY
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ── Right: Locality Insights ── */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-navy">
                Locality Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Locality selector */}
              <Tabs defaultValue="Anna Nagar">
                <TabsList className="mb-4">
                  <TabsTrigger value="Anna Nagar">Anna Nagar</TabsTrigger>
                  <TabsTrigger value="OMR">OMR</TabsTrigger>
                  <TabsTrigger value="Velachery">Velachery</TabsTrigger>
                </TabsList>

                <TabsContent value="Anna Nagar">
                  {/* Ratings grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {insightItems.map((item) => {
                      const Icon = item.icon;
                      const score = annaNagarInsights[item.key];
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sky flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-royal" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-navy">
                              {item.label}
                            </p>
                            <StarRating rating={score} />
                            <p className="text-xs text-slate-accent mt-0.5">
                              {score}/5
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Nearby places */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-navy mb-3">
                      Nearby Essentials
                    </h4>
                    <div className="space-y-3">
                      {nearbyPlaces.map((place) => (
                        <div
                          key={place.name}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-royal shrink-0" />
                          <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                            <span className="text-navy truncate">
                              {place.name}
                            </span>
                            <span className="text-slate-accent whitespace-nowrap text-xs">
                              {place.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="OMR">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {insightItems.map((item) => {
                      const Icon = item.icon;
                      const score =
                        item.key === 'connectivity'
                          ? 4.5
                          : item.key === 'safety'
                            ? 3.5
                            : item.key === 'infrastructure'
                              ? 4.0
                              : item.key === 'airQuality'
                                ? 4.0
                                : item.key === 'restaurants'
                                  ? 3.5
                                  : 3.0;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sky flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-royal" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-navy">
                              {item.label}
                            </p>
                            <StarRating rating={score} />
                            <p className="text-xs text-slate-accent mt-0.5">
                              {score}/5
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-navy mb-3">
                      Nearby Essentials
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Thoraipakkam Signal', time: '3 min walk' },
                        { name: 'Chettinad Health City', time: '8 min drive' },
                        { name: 'SRM University', time: '12 min drive' },
                        { name: 'Phoenix Marketcity', time: '15 min drive' },
                        { name: 'Siruseri IT Park', time: '10 min drive' },
                      ].map((place) => (
                        <div
                          key={place.name}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-royal shrink-0" />
                          <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                            <span className="text-navy truncate">
                              {place.name}
                            </span>
                            <span className="text-slate-accent whitespace-nowrap text-xs">
                              {place.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="Velachery">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {insightItems.map((item) => {
                      const Icon = item.icon;
                      const score =
                        item.key === 'connectivity'
                          ? 4.5
                          : item.key === 'safety'
                            ? 4.0
                            : item.key === 'infrastructure'
                              ? 4.0
                              : item.key === 'airQuality'
                                ? 3.5
                                : item.key === 'restaurants'
                                  ? 4.5
                                  : 4.0;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sky flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-royal" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-navy">
                              {item.label}
                            </p>
                            <StarRating rating={score} />
                            <p className="text-xs text-slate-accent mt-0.5">
                              {score}/5
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-navy mb-3">
                      Nearby Essentials
                    </h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Velachery MRTS Station', time: '5 min walk' },
                        { name: 'Chromepet Hospital', time: '8 min drive' },
                        { name: 'PSBB School', time: '6 min drive' },
                        { name: 'Phoenix Marketcity', time: '10 min drive' },
                        { name: 'Velachery Lake', time: '3 min walk' },
                      ].map((place) => (
                        <div
                          key={place.name}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-royal shrink-0" />
                          <div className="flex items-center justify-between gap-2 min-w-0 flex-1">
                            <span className="text-navy truncate">
                              {place.name}
                            </span>
                            <span className="text-slate-accent whitespace-nowrap text-xs">
                              {place.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
