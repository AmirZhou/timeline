import { action } from "../_generated/server";
import { v } from "convex/values";
import { NotionSyncClient } from "../lib/notionClient";

export const testNetworkLatency = action({
  args: { 
    iterations: v.optional(v.number()),
    intervalSeconds: v.optional(v.number())
  },
  handler: async (ctx, { iterations = 10, intervalSeconds = 5 }) => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    const apiKey = process.env.NOTION_API_KEY;
    
    if (!apiKey) {
      throw new Error("NOTION_API_KEY environment variable is required");
    }
    
    console.log(`🚀 NETWORK LATENCY TEST STARTING`);
    console.log(`   📊 Test parameters:`);
    console.log(`   - Iterations: ${iterations}`);
    console.log(`   - Interval: ${intervalSeconds}s between requests`);
    console.log(`   - Database: ${databaseId}`);
    console.log(`   - Start time: ${new Date().toISOString()}\n`);
    
    const client = new NotionSyncClient(apiKey);
    const results = [];
    let totalBytes = 0;
    
    for (let i = 0; i < iterations; i++) {
      console.log(`\n🔄 === ITERATION ${i + 1}/${iterations} ===`);
      
      const iterationStart = Date.now();
      const iterationTimestamp = new Date().toISOString();
      
      try {
        // Trigger the fetch with our new timing instrumentation
        const records = await client.fetchDatabaseChanges(databaseId);
        
        const iterationEnd = Date.now();
        const totalTime = iterationEnd - iterationStart;
        
        // Estimate response size (rough calculation)
        const estimatedBytes = JSON.stringify(records).length;
        totalBytes += estimatedBytes;
        
        const result = {
          iteration: i + 1,
          success: true,
          totalTime: totalTime,
          recordCount: records.length,
          estimatedResponseSize: estimatedBytes,
          throughput: estimatedBytes / (totalTime / 1000), // bytes per second
          timestamp: iterationTimestamp,
          recordsPerSecond: records.length / (totalTime / 1000)
        };
        
        results.push(result);
        
        console.log(`✅ ITERATION ${i + 1} COMPLETE:`);
        console.log(`   ⏱️ Total time: ${totalTime.toFixed(2)}ms`);
        console.log(`   📦 Records: ${records.length}`);
        console.log(`   📊 Response size: ~${(estimatedBytes / 1024).toFixed(2)}KB`);
        console.log(`   🚀 Throughput: ${(result.throughput / 1024).toFixed(2)}KB/s`);
        
      } catch (error) {
        const iterationEnd = Date.now();
        const totalTime = iterationEnd - iterationStart;
        
        const result = {
          iteration: i + 1,
          success: false,
          totalTime: totalTime,
          error: error instanceof Error ? error.message : String(error),
          timestamp: iterationTimestamp
        };
        
        results.push(result);
        
        console.log(`❌ ITERATION ${i + 1} FAILED:`);
        console.log(`   ⏱️ Time to failure: ${totalTime.toFixed(2)}ms`);
        console.log(`   💥 Error: ${result.error}`);
        
        // Check for rate limiting or network issues
        if (result.error.includes('rate') || result.error.includes('429')) {
          console.log(`🚦 RATE LIMIT DETECTED - Breaking test early`);
          break;
        }
      }
      
      // Wait between iterations (except for the last one)
      if (i < iterations - 1) {
        console.log(`⏳ Waiting ${intervalSeconds}s before next iteration...`);
        await new Promise(resolve => setTimeout(resolve, intervalSeconds * 1000));
      }
    }
    
    // Calculate statistics
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);
    
    if (successfulResults.length === 0) {
      console.log(`\n❌ ALL REQUESTS FAILED - No statistics available`);
      return {
        testCompleted: true,
        totalIterations: results.length,
        successfulRequests: 0,
        failedRequests: failedResults.length,
        results: results
      };
    }
    
    const latencies = successfulResults.map(r => r.totalTime);
    const throughputs = successfulResults.map(r => 'throughput' in r ? r.throughput : 0);
    const recordCounts = successfulResults.map(r => 'recordCount' in r ? r.recordCount : 0);
    
    const stats = {
      // Latency statistics
      averageLatency: latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length,
      minLatency: Math.min(...latencies),
      maxLatency: Math.max(...latencies),
      medianLatency: latencies.sort((a, b) => a - b)[Math.floor(latencies.length / 2)],
      
      // Throughput statistics  
      averageThroughput: throughputs.reduce((sum, tp) => sum + tp, 0) / throughputs.length,
      maxThroughput: Math.max(...throughputs),
      minThroughput: Math.min(...throughputs),
      
      // Data statistics
      totalDataTransferred: totalBytes,
      averageRecordCount: recordCounts.reduce((sum, rc) => sum + rc, 0) / recordCounts.length,
      averageRecordsPerSecond: successfulResults.reduce((sum, r) => sum + ('recordsPerSecond' in r ? r.recordsPerSecond : 0), 0) / successfulResults.length
    };
    
    console.log(`\n📈 === NETWORK LATENCY TEST RESULTS ===`);
    console.log(`🎯 Test Summary:`);
    console.log(`   - Total iterations: ${results.length}`);
    console.log(`   - Successful requests: ${successfulResults.length}`);
    console.log(`   - Failed requests: ${failedResults.length}`);
    console.log(`   - Success rate: ${((successfulResults.length / results.length) * 100).toFixed(1)}%`);
    
    console.log(`\n⏱️ Latency Analysis:`);
    console.log(`   - Average: ${stats.averageLatency.toFixed(2)}ms`);
    console.log(`   - Minimum: ${stats.minLatency.toFixed(2)}ms`);
    console.log(`   - Maximum: ${stats.maxLatency.toFixed(2)}ms`);
    console.log(`   - Median: ${stats.medianLatency.toFixed(2)}ms`);
    
    console.log(`\n🚀 Performance Analysis:`);
    console.log(`   - Average throughput: ${(stats.averageThroughput / 1024).toFixed(2)}KB/s`);
    console.log(`   - Peak throughput: ${(stats.maxThroughput / 1024).toFixed(2)}KB/s`);
    console.log(`   - Total data transferred: ${(stats.totalDataTransferred / 1024).toFixed(2)}KB`);
    console.log(`   - Average records/request: ${stats.averageRecordCount.toFixed(1)}`);
    console.log(`   - Average records/second: ${stats.averageRecordsPerSecond.toFixed(1)}`);
    
    // Performance categorization
    let overallPerformance = '';
    if (stats.averageLatency < 500) overallPerformance = '🟢 EXCELLENT';
    else if (stats.averageLatency < 1000) overallPerformance = '🟡 GOOD';
    else if (stats.averageLatency < 2000) overallPerformance = '🟠 MODERATE';
    else overallPerformance = '🔴 SLOW';
    
    console.log(`\n🎖️ Overall Performance Rating: ${overallPerformance}`);
    
    // Identify potential issues
    if (stats.maxLatency > stats.averageLatency * 3) {
      console.log(`⚠️ WARNING: High latency variance detected (max is ${(stats.maxLatency / stats.averageLatency).toFixed(1)}x average)`);
    }
    
    if (failedResults.length > 0) {
      console.log(`⚠️ WARNING: ${failedResults.length} failed requests - check for network issues`);
    }
    
    console.log(`\n✅ Test completed at: ${new Date().toISOString()}`);
    
    return {
      testCompleted: true,
      testTimestamp: new Date().toISOString(),
      totalIterations: results.length,
      successfulRequests: successfulResults.length,
      failedRequests: failedResults.length,
      statistics: stats,
      overallPerformance,
      results: results
    };
  }
});