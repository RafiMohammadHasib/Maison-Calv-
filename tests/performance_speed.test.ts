import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface LatencyStats {
  samples: number[];
  min: number;
  max: number;
  mean: number;
  median: number;
  p95: number;
}

function calculateStats(samples: number[]): LatencyStats {
  const sorted = [...samples].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const mean = Math.round((samples.reduce((a, b) => a + b, 0) / samples.length) * 10) / 10;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  return { samples: sorted, min, max, mean, median, p95 };
}

async function benchmark(url: string, iterations = 5, options?: RequestInit): Promise<LatencyStats> {
  const latencies: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const res = await fetch(url, options);
    await res.text();
    const elapsed = Math.round((performance.now() - start) * 10) / 10;
    latencies.push(elapsed);
  }
  return calculateStats(latencies);
}

describe("Speed & Latency Performance Benchmarks", () => {
  it("BENCHMARK: Public Homepage (/) Response Latency", async () => {
    const stats = await benchmark(`${BASE_URL}/`, 5);
    console.log(`[Homepage /] Latency: Min=${stats.min}ms | Mean=${stats.mean}ms | Max=${stats.max}ms | P95=${stats.p95}ms`);
    assert.ok(stats.min < 800, `Homepage TTFB too high: ${stats.min}ms`);
  });

  it("BENCHMARK: Admin Login (/admin/login) Response Latency", async () => {
    const stats = await benchmark(`${BASE_URL}/admin/login`, 5);
    console.log(`[Admin Login /admin/login] Latency: Min=${stats.min}ms | Mean=${stats.mean}ms | Max=${stats.max}ms | P95=${stats.p95}ms`);
    assert.ok(stats.min < 600, `Login page latency too high: ${stats.min}ms`);
  });

  it("BENCHMARK: Spaces Inventory API (/api/admin/spaces) Latency", async () => {
    const stats = await benchmark(`${BASE_URL}/api/admin/spaces`, 5);
    console.log(`[API /api/admin/spaces] Latency: Min=${stats.min}ms | Mean=${stats.mean}ms | Max=${stats.max}ms | P95=${stats.p95}ms`);
    assert.ok(stats.mean < 350, `Spaces API mean latency too high: ${stats.mean}ms`);
  });

  it("BENCHMARK: Static Brand Asset Delivery (/images/brand/maison-calve-logo.png)", async () => {
    const stats = await benchmark(`${BASE_URL}/images/brand/maison-calve-logo.png`, 5);
    console.log(`[Static Asset Logo] Latency: Min=${stats.min}ms | Mean=${stats.mean}ms | Max=${stats.max}ms | P95=${stats.p95}ms`);
    assert.ok(stats.min < 100, `Static image latency too high: ${stats.min}ms`);
  });

  it("BENCHMARK: Public Enquiry Submission API (/api/enquiry) Latency", async () => {
    const stats = await benchmark(`${BASE_URL}/api/enquiry`, 3, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "open-space",
        name: "Benchmark Runner",
        email: "benchmark@performance.fr",
        phone: "+33 6 00 00 00 00",
        message: "Speed test ping"
      })
    });
    console.log(`[API /api/enquiry] Latency: Min=${stats.min}ms | Mean=${stats.mean}ms | Max=${stats.max}ms | P95=${stats.p95}ms`);
    assert.ok(stats.mean < 500, `Enquiry submission latency too high: ${stats.mean}ms`);
  });
});

